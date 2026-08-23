const PYTHON_TYPES: Record<string, string> = {
  string: 'str',
  integer: 'int',
  number: 'float',
  boolean: 'bool',
  object: 'dict[str, Any]',
  'array[string]': 'list[str]',
  'array[integer]': 'list[int]',
  'array[number]': 'list[float]',
  'array[object]': 'list[dict[str, Any]]',
};

const PYTHON_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
  'raise', 'return', 'try', 'while', 'with', 'yield',
]);

export function parseOutputSchema(raw?: string): Record<string, string> | null {
  if (!raw?.trim()) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Schema must be a JSON object that maps field names to types.');
  }

  const fields: Record<string, string> = {};
  for (const [name, type] of Object.entries(parsed)) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
      throw new Error(`Invalid schema field name: ${name}`);
    }
    if (PYTHON_KEYWORDS.has(name)) {
      throw new Error(`Schema field name is a Python keyword: ${name}`);
    }
    if (typeof type !== 'string' || !PYTHON_TYPES[type.toLowerCase()]) {
      throw new Error(`Unsupported type for ${name}: ${String(type)}`);
    }
    fields[name] = PYTHON_TYPES[type.toLowerCase()];
  }
  if (Object.keys(fields).length === 0) throw new Error('Schema must contain at least one field.');
  return fields;
}
