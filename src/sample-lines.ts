import { readers } from '@lapxo/topos/capsule';
import { parse, canonical } from '@lapxo/topos/wire';

/** A document sample declares the wire lines it illustrates; it grants no authority. */
export function sampleLines(bytes: Uint8Array): readonly string[] {
  const sample: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  if (!sample || typeof sample !== 'object' || !('reads' in sample) || sample.reads !== 'said/lines' || !('lines' in sample) || !Array.isArray(sample.lines)) {
    throw Error('REFUSE·document sample does not declare said/lines');
  }
  return sample.lines.map((line: unknown) => {
    if (typeof line !== 'string') throw Error('REFUSE·document sample has a non-text line');
    const parsed = parse(line);
    if (parsed.kind !== 'fact' || canonical(parsed.value.fields) !== line) throw Error('REFUSE·document sample has a non-canonical wire line');
    return line;
  });
}

export const { observe } = readers({
  'sample-lines': { reads: ['*.json'], observe: (bytes: Uint8Array) => [{
    scope: 'said/lines', measure: 'lines', role: 'reads' as const,
    bound: { kind: 'enumerated' as const, values: [sampleLines(bytes).join('\n')] },
  }] },
});
