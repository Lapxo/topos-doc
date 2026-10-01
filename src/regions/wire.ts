import { cellText, listed, of, pairs, prose, receipts, resolved, say, titled, type Asked } from '../helpers/capsule.ts';

/**
 * The wire of a place as its page: each rule its lock names, in the order it names them, said with the tokens its lock
 * gives; the functions of its reference as the language reads them; and each corpus that holds them, with its receipt;
 * nothing where it names no rule, reference or corpus.
 */
export const render = (asked: Asked): readonly string[] => {
  const [rules, names, corpus] = [listed(asked, 'wire/rules'), listed(asked, 'wire/reference'), listed(asked, 'wire/corpus')];
  if (!rules.length && !names.length && !corpus.length) return [];
  const tokens = Object.fromEntries(pairs(asked, 'wire/tokens'));
  const signed = (name: string): string => of(receipts(asked, 'source').find((one) => of(one, 'scope') === `source/signature/${name}`), 'value');
  const held = (name: string): string => of(receipts(asked, 'vectors').find((one) => of(one, 'scope') === `vector/${name}`), 'value');
  const reference = names.map((name) => `| \`${name}\` | \`${cellText(signed(name))}\` |`);
  return resolved(asked, [`# ${prose(asked, 'wire/heading') ?? ''}`, '', say(asked, 'wire/lead', tokens),
    ...rules.flatMap((rule) => ['', ...titled(asked, `wire/${rule}`, [say(asked, `wire/${rule}`, tokens)])]),
    '', ...titled(asked, 'wire/reference', [[prose(asked, 'wire/reference/table') ?? '', '|---|---|', ...reference].join('\n')]),
    '', ...titled(asked, 'wire/corpus', [corpus.map((name) => `- \`vector/${name}\` · ${held(name)}`).join('\n')])]);
};
