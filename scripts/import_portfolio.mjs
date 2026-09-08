import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import os from 'node:os';

const source = path.join(os.tmpdir(), 'spaceynyc-portfolio-source-20260908');
const app = fs.readFileSync(path.join(source, 'src/App.tsx'), 'utf8');
const readArray = (name, type) => {
  const start = app.indexOf(`const ${name}${type} = [`);
  if (start < 0) throw new Error(`Missing ${name}`);
  const literal = app.slice(app.indexOf('[', start), app.indexOf('\n]', start) + 2);
  // Only the inspected, literal content arrays from the original portfolio.
  return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 100 });
};
const featured = readArray('featured', ': Project[]');
const projects = [...featured, ...readArray('projects', ': Project[]')].map((p, i) => ({
  ...p,
  id: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  number: String(i + 1).padStart(2, '0'),
  featured: i < featured.length,
}));
if (projects.length !== 11) throw new Error('Unexpected project count');
fs.writeFileSync('src/portfolio-data.js', '// Content migrated from spaceynyc/portfolio at 261f0cb83ce3d80083436d30afbca40664836d31.\n'
  + `export const projects = ${JSON.stringify(projects, null, 2)};\n`
  + `export const technologies = ${JSON.stringify(readArray('marqueeItems', ''), null, 2)};\n`);
fs.cpSync(path.join(source, 'public/screenshots'), 'public/screenshots', { recursive: true });
console.log(`Imported ${projects.length} projects and ${projects.filter(p => p.image).length} original thumbnails.`);
