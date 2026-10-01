import { SPANS, attrs, between, cellOf, cellOfLines, css, described, escaped, examples, font, look, numeral, object, of, painted, prose, px, reaches, sample, sampled, say, secs, shortest, spacing, states, stem, style, type Asked } from '../helpers/capsule.ts';

/** A cell drawn as bars that move, with no script: each claim's range turning the colour of what they hold together when they meet, the one apart turning the colour of a fork when they stay apart; at three the example the render is named for; below three the wire sample of the object's law, else any the place ships, else its shortest example. */
export const render = (asked: Asked): readonly string[] => {
  const one = reaches(asked, 'statement') ? examples(asked).find((example) => example.name === stem(asked.shape)) : shortest(asked);
  const lines = reaches(asked, 'statement') ? [] : sampled(asked, ((law) => (law === undefined ? '' : sample(asked, law, 'yes').at ?? ''))(object(asked)))?.lines ?? [];
  const cell = cellOfLines(lines.filter((line) => of(line, 'scope') === of(lines[0], 'scope'))) ?? (one === undefined ? undefined : cellOf(asked, one.at));
  if (cell === undefined) return [];
  const [held, alone, , forked] = states(asked);
  const apart = (i: number): boolean => SPANS.inhabited(cell.claims.filter((_, j) => j !== i).reduce((all, other) => SPANS.meet(all, other.span), SPANS.top));
  const g = spacing(asked, 'ranges');
  const beat = (attribute: string, from: string | undefined, to: string | undefined): string => (from === undefined || to === undefined ? '' : `<animate attributeName="${attribute}" values="${from};${from};${to}"${attrs({ dur: secs(g.beat) })} fill="freeze"/>`);
  const [width, left, top, row] = [numeral(look(asked, 'width/figure')), g.left, g.top, g.row];
  const right = width - g.right;
  const x = (v: number): string | undefined => px(between(v, [cell.hull.lo - g.pad, cell.hull.hi + g.pad], [left, right]));
  const rows = [...cell.claims.map((one) => ({ label: one.origin, ...one.span, kind: 'claim' })), { label: say(asked, 'cell/held-row'), ...cell.held, kind: 'held' }];
  const [axis, meets] = [top + rows.length * row + g.axis, SPANS.inhabited(cell.held)];
  const height = axis + (meets ? g.poles : g.tail);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: px(width) && px(height) ? `0 0 ${px(width)} ${px(height)}` : undefined, width: px(width), height: px(height) })} role="img" aria-labelledby="title desc">`,
    `<title id="title">${say(asked, 'cell/title')}</title>`, `<desc id="desc">${escaped(described(asked, cell))}</desc>`,
    ...style([css([['text', { ...font(asked, 'text', 'text'), fill: painted(asked, 'text').colour }]]), css([['.claim', { fill: alone?.colour }], ['.held', { fill: held?.colour }], ['.pole', { fill: held?.colour, 'font-weight': look(asked, 'weight/strong') }],
      ['.axis,.tick', { stroke: alone?.colour, 'stroke-width': look(asked, 'stroke/rule') }], ['.touch', { stroke: held?.colour, 'stroke-width': look(asked, 'stroke/rule'), 'stroke-dasharray': look(asked, 'stroke/dash') }]])], css([['text', { fill: painted(asked, 'text-dark').colour }]])),
    ...(meets ? [cell.held.lo, cell.held.hi].map((v) => `<line class="touch"${attrs({ x1: x(v), y1: px(top - g.touch), x2: x(v), y2: px(axis) })}/>`) : []),
    ...rows.flatMap((bar, i) => [
      `<text${attrs({ x: px(left - g.label), y: px(top + i * row + g.base) })} text-anchor="end">${escaped(bar.label)}</text>`,
      bar.kind === 'held' && !meets ? `<text${attrs({ x: px(left), y: px(top + i * row + g.base) })}>${escaped(prose(asked, 'apart') ?? '')}</text>`
        : `<rect class="${bar.kind}"${attrs({ x: x(bar.lo), y: px(top + i * row), width: px(numeral(x(bar.hi)) - numeral(x(bar.lo))), height: px(g.bar), rx: px(g.radius) })}${((moves) => (moves ? `>${moves}</rect>` : '/>'))(bar.kind === 'held'
          ? beat('opacity', '0', '1') : beat('fill', alone?.colour, meets ? held?.colour : apart(i) ? forked?.colour : undefined))}`,
    ]),
    `<line class="axis"${attrs({ x1: px(left), y1: px(axis), x2: px(right), y2: px(axis) })}/>`,
    ...[...new Set([cell.hull.lo, cell.held.lo, cell.held.hi, cell.hull.hi])].sort((a, b) => a - b).flatMap((v) => [`<line class="tick"${attrs({ x1: x(v), y1: px(axis), x2: x(v), y2: px(axis + g.tick) })}/>`, `<text${attrs({ x: x(v), y: px(axis + g.value) })} text-anchor="middle">${v}</text>`]),
    ...(meets ? [`<text class="pole"${attrs({ x: x(cell.held.lo), y: px(axis + g.pole) })} text-anchor="middle">${say(asked, 'cell/floor')}</text>`, `<text class="pole"${attrs({ x: x(cell.held.hi), y: px(axis + g.pole) })} text-anchor="middle">${say(asked, 'cell/ceiling')}</text>`] : []),
    '</svg>',
  ];
};
