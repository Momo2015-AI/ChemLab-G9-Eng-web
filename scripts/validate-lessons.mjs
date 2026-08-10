import fs from 'node:fs/promises';
import path from 'node:path';

const dir = process.argv[2] || 'modules/lessons';
const entries = (await fs.readdir(dir)).filter(name => /^day-\d+\.json$/.test(name));
const ids = new Set();
const errors = [];
for (const name of entries) {
  const file = path.join(dir, name);
  const data = JSON.parse(await fs.readFile(file, 'utf8'));
  const id = data.id ?? data.day ?? name;
  if (ids.has(String(id))) errors.push(`duplicate lesson id: ${id}`);
  ids.add(String(id));
  if (data.day == null) errors.push(`${name}: missing day`);
}
console.log(`Validated ${entries.length} lesson files, ${ids.size} unique lesson IDs`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
