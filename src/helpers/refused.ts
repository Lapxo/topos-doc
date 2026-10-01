import { of, placeOf, receipts, type Asked } from '@lapxo/topos/capsule';
import { byBytes, steps } from '@lapxo/topos/wire';
import { numeral } from './asked.ts';

/** The words a vectors reader says a refused case in. */
type Refusal = 'refused' | 'name' | 'input' | 'why';

/** The first case of a place's vectors that refuses and says why, by the file its scope names and then its index, never by where a run was read: what it is handed, why it refuses, and where it is kept. */
export const refusedCase = (asked: Asked): { readonly input: string; readonly why: string; readonly at: string } | undefined => {
  const tail = (scope: string): { readonly n: string; readonly word: string; readonly file: string } => (([n = '', word = '', ...file]) => ({ n, word, file: steps(file.reverse()) }))([...steps(scope)].reverse());
  const step: Refusal = 'refused';
  const said = receipts(asked, 'vectors').filter((line) => tail(of(line, 'scope')).word === step);
  const where = (scope: string): string => placeOf(said.find((line) => of(line, 'scope') === scope) ?? {});
  const [first] = [...new Set(said.filter((line) => of(line, 'measure') === 'why').map((line) => of(line, 'scope')))]
    .sort((a, b) => byBytes(tail(a).file, tail(b).file) || numeral(tail(a).n) - numeral(tail(b).n));
  const read = (measure: Refusal): string => of(said.find((line) => of(line, 'scope') === first && of(line, 'measure') === measure), 'value');
  return first === undefined ? undefined : { input: read('input'), why: read('why'), at: where(first) };
};
