import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ANALYTICS_EVENTS,
  isAnalyticsEvent,
  sanitizeAnalyticsProperties,
  sanitizePageviewProperties,
  filterPostHogCapture,
} from '../lib/analytics-config';

test('only the six approved analytics events are accepted', () => {
  assert.equal(isAnalyticsEvent('template_selected'), true);
  assert.equal(isAnalyticsEvent('affiliate_clicked'), true);
  assert.equal(isAnalyticsEvent('$pageview'), false);
  assert.equal(isAnalyticsEvent('$autocapture'), false);
  assert.equal(isAnalyticsEvent('api_key_entered'), false);
});

test('user content and automatic URL properties are removed', () => {
  const sanitized = sanitizeAnalyticsProperties('template_selected', {
    template_id: 'research-template',
    source: 'library',
    api_key: 'secret',
    prompt: 'private prompt',
    json: '{"private":true}',
    generated_code: 'print("private")',
    $current_url: 'https://example.com/?prompt=private',
    $referrer: 'https://private.example/',
    distinct_id: 'anonymous-id',
  });

  assert.deepEqual(sanitized, {
    template_id: 'research-template',
    source: 'library',
    distinct_id: 'anonymous-id',
  });
});

test('JSON import keeps only its safe source and discards file contents', () => {
  assert.deepEqual(
    sanitizeAnalyticsProperties('json_imported', {
      source: 'drag_drop',
      filename: 'private.json',
      contents: '{"apiKey":"secret"}',
    }),
    { source: 'drag_drop' }
  );
});

// --- sanitizePageviewProperties ---

test('$pageview sanitizer keeps only $pathname and anonymous SDK props', () => {
  const sanitized = sanitizePageviewProperties({
    $pathname: '/templates',
    $current_url: 'https://example.com/templates?prompt=private',
    $referrer: 'https://private.example/',
    $referring_domain: 'private.example',
    utm_source: 'twitter',
    $browser: 'Chrome',
    $os: 'macOS',
    distinct_id: 'anon-123',
    $screen_height: 1080,
    $screen_width: 1920,
  });
  assert.deepEqual(sanitized, {
    $pathname: '/templates',
    $browser: 'Chrome',
    $os: 'macOS',
    distinct_id: 'anon-123',
  });
});

test('$pageview sanitizer strips $current_url to prevent query string leakage', () => {
  const sanitized = sanitizePageviewProperties({
    $current_url: 'https://app.example.com/?secret=abc123',
    $pathname: '/',
  });
  assert.equal(sanitized.$current_url, undefined);
  assert.equal(sanitized.$pathname, '/');
});

// --- filterPostHogCapture (production before_send) ---

test('filterPostHogCapture passes $pageview with sanitized properties', () => {
  const result = filterPostHogCapture({
    uuid: '1',
    event: '$pageview',
    properties: {
      $pathname: '/templates',
      $current_url: 'https://example.com/templates?private=1',
      $referrer: 'https://google.com/',
      $browser: 'Firefox',
      distinct_id: 'anon-456',
    },
  });
  assert.notEqual(result, null);
  assert.equal(result!.event, '$pageview');
  assert.equal(result!.properties.$pathname, '/templates');
  assert.equal(result!.properties.$browser, 'Firefox');
  assert.equal(result!.properties.distinct_id, 'anon-456');
  // Privacy: these must be stripped
  assert.equal(result!.properties.$current_url, undefined);
  assert.equal(result!.properties.$referrer, undefined);
});

test('filterPostHogCapture passes allowed custom events with sanitized properties', () => {
  const result = filterPostHogCapture({
    uuid: '2',
    event: 'template_selected',
    properties: {
      template_id: 'my-template',
      source: 'sidebar',
      $current_url: 'https://example.com/',
      api_key: 'secret',
      distinct_id: 'anon-789',
    },
  });
  assert.notEqual(result, null);
  assert.equal(result!.event, 'template_selected');
  assert.deepEqual(result!.properties, {
    template_id: 'my-template',
    source: 'sidebar',
    distinct_id: 'anon-789',
  });
});

test('filterPostHogCapture rejects unknown events', () => {
  assert.equal(filterPostHogCapture({
    uuid: '3',
    event: '$autocapture',
    properties: { $el_text: 'button' },
  }), null);

  assert.equal(filterPostHogCapture({
    uuid: '4',
    event: '$rageclick',
    properties: {},
  }), null);

  assert.equal(filterPostHogCapture({
    uuid: '5',
    event: 'unknown_custom_event',
    properties: {},
  }), null);
});

test('filterPostHogCapture returns null for null input', () => {
  assert.equal(filterPostHogCapture(null), null);
});

test('filterPostHogCapture passes all six custom analytics events', () => {
  for (const event of ANALYTICS_EVENTS) {
    const result = filterPostHogCapture({
      uuid: 'test',
      event,
      properties: { distinct_id: 'test' },
    });
    assert.notEqual(result, null, `Expected ${event} to pass filterPostHogCapture`);
    assert.equal(result!.event, event);
  }
});

test('filterPostHogCapture preserves token on custom events while stripping unallowed data', () => {
  const result = filterPostHogCapture({
    uuid: 'custom-token-test',
    event: 'code_generated',
    properties: {
      token: 'phc_test_token',
      distinct_id: 'anon-test',
      $session_id: 'session-123',
      $window_id: 'window-456',
      secret_data: 'remove-me',
      prompt: 'private prompt',
      generated_code: 'def foo(): pass',
      $current_url: 'https://example.com/editor?secret=1',
      $referrer: 'https://secret.example.com/',
      utm_source: 'twitter',
    },
  });
  assert.notEqual(result, null);
  assert.equal(result!.event, 'code_generated');
  assert.equal(result!.properties.token, 'phc_test_token');
  assert.equal(result!.properties.distinct_id, 'anon-test');
  assert.equal(result!.properties.$session_id, 'session-123');
  assert.equal(result!.properties.$window_id, 'window-456');
  // Privacy verification: all unallowed user/URL properties MUST be stripped
  assert.equal(result!.properties.secret_data, undefined);
  assert.equal(result!.properties.prompt, undefined);
  assert.equal(result!.properties.generated_code, undefined);
  assert.equal(result!.properties.$current_url, undefined);
  assert.equal(result!.properties.$referrer, undefined);
  assert.equal(result!.properties.utm_source, undefined);
});

test('filterPostHogCapture preserves token on $pageview events while stripping unallowed data', () => {
  const result = filterPostHogCapture({
    uuid: 'pageview-token-test',
    event: '$pageview',
    properties: {
      token: 'phc_test_token',
      distinct_id: 'anon-test',
      $pathname: '/templates',
      $session_id: 'session-123',
      $window_id: 'window-456',
      $current_url: 'https://example.com/templates?secret=abc',
      $referrer: 'https://private.example.com/',
      $referring_domain: 'private.example.com',
      utm_source: 'campaign',
    },
  });
  assert.notEqual(result, null);
  assert.equal(result!.event, '$pageview');
  assert.equal(result!.properties.token, 'phc_test_token');
  assert.equal(result!.properties.distinct_id, 'anon-test');
  assert.equal(result!.properties.$pathname, '/templates');
  assert.equal(result!.properties.$session_id, 'session-123');
  assert.equal(result!.properties.$window_id, 'window-456');
  // Privacy verification
  assert.equal(result!.properties.$current_url, undefined);
  assert.equal(result!.properties.$referrer, undefined);
  assert.equal(result!.properties.$referring_domain, undefined);
  assert.equal(result!.properties.utm_source, undefined);
});

test('ANALYTICS_EVENTS contains exactly the six expected events', () => {
  const expected = [
    'template_selected',
    'json_imported',
    'code_generated',
    'code_downloaded',
    'buymeacoffee_clicked',
    'affiliate_clicked',
  ];
  assert.deepEqual([...ANALYTICS_EVENTS], expected);
});
