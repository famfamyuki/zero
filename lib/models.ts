export interface ModelOption {
  value: string;
  label: string;
  badge?: string;
}

export interface ModelGroup {
  group: string;
  models: ModelOption[];
}

export const DEFAULT_LLM_MODEL = 'gpt-5.6-terra';

export const LLM_MODEL_GROUPS: ModelGroup[] = [
  {
    group: 'OpenAI (GPT-5.6 & Reasoning)',
    models: [
      { value: 'gpt-5.6-terra', label: 'gpt-5.6-terra (Balanced • Recommended)' },
      { value: 'gpt-5.6-sol', label: 'gpt-5.6-sol (Highest Performance)' },
      { value: 'gpt-5.6-luna', label: 'gpt-5.6-luna (Fast & Low Cost)' },
      { value: 'o3-mini', label: 'o3-mini (High-Speed Reasoning)' },
      { value: 'o1', label: 'o1 (Deep Reasoning)' },
    ],
  },
  {
    group: 'Anthropic (Claude 3.7 & 3.5)',
    models: [
      { value: 'anthropic/claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet (Hybrid Reasoning)' },
      { value: 'anthropic/claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' },
      { value: 'anthropic/claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku (Fast)' },
      { value: 'anthropic/claude-3-opus-latest', label: 'Claude 3 Opus' },
    ],
  },
  {
    group: 'Google (Gemini 2.5 & 2.0)',
    models: [
      { value: 'gemini/gemini-2.5-pro', label: 'Gemini 2.5 Pro (State of the Art)' },
      { value: 'gemini/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Ultra Fast)' },
      { value: 'gemini/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini/gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
  },
  {
    group: 'Groq / Meta & DeepSeek (Ultra-Fast)',
    models: [
      { value: 'groq/llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Versatile)' },
      { value: 'groq/llama-3.1-8b-instant', label: 'Llama 3.1 8B (Instant)' },
      { value: 'groq/deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 Distill 70B' },
    ],
  },
  {
    group: 'Local / Ollama (Self-Hosted & Offline)',
    models: [
      { value: 'ollama/llama3.3', label: 'Ollama: llama3.3' },
      { value: 'ollama/deepseek-r1', label: 'Ollama: deepseek-r1' },
      { value: 'ollama/qwen2.5', label: 'Ollama: qwen2.5' },
      { value: 'ollama/mistral', label: 'Ollama: mistral' },
    ],
  },
  {
    group: 'Legacy Models (Backward Compatibility)',
    models: [
      { value: 'gpt-4o', label: 'OpenAI: gpt-4o' },
      { value: 'gpt-4o-mini', label: 'OpenAI: gpt-4o-mini' },
      { value: 'o1-mini', label: 'OpenAI: o1-mini' },
      { value: 'anthropic/claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet (2024-06-20)' },
      { value: 'anthropic/claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku (2024-10-22)' },
      { value: 'gemini/gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
      { value: 'groq/llama3-70b-8192', label: 'Llama 3 70B (Legacy Groq)' },
      { value: 'ollama/llama3', label: 'Ollama: llama3 (Legacy)' },
    ],
  },
];
