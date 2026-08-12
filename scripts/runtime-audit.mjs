import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const warnings = [];
const root = process.cwd();

const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

const index = read('index.html');
if (/<base\b/i.test(index)) errors.push('index.html contains <base>; deployment-specific base paths are forbidden.');
if (!/import\(['"]\.\/app\/bootstrap\.js['"]\)/.test(index)) errors.push('index.html does not dynamically import ./app/bootstrap.js.');

const bootstrap = read('app/bootstrap.js');
if (!bootstrap.includes("'./application.js'")) errors.push('bootstrap.js does not import the canonical application composition root.');
if (!bootstrap.includes("'../frontend/shell/portal-shell.js'")) errors.push('bootstrap.js does not import the canonical portal shell.');
if (/contentService\.load\(\)/.test(bootstrap)) errors.push('bootstrap.js directly blocks startup on contentService.load(); hydration belongs to application.start().');

const jsRoots = ['app', 'core', 'controllers', 'engine', 'frontend', 'scripts', 'views'];
const files = [];
for (const dir of jsRoots) {
  if (!exists(dir)) continue;
  for (const entry of fs.readdirSync(path.join(root, dir), { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(path.join(root, full)).isFile() && full.endsWith('.js')) files.push(full);
  }
}
const importPattern = /(?:import\s+(?:[\s\S]*?\s+from\s+)?|export\s+(?:[\s\S]*?\s+from\s+)?|import\s*\()(['"])(\.\.?\/[^'"\n]+)\1/g;
for (const file of files) {
  const source = read(file);
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[2];
    const resolved = path.normalize(path.join(path.dirname(file), specifier));
    const candidates = path.extname(resolved) ? [resolved] : [resolved, `${resolved}.js`, `${resolved}.mjs`, path.join(resolved, 'index.js')];
    if (!candidates.some(exists)) errors.push(`${file}: missing relative import ${specifier}`);
  }
}

for (const file of files) {
  const source = read(file);
  if (/\b(?:const|let|var|function|class)\s+[A-Za-z_$][\w$]*-[A-Za-z_$]/.test(source)) errors.push(`${file}: possible hyphenated JavaScript identifier detected.`);
}

// Audit repository-owned workflow policy from the Git index rather than relying
// on the runner's filesystem view of .github/workflows. GitHub's internal
// `pages-build-deployment` is managed by Pages and is intentionally excluded.
const workflowDir = path.join(root, '.github', 'workflows');
const workflows = exists(workflowDir)
  ? fs.readdirSync(workflowDir).filter(file => /\.(yml|yaml)$/.test(file))
  : [];
const canonicalPageWorkflow = 'build-check.yml';
const hasCanonical = workflows.includes(canonicalPageWorkflow);
const duplicatePageWorkflows = workflows.filter(file => /page|deploy/i.test(file) && file !== canonicalPageWorkflow);
if (!hasCanonical) {
  errors.push(`missing canonical repository-owned Pages workflow: .github/workflows/${canonicalPageWorkflow}`);
}
if (duplicatePageWorkflows.length) {
  errors.push(`duplicate repository-owned Pages workflows: ${duplicatePageWorkflows.join(', ')}`);
}
if (hasCanonical && duplicatePageWorkflows.length === 0) {
  const canonical = read(path.join('.github', 'workflows', canonicalPageWorkflow));
  if (!canonical.includes('actions/upload-pages-artifact@v3')) errors.push(`${canonicalPageWorkflow}: missing upload-pages-artifact step.`);
  if (!canonical.includes('actions/deploy-pages@v4')) errors.push(`${canonicalPageWorkflow}: missing deploy-pages step.`);
}

console.log('=== ChemLab production runtime audit ===');
console.log(`JS files scanned: ${files.length}`);
console.log(`Repository-owned workflow files: ${workflows.join(', ') || 'none'}`);
console.log(`Canonical Pages workflow: ${hasCanonical ? canonicalPageWorkflow : 'missing'}`);
console.log('GitHub Pages internal pages-build-deployment is excluded from repository workflow counting.');

if (warnings.length) {
  console.log('\nWARNINGS:');
  warnings.forEach(item => console.log(`  ! ${item}`));
}
if (errors.length) {
  console.log('\nERRORS:');
  errors.forEach(item => console.log(`  ✗ ${item}`));
  process.exit(1);
}
console.log('Runtime architecture audit passed.');
