import type { Language } from '@/lib/i18n/translations';

const en = {
  'readiness.crewNameEmpty.title': 'Crew name is empty',
  'readiness.crewNameEmpty.explanation': 'A named crew is easier to identify and maintain.',
  'readiness.crewNameEmpty.suggestion': 'Open Crew Config and enter a descriptive crew name.',
  'readiness.nodeLabelEmpty.title': 'Node label is empty',
  'readiness.nodeLabelEmpty.explanation': 'An unlabeled node makes the workflow harder to understand.',
  'readiness.nodeLabelEmpty.suggestion': 'Open the node in Inspector and add a concise label.',
  'readiness.agentUnused.title': 'Agent is unused',
  'readiness.agentUnused.explanation': 'This agent does not own a task in the sequential workflow.',
  'readiness.agentUnused.suggestion': 'Assign the agent to a task or remove it if it is unnecessary.',
  'readiness.toolUnused.title': 'Tool is unused',
  'readiness.toolUnused.explanation': 'This Tool is not connected to an Agent.',
  'readiness.toolUnused.suggestion': 'Connect the Tool to an Agent or remove the Tool.',
  'readiness.duplicateSemanticEdge.title': 'Duplicate connection',
  'readiness.duplicateSemanticEdge.explanation': 'Multiple connections express the same relationship.',
  'readiness.duplicateSemanticEdge.suggestion': 'Keep one connection and delete the duplicate.',
  'readiness.legacyTaskAgentEdge.title': 'Use Agent → Task for ownership',
  'readiness.legacyTaskAgentEdge.explanation': 'Task → Agent is a legacy ownership direction.',
  'readiness.legacyTaskAgentEdge.suggestion': 'Replace it with an Agent → Task connection.',
  'readiness.redundantAgentAssignment.title': 'Agent assignment is duplicated',
  'readiness.redundantAgentAssignment.explanation': 'The same ownership is set through more than one assignment channel.',
  'readiness.redundantAgentAssignment.suggestion': 'Keep either the Agent → Task connection or assigned Agent field, not both.',
  'readiness.hierarchicalManagerImplicit.title': 'Manager model is implicit',
  'readiness.hierarchicalManagerImplicit.explanation': 'Hierarchical execution relies on an implicit manager model.',
  'readiness.hierarchicalManagerImplicit.suggestion': 'Open Crew Config and select the intended Manager LLM.',
  'readiness.hierarchicalAssignmentIgnored.title': 'Explicit task ownership is ignored in hierarchical mode',
  'readiness.hierarchicalAssignmentIgnored.explanation': 'Hierarchical execution delegates tasks through the manager instead of explicit ownership.',
  'readiness.hierarchicalAssignmentIgnored.suggestion': 'Remove explicit task ownership, or switch to sequential mode if fixed ownership is required.',
  'readiness.customModelUnverified.title': 'Custom model is not catalog-verified',
  'readiness.customModelUnverified.explanation': 'The model identifier is outside the built-in model catalog.',
  'readiness.customModelUnverified.suggestion': 'Verify the provider model ID and runtime credentials before deployment.',
  'readiness.customToolStub.title': 'Custom Tool is still a scaffold stub',
  'readiness.customToolStub.explanation': 'Generated scaffold code does not implement the Custom Tool behavior.',
  'readiness.customToolStub.suggestion': 'Implement the generated Custom Tool class before production use.',
  'readiness.jsonOutputSchemaImplicit.title': 'JSON output schema is implicit',
  'readiness.jsonOutputSchemaImplicit.explanation': 'The Task requests JSON without an explicit schema.',
  'readiness.jsonOutputSchemaImplicit.suggestion': 'Add a valid JSON schema in the Task output settings.',
  'readiness.structuredOutputMismatch.title': 'Structured output request and validation do not match',
  'readiness.structuredOutputMismatch.explanation': 'The requested structured output is not enabled consistently.',
  'readiness.structuredOutputMismatch.suggestion': 'Enable JSON output and provide a matching schema.',
  'readiness.outputFileCollision.title': 'Multiple tasks share one output file',
  'readiness.outputFileCollision.explanation': 'More than one Task writes to the same output file.',
  'readiness.outputFileCollision.suggestion': 'Give each Task a unique output file or consolidate the writers.',
  'readiness.safetyClaimUnenforced.title': 'Safety constraint is not enforced by generated code',
  'readiness.safetyClaimUnenforced.explanation': 'The workflow describes a safety constraint that generated code cannot enforce.',
  'readiness.safetyClaimUnenforced.suggestion': 'Add explicit runtime checks outside the prompt before production use.',
} as const;

export type ReadinessTranslationKey = keyof typeof en;
const ja: { [K in ReadinessTranslationKey]: string } = {
  'readiness.crewNameEmpty.title': 'Crew名が空です', 'readiness.crewNameEmpty.explanation': 'Crew名がないと識別や保守が難しくなります。', 'readiness.crewNameEmpty.suggestion': 'Crew Configを開き、内容を表すCrew名を入力してください。',
  'readiness.nodeLabelEmpty.title': 'ノードのラベルが空です', 'readiness.nodeLabelEmpty.explanation': 'ラベルのないノードはワークフローを理解しにくくします。', 'readiness.nodeLabelEmpty.suggestion': 'Inspectorでノードを開き、簡潔なラベルを追加してください。',
  'readiness.agentUnused.title': '未使用のAgentがあります', 'readiness.agentUnused.explanation': 'このAgentはSequentialワークフロー内のTaskを担当していません。', 'readiness.agentUnused.suggestion': 'AgentをTaskへ割り当てるか、不要なら削除してください。',
  'readiness.toolUnused.title': '未使用のToolがあります', 'readiness.toolUnused.explanation': 'このToolはAgentへ接続されていません。', 'readiness.toolUnused.suggestion': 'ToolをAgentへ接続するか、Toolを削除してください。',
  'readiness.duplicateSemanticEdge.title': '同じ意味の接続が重複しています', 'readiness.duplicateSemanticEdge.explanation': '複数の接続が同じ関係を表しています。', 'readiness.duplicateSemanticEdge.suggestion': '接続を1本だけ残し、重複を削除してください。',
  'readiness.legacyTaskAgentEdge.title': 'Agent → Task形式を使用してください', 'readiness.legacyTaskAgentEdge.explanation': 'Task → Agentは旧形式の担当関係です。', 'readiness.legacyTaskAgentEdge.suggestion': 'Agent → Task接続へ置き換えてください。',
  'readiness.redundantAgentAssignment.title': 'Agent割当が重複しています', 'readiness.redundantAgentAssignment.explanation': '同じ担当関係が複数の方法で設定されています。', 'readiness.redundantAgentAssignment.suggestion': 'Agent → Task接続またはassigned Agentフィールドのどちらか一方だけを使用してください。',
  'readiness.hierarchicalManagerImplicit.title': 'Manager modelが暗黙設定です', 'readiness.hierarchicalManagerImplicit.explanation': 'Hierarchical実行が暗黙のManager modelに依存しています。', 'readiness.hierarchicalManagerImplicit.suggestion': 'Crew Configで使用するManager LLMを選択してください。',
  'readiness.hierarchicalAssignmentIgnored.title': 'Hierarchicalでは明示Task割当が反映されません', 'readiness.hierarchicalAssignmentIgnored.explanation': 'Hierarchical実行では明示担当ではなくManagerがTaskを委任します。', 'readiness.hierarchicalAssignmentIgnored.suggestion': '明示担当を削除するか、固定担当が必要ならSequentialへ変更してください。',
  'readiness.customModelUnverified.title': 'Custom modelはカタログ検証外です', 'readiness.customModelUnverified.explanation': 'モデルIDが組み込みモデルカタログにありません。', 'readiness.customModelUnverified.suggestion': '本番投入前にproviderのモデルIDと認証情報を確認してください。',
  'readiness.customToolStub.title': 'Custom Toolがstubのままです', 'readiness.customToolStub.explanation': '生成されたscaffoldにはCustom Toolの動作が実装されていません。', 'readiness.customToolStub.suggestion': '本番利用前に生成されたCustom Toolクラスを実装してください。',
  'readiness.jsonOutputSchemaImplicit.title': 'JSON出力schemaが暗黙です', 'readiness.jsonOutputSchemaImplicit.explanation': 'Taskが明示schemaなしでJSONを要求しています。', 'readiness.jsonOutputSchemaImplicit.suggestion': 'Taskの出力設定へ有効なJSON schemaを追加してください。',
  'readiness.structuredOutputMismatch.title': '構造化出力要求と検証設定が一致していません', 'readiness.structuredOutputMismatch.explanation': '要求した構造化出力が一貫して有効化されていません。', 'readiness.structuredOutputMismatch.suggestion': 'JSON出力を有効にし、一致するschemaを設定してください。',
  'readiness.outputFileCollision.title': '複数Taskが同じ出力ファイルを共有しています', 'readiness.outputFileCollision.explanation': '複数のTaskが同じ出力ファイルへ書き込みます。', 'readiness.outputFileCollision.suggestion': 'Taskごとに固有の出力ファイルを設定するか、書き込みTaskを統合してください。',
  'readiness.safetyClaimUnenforced.title': 'Safety制約が生成コードで強制されていません', 'readiness.safetyClaimUnenforced.explanation': 'ワークフローに、生成コードでは強制できないSafety制約が記述されています。', 'readiness.safetyClaimUnenforced.suggestion': '本番利用前にprompt外の明示的なruntime checkを追加してください。',
};

const dictionaries = { en, ja } as const;
export function translateReadinessKey(lang: Language, key: string, params?: Readonly<Record<string, string | number | boolean>>): string {
  const typedKey = key as ReadinessTranslationKey;
  const template = dictionaries[lang]?.[typedKey] ?? en[typedKey];
  const fallback = lang === 'ja' ? 'Readinessの詳細を確認してください。' : 'Review this Readiness finding.';
  return (template ?? fallback).replace(/\{(\w+)\}/g, (_, name: string) => String(params?.[name] ?? `{${name}}`));
}

export const READINESS_TRANSLATION_KEYS = Object.keys(en) as ReadinessTranslationKey[];
