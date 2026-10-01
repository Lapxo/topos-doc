import { aligned, cellText, formulas, glyph, hull, lawAt, lawName, moduleOfObject, object, of, pairs, placeOf, prose, reaches, receiptLine, receiptValue, receipts, resting, symbolOf, tuple, type Asked, type Handed } from '../helpers/capsule.ts';
import { alphabet, byBytes, fields } from '@lapxo/topos/wire';

/** The law a formula states. */
const formulaLaw = (asked: Asked, formula: Handed): Handed | undefined => lawAt(asked, of(formula, 'scope').slice(0, of(formula, 'scope').lastIndexOf('/')));
/** The arrows the object's offers make, each operation's parameters and result in the notation's symbols, and the states it takes. */
const arrows = (asked: Asked): readonly string[] => {
  const held = object(asked);
  const module = held === undefined ? undefined : moduleOfObject(asked, held);
  const symbols = new Map(pairs(asked, 'notation/symbols'));
  const made = module === undefined || held === undefined ? [] : resting(asked, of(held, 'scope')).map((line) => of(line, 'scope').slice(of(line, 'scope').lastIndexOf('/') + 1)).flatMap((name) => {
    const params = receiptLine(asked, 'source', `source/arrow/${name}`, module, 'params');
    const result = receiptValue(asked, 'source', `source/arrow/${name}`, module, 'result');
    if (params === undefined || result === undefined) return [];
    const typed = fields(of(params, 'value')).map(([name, type]) => symbolOf(asked, type, name));
    const makes = symbolOf(asked, result, 'value') === symbols.get('object') && !typed.some((one) => one === symbols.get('object') || one === `[${symbols.get('object')}]`);
    return makes ? [] : [[name, `${typed.join(` ${glyph(asked, 'product')} `)} ${glyph(asked, 'maps')} ${symbolOf(asked, result, 'value')}`] as const];
  });
  const kind = pairs(asked, 'notation/types').find(([, sym]) => sym === symbols.get('state'))?.[0] ?? '';
  const union = alphabet(of([...receipts(asked, 'source')].filter((one) => of(one, 'scope') === `source/union/${kind}`).sort((a, b) => byBytes(placeOf(a), placeOf(b)))[0], 'value')).members;
  const width = hull(made.map(([name]) => name.length)).hi;
  return [...made.map(([name, arrow]) => `${name.padEnd(width)} : ${arrow}`), ...(union.length ? [`${symbols.get('state')}(${symbols.get('object')}) ${glyph(asked, 'member')} {${union.join(', ')}}`] : [])];
};

/** The object in its notation: its tuple at zero, its own formulas at one, every formula with its law below eight; at eight, the reference's section. */
export const render = (asked: Asked): readonly string[] => {
  const head = tuple(asked);
  if (head === undefined) return [];
  if (asked.at <= 0) return ['```text', head, '```'];
  if (asked.at <= 1) return ['```text', head, ...aligned(asked), '```'];
  const all = formulas(asked);
  if (!reaches(asked, 'whole')) return ['```text', head, '```', '', ...all.map((line) => `- \`${of(line, 'value')}\` — ${of(formulaLaw(asked, line), 'about')}.`)];
  return [`## ${prose(asked, 'reference/notation') ?? ''}`, '', '```text', head, '```', '', prose(asked, 'notation/table') ?? '', '|---|---|---|',
    ...all.map((line) => ((law) => `| \`${cellText(of(line, 'value'))}\` | ${law === undefined ? '' : lawName(asked, law)} | ${cellText(of(law, 'about'))} |`)(formulaLaw(asked, line))), '', '```text', ...arrows(asked), '```'];
};
