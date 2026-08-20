import posthog from 'posthog-js';
import { filterPostHogCapture } from '@/lib/analytics-config';

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (projectToken) {
  posthog.init(projectToken, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
    defaults: '2026-05-30',
    autocapture: false,
    rageclick: false,
    capture_pageview: 'history_change',
    capture_pageleave: false,
    capture_heatmaps: false,
    capture_performance: false,
    disable_session_recording: true,
    enable_recording_console_log: false,
    person_profiles: 'never',
    save_campaign_params: false,
    save_referrer: false,
    ip: false,
    before_send: filterPostHogCapture,
  });
}
