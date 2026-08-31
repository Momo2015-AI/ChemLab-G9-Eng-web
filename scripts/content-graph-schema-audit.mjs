#!/usr/bin/env node
/**
 * content-graph-schema-audit — 知识图谱 schema 契约审计 (Sprint A)
 *
 * 按 content/knowledge/schema.json 的契约校验 knowledge-graph.json：
 *   1. 图级必填键
 *   2. 节点必填字段、枚举取值、id 唯一性
 *   3. 关系必填字段、类型枚举
 *   4. 引用完整性：node-node 关系 source/target 必须解析到节点；
 *      question 关系 source 解析到节点、target 解析到运行时题目池
 *   5. 弃用字段（node.prerequisites）warning
 *
 * 任何 ERROR 都会使 Gate BLOCKED（exit 1）。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const schemaPath = path.join(root, 'content/knowledge/schema.json');
const graphPath = path.join(root, 'content/knowledge/knowledge-graph.json');
const lessonsPath = path.join(root, 'content/lessons');

const report = { errors: [], warnings: [], stats: {} };

function fail(message) {
  report.errors.push(message);
}

function warn(message) {
  report.warnings.push(message);
}

function load(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const schema = load(schemaPath);
const graph = load(graphPath);

if (!schema) fail(`无法读取 schema 契约: ${schemaPath}`);
if (!graph) fail(`无法读取知识图谱: ${graphPath}`);

if (report.errors.length === 0) {
  // ---------- 1. 图级必填键 ----------
  for (const key of schema.graph.requiredKeys) {
    if (graph[key] === undefined) fail(`图缺少必填键: ${key}`);
  }

  const nodeIds = new Set();
  const enumDomain = new Set(schema.enums.domainEnum);
  const enumBloom = new Set(schema.enums.bloomLevelsEnum);
  const enumSemester = new Set(schema.enums.semesterEnum);
  const enumUnit = new Set(schema.enums.unitIdEnum);
  const enumRelationType = new Set(schema.enums.relationTypeEnum);
  const forbiddenNodeFields = Object.keys(schema.node.forbiddenFields || {});
  const requiredNodeFields = Object.keys(schema.node.requiredFields);

  // ---------- 2. 节点校验 ----------
  for (const node of graph.nodes || []) {
    const id = node?.id || '(缺 id)';
    for (const field of requiredNodeFields) {
      const value = node?.[field];
      if (value === undefined || value === null || value === '') {
        fail(`节点 ${id} 缺少必填字段: ${field}`);
      }
    }
    if (node?.id) {
      if (nodeIds.has(node.id)) fail(`节点 id 重复: ${node.id}`);
      nodeIds.add(node.id);
    }
    if (node?.domain && !enumDomain.has(node.domain)) {
      fail(`节点 ${id} domain 取值非法: ${node.domain}（契约见 schema.json enums.domainEnum）`);
    }
    if (node?.semester && !enumSemester.has(node.semester)) {
      fail(`节点 ${id} semester 取值非法: ${node.semester}`);
    }
    if (node?.unitId && !enumUnit.has(node.unitId)) {
      fail(`节点 ${id} unitId 取值非法: ${node.unitId}（新增单元需先更新 schema.json）`);
    }
    if (!Array.isArray(node?.bloomLevels) || node.bloomLevels.length === 0) {
      fail(`节点 ${id} bloomLevels 必须是非空数组`);
    } else {
      for (const level of node.bloomLevels) {
        if (!enumBloom.has(level)) fail(`节点 ${id} bloomLevels 取值非法: ${level}`);
      }
    }
    for (const field of forbiddenNodeFields) {
      if (node?.[field] !== undefined) {
        fail(`节点 ${id} 携带禁止字段 ${field}（Sprint B 起 relations[] 为唯一事实源，见 schema.json forbiddenFields）`);
      }
    }
  }

  // ---------- 3. 关系字段与类型枚举 ----------
  const enumDifficulty = new Set(schema.enums.difficultyEnum);
  const attributeMount = {
    question: new Set(['difficulty']),
    prerequisite: new Set(['weight', 'required']),
    related: new Set(['description']),
    contrast: new Set(['description']),
  };
  for (const relation of graph.relations || []) {
    if (!relation?.source || !relation?.target) {
      fail(`关系缺少 source 或 target: ${JSON.stringify(relation)}`);
      continue;
    }
    if (!relation?.type || !enumRelationType.has(relation.type)) {
      fail(`关系类型非法: ${relation.source} -> ${relation.target} type=${relation.type}`);
    }
    const allowed = attributeMount[relation.type] || new Set();
    for (const key of Object.keys(relation)) {
      if (['source', 'target', 'type'].includes(key)) continue;
      if (!allowed.has(key)) {
        fail(`属性 ${key} 不允许挂载在 ${relation.type} 关系上: ${relation.source} -> ${relation.target}`);
        continue;
      }
      if (key === 'difficulty' && !enumDifficulty.has(relation[key])) {
        fail(`question 关系 difficulty 取值非法: ${relation.source} -> ${relation.target} difficulty=${relation[key]}`);
      }
      if (key === 'weight' && (typeof relation[key] !== 'number' || relation[key] < 0 || relation[key] > 1)) {
        fail(`prerequisite 关系 weight 必须是 0-1 的数字: ${relation.source} -> ${relation.target} weight=${relation[key]}`);
      }
      if (key === 'required' && typeof relation[key] !== 'boolean') {
        fail(`prerequisite 关系 required 必须是 boolean: ${relation.source} -> ${relation.target}`);
      }
      if (key === 'description' && (typeof relation[key] !== 'string' || !relation[key].trim())) {
        fail(`related 关系 description 必须是非空字符串: ${relation.source} -> ${relation.target}`);
      }
    }
  }

  // ---------- 4. 引用完整性 ----------
  const isNodeNode = new Set(['prerequisite', 'related']);
  const lessonExperimentIds = loadLessonExperimentIds();
  const misconceptionIds = loadMisconceptionIds();
  for (const relation of graph.relations || []) {
    if (!relation?.source || !relation?.target) continue;
    if (!nodeIds.has(relation.source)) {
      fail(`关系 source 无法解析到节点: ${relation.source} -> ${relation.target} (${relation.type})`);
    }
    if (isNodeNode.has(relation.type) && !nodeIds.has(relation.target)) {
      fail(`关系 target 无法解析到节点: ${relation.source} -> ${relation.target} (${relation.type})`);
    }
    if (relation.type === 'experiment' && !lessonExperimentIds.has(relation.target)) {
      fail(`experiment 关系 target 无法解析到实验资源: ${relation.source} -> ${relation.target}`);
    }
    if (relation.type === 'commonMistake' && !misconceptionIds.has(relation.target)) {
      fail(`commonMistake 关系 target 无法解析到规范误解 ID: ${relation.source} -> ${relation.target}`);
    }
  }

  // ---------- 5. 节点 misconceptionIds 字段解析到规范误解 ID ----------
  for (const node of graph.nodes || []) {
    for (const ref of node?.misconceptionIds || []) {
      if (!misconceptionIds.has(ref)) {
        fail(`节点 ${node.id} misconceptionIds 引用无法解析: ${ref}`);
      }
    }
  }

  // ---------- 6. question 关系 target 解析到运行时题目池 ----------
  const questionPool = loadRuntimeQuestionIds();
  for (const relation of graph.relations || []) {
    if (relation?.type !== 'question') continue;
    if (!questionPool.has(relation.target)) {
      fail(`question 关系 target 不在运行时题目池: ${relation.source} -> ${relation.target}`);
    }
  }

  report.stats.nodes = graph.nodes?.length || 0;
  report.stats.relations = graph.relations?.length || 0;
  report.stats.questionPoolSize = questionPool.size;
}

function loadLessonExperimentIds() {
  const ids = new Set();
  const experimentsPath = path.join(root, 'content/experiments');
  if (fs.existsSync(experimentsPath)) {
    for (const file of fs.readdirSync(experimentsPath)) {
      if (!file.endsWith('.json')) continue;
      const data = load(path.join(experimentsPath, file));
      if (data?.id) ids.add(data.id);
    }
  }
  if (!fs.existsSync(lessonsPath)) return ids;
  const lessonFiles = fs.readdirSync(lessonsPath)
    .filter(file => file.endsWith('.json') && !/(?:-practice|-mastery|-diagnostic|-guided-learning|-experiment|-transfer)\.json$/.test(file));
  for (const name of lessonFiles) {
    const lesson = load(path.join(lessonsPath, name));
    for (const experiment of lesson?.experiments || []) {
      if (experiment?.id) ids.add(experiment.id);
    }
  }
  return ids;
}

function loadMisconceptionIds() {
  const ids = new Set();
  const filePath = path.join(root, 'content/misconceptions/canonical-misconceptions.js');
  if (!fs.existsSync(filePath)) return ids;
  const source = fs.readFileSync(filePath, 'utf8');
  for (const match of source.matchAll(/id:\s*'([^']+)'/g)) {
    if (match[1].startsWith('mc-')) ids.add(match[1]);
  }
  return ids;
}

function loadRuntimeQuestionIds() {
  const ids = new Set();
  if (!fs.existsSync(lessonsPath)) return ids;
  const collect = list => {
    for (const question of list || []) {
      if (question?.id) ids.add(question.id);
    }
  };
  const lessonFiles = fs.readdirSync(lessonsPath)
    .filter(file => file.endsWith('.json') && !/(?:-practice|-mastery|-diagnostic|-guided-learning|-experiment|-transfer)\.json$/.test(file));
  for (const name of lessonFiles) {
    const lesson = load(path.join(lessonsPath, name));
    if (!lesson) continue;
    collect(lesson.questions);
    const practice = load(path.join(lessonsPath, name.replace(/\.json$/, '-practice.json')));
    collect(Array.isArray(practice?.questions) ? practice.questions : (Array.isArray(practice) ? practice : []));
    const diagnostic = load(path.join(lessonsPath, name.replace(/\.json$/, '-diagnostic.json')));
    collect(Array.isArray(diagnostic?.diagnostics) ? diagnostic.diagnostics : (Array.isArray(diagnostic?.questions) ? diagnostic.questions : []));
    const masteryResource = load(path.join(lessonsPath, name.replace(/\.json$/, '-mastery.json')));
    collect(Array.isArray(masteryResource?.mastery?.questions) ? masteryResource.mastery.questions : (Array.isArray(masteryResource?.questions) ? masteryResource.questions : []));
    const transferResource = load(path.join(lessonsPath, name.replace(/\.json$/, '-transfer.json')));
    collect(Array.isArray(transferResource?.questions) ? transferResource.questions : []);
  }
  return ids;
}

// ---------- 输出 ----------
if (report.stats.nodes !== undefined) {
  console.log(`[graph-schema-audit] 节点 ${report.stats.nodes} | 关系 ${report.stats.relations} | 运行时题目池 ${report.stats.questionPoolSize}`);
}
for (const message of report.warnings) console.log(`  WARN: ${message}`);
for (const message of report.errors) console.error(`  ERROR: ${message}`);

if (report.errors.length > 0) {
  console.error(`[graph-schema-audit] Gate BLOCKED — ${report.errors.length} 个错误`);
  process.exit(1);
}
console.log('[graph-schema-audit] Gate PASS');
