import assert from 'node:assert/strict';
import test from 'node:test';
import { isAnalyticsEvent, sanitizeAnalyticsProperties } from '../lib/analytics-config';

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
