// ChemLab-G9 Health Check
// Checks: directory structure, JS syntax, JSON validity, essential files

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const errors = [];
const warnings = [];

// Required top-level directories
const requiredDirs = ['core', 'modules', 'schemas'];
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    errors.push(`Missing required directory: ${dir}/`);
  }
}

// Required files
const requiredFiles = ['index.html', 'README.md'];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  }
}

// Check JS syntax in canonical production directories.
const jsDirs = ['app', 'core', 'controllers', 'services', 'views', 'modules'];
for (const dir of jsDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = getAllJsFiles(dir);
  for (const file of files) {
    try {
      execSync(`node --check "${file}"`, { stdio: 'pipe' });
    } catch (e) {
      errors.push(`JS syntax error in: ${file}`);
    }
  }
}

// Check JSON validity in content and schema directories.
const jsonDirs = ['modules', 'schemas', 'content'];
for (const dir of jsonDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = getAllJsonFiles(dir);
  for (const file of files) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      errors.push(`Invalid JSON: ${file} — ${e.message}`);
    }
  }
}

// Check workflows
const workflowDir = '.github/workflows';
if (fs.existsSync(workflowDir)) {
  const workflows = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  if (workflows.length === 0) {
    warnings.push('No workflow files found in .github/workflows/');
  }
}

// Output results
console.log('=== ChemLab-G9 Health Check ===\n');

if (errors.length > 0) {
  console.log('ERRORS:');
  errors.forEach(e => console.log(`  ✗ ${e}`));
}

if (warnings.length > 0) {
  console.log('\nWARNINGS:');
  warnings.forEach(w => console.log(`  ! ${w}`));
}

if (errors.length === 0) {
  console.log('All checks passed.');
  process.exit(0);
} else {
  console.log(`\n${errors.length} error(s) found.`);
  process.exit(1);
}

function getAllJsFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile() && entry.endsWith('.js')) {
      results.push(full);
    }
  }
  return results;
}

function getAllJsonFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { recursive: true })) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isFile() && entry.endsWith('.json')) {
      results.push(full);
    }
  }
  return results;
}
