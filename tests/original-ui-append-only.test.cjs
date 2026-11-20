"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
function blobSha(content) {
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  return crypto.createHash('sha1')
    .update(Buffer.from('blob ' + bytes.length + '\\0'.replace('\\0', '\0')))
    .update(bytes).digest('hex');
}
function source(pathname) {
  return fs.readFileSync(path.join(root, pathname));
}
const BASELINE_BLOBS = {
  'app.js': '692359e0539568ccfe2f592e6e5e258c8f3fe22c',
  'styles.css': '209367ec490ad12f123e0a9a006a4fffec8b6dad',
  'data/executive_water_data.js': '538d3c4a421367a6c03aaa45d6fdeb95113379aa',
  'data/executive_water_update_2026_08.js': '34f101951692f355939aac1e4b40318216140281',
};
const INITIAL_INDEX_SHA = '5a058fac3b5db20d916e206c6ca35932b628f038';
const NEW_SCRIPT = '    <script src="./data/executive_water_update_2026_11.js"></script>\\n'.replace('\\n', '\n');

test('original September 16 source, styles, historical datasets and existing assumptions are byte-identical', () => {
  for (const [pathname, sha] of Object.entries(BASELINE_BLOBS)) {
    assert.equal(blobSha(source(pathname)), sha, pathname + ' changed from the September 16 version');
  }
});
test('only new-month script tag was appended to the original HTML', () => {
  const html = source('index.html').toString('utf8');
  assert.equal(html.split(NEW_SCRIPT).length - 1, 1, 'new-month script must appear exactly once');
  assert.ok(html.indexOf('executive_water_update_2026_08.js') < html.indexOf('executive_water_update_2026_11.js'));
  assert.ok(html.indexOf('executive_water_update_2026_11.js') < html.indexOf('src="./app.js"'));
  const restored = html.replace(NEW_SCRIPT, '');
  assert.equal(blobSha(restored), INITIAL_INDEX_SHA, 'unexpected changes to original markup');
});
