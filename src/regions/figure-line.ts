import { attrs, css, declaredSample, drawn, escaped, figured, font, listed, look, of, painted, px, say, sentence, spacing, states, style, type Asked } from '../helpers/capsule.ts';

/** The first line of the wire sample its view declares, drawn with each field its figure's form names labelled by the wire's own word for it, in the form's order, spaced, set and coloured by the place's look, and on a page captioned by what it draws; nothing without that sample or a form. */
export const render = (asked: Asked): readonly string[] => {
  const line = declaredSample(asked, figured(asked, asked.region, 1)[0])[0];
  const rows = listed(asked, 'form/figure/line').map((field) => [field, of(line, field)] as const).filter(([, said]) => said !== '');
  const [held] = states(asked);
  const [g, wide] = [spacing(asked, 'line'), look(asked, 'width/figure')];
  const alt = line === undefined ? '' : say(asked, 'figure/line', { scope: of(line, 'scope'), count: rows.length });
  const height = px(g.top + rows.length * g.row);
  return drawn(asked, rows.length ? [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: wide && height ? `0 0 ${wide} ${height}` : undefined, width: wide, height })} role="img" aria-label="${escaped(alt)}">`,
    ...style([css([['text', { ...font(asked, 'code', 'code'), fill: painted(asked, 'text').colour }], ['.field', { fill: held?.colour, 'font-weight': look(asked, 'weight/strong') }]])], css([['text', { fill: painted(asked, 'text-dark').colour }]])),
    ...rows.flatMap(([field, said], i) => [`<text class="field"${attrs({ x: px(g.label), y: px(g.first + i * g.row) })} text-anchor="end">${escaped(field)}</text>`, `<text${attrs({ x: px(g.value), y: px(g.first + i * g.row) })}>${escaped(said)}</text>`]),
    '</svg>'] : [], alt, 'figure/line', alt ? [sentence(asked, alt)] : []);
};
