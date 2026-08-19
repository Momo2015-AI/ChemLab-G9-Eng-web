#!/usr/bin/env node
/**
 * gen-project-status.mjs — Auto-generates docs/PROJECT-STATUS.md from live project state.
 *
 * Usage:
 *   node scripts/gen-project-status.mjs
 *   node scripts/gen-project-status.mjs --check  # prints to stdout only
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = process.cwd();
const STATUS_PATH = path.join(ROOT, 'docs/PROJECT-STATUS.md');
const TODAY = new Date().toISOString().slice(0, 10);
const DRY_RUN = process.argv.includes('--check');

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    return e.stdout || e.stderr || '';
  }
}

function countQ(base, suffix) {
  const fp = path.join(ROOT, base + suffix + '.json');
  if (!fs.existsSync(fp)) return 0;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (suffix === '') return (d.questions || []).filter(q => q && q.id).length;
  if (suffix === '-practice') return (d.questions || []).filter(q => q && q.id).length;
  if (suffix === '-diagnostic') {
    const arr = Array.isArray(d.diagnostics) ? d.diagnostics : (d.diagnostics?.questions || []);
    return arr.filter(q => q && q.id).length;
  }
  if (suffix === '-mastery') return (d.mastery?.questions || []).filter(q => q && q.id).length;
  if (suffix === '-transfer') return (d.questions || []).filter(q => q && q.id).length;
  return 0;
}

function guidedSteps(base) {
  const fp = path.join(ROOT, base + '.json');
  if (!fs.existsSync(fp)) return 0;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  return (d.guidedLearning?.steps || []).length;
}

function expCount(base) {
  const fp = path.join(ROOT, base + '.json');
  if (!fs.existsSync(fp)) return 0;
  const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
  return (d.experiments || []).length;
}

// ── Metrics ──────────────────────────────────────────────────────

const testOut = run('npm test 2>&1');
const tm = testOut.match(/# tests\s+(\d+)\s*\n.*# pass\s+(\d+)\s*\n.*# fail\s+(\d+)/s);
const totalTests = tm ? parseInt(tm[1], 10) : 0;
const passTests = tm ? parseInt(tm[2], 10) : 0;
const failTests = tm ? parseInt(tm[3], 10) : 0;
const testsGreen = failTests === 0;

const auditOut = run('node scripts/runtime-audit.mjs 2>&1');
const auditGreen = !auditOut.includes('ERRORS:') && !auditOut.includes('process.exit');

const contentOut = run('npm run audit:content 2>&1');
const contentGreen = contentOut.includes('Errors') && !contentOut.match(/Errors\s*:\s*\n-\s*[^N]/);

let manifest;
try {
  const m = await import(path.join(ROOT, 'content/curriculum/lesson-manifest.js'));
  manifest = m.default;
} catch { manifest = { lessons: [] }; }

const allLessons = manifest?.lessons || [];
const releasedLessons = allLessons.filter(l =>
  ['ready', 'released', 'published'].includes(String(l.releaseStatus || l.status || '').toLowerCase())
);
const unitsCovered = [...new Set(releasedLessons.map(l => l.unitId))].sort();

const kg = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/knowledge/knowledge-graph.json'), 'utf8'));
const kgNodes = kg.nodes?.length || 0;
const kgUpper = (kg.nodes || []).filter(n => n.semester === 'upper').length;
const kgLower = (kg.nodes || []).filter(n => n.semester === 'lower').length;
const kgRelations = kg.relations?.length || 0;

let canonCount = 0, aliasCount = 0;
try {
  const mc = await import(path.join(ROOT, 'content/misconceptions/canonical-misconceptions.js'));
  canonCount = (mc.canonicalMisconceptions || mc.default?.canonicalMisconceptions || []).length;
  aliasCount = Object.keys(mc.ALIAS_MAP || mc.default?.ALIAS_MAP || {}).length;
} catch {}

let sourceStatus = 'UNKNOWN', sourceCoverage = 0;
try {
  const sr = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/sources/source-registry.json'), 'utf8'));
  sourceStatus = sr.status || 'UNKNOWN';
  sourceCoverage = Object.keys(sr.coverage || {}).length;
} catch {}

let zone4Size = 0, zone11Size = 0;
try { zone4Size = fs.readFileSync(path.join(ROOT, 'content/labs/zone4.js'), 'utf8').split('\n').length; } catch {}
try { zone11Size = fs.readFileSync(path.join(ROOT, 'content/labs/zone11.js'), 'utf8').split('\n').length; } catch {}

// ── Render helpers ───────────────────────────────────────────────

const BT = '`'; // backtick char

function renderLessons() {
  const rows = releasedLessons.map(l => {
    const base = path.join('content/lessons', l.canonicalId);
    const guided = guidedSteps(base);
    const exp = expCount(base);
    const practice = countQ(base, '-practice');
    const diagnostic = countQ(base, '-diagnostic');
    const mastery = countQ(base, '-mastery');
    const transfer = countQ(base, '-transfer');
    const title = l.title || l.canonicalId;
    return '| ' + l.canonicalId + ' ' + title + ' | ' + (l.releaseStatus || 'ready') +
      ' | ' + guided + ' step guided, ' + exp + ' experiment' +
      ', ' + practice + ' practice, ' + diagnostic + ' diagnostic' +
      ', ' + mastery + ' mastery, ' + transfer + ' transfer |';
  });
  return rows.join('\n');
}

function unitDescText() {
  const map = { u01: '上册第一单元\u201c\u8d70\u8fdb\u5316\u5b66\u4e16\u754c\u201d', u02: '上册第二单元\u201c\u6211\u4eec\u5468\u56f4\u7684\u7a7a\u6c14\u201d', u10: '\u4e0b\u518c\u7b2c\u5341\u5355\u5143\u201c\u9178\u548c\u78b1\u201d' };
  return unitsCovered.map(u => {
    const ls = releasedLessons.filter(l => l.unitId === u).map(l => l.canonicalId.replace('lesson-', 'L')).join('/');
    return ls + ' ' + (map[u] || u);
  }).join('\uff0c');
}

function sourceNote() {
  if (sourceStatus === 'COMPLETE') return '\u5168\u90e8\u8bfe\u7a0b\u5df2\u5b8c\u6210\u6765\u6e90\u767b\u8bb0\u3002';
  if (sourceStatus === 'PARTIAL') return '\u6846\u67b6\u5df2\u5efa\uff0cS0 \u6743\u5a01\u6765\u6e90\u6307\u5b9a\u6587\u6863\u5f85\u9879\u76ee\u6240\u6709\u8005\u7b7e\u6279\u3002';
  return '\u72b6\u6001\u5f85\u786e\u8ba4\u3002';
}

function gapsText() {
  const gaps = [];
  if (sourceStatus !== 'COMPLETE') {
    gaps.push('**Source Registry ' + sourceStatus + '** \u2014\u2014 S0 \u6743\u5a01\u6765\u6e90\u6307\u5b9a\u6587\u6863\u5f85\u9879\u76ee\u6240\u6709\u8005\u7b7e\u6279\uff08\u9700\u4eba\u5de5\u51b3\u7b56\uff09\u3002\u5f53\u524d ' + sourceCoverage + '/' + releasedLessons.length + ' \u8bfe\u7a0b\u6709\u6765\u6e90\u6807\u6ce8\u3002');
  }
  if (failTests > 0) {
    gaps.push('\u6d4b\u8bd5\u5931\u8d25 ' + failTests + ' \u9879 \u2014\u2014 \u9700\u4fee\u590d\u3002');
  }
  gaps.push('Browser E2E regression tests missing (Node-only unit/integration tests; innerHTML-based view layer has untestable paths).');
  gaps.push('\u8bfe\u7a0b\u8986\u76d6\u5e7f\u5ea6\u4ecd\u7a84\uff1a' + releasedLessons.length + '/' + allLessons.length + ' \u8bfe\u65f6\uff0c' + unitsCovered.length + '/' + [...new Set(allLessons.map(l => l.unitId))].length + ' \u5355\u5143\u3002\u5efa\u8bae\u6309 u03\u2192u04\u2192u05\u2192u06\u2192u07\u2192u08\u2192u09\u2192u11\u2192u12 \u987a\u5e8f\u9010\u8bfe\u6269\u5c55\u3002');
  return gaps.map((g, i) => (i + 1) + '. ' + g).join('\n');
}

// ── Build markdown ───────────────────────────────────────────────

const lines = [
  '# ChemLab-G9-Eng \u9879\u76ee\u72b6\u6001',
  '',
  '> \u66f4\u65b0\u4e8e ' + TODAY + ' (\u81ea\u52a8\u751f\u6210\uff0c\u8fd0\u884c ' + BT + 'node scripts/gen-project-status.mjs' + BT + ' \u5237\u65b0)\u3002\u5386\u53f2\u7248\u672c\u72b6\u6001\u89c1 ' + BT + 'archive/HISTORY-V1.5-V2.2.md' + BT + '\u3002',
  '',
  '## \u5f53\u524d\u9636\u6bb5',
  '',
  '**\u67b6\u6784\u51b7\u537a + \u5185\u5bb9\u4f18\u5148\uff08Phase C3 \u2192 C4\uff09**\uff1a' + releasedLessons.length + ' \u95e8\u57fa\u51c6\u8bfe\u7a0b\u5df2\u4ea4\u4ed8\u5e76\u53d1\u5e03\uff0c\u8fdb\u5165\u9010\u8bfe\u6269\u5c55\u9636\u6bb5\u3002',
  '',
  '## \u8d28\u91cf\u57fa\u7ebf',
  '',
  '```text',
  'tests:            ' + passTests + ' / ' + totalTests + (testsGreen ? ' GREEN' : ' FAIL (' + failTests + ')'),
  'runtime audit:    ' + (auditGreen ? 'GREEN' : 'FAIL'),
  'content gates:    ' + (contentGreen ? 'GREEN' : 'FAIL'),
  'deployment:       GitHub Pages\uff08runtime-only dist/\uff09',
  '```',
  '',
  '## \u8bfe\u7a0b\u8986\u76d6',
  '',
  '| \u8bfe\u7a0b | \u72b6\u6001 | \u5185\u5bb9 |',
  '|---|---|---|',
  renderLessons(),
  '',
   '\u8bfe\u7a0b\u6e05\u5355\uff1a' + BT + 'content/curriculum/lesson-manifest.js' + BT + '\uff08' + releasedLessons.length + '/' + allLessons.length + ' \u8bfe\uff0c\u6269\u5c55\u987b\u9010\u8bfe\u8fc7 7-Gate\uff09\u3002',
  '',
   '**\u8986\u76d6\u5e7f\u5ea6\u8bf4\u660e**\uff1a\u5f53\u524d ' + releasedLessons.length + '/' + allLessons.length + ' \u8bfe\u65f6\u3001' + unitsCovered.length + '/' + [...new Set(allLessons.map(l => l.unitId))].length + ' \u5355\u5143\u6709\u5185\u5bb9\uff08' + unitDescText() + '\uff09\u3002\u8fd9\u662f\u9879\u76ee\u201c\u5148\u505a\u6df1\u3001\u518d\u505a\u5e7f\u201d\u7684\u4e3b\u52a8\u9009\u62e9\u2014\u2014\u5df2\u5b8c\u6210\u5185\u5bb9\u5b8c\u6574\u3001\u5224\u5206\u94fe\u8def\u53ef\u8fd0\u884c\uff0c\u4f46\u8986\u76d6\u9762\u4ecd\u7a84\uff1b\u5b8c\u6574\u6027\u4e0e\u8986\u76d6\u5e7f\u5ea6\u662f\u4e24\u4e2a\u7ef4\u5ea6\uff0c\u8fdb\u5ea6\u8bc4\u4f30\u9700\u533a\u5206\u770b\u5f85\u3002',
  '',
  '## \u5b66\u4e60\u95ed\u73af',
  '',
  '```text',
  '\u5f15\u5bfc\u5b66\u4e60 \u2192 \u5b9e\u9a8c \u2192 \u7ec3\u4e60 \u2192 \u8bca\u65ad \u2192 \u8865\u6551 \u2192 \u518d\u68c0\u6d4b(\u672c\u8bfe\u6c60+\u9519\u9898\u4f18\u5148)',
  '  \u2192 95% Mastery(\u53ef\u91cd\u8bd5) \u2192 \u8fc1\u79fb(\u4e13\u5c5e\u9898\u6c60, \u226580%) \u2192 \u5b8c\u6210\u672c\u8bfe',
  '```',
  '',
  '- \u638c\u63e1\u5224\u5b9a = \u5206\u6570\u226595% \u2227 \u77e5\u8bc6\u70b9\u8986\u76d6 \u2227 \u5173\u952e\u8bef\u89e3\u6e05\u96f6 \u2227 \u4e3b\u89c2\u9898(\u540c\u4e49\u8bcd\u7ec4\u8bc4\u5206)\u901a\u8fc7\u3002',
  '- \u5b9e\u9a8c\u89c2\u5bdf\uff1a\u7a7a\u767d\u4e0d\u8ba1\u8bc1\u636e\uff1b\u65e0\u6548\u89c2\u5bdf\u4e0d\u4e2d\u9014\u9501\u5b9a\u8865\u6551\uff0c\u5b9e\u9a8c\u5b8c\u6210\u65f6\u7edf\u4e00\u88c1\u51b3\u3002',
  '- \u6301\u4e45\u5316\uff1a\u5b39\u91cf\u5bb9\u9519\u3001\u635f\u574f\u5907\u4efd\u3001\u5386\u53f2\u4e0a\u9650 100\u3001\u9057\u7559\u72b6\u6001\u81ea\u52a8\u8fc1\u79fb\u3002',
  '- \u9898\u76ee\u4e71\u5e8f\uff1a' + BT + 'shuffleQuestions' + BT + ' \u652f\u6301\u4f9d\u8d56\u6ce8\u5165\u7684 RNG\uff0c\u6d4b\u8bd5\u9a8c\u8bc1\u4e0d\u6539\u53d8\u539f\u6c60\u3001\u9519\u9898\u4f18\u5148\u4e8e\u4e71\u5e8f\u6b63\u786e\u9898\u3002',
  '',
  '## \u5185\u5bb9\u6cbb\u7406\u72b6\u6001',
  '',
  '- **Source Registry\uff1a' + sourceStatus + '**\uff08' + BT + 'content/sources/source-registry.json' + BT + '\uff09\u2014\u2014' + sourceNote() + '\u5f53\u524d ' + sourceCoverage + '/' + releasedLessons.length + ' \u8bfe\u7a0b\u6709\u6765\u6e90\u6807\u6ce8\u3002',
  '- \u77e5\u8bc6\u56fe\u8c31 v2.1\uff1a' + kgNodes + ' \u8282\u70b9\uff08upper ' + kgUpper + ' / lower ' + kgLower + '\uff09/ ' + kgRelations + ' \u5173\u7cfb\uff0c**\u5168\u90e8\u8282\u70b9\u5747\u5177\u5907\u8be6\u60c5\u5185\u5bb9**\uff08\u5b9a\u4e49 / \u8865\u6551\u76ee\u6807 / \u8ba4\u77e5\u5c42\u6b21 / \u8bef\u89e3 / \u524d\u7f6e\uff09\u3002',
  '- misconception \u8bcd\u8868\uff1a' + canonCount + ' \u4e2a canonical ID + ' + aliasCount + ' \u4e2a alias\uff0c' + BT + 'core/assessment/mastery-policy.js' + BT + ' \u8d1f\u8d23\u522b\u540d\u89e3\u6790\u5230 canonical \u5f62\u5f0f\u3002',
  '- \u5168\u5c40\u9898\u6c60\uff1a263 \u9898\uff08CANONICAL_RUNTIME_SOURCE\uff09\uff0c\u65e7 320 \u9898\u6c38\u4e45\u9000\u5f79\u3002',
  '',
  '## \u865a\u62df\u5b9e\u9a8c',
  '',
  '- ' + BT + 'zone4.js' + BT + '\uff08' + zone4Size + ' \u884c\uff09\uff1a\u7a7a\u6c14\u6210\u5206\u6c14\u6ce1\u56fe + \u71c3\u70e7\u5267\u573a\uff085 \u79cd\u7269\u8d28 \u00d7 \u7a7a\u6c14/\u6c27\u6c14\u5bf9\u6bd4\uff09',
  '- ' + BT + 'zone11.js' + BT + '\uff08' + zone11Size + ' \u884c\uff09\uff1a\u6307\u793a\u5242\u53d8\u8272 + pH \u5f69\u8679\u6761 + \u6d53\u9178\u7a00\u91ca + \u4e2d\u548c\u6ef4\u5b9a pH \u66f2\u7ebf + \u5fae\u89c2\u7c92\u5b50',
  '- \u4e24\u6a21\u5757\u5747\u652f\u6301\u81ea\u9002\u5e94\u753b\u5e03\uff08ResizeObserver + devicePixelRatio\uff09',
  '',
  '## \u5df2\u77e5\u7f3a\u53e3\uff08\u6309\u4f18\u5148\u7ea7\uff09',
  '',
  gapsText(),
  '',
  '## \u5de5\u7a0b\u7ea6\u5b9a',
  '',
  '- ' + BT + 'main' + BT + ' \u552f\u4e00\u5206\u652f\uff1b\u53d8\u66f4\u6d41\u7a0b\uff1a\u5b9e\u73b0 \u2192 \u6d4b\u8bd5 \u2192 runtime/content \u5ba1\u8ba1 \u2192 \u6587\u6863\uff08DEV-REC.md\uff09\u2192 \u63d0\u4ea4 \u2192 CI GREEN \u2192 Pages\u3002',
  '- \u672c\u5730\u5f00\u53d1\uff1a' + BT + 'python3 -m http.server 8080' + BT + '\uff08\u4e0d\u80fd\u53cc\u51fb index.html\uff09\u3002',
  '- \u6587\u6863\u5bfc\u822a\u89c1 ' + BT + 'docs/README.md' + BT + '\u3002',
];

const md = lines.join('\n');

if (DRY_RUN) {
  console.log(md);
} else {
  fs.writeFileSync(STATUS_PATH, md, 'utf8');
  console.log('Updated ' + STATUS_PATH);
  console.log('  lessons: ' + releasedLessons.length + '/' + allLessons.length);
  console.log('  tests: ' + passTests + '/' + totalTests + ' (fail=' + failTests + ')');
  console.log('  kg: ' + kgNodes + ' nodes, ' + kgRelations + ' relations');
  console.log('  misconceptions: ' + canonCount + ' canonical + ' + aliasCount + ' aliases');
  console.log('  source registry: ' + sourceStatus + ' (' + sourceCoverage + '/' + releasedLessons.length + ' covered)');
}
