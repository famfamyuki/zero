import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ANALYTICS_EVENTS,
  isAnalyticsEvent,
  sanitizeAnalyticsProperties,
  sanitizePageviewProperties,
  filterPostHogCapture,
} from '../lib/analytics-config';

test('only the fifteen approved analytics events are accepted', () => {
  assert.equal(isAnalyticsEvent('template_selected'), true);
  assert.equal(isAnalyticsEvent('affiliate_clicked'), true);
  assert.equal(isAnalyticsEvent('readiness_opened'), true);
  assert.equal(isAnalyticsEvent('readiness_finding_selected'), true);
  assert.equal(isAnalyticsEvent('execution_preview_opened'), true);
  assert.equal(isAnalyticsEvent('execution_preview_located'), true);
  assert.equal(isAnalyticsEvent('resource_analysis_opened'), true);
  assert.equal(isAnalyticsEvent('resource_analysis_hotspot_selected'), true);
  assert.equal(isAnalyticsEvent('preflight_review_opened'), true);
  assert.equal(isAnalyticsEvent('preflight_review_stage_selected'), true);
  assert.equal(isAnalyticsEvent('preflight_review_re_evaluated'), true);
  assert.equal(isAnalyticsEvent('resource_analysis_refreshed'), false);
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

test('filterPostHogCapture passes all fifteen custom analytics events', () => {
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

test('Readiness analytics retains only domain-safe properties', () => {
  assert.deepEqual(sanitizeAnalyticsProperties('readiness_opened', {
    status: 'needs_attention', evaluable: true, ruleset_version: '0.1.0', nodeId: 'private', evidence: 'private', translated_text: 'private',
  }), { status: 'needs_attention', evaluable: true, ruleset_version: '0.1.0' });
  assert.deepEqual(sanitizeAnalyticsProperties('readiness_finding_selected', {
    rule_id: 'RDY_AGENT_UNUSED', impact: 'medium', category: 'workflow_structure', target_scope: 'node', edgeId: 'private', label: 'private', goal: 'private', outputFile: 'private',
  }), { rule_id: 'RDY_AGENT_UNUSED', impact: 'medium', category: 'workflow_structure', target_scope: 'node' });
});

test('Execution Preview analytics retains only approved non-content properties', () => {
  assert.deepEqual(sanitizeAnalyticsProperties('execution_preview_opened', {
    state: 'available', process: 'hierarchical', preview_version: '0.1.0', graph: 'private', model: 'private', url: 'private',
  }), { state: 'available', process: 'hierarchical', preview_version: '0.1.0' });
  assert.deepEqual(sanitizeAnalyticsProperties('execution_preview_located', {
    target_type: 'task', source: 'context', id: 'private', label: 'private', description: 'private', output_path: 'private',
  }), { target_type: 'task', source: 'context' });
});

test('Resource Analysis analytics retains only bounded categorical properties', () => {
  assert.deepEqual(sanitizeAnalyticsProperties('resource_analysis_opened', {
    state: 'available', process: 'sequential', analysis_version: '0.1.0',
    id: 'task-private', label: 'private', role: 'private', task_text: 'private',
    graph: '{"private":true}', model_id: 'private-model', hotspot_value: 9,
    blockingCodes: ['NO_TASKS'], error: 'private', $current_url: 'https://private.example',
    $referrer: 'https://referrer.example', utm_source: 'private', lang: 'ja',
  }), { state: 'available', process: 'sequential', analysis_version: '0.1.0' });
  assert.deepEqual(sanitizeAnalyticsProperties('resource_analysis_hotspot_selected', {
    hotspot_kind: 'dependency_depth', target_type: 'task',
    node_id: 'private', tool_id: 'private', label: 'private', value: 7,
    description: 'private', graph_json: '{"private":true}', manager_model: 'private',
  }), { hotspot_kind: 'dependency_depth', target_type: 'task' });
});

test('Unified Preflight analytics retain only exact version and stage properties', () => {
  const privateProperties = {
    node_id: 'node-private',
    label: 'private label',
    prompt: 'private prompt',
    graph_json: '{"private":true}',
    model_id: 'private-model',
    filename: 'private.json',
    contents: 'private contents',
    $current_url: 'https://example.com/?private=1',
    $referrer: 'https://private.example/',
    utm_source: 'private-campaign',
  };

  assert.deepEqual(sanitizeAnalyticsProperties('preflight_review_opened', {
    preflight_version: '0.1.0',
    stage: 'resources',
    ...privateProperties,
  }), { preflight_version: '0.1.0' });

  for (const event of ['preflight_review_stage_selected', 'preflight_review_re_evaluated'] as const) {
    assert.deepEqual(sanitizeAnalyticsProperties(event, {
      stage: 'resources',
      preflight_version: '0.1.0',
      ...privateProperties,
    }), { stage: 'resources' });
  }
});

test('PostHog before_send strips private properties from every Unified Preflight event', () => {
  const cases = [
    ['preflight_review_opened', { preflight_version: '0.1.0' }],
    ['preflight_review_stage_selected', { stage: 'resources' }],
    ['preflight_review_re_evaluated', { stage: 'resources' }],
  ] as const;

  for (const [event, expected] of cases) {
    const result = filterPostHogCapture({
      uuid: `privacy-${event}`,
      event,
      properties: {
        ...expected,
        token: 'phc_public_token',
        distinct_id: 'anonymous-id',
        node_id: 'private-node',
        label: 'private label',
        prompt: 'private prompt',
        graph_json: '{"private":true}',
        model_id: 'private-model',
        filename: 'private.json',
        contents: 'private contents',
        $current_url: 'https://example.com/?private=1',
        $referrer: 'https://private.example/',
        utm_source: 'private-campaign',
      },
    });

    assert.notEqual(result, null);
    assert.deepEqual(result!.properties, {
      ...expected,
      token: 'phc_public_token',
      distinct_id: 'anonymous-id',
    });
  }
});

test('ANALYTICS_EVENTS contains exactly the fifteen expected events', () => {
  const expected = [
    'template_selected',
    'json_imported',
    'code_generated',
    'code_downloaded',
    'buymeacoffee_clicked',
    'affiliate_clicked',
    'readiness_opened',
    'readiness_finding_selected',
    'execution_preview_opened',
    'execution_preview_located',
    'resource_analysis_opened',
    'resource_analysis_hotspot_selected',
    'preflight_review_opened',
    'preflight_review_stage_selected',
    'preflight_review_re_evaluated',
  ];
  assert.deepEqual([...ANALYTICS_EVENTS], expected);
});
