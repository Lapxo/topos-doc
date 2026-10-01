import { intervals, type Interval, type State } from '@lapxo/obligations';
import { cell, encounter, observe, state, type Obligatory } from '@lapxo/obligations/views/field';
import { of, placeOf, receipts, type Asked, type Handed } from '@lapxo/topos/capsule';
import { canonical, fields, fromLine } from '@lapxo/topos/wire';
import { numeral, pairs } from './asked.ts';
import { count, listOf, prose, say, stated } from './language.ts';
import { lawAt, lawName } from './laws.ts';
import { escaped } from './prose.ts';
import { attrs, look } from './look.ts';

export const SPANS = intervals(-Infinity, Infinity);
export const hull = (ns: readonly number[]): Interval => ns.reduce((all, n) => SPANS.join(all, { lo: n, hi: n }), SPANS.bottom);
type Rest = { readonly who: string; readonly held: Interval; readonly count: number };
export type Cell = { readonly claims: Obligatory<Interval>['seen']; readonly held: Interval; readonly hull: Interval; readonly state: State; readonly rest?: Rest };

const apartOf = (met: Obligatory<Interval>, at: string): Rest | undefined => ((left) => (left.length === 1 ? left[0] : undefined))(met.seen.flatMap((one) => ((rest) => (rest.origins > 1 && SPANS.inhabited(rest.held)
  ? [{ who: one.origin, held: rest.held, count: rest.origins }] : []))(encounter(SPANS, met.seen.filter((other) => other !== one).reduce((held, claim) => observe(held, claim), cell<Interval>(at))))));

/** The cell the code at `at` spells: the claims its literals make, in the shape the notation names, where they meet, and the state they are in. */
export function cellOf(asked: Asked, at: string): Cell | undefined {
  const shape = new Map(pairs(asked, 'notation/claim'));
  const role = (name: string): string => shape.get(name) ?? '';
  const fielded = receipts(asked, 'source').filter((one) => placeOf(one) === at && of(one, 'scope').startsWith('source/literal/'))
    .map((one) => new Map(fields(of(one, 'value'))));
  const met = fielded.filter((one) => ['who', 'lo', 'hi'].every((name) => one.has(role(name))) && !one.has(role('without')))
    .reduce((held, one) => observe(held, { origin: one.get(role('who')) ?? '', span: { lo: numeral(one.get(role('lo'))), hi: numeral(one.get(role('hi'))) } }), cell<Interval>(at));
  return built(met, at);
}
/** The cell a sample's wire lines make: each line a claim of the origin that said it, over the interval its value holds as its form reads it. */
export const cellOfLines = (lines: readonly Handed[]): Cell | undefined => ((at) => built(lines.reduce((held, line) => ((got) => (got.kind === 'fact' && got.value.bound.kind === 'interval'
  && got.value.bound.lo !== null && got.value.bound.hi !== null ? observe(held, { origin: of(line, 'by'), span: { lo: got.value.bound.lo, hi: got.value.bound.hi } }) : held))(fromLine(canonical(line), null)), cell<Interval>(at)), at))(of(lines[0], 'scope'));
const built = (met: Obligatory<Interval>, at: string): Cell | undefined => {
  const { origins, held } = encounter(SPANS, met);
  const rest = SPANS.inhabited(held) ? undefined : apartOf(met, at);
  return origins > 1 ? { claims: met.seen, held, hull: met.seen.reduce((all, one) => SPANS.join(all, one.span), SPANS.bottom), state: state(SPANS, met), ...(rest === undefined ? {} : { rest }) } : undefined;
};
/** A cell said in one sentence: how many of its origins meet and where, the one apart when a single one is, and its state; its state alone where the language has no words for these. */
export const captioned = (asked: Asked, met: Cell): string => (met.rest !== undefined
  ? say(asked, 'cell/outlier', { count: count(asked, met.rest.count), ...met.rest.held, who: met.rest.who, state: met.state.toLowerCase() })
  : SPANS.inhabited(met.held) ? say(asked, 'cell/together', { count: count(asked, met.claims.length), ...met.held, state: met.state.toLowerCase() }) : '') || stated(asked, met.state);
export const described = (asked: Asked, met: Cell): string => say(asked, 'cell/origins', { count: count(asked, met.claims.length, true),
  claims: listOf(asked, met.claims.map((one) => say(asked, 'cell/claim', { who: one.origin, ...one.span }))), held: SPANS.inhabited(met.held) ? say(asked, 'cell/held', { ...met.held }) : prose(asked, 'apart') ?? '' });
export const image = (asked: Asked, at: string, met: Cell): string => `<p${attrs({ align: look(asked, 'align/figure') })}><img src="${at}" alt="${escaped(described(asked, met))}"${attrs({ width: look(asked, 'width/figure') })}></p>`;
export const labelOf = (asked: Asked, scope: string): string => ((law) => (law === undefined ? scope : lawName(asked, law)))(lawAt(asked, scope));
