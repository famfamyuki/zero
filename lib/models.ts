export interface ModelOption {
  value: string;
  label: string;
  badge?: 'RECOMMENDED' | 'LATEST' | 'PREVIEW' | 'LEGACY' | 'LOCAL';
}

export interface ModelGroup {
  group: string;
  models: ModelOption[];
}

export const CUSTOM_MODEL_VALUE = '__custom_model__';
export const DEFAULT_LLM_MODEL = 'gpt-5.6-terra';

// Text-generation models compatible with CrewAI/LiteLLM provider prefixes.
// Provider catalogs change frequently, so the Inspector also accepts any custom model ID.
export const LLM_MODEL_GROUPS: ModelGroup[] = [
  {
    group: 'OpenAI — GPT-5.6 (Current)',
    models: [
      { value: 'gpt-5.6-sol', label: 'GPT-5.6 Sol — highest capability', badge: 'LATEST' },
      { value: 'gpt-5.6-terra', label: 'GPT-5.6 Terra — balanced', badge: 'RECOMMENDED' },
      { value: 'gpt-5.6-luna', label: 'GPT-5.6 Luna — fast / low cost', badge: 'LATEST' },
      { value: 'gpt-5.6', label: 'GPT-5.6 alias', badge: 'LATEST' },
    ],
  },
  {
    group: 'OpenAI — Previous & Reasoning',
    models: [
      { value: 'gpt-5.5', label: 'GPT-5.5', badge: 'LEGACY' },
      { value: 'gpt-5.4', label: 'GPT-5.4', badge: 'LEGACY' },
      { value: 'gpt-5', label: 'GPT-5', badge: 'LEGACY' },
      { value: 'gpt-4.1', label: 'GPT-4.1', badge: 'LEGACY' },
      { value: 'gpt-4.1-mini', label: 'GPT-4.1 mini', badge: 'LEGACY' },
      { value: 'gpt-4.1-nano', label: 'GPT-4.1 nano', badge: 'LEGACY' },
      { value: 'gpt-4o', label: 'GPT-4o', badge: 'LEGACY' },
      { value: 'gpt-4o-mini', label: 'GPT-4o mini', badge: 'LEGACY' },
      { value: 'o4-mini', label: 'o4-mini reasoning', badge: 'LEGACY' },
      { value: 'o3', label: 'o3 reasoning', badge: 'LEGACY' },
      { value: 'o3-mini', label: 'o3-mini reasoning', badge: 'LEGACY' },
      { value: 'o1', label: 'o1 reasoning', badge: 'LEGACY' },
      { value: 'o1-mini', label: 'o1-mini reasoning', badge: 'LEGACY' },
    ],
  },
  {
    group: 'Anthropic — Claude 5 (Current)',
    models: [
      { value: 'anthropic/claude-fable-5', label: 'Claude Fable 5 — highest capability', badge: 'LATEST' },
      { value: 'anthropic/claude-opus-5', label: 'Claude Opus 5 — complex agentic work', badge: 'LATEST' },
      { value: 'anthropic/claude-sonnet-5', label: 'Claude Sonnet 5 — balanced', badge: 'RECOMMENDED' },
    ],
  },
  {
    group: 'Anthropic — Claude 4.x',
    models: [
      { value: 'anthropic/claude-opus-4-8', label: 'Claude Opus 4.8', badge: 'LEGACY' },
      { value: 'anthropic/claude-opus-4-7', label: 'Claude Opus 4.7', badge: 'LEGACY' },
      { value: 'anthropic/claude-opus-4-6', label: 'Claude Opus 4.6', badge: 'LEGACY' },
      { value: 'anthropic/claude-sonnet-4-6', label: 'Claude Sonnet 4.6', badge: 'LEGACY' },
      { value: 'anthropic/claude-opus-4-5', label: 'Claude Opus 4.5', badge: 'LEGACY' },
      { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5', badge: 'LEGACY' },
      { value: 'anthropic/claude-haiku-4-5', label: 'Claude Haiku 4.5 — fast', badge: 'LEGACY' },
    ],
  },
  {
    group: 'Google — Gemini 3.x (Current)',
    models: [
      { value: 'gemini/gemini-3.7-flash', label: 'Gemini 3.7 Flash', badge: 'LATEST' },
      { value: 'gemini/gemini-3.6-flash', label: 'Gemini 3.6 Flash', badge: 'LATEST' },
      { value: 'gemini/gemini-3.5-flash', label: 'Gemini 3.5 Flash', badge: 'RECOMMENDED' },
      { value: 'gemini/gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', badge: 'LATEST' },
      { value: 'gemini/gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', badge: 'LATEST' },
      { value: 'gemini/gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro Preview', badge: 'PREVIEW' },
      { value: 'gemini/gemini-3.1-pro-preview-customtools', label: 'Gemini 3.1 Pro Preview — custom tools', badge: 'PREVIEW' },
      { value: 'gemini/gemini-3-flash-preview', label: 'Gemini 3 Flash Preview', badge: 'PREVIEW' },
    ],
  },
  {
    group: 'Google — Gemini 2.x (Previous)',
    models: [
      { value: 'gemini/gemini-2.5-pro', label: 'Gemini 2.5 Pro', badge: 'LEGACY' },
      { value: 'gemini/gemini-2.5-flash', label: 'Gemini 2.5 Flash', badge: 'LEGACY' },
      { value: 'gemini/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', badge: 'LEGACY' },
      { value: 'gemini/gemini-2.0-flash', label: 'Gemini 2.0 Flash', badge: 'LEGACY' },
      { value: 'gemini/gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', badge: 'LEGACY' },
    ],
  },
  {
    group: 'GroqCloud — Production Text Models',
    models: [
      { value: 'groq/openai/gpt-oss-120b', label: 'GPT-OSS 120B on Groq', badge: 'RECOMMENDED' },
      { value: 'groq/openai/gpt-oss-20b', label: 'GPT-OSS 20B on Groq', badge: 'LATEST' },
      { value: 'groq/llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', badge: 'LEGACY' },
      { value: 'groq/llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', badge: 'LEGACY' },
      { value: 'groq/groq/compound', label: 'Groq Compound system', badge: 'LATEST' },
      { value: 'groq/groq/compound-mini', label: 'Groq Compound Mini system', badge: 'LATEST' },
    ],
  },
  {
    group: 'GroqCloud — Preview Text Models',
    models: [
      { value: 'groq/minimaxai/minimax-m2.7', label: 'MiniMax M2.7 (Enterprise Preview)', badge: 'PREVIEW' },
      { value: 'groq/qwen/qwen3.6-27b', label: 'Qwen 3.6 27B (Preview)', badge: 'PREVIEW' },
    ],
  },
  {
    group: 'Ollama — Local Models (install separately)',
    models: [
      { value: 'ollama/llama3', label: 'Llama 3', badge: 'LOCAL' },
      { value: 'ollama/llama3.3', label: 'Llama 3.3', badge: 'LOCAL' },
      { value: 'ollama/deepseek-r1', label: 'DeepSeek R1', badge: 'LOCAL' },
      { value: 'ollama/qwen3', label: 'Qwen 3', badge: 'LOCAL' },
      { value: 'ollama/gemma3', label: 'Gemma 3', badge: 'LOCAL' },
      { value: 'ollama/mistral-small3.1', label: 'Mistral Small 3.1', badge: 'LOCAL' },
      { value: 'ollama/llama3.2', label: 'Llama 3.2', badge: 'LOCAL' },
      { value: 'ollama/qwen2.5', label: 'Qwen 2.5', badge: 'LOCAL' },
      { value: 'ollama/mistral', label: 'Mistral', badge: 'LOCAL' },
    ],
  },
];

export const LLM_MODEL_OPTIONS = LLM_MODEL_GROUPS.flatMap((group) => group.models);

export function isKnownModel(value?: string): boolean {
  return Boolean(value && LLM_MODEL_OPTIONS.some((model) => model.value === value));
}
