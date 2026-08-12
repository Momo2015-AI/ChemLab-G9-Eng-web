import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const warnings = [];
const root = process.cwd();

const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));

// index.html must not hard-code a deployment-specific <base>.
const index = read('index.html');
if (/<base\b/i.test(index)) errors.push('index.html contains <base>; deployment-specific base paths are forbidden.');
if (!/import\(['"]\.\/app\/bootstrap\.js['"]\)/.test(index)) errors.push('index.html does not dynamically import ./app/bootstrap.js.');

// Production bootstrap must resolve in the canonical app -> frontend layout.
const bootstrap = read('app/bootstrap.js');
if (!bootstrap.includes("'./application.js'")) errors.push('bootstrap.js does not import the canonical application composition root.');
if (!bootstrap.includes("'../frontend/shell/portal-shell.js'")) errors.push('bootstrap.js does not import the canonical portal shell.');
if (/contentService\.load\(\)/.test(bootstrap)) errors.push('bootstrap.js directly blocks startup on contentService.load(); hydration belongs to application.start().');

// Verify every relative JS import target in the production graph exists.
const jsRoots = ['app', 'core', 'controllers', 'engine', 'frontend', 'services', 'views'];
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

// Detect common syntax mistakes that previously caused browser parser failures.
for (const file of files) {
  const source = read(file);
  if (/\b(?:const|let|var|function|class)\s+[A-Za-z_$][\w$]*-[A-Za-z_$]/.test(source)) {
    errors.push(`${file}: possible hyphenated JavaScript identifier detected.`);
  }
}

// Deployment must have exactly one canonical Pages workflow.
const workflows = exists('.github/workflows') ? fs.readdirSync(path.join(root, '.github/workflows')).filter(f => /\.(yml|yaml)$/.test(f)) : [];
const pageWorkflows = workflows.filter(f => /page|deploy/i.test(f));
if (pageWorkflows.length !== 1 || pageWorkflows[0] !== 'deploy-pages.yml') {
  errors.push(`expected exactly one canonical Pages workflow (deploy-pages.yml); found ${pageWorkflows.join(', ') || 'none'}`);
}

// Duplicate legacy health workflow is no longer part of the architecture.
if (exists('.github/workflows/check.yml')) warnings.push('.github/workflows/check.yml remains; it should be removed after the consolidated build gate is active.');

console.log('=== ChemLab production runtime audit ===');
console.log(`JS files scanned: ${files.length}`);
console.log(`Pages workflows: ${pageWorkflows.join(', ') || 'none'}`);

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
