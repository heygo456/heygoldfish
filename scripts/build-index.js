/* Membaca content/artikel/*.md -> content/index.json (dipakai oleh js/app.js).
   Jalankan manual: npm run build  (otomatis dijalankan saat deploy GitHub Actions) */
const fs = require('fs'), path = require('path'), yaml = require('js-yaml');
const dir = path.join(__dirname, '..', 'content', 'artikel');
const out = path.join(__dirname, '..', 'content', 'index.json');
const articles = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
  const raw = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { console.warn('Dilewati (front matter tidak ada):', f); return null; }
  return { id: f.replace(/\.md$/, ''), ...yaml.load(m[1]), body: m[2].trim() };
}).filter(Boolean).sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || String(a.title).localeCompare(String(b.title)));
fs.writeFileSync(out, JSON.stringify({ articles }, null, 1));
console.log(`index.json: ${articles.length} artikel`);
