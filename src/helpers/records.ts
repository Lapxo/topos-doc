import { lang, of, placeOf, receipts, type Asked } from '@lapxo/topos/capsule';
import { alphabet, steps } from '@lapxo/topos/wire';
import { receiptValue } from './asked.ts';
import { words } from './language.ts';

export type Entry = { readonly scope: string; readonly title: string; readonly field: (measure: string) => string | undefined };

/** The entries a family of lines holds, one per scope: named by what a line of it says, else by its name in words. */
export const entries = (asked: Asked, family: string): readonly Entry[] => {
  const held = asked.lines.filter((line) => of(line, 'scope').startsWith(`${family}/`));
  return [...new Set(held.map((line) => of(line, 'scope')))].map((scope) => {
    const own = held.filter((line) => of(line, 'scope') === scope);
    return { scope, title: own.map((line) => of(line, 'about')).find(Boolean) ?? words(asked, scope.slice(scope.indexOf('/') + 1)),
      field: (measure: string) => ((line) => (line === undefined ? undefined : of(line, 'value')))(own.find((line) => of(line, 'measure') === measure)) };
  });
};

/** The places the root says what they are, each after the places it rests on. */
export const placesOf = (asked: Asked): readonly string[] => {
  const placeIn = (scope: string): string => (([, , place = '']) => place)(steps(scope));
  const named = [...new Set(asked.lines.map((line) => of(line, 'scope')).filter((scope) => scope === `prose/${lang(asked)}/${placeIn(scope)}/what`).map(placeIn))];
  const rests = (name: string): readonly string[] => asked.lines.filter((line) => of(line, 'scope').startsWith(`dep/${name}/`)).flatMap((line) => alphabet(of(line, 'value')).members).filter((one) => named.includes(one));
  const ordered: string[] = [];
  while (ordered.length < named.length) ordered.push(named.find((one) => !ordered.includes(one) && rests(one).every((dep) => ordered.includes(dep))) ?? named.find((one) => !ordered.includes(one)) ?? '');
  return ordered;
};

/** What the language says a place declares of one type: each name under a head, with what it says beside it. */
export const typedAs = (asked: Asked, head: string, type: string, beside: string): readonly (readonly [string, string])[] => [...new Map(receipts(asked, 'source')
  .filter((line) => of(line, 'scope').startsWith(head) && receiptValue(asked, 'source', of(line, 'scope'), placeOf(line), 'type') === type)
  .map((line) => [`${placeOf(line)} ${of(line, 'scope')}`, [of(line, 'scope').slice(of(line, 'scope').lastIndexOf('/') + 1), receiptValue(asked, 'source', of(line, 'scope'), placeOf(line), beside) ?? ''] as const])).values()];
