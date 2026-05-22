'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const build = require('../build.js');

test('injectOverlay inserts the overlay block before </body>', () => {
  const html = '<html><body><h1>Hi</h1></body></html>';
  const out = build.injectOverlay(html, '../../');

  assert.ok(out.includes('<!-- hub-overlay:start -->'), 'has start marker');
  assert.ok(out.includes('<!-- hub-overlay:end -->'), 'has end marker');
  assert.ok(
    out.includes('src="../../hub-overlay.js"'),
    'references the shared overlay file at the given root',
  );
  assert.ok(
    out.includes('data-hub-root="../../"'),
    'passes the hub root to the overlay',
  );
  assert.ok(
    out.indexOf('<!-- hub-overlay:start -->') < out.indexOf('</body>'),
    'block is placed before the closing body tag',
  );
});

test('injectOverlay is idempotent', () => {
  const html = '<html><body><h1>Hi</h1></body></html>';
  const once = build.injectOverlay(html, '../../');
  const twice = build.injectOverlay(once, '../../');

  assert.equal(twice, once, 'injecting an already-injected page changes nothing');
});

test('injectOverlay replaces a stale block when the root changes', () => {
  const html = '<html><body><h1>Hi</h1></body></html>';
  const shallow = build.injectOverlay(html, '../../');
  const deeper = build.injectOverlay(shallow, '../../../');

  assert.ok(deeper.includes('src="../../../hub-overlay.js"'), 'uses the new root');
  assert.ok(!deeper.includes('src="../../hub-overlay.js"'), 'drops the old root');
  assert.equal(
    deeper.match(/hub-overlay:start/g).length,
    1,
    'still exactly one overlay block',
  );
});

test('injectOverlay appends the block when there is no </body>', () => {
  const html = '<h1>Fragment with no body tag</h1>\n';
  const out = build.injectOverlay(html, './');

  assert.ok(out.includes('<!-- hub-overlay:start -->'), 'block was added');
  assert.ok(out.includes('src="./hub-overlay.js"'), 'uses the given root');
  assert.ok(
    out.trimEnd().endsWith('<!-- hub-overlay:end -->'),
    'block lands at the end of the document',
  );
});

test('relativeRootPath returns the URL prefix from a page back to the repo root', () => {
  const root = path.join('C:', 'repo');

  assert.equal(
    build.relativeRootPath(path.join(root, 'sites', 'x', 'index.html'), root),
    '../../',
  );
  assert.equal(
    build.relativeRootPath(path.join(root, 'sites', 'x', 'sub', 'page.html'), root),
    '../../../',
  );
});

test('relativeRootPath uses forward slashes, not OS separators', () => {
  const root = path.join('C:', 'repo');
  const rel = build.relativeRootPath(path.join(root, 'sites', 'x', 'index.html'), root);

  assert.ok(!rel.includes('\\'), 'no backslashes in a URL path');
});

test('relativeRootPath returns "./" for a file in the repo root', () => {
  const root = path.join('C:', 'repo');

  assert.equal(build.relativeRootPath(path.join(root, 'index.html'), root), './');
});
