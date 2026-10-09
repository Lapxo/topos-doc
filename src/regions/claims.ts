import { folder, found, listed, of, prose, relative, resolved, say, section, sentence, type Asked } from '../helpers/capsule.ts';
import { alphabet, byBytes, fields, matches } from '@lapxo/topos/wire';

/** One receipt preserves its value; multiple observations require a declared reader to resolve them. */
const reading = (asked: Asked, glob: string): string | undefined => {
  const held = Object.values(asked.regions).flatMap((region) => region.receipts).filter((line) => matches(glob, of(line, 'scope')));
  if (held.length > 1) throw new Error(`REFUSE·claim ${asked.region}@${asked.at}: ${glob} names ${held.length} receipts without a resolved value`);
  if (held.length === 1) return of(held[0], 'value');
  const line = found(asked, glob);
  if (line === undefined || of(line, 'value') === 'withdraw') return undefined;
  return of(line, 'form') === 'interval' ? of(line, 'value')
    : of(line, 'form') === 'alphabet' ? String(listed(asked, glob).length) : undefined;
};

/** A place's claims, each one sentence of its language with every number read from a receipt, and the page that holds the receipt linked on the same line. */
export const render = (asked: Asked): readonly string[] => {
  const here = folder(asked.shape);
  const held = asked.lines.filter((line) => of(line, 'scope').startsWith('claims/') && of(line, 'value') !== 'withdraw').sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope')));
  const bullet = (scope: string, value: string, needs: string): readonly string[] => {
    const [page] = alphabet(needs).members;
    const read = fields(value).map(([name, glob]) => [name, reading(asked, glob)] as const);
    if (read.some(([, got]) => got === undefined)) return [];
    const said = sentence(asked, say(asked, scope, Object.fromEntries(read.map(([name, got]) => [name, got ?? '']))));
    if (!said) return [];
    return [`- **${said}**${page === undefined ? '' : ` · [${prose(asked, 'claims/receipt') ?? ''}](${relative(here, page)})`}`];
  };
  const rows = held.flatMap((line) => bullet(of(line, 'scope'), of(line, 'value'), of(line, 'needs')));
  return resolved(asked, rows.length ? [...section(asked, 'claims'), ...rows] : []);
};
