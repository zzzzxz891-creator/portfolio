import test from 'node:test';
import assert from 'node:assert/strict';
import { createSitePaths } from '../src/site-paths.js';

for (const base of ['/', '/portfolio/']) {
  test(`navigation and all responsive asset candidates use base ${base}`, () => {
    const { sitePath, assetData, appRoute } = createSitePaths(base);
    assert.equal(sitePath('/works'), `${base}works`);
    assert.equal(sitePath('/#about'), `${base}#about`);
    assert.equal(appRoute(`${base}works/`, '#top'), '/works/#top');
    const mapped = assetData({ original: '/assets/page.png?v=abc', srcSet: '/assets/page.webp?v=abc 1600w, /assets/page.png?v=abc 3840w', meta: [29, true, 'https://example.com/photo'] });
    assert.equal(mapped.original, `${base}assets/page.png?v=abc`);
    assert.equal(mapped.srcSet, `${base}assets/page.webp?v=abc 1600w, ${base}assets/page.png?v=abc 3840w`);
    assert.deepEqual(mapped.meta, [29, true, 'https://example.com/photo']);
  });
}
