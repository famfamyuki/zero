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


