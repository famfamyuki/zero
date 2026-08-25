export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(',')}}`;
}

// Small synchronous SHA-256 keeps fingerprints identical in browser, Node, and tests.
export function sha256(value: string): string {
  const rightRotate = (n: number, x: number) => (x >>> n) | (x << (32 - n));
  const words: number[] = []; const ascii = unescape(encodeURIComponent(value)); const bitLength = ascii.length * 8;
  for (let i = 0; i < ascii.length; i++) words[i >> 2] |= ascii.charCodeAt(i) << ((3 - i) % 4) * 8;
  words[bitLength >> 5] |= 0x80 << (24 - bitLength % 32); const lastWord=((bitLength + 64 >> 9) << 4) + 15; words[lastWord] = bitLength; for(let i=0;i<=lastWord;i++)words[i]??=0;
  const h = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225];
  const k: number[] = []; let prime = 2;
  while (k.length < 64) { let ok = true; for (let d = 2; d * d <= prime; d++) if (prime % d === 0) ok = false; if (ok) k.push(Math.floor((Math.cbrt(prime) % 1) * 0x100000000)); prime++; }
  for (let offset = 0; offset < words.length; offset += 16) { const w = words.slice(offset, offset + 16); for (let i = 16; i < 64; i++) { const x = w[i - 15], y = w[i - 2]; w[i] = (w[i - 16] + (rightRotate(7, x) ^ rightRotate(18, x) ^ x >>> 3) + w[i - 7] + (rightRotate(17, y) ^ rightRotate(19, y) ^ y >>> 10)) | 0; } const old = h.slice(); let [a,b,c,d,e,f,g,hh] = h; for (let i = 0; i < 64; i++) { const t1 = (hh + (rightRotate(6,e)^rightRotate(11,e)^rightRotate(25,e)) + ((e&f)^(~e&g)) + k[i] + w[i]) | 0; const t2 = ((rightRotate(2,a)^rightRotate(13,a)^rightRotate(22,a)) + ((a&b)^(a&c)^(b&c))) | 0; [hh,g,f,e,d,c,b,a] = [g,f,e,(d+t1)|0,c,b,a,(t1+t2)|0]; } const work=[a,b,c,d,e,f,g,hh]; for (let i=0;i<8;i++) h[i]=(work[i]+old[i])|0; }
  return h.map((n) => (n >>> 0).toString(16).padStart(8, '0')).join('');
}
