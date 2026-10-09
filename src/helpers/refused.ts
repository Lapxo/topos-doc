import { of, placeOf, receipts, type Asked } from '@lapxo/topos/capsule';
import { byBytes, steps } from '@lapxo/topos/wire';
import { numeral } from './asked.ts';

/** The words a vectors reader says a refused case in. */
type Refusal = 'refused' | 'name' | 'input' | 'why';

type Told = { readonly input: string; readonly why: string; readonly at: string; readonly name: string };

const tail = (scope: string): { readonly n: string; readonly word: string; readonly file: string } =>
  (([n = '', word = '', ...file]) => ({ n, word, file: steps(file.reverse()) }))([...steps(scope)].reverse());

/** Every case of a place's vectors or captures that refuses and says why, by the file its scope names and then its index. */
export const refusedCases = (asked: Asked): readonly Told[] => {
  const step: Refusal = 'refused';
  const said = [...receipts(asked, 'vectors'), ...receipts(asked, 'captures')].filter((line) => tail(of(line, 'scope')).word === step);
  const where = (scope: string): string => placeOf(said.find((line) => of(line, 'scope') === scope) ?? {});
  const scopes = [...new Set(said.filter((line) => of(line, 'measure') === 'why').map((line) => of(line, 'scope')))]
    .sort((a, b) => byBytes(tail(a).file, tail(b).file) || numeral(tail(a).n) - numeral(tail(b).n));
  const read = (first: string, measure: Refusal): string => {
    const values = [...new Set(said.filter((line) => of(line, 'scope') === first && of(line, 'measure') === measure).map(line => of(line, 'value')))];
    if (values.length > 1) throw Error(`REFUSE·doc ${first}/${measure} has incompatible observations`);
    return values[0] ?? '';
  };
  return scopes.map((first) => ({ input: read(first, 'input'), why: read(first, 'why'), at: where(first), name: read(first, 'name') || tail(first).file }));
};

/** The first case of a place's vectors that refuses and says why. */
export const refusedCase = (asked: Asked): { readonly input: string; readonly why: string; readonly at: string } | undefined => refusedCases(asked)[0];
