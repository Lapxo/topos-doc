import { SPANS, attrs, between, captioned, cellOfLines, css, declaredSample, drawn, escaped, figured, font, listOf, listed, look, numeral, of, painted, px, rendered, say, secs, sentence, spacing, style, type Asked } from '../helpers/capsule.ts';

/** A fold that moves, with no script, from the sample its view declares: the claims that meet slide in until they meet and the meet takes the colour its figure's form names for a meet, then the one claim apart falls away and the set takes the colour named for a set apart; its spacing, timing, font and colours are the place's look; on a page, the sentence its cell says is its caption. */
export const render = (asked: Asked): readonly string[] => {
  const lines = declaredSample(asked, figured(asked, asked.region, 1)[0]);
  const cell = cellOfLines(lines.filter((line) => of(line, 'scope') === of(lines[0], 'scope')));
  const named = listed(asked, 'form/figure/fold');
  const [claimed, met, apart] = named.map((state) => rendered(asked, state));
  const [g, wide] = [spacing(asked, 'fold'), numeral(look(asked, 'width/figure'))];
  const away = cell?.rest?.who;
  const held = cell === undefined ? undefined : SPANS.inhabited(cell.held) ? cell.held : cell.rest?.held;
  const said = cell === undefined ? [] : [held === undefined ? '' : say(asked, 'figure/fold/together', { ...held, state: (named[1] ?? '').toLowerCase() }),
    away === undefined || held === undefined ? '' : say(asked, 'figure/fold/apart', { who: away, state: cell.state.toLowerCase() })].filter(Boolean);
  const x = (v: number): number => (cell === undefined ? NaN : between(v, [cell.hull.lo - g.pad, cell.hull.hi + g.pad], [g.margin, wide - g.margin]));
  const rows = cell === undefined ? [] : cell.claims.filter((claim) => claim.origin !== away);
  const out = cell?.claims.find((claim) => claim.origin === away);
  const height = (rows.length + (out ? 1 : 0) + 1) * g.row + said.length * g.say + g.say;
  const bar = (lo: number, hi: number, y: number, body: string): string => `<rect${attrs({ x: px(x(lo)), y: px(y), width: px(x(hi) - x(lo)), height: px(g.bar), rx: px(g.radius), fill: claimed?.colour })}>${body}</rect>`;
  const fade = (begin: number): string => `<animate attributeName="opacity" values="0;0;1"${attrs({ keyTimes: Number.isFinite(begin / (begin + g.turn)) ? `0;${(begin / (begin + g.turn)).toFixed(1)};1` : undefined, dur: secs(begin + g.turn) })} fill="freeze"/>`;
  const turn = (from: string | undefined, to: string | undefined, begin: number): string => `<animate attributeName="fill"${attrs({ from, to, begin: secs(begin), dur: secs(g.turn) })} fill="freeze"/>`;
  return drawn(asked, cell === undefined || held === undefined || !said.length ? [] : [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: px(wide) && px(height) ? `0 0 ${px(wide)} ${px(height)}` : undefined, width: px(wide), height: px(height) })} role="img" aria-label="${escaped(listOf(asked, said))}">`,
    ...style([css([['text', { ...font(asked, 'text', 'text'), fill: painted(asked, 'text').colour }]])], css([['text', { fill: painted(asked, 'text-dark').colour }]])),
    `<line${attrs({ x1: px(x(cell.hull.lo)), y1: px((rows.length + 1) * g.row + g.top), x2: px(x(cell.hull.hi)), y2: px((rows.length + 1) * g.row + g.top), stroke: claimed?.colour })}/>`,
    ...rows.map((claim, i) => bar(claim.span.lo, claim.span.hi, g.top + i * g.row, `<animate attributeName="x"${attrs({ from: px(x(claim.span.lo) + (i & 1 ? g.slide : -g.slide)), to: px(x(claim.span.lo)), dur: secs(g.meet) })} fill="freeze"/>${out ? turn(claimed?.colour, apart?.colour, g.set) : ''}`)),
    bar(held.lo, held.hi, g.top + rows.length * g.row, `${turn(claimed?.colour, met?.colour, g.meet)}${out ? turn(met?.colour, apart?.colour, g.set) : ''}`),
    ...(out ? [bar(out.span.lo, out.span.hi, g.top + (rows.length + 1) * g.row + g.gap, `<animate attributeName="x"${attrs({ values: px(x(held.lo)) && px(x(out.span.lo)) ? `${px(x(held.lo))};${px(x(held.lo))};${px(x(out.span.lo))}` : undefined, keyTimes: Number.isFinite(g.fall / g.set) ? `0;${(g.fall / g.set).toFixed(1)};1` : undefined, dur: secs(g.set) })} fill="freeze"/>${turn(claimed?.colour, apart?.colour, g.set)}`)] : []),
    ...said.map((one, i) => `<text${attrs({ x: px(g.margin), y: px(height - (said.length - i) * g.say + g.top) })}>${escaped(one)}${fade(g.speak + i * g.meet)}</text>`),
    '</svg>'], listOf(asked, said), 'figure/fold', ((caption) => (caption ? [sentence(asked, caption)] : []))(cell === undefined ? '' : captioned(asked, cell)));
};
