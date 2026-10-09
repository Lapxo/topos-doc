import { handed, of, placeOf, receipts, value, type Asked, type Handed } from '@lapxo/topos/capsule';
import { alphabet, byBytes } from '@lapxo/topos/wire';

/** A sample explicitly named, or the first sample in the place's declared positive family. */
export const sampled = (asked: Asked, prefer = ''): { readonly at: string; readonly lines: readonly Handed[] } | undefined => {
  const family = value(asked, 'samples/yes');
  const said = receipts(asked, 'laws').filter((line) => of(line, 'scope') === 'said/lines');
  const eligible = prefer ? said.filter((line) => placeOf(line) === prefer)
    : family === undefined ? [] : said.filter((line) => placeOf(line).startsWith(`${family.replace(/\/$/, '')}/`));
  const [one] = [...eligible].sort((a, b) => byBytes(placeOf(a), placeOf(b)));
  return one === undefined ? undefined : { at: placeOf(one), lines: handed(['**'], of(one, 'value').split('\n')) };
};
/** A view's declared evidence is never replaced by an unrelated sample. */
export const declaredSample = (asked: Asked, view: Handed | undefined): readonly Handed[] => {
  const needs = alphabet(of(view, 'needs')).members;
  if (needs.length) return needs.flatMap((need) => sampled(asked, need)?.lines ?? []);
  return sampled(asked)?.lines ?? [];
};
