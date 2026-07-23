import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildRedirectHtml,
  outPathFor,
  PrerenderError,
  requiredMetadataIssues,
  runPrerender,
} from './prerender.mjs';

test('legacy redirects preserve the deployment base without remaining indexable', () => {
  const html = buildRedirectHtml('/bibliotheque', '/vc-platform/');

  assert.match(html, /http-equiv="refresh" content="0; url=\/vc-platform\/bibliotheque"/);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /window\.location\.replace\("\/vc-platform\/bibliotheque"\)/);
  assert.doesNotMatch(html, /rel="canonical"/);
});

test('prerender output paths cannot escape the selected dist directory', () => {
  assert.equal(outPathFor('/home?source=test', '/virtual/dist'), '/virtual/dist/home/index.html');
  assert.throws(() => outPathFor('/../../outside', '/virtual/dist'), /hors du répertoire cible/);
  assert.throws(() => outPathFor('/folder\\outside', '/virtual/dist'), /chemin de route invalide/);
});

const options = {
  baseUrl: '/',
  siteUrl: 'https://example.test',
  routes: ['/ok'],
  concurrency: 1,
  tolerant: false,
  distDir: '/virtual/dist',
};

function rendered({ metaReady = true, missingMetadata = [] } = {}) {
  return {
    html: '<!doctype html><html><head></head><body><div id="root">ok</div></body></html>',
    metaReady,
    missingMetadata,
  };
}

function fakeBrowser() {
  return {
    async newPage() {
      return { close: async () => {} };
    },
    close: async () => {},
  };
}

function dependencies(overrides = {}) {
  return {
    readShell: () => '<!doctype html><html><body><div id="root"></div></body></html>',
    startServer: async () => ({
      origin: 'http://127.0.0.1:4317',
      close: async () => {},
    }),
    launchBrowser: async () => fakeBrowser(),
    renderRoute: async () => rendered(),
    writeHtml: () => {},
    ...overrides,
  };
}

async function expectStrictFailure(promise, predicate) {
  await assert.rejects(promise, (error) => {
    assert.equal(error instanceof PrerenderError, true);
    assert.equal(error.summary.ok, false);
    predicate(error.summary);
    return true;
  });
}

test('strict prerender fails when Chromium cannot start', async () => {
  await expectStrictFailure(
    runPrerender(options, dependencies({
      launchBrowser: async () => {
        throw new Error('Chromium unavailable');
      },
    })),
    (summary) => assert.match(summary.browserError, /Chromium unavailable/),
  );
});

test('tolerant prerender is available only through an explicit option', async () => {
  const summary = await runPrerender(
    { ...options, tolerant: true },
    dependencies({
      launchBrowser: async () => {
        throw new Error('Chromium unavailable');
      },
    }),
  );

  assert.equal(summary.ok, false);
  assert.match(summary.browserError, /Chromium unavailable/);
});

test('strict prerender rejects metaReady=false and does not write the route', async () => {
  const writes = [];
  await expectStrictFailure(
    runPrerender(options, dependencies({
      renderRoute: async (_page, request) => request.requireNoindex
        ? rendered()
        : rendered({ metaReady: false }),
      writeHtml: (path) => writes.push(path),
    })),
    (summary) => {
      assert.deepEqual(summary.metadataFailures.map((failure) => failure.path), ['/ok']);
      assert.equal(summary.written, 0);
      assert.equal(summary.expected, 1);
    },
  );
  assert.deepEqual(writes, ['/virtual/dist/404.html']);
});

test('strict prerender reports a route failure and a count mismatch', async () => {
  await expectStrictFailure(
    runPrerender(options, dependencies({
      renderRoute: async (_page, request) => {
        if (!request.requireNoindex) throw new Error('route crashed');
        return rendered();
      },
    })),
    (summary) => {
      assert.deepEqual(summary.routeFailures.map((failure) => failure.path), ['/ok']);
      assert.match(summary.routeFailures[0].message, /route crashed/);
      assert.equal(summary.written, 0);
      assert.equal(summary.expected, 1);
      assert.equal(summary.issues.includes('count-mismatch'), true);
    },
  );
});

test('strict prerender rejects a rendered route with required metadata missing', async () => {
  await expectStrictFailure(
    runPrerender(options, dependencies({
      renderRoute: async (_page, request) => request.requireNoindex
        ? rendered()
        : rendered({ missingMetadata: ['canonical'] }),
    })),
    (summary) => {
      assert.deepEqual(summary.metadataFailures, [{ path: '/ok', missing: ['canonical'], metaReady: true }]);
      assert.equal(summary.written, 0);
    },
  );
});

test('required metadata validation covers canonical, social tags and 404 noindex', () => {
  const complete = {
    title: 'Page · VC Premium Experience',
    rootChildCount: 1,
    description: 'Description',
    canonical: 'https://example.test/page',
    robots: '',
    ogTitle: 'Page · VC Premium Experience',
    ogDescription: 'Description',
    ogUrl: 'https://example.test/page',
    ogImage: 'https://example.test/og/default.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Page · VC Premium Experience',
    twitterDescription: 'Description',
    twitterImage: 'https://example.test/og/default.png',
  };

  assert.deepEqual(requiredMetadataIssues(complete, {
    expectedCanonical: 'https://example.test/page',
  }), []);
  assert.deepEqual(requiredMetadataIssues({ ...complete, canonical: '' }, {
    expectedCanonical: 'https://example.test/page',
  }), ['canonical']);
  assert.deepEqual(requiredMetadataIssues({ ...complete, canonical: '', ogUrl: '', robots: 'noindex,nofollow' }, {
    requireNoindex: true,
    allowCanonical: false,
  }), []);
  assert.deepEqual(requiredMetadataIssues({ ...complete, canonical: '', ogUrl: '', robots: '' }, {
    requireNoindex: true,
    allowCanonical: false,
  }), ['robots:noindex']);
});

test('strict prerender writes every selected route and a noindex 404 artifact', async () => {
  const writes = [];
  const summary = await runPrerender(options, dependencies({
    writeHtml: (path) => writes.push(path),
  }));

  assert.equal(summary.ok, true);
  assert.equal(summary.expected, 1);
  assert.equal(summary.written, 1);
  assert.equal(summary.notFoundWritten, true);
  assert.deepEqual(writes.sort(), [
    '/virtual/dist/404.html',
    '/virtual/dist/ok/index.html',
  ]);
});

test('prerender waits for every worker when one page fails to initialize', async () => {
  let releaseRender;
  const renderMayFinish = new Promise((resolve) => {
    releaseRender = resolve;
  });
  let pageCount = 0;
  let workerPageClosed;
  const workerPageDidClose = new Promise((resolve) => {
    workerPageClosed = resolve;
  });
  const writes = [];
  const browser = {
    async newPage() {
      pageCount += 1;
      if (pageCount === 2) throw new Error('page initialization failed');
      return {
        close: async () => workerPageClosed(),
      };
    },
    close: async () => {},
  };

  const result = runPrerender({
    ...options,
    concurrency: 2,
    routes: ['/one', '/two'],
    tolerant: true,
  }, dependencies({
    launchBrowser: async () => browser,
    renderRoute: async (_page, request) => {
      if (!request.requireNoindex) await renderMayFinish;
      return rendered();
    },
    writeHtml: (path) => writes.push(path),
  }));

  let returned = false;
  void result.then(() => {
    returned = true;
  });
  await new Promise((resolve) => setImmediate(resolve));

  try {
    assert.equal(returned, false, 'runPrerender returned while another worker was still rendering');
  } finally {
    releaseRender();
  }

  const summary = await result;
  await workerPageDidClose;
  assert.equal(summary.attempted, 2);
  assert.equal(summary.written, 2);
  assert.equal(summary.notFoundWritten, true);
  assert.match(summary.infrastructureError, /page initialization failed/);
  assert.deepEqual(writes.sort(), [
    '/virtual/dist/404.html',
    '/virtual/dist/one/index.html',
    '/virtual/dist/two/index.html',
  ]);
});
