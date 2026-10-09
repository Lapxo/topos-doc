import { listed, of, placeOf, receipts, value, type Asked, type Handed } from '@lapxo/topos/capsule';
import { alphabet } from '@lapxo/topos/wire';
import { pairs, receiptValue } from './asked.ts';
import { hull } from './cells.ts';
import { lawAt, laws, moduleOf, object, resting } from './laws.ts';
import { glyph } from './prose.ts';

export const symbolOf = (asked: Asked, type: string, name: string): string => (type.endsWith('[]') ? `[${symbolOf(asked, type.slice(0, -'[]'.length), name)}]`
  : listed(asked, 'notation/named').includes(type) ? name : new Map(pairs(asked, 'notation/types')).get(type) ?? type);

export function formulas(asked: Asked): readonly Handed[] {
  const pending = laws(asked).filter((line) => of(line, 'form') === 'formula');
  const parent = (formula: Handed): string => of(formula, 'scope').slice(0, of(formula, 'scope').lastIndexOf('/'));
  const out: Handed[] = [];
  while (pending.length) {
    const waits = (formula: Handed): boolean => alphabet(of(lawAt(asked, parent(formula)), 'restsOn')).members.some((on) => pending.some((other) => other !== formula && parent(other) === on));
    const next = pending.findIndex((formula) => !waits(formula));
    out.push(...pending.splice(next < 0 ? 0 : next, 1));
  }
  return out;
}

export const moduleOfObject = (asked: Asked, held: Handed): string | undefined => resting(asked, of(held, 'scope')).map((offer) => moduleOf(asked, offer)).find(Boolean);

/** The object as a tuple of the notation's symbols: the members of its cell its module carries, its gloss beside them. */
export const tuple = (asked: Asked): string | undefined => {
  const held = object(asked);
  if (held === undefined || !pairs(asked, 'notation/cell').length) return undefined;
  const module = moduleOfObject(asked, held);
  const carries = new Set(alphabet(module === undefined ? '' : receiptValue(asked, 'source', 'source/carries', module) ?? '').members);
  const [symbols, gloss] = [new Map(pairs(asked, 'notation/symbols')), listed(asked, 'notation/gloss')];
  const members = pairs(asked, 'notation/cell');
  const shown = (carries.size ? members.filter(([member]) => carries.has(member)) : members).map(([, sym]) => sym);
  if (!shown.length) return undefined;
  return `${symbols.get('object')} = ${glyph(asked, 'open')}${shown.join(', ')}${glyph(asked, 'close')}${gloss.length ? `        ${gloss.join('     ')}` : ''}`;
};

/** The object's own formulas, aligned where each is cut: those its notation lists, else those of the laws it rests on and its own. */
export const aligned = (asked: Asked): readonly string[] => {
  const held = object(asked);
  const chosen = listed(asked, 'notation/formulas');
  const own = (chosen.length ? chosen : [...alphabet(of(held, 'restsOn')).members, of(held, 'scope')]).flatMap((scope) => formulas(asked).filter((line) => of(line, 'scope').startsWith(`${scope}/`))).map((line) => of(line, 'value'));
  const cut = (text: string): number => hull(['=', glyph(asked, 'iff'), glyph(asked, 'member')].map((mark) => text.indexOf(` ${mark} `)).concat(text.indexOf(': ')).filter((i) => i > 0)).lo;
  const side = hull(own.map((text) => text.slice(0, cut(text)).length)).hi;
  return own.map((text) => `${text.slice(0, cut(text)).padEnd(side)} ${text.slice(cut(text)).trimStart()}`);
};

export type Move = { readonly from: string; readonly to: string; readonly dangerous: boolean; readonly why: string };

/** The moves between the object's states the laws said, in order, each dangerous or with why it moves; none when they said none. */
export const moves = (asked: Asked): readonly Move[] | undefined => {
  const [renders, at] = [pairs(asked, 'notation/renders'), value(asked, 'notation/moves') ?? ''];
  const split = (edge: string): readonly [string, string] => [edge.slice(0, edge.indexOf('→')), edge.slice(edge.indexOf('→') + 1)];
  const edges = alphabet(receiptValue(asked, 'laws', 'said/moves', at) ?? '').members.map(split);
  const known = (state: string): boolean => renders.some(([one]) => one === state);
  const said = receipts(asked, 'laws').filter((one) => placeOf(one) === at);
  const dangerous = alphabet(of(said.find((one) => of(one, 'scope').endsWith('/dangerous')), 'value')).members.map(split);
  const moved = (one: Handed): readonly [string, string] => split(of(one, 'scope').slice(of(one, 'scope').lastIndexOf('/why/') + '/why/'.length));
  const whyOf = ([from, to]: readonly [string, string]): string => of(said.find((one) => of(one, 'scope').includes('/why/') && moved(one)[0] === from && (moved(one)[1] === to || !known(moved(one)[1]))), 'value');
  if (!renders.length || !edges.length) return undefined;
  return edges.filter(([from, to]) => from !== to && known(from) && known(to)).sort(([a, b], [c, d]) => (a === c ? (b < d ? -1 : b > d ? 1 : 0) : a < c ? -1 : 1))
    .map((edge) => ({ from: edge[0], to: edge[1], dangerous: dangerous.some(([from, to]) => from === edge[0] && to === edge[1]), why: whyOf(edge) }));
};
