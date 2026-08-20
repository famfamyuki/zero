# AgentGraph Studio — PostHog 計測不具合 修正完了レポート

**作成日時**: 2026-08-20  
**対象リポジトリ**: `famfamyuki/zero`  
**適用ブランチ**: `main`  
**最新コミット**: `fix: preserve PostHog transport token`  

---

## 1. 概要 (Executive Summary)

AgentGraph Studio において、Vercel Analytics では実ユーザー数が計測されていた一方で、PostHog では各種操作やページ表示を行ってもイベントが 1 件も記録されない問題が発生していました。

調査・実証の結果、以下の決定的な要因を特定・解決しました：
1. **`capture_pageview: false` 設定**: 自動 `$pageview` が無効化されていた。
2. **`before_send` による `$pageview` 破棄**: `isAnalyticsEvent('$pageview') === false` により破棄されていた。
3. **`token` プロパティの欠落による HTTP 401（最重要）**: `ANONYMOUS_SDK_PROPERTY_ALLOWLIST` に `token` が含まれていなかったため、サニタイザーによって `properties.token` が削除され、PostHog サーバー側で **HTTP 401: "event submitted without an api_key"** として全イベントが拒否されていた。

本改修により、**プライバシー保護設計（ユーザー入力・プロンプト・JSON本文・URLクエリ文字列等の非送信）を 100% 維持** したまま、PostHog への正規 ingestion（HTTP 200 OK）を完全復旧しました。

---

## 2. 根本原因 (Root Cause Analysis)

| # | 現象 | 該当箇所 | 原因詳細 | 影響 |
|---|---|---|---|---|
| 1 | `properties.token` の消失 | `lib/analytics-config.ts`<br>`ANONYMOUS_SDK_PROPERTY_ALLOWLIST` | allowlist に `token` が定義されていなかったため、`before_send` フィルタ実行時に `properties.token` が削除された。 | **PostHog Ingestion API が HTTP 401 (`event submitted without an api_key`) を返し、全イベントが不受理となっていた。** |
| 2 | `$pageview` が記録されない | `instrumentation-client.ts:12`<br>`capture_pageview: false` | PostHog SDK の自動ページビュー計測が無効化されていた。 | 初期表示および SPA 遷移のページビューが生成されない。 |
| 3 | `$pageview` のフィルタ破棄 | `instrumentation-client.ts:23`<br>`before_send` 内判定 | `isAnalyticsEvent(capture.event)` は独自 6 イベントのみを許可しており、`$pageview` が `null` で破棄されていた。 | 仮に `$pageview` が発生しても送信されない。 |

---

## 3. 実施した修正内容 (Implemented Changes)

### ① `lib/analytics-config.ts`
* **`ANONYMOUS_SDK_PROPERTY_ALLOWLIST` に `token` および `$window_id` を追加**:
  * PostHog のイベント配送・認証に不可欠な `token`（プロジェクト API キー）を保持。
* **`sanitizePageviewProperties` の実装**:
  * 許可: `token`, `distinct_id`, `$pathname`（ページパス例: `/`, `/templates`）+ 匿名 SDK メタデータ（OS, ブラウザ等）
  * 破棄: `$current_url`（クエリ文字列漏洩防止）、`$referrer`、`$referring_domain`、UTM パラメータ等
* **`filterPostHogCapture`（共通純粋関数）の実装**:
  * `$pageview` → `sanitizePageviewProperties` を適用
  * 独自イベント（`ANALYTICS_EVENTS`） → `sanitizeAnalyticsProperties` を適用
  * 未許可イベント（`$autocapture`, `$rageclick`, 未知イベント等） → `null` で送信遮断

### ② `instrumentation-client.ts`
* `capture_pageview: 'history_change'` に変更（初回アクセスおよび Next.js SPA 遷移を計測）。
* `before_send` に `filterPostHogCapture` を適用。
* プライバシー設定（`autocapture: false`, `disable_session_recording: true`, `person_profiles: 'never'`, `ip: false` 等）を維持。

### ③ `tests/analytics_privacy.test.ts`
* `filterPostHogCapture` で `token` が確実に保持され、かつ `$current_url` / `$referrer` / UTM / ユーザー入力が確実に除去されることを検証するテストを追加。

---

## 4. プライバシー保護設計 (Privacy-First Architecture)

以下の機密情報は **一切 PostHog へ送信されません**：

- ❌ **ユーザー入力内容**（プロンプト、設定値、APIキー等）
- ❌ **ファイル内容**（インポートした JSON 本文、ノード構成等）
- ❌ **生成コード**（生成された Python スクリプト等）
- ❌ **URL クエリ文字列**（`$current_url` を除外し、パス名 `$pathname` のみ収集）
- ❌ **リファラー・トラッキングパラメータ**（`$referrer`, UTM パラメータ等を除外）
- ❌ **Session Recording / Heatmaps / Autocapture / IP アドレス**（すべて無効化）

---

## 5. 実エンドポイント疎通検証 (Live Endpoint Verification)

PostHog EU エンドポイント (`https://eu.i.posthog.com/e/`) に対する実測結果：

* **修正前（token 削除状態）**:
  * HTTP Status: `401 Unauthorized`
  * Response: `event submitted without an api_key`
* **修正後（token 保持 + サニタイズ適用）**:
  * HTTP Status: `200 OK`
  * Response: `{"status":"Ok"}`
  * 送信プロパティ: `token`, `distinct_id`, `$pathname` のみ保持。クエリ文字列等は完全除去。

---

## 6. 品質保証 & テスト結果 (Quality Assurance)

| 項目 | 実行コマンド | 結果 |
|---|---|---|
| **Privacy & Token Unit Tests** | `node --import tsx --test tests/analytics_privacy.test.ts` | **PASS (13/13, 0 fail)** |
| **Full Project Test Suite** | `npm test` | **PASS (46/46, 0 fail)** |
| **TypeScript Typecheck** | `npm run build` | **PASS (型エラー 0 件)** |
| **Production Build** | `npm run build` | **PASS (7/7 ページ静的最適化完了)** |
