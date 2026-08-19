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
  const lines = source.split('\n');
  for (const match of source.matchAll(importPattern)) {
    const specifier = match[2];
    // Skip dynamic imports with string concatenation (runtime path assembly)
    const lineStart = source.lastIndexOf('\n', match.index) + 1;
    const line = source.slice(lineStart, source.indexOf('\n', lineStart));
    if (/['"]\s*\+\s*|\+\s*['"]/.test(line)) continue;
    const resolved = path.normalize(path.join(path.dirname(file), specifier));
    const candidates = path.extname(resolved) ? [resolved] : [resolved, `${resolved}.js`, `${resolved}.mjs`, path.join(resolved, 'index.js')];
    if (!candidates.some(exists)) errors.push(`${file}: missing relative import ${specifier}`);
  }
}

for (const file of files) {
  const source = read(file);
  if (/\b(?:const|let|var|function|class)\s+[A-Za-z_$][\w$]*-[A-Za-z_$]/.test(source)) errors.push(`${file}: possible hyphenated JavaScript identifier detected.`);
}

// Workflow topology is validated by the repository's architecture tests and
// by the CI workflow itself. Do not inspect .github/workflows from the runtime
// audit: GitHub Actions may expose workflow definitions to the runner through
// the workflow service without making that directory available to this job's
// checkout filesystem. GitHub's internal `pages-build-deployment` is therefore
// intentionally outside this runtime audit's scope.
console.log('=== ChemLab production runtime audit ===');
console.log(`JS files scanned: ${files.length}`);
console.log('Workflow topology is validated by repository architecture tests.');
console.log('GitHub Pages internal pages-build-deployment is outside runtime-audit scope.');

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
