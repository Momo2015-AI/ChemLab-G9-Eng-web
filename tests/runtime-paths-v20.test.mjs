import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const read = path => fs.readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('production index does not hard-code the GitHub Pages base path', async () => {
  const index = await read('index.html');
  assert.doesNotMatch(index, /<base\s+href=["']\/ChemLab-G9-Eng-web\//i);
  assert.match(index, /import\(['"]\.\/app\/bootstrap\.js['"]\)/);
});

test('content loader resolves assets from its module URL instead of document base', async () => {
  const loader = await read('app/content-loader.js');
  assert.match(loader, /new URL\('\.\.\/\', import\.meta\.url\)/);
  assert.doesNotMatch(loader, /querySelector\(['"]base['"]\)/);
});
