import { folder, found, listed, numeral, of, prose, relative, resolved, say, section, sentence, type Asked } from '../helpers/capsule.ts';
import { alphabet, byBytes, fields, matches } from '@lapxo/topos/wire';

/** What one field of a claim reads: the receipts its glob names, their counts summed, or the one word a receipt says; with none, the lock's line of that scope, a ceiling as written and a list by its members, as the hero counts them. Counts and words under one glob refuse: neither a sum nor a tally would be the claim. */
const reading = (asked: Asked, glob: string): string => {
  const held = Object.values(asked.regions).flatMap((region) => region.receipts).filter((line) => matches(glob, of(line, 'scope')));
  const counts = held.filter((line) => of(line, 'value').includes('..')).map((line) => numeral(of(line, 'value')));
  if (counts.length && counts.length === held.length) return String(counts.reduce((sum, one) => sum + one, 0));
  if (counts.length) throw new Error(`REFUSE·claim ${asked.region}@${asked.at}: ${glob} names ${counts.length} of ${held.length} receipts as counts and the rest as words`);
  if (held.length) return held.length > 1 ? String(held.length) : of(held[0], 'value');
  return of(found(asked, glob), 'form') === 'interval' ? of(found(asked, glob), 'value') : String(listed(asked, glob).length);
};

/** A place's claims, each one sentence of its language with every number read from a receipt, and the page that holds the receipt linked on the same line. */
export const render = (asked: Asked): readonly string[] => {
  const here = folder(asked.shape);
  const held = asked.lines.filter((line) => of(line, 'scope').startsWith('claims/')).sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope')));
  const bullet = (scope: string, value: string, needs: string): string => {
    const [page] = alphabet(needs).members;
    const said = sentence(asked, say(asked, scope, Object.fromEntries(fields(value).map(([name, glob]) => [name, reading(asked, glob)]))));
    return `- **${said}**${page === undefined ? '' : ` · [${prose(asked, 'claims/receipt') ?? ''}](${relative(here, page)})`}`;
  };
  return resolved(asked, held.length ? [...section(asked, 'claims'), ...held.map((line) => bullet(of(line, 'scope'), of(line, 'value'), of(line, 'needs')))] : []);
};
