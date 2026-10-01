import { cellText, keys, moduleOf, numeral, of, offers, prose, receiptValue, receipts, say, type Asked, type Handed } from '../helpers/capsule.ts';
import { byBytes, steps } from '@lapxo/topos/wire';

/** The operations a place offers, a row each: the view it is read in, its signature, how many samples it lacks and what it rests on. */
export const render = (asked: Asked): readonly string[] => {
  const read = new Map(receipts(asked, 'offers').map((line) => [of(line, 'scope'), of(line, 'value')]));
  const signature = (line: Handed): string => {
    const [op, module] = [of(line, 'scope').slice(of(line, 'scope').lastIndexOf('/') + 1), moduleOf(asked, line)];
    const head = module === undefined ? undefined : receiptValue(asked, 'source', `source/signature/${op}`, module);
    return head === undefined ? say(asked, 'reference/owed') : cellText(head);
  };
  return [`## ${prose(asked, 'reference/operations') ?? ''}`, '', prose(asked, 'reference/operations-table') ?? '', '|---|---|---|---|---|',
    ...[...offers(asked)].sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope'))).map((line) => {
      const [view = '', op = ''] = steps(of(line, 'scope')).slice(1);
      return `| ${op} | ${view} | \`${signature(line)}\` | ${((n) => (Number.isNaN(n) ? 0 : n))(numeral(read.get(`${of(line, 'scope')}/no-samples`)))} | ${cellText(keys(asked, of(line, 'restsOn'))) || say(asked, 'reference/unrested')} |`;
    })];
};
