import { attrs, css, drawn, escaped, font, look, painted, px, refusedCase, say, spacing, states, style, type Asked } from '../helpers/capsule.ts';

/** A region asked for what it did not declare, crossed: what the first refused case of the place's vectors was handed, the case its refuses section says, struck through in the colour of what is forbidden, and why it was refused beneath, spaced and set by the place's look; nothing where its vectors refuse none. */
export const render = (asked: Asked): readonly string[] => {
  const told = refusedCase(asked);
  const [, , forbidden] = states(asked);
  const [g, wide] = [spacing(asked, 'refuses'), look(asked, 'width/figure')];
  const alt = told === undefined || !told.input || !told.why ? '' : say(asked, 'figure/refuses', { input: told.input, why: told.why });
  return drawn(asked, told !== undefined && alt ? [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: wide && px(g.height) ? `0 0 ${wide} ${px(g.height)}` : undefined, width: wide, height: px(g.height) })} role="img" aria-label="${escaped(alt)}">`,
    ...style([css([['text', { ...font(asked, 'text', 'text'), fill: painted(asked, 'text').colour }], ['.cross', { fill: forbidden?.colour, 'font-weight': look(asked, 'weight/strong') }]]),
      css([['.asked', { ...font(asked, 'code', 'code'), fill: forbidden?.colour, 'text-decoration': 'line-through' }]])], css([['text', { fill: painted(asked, 'text-dark').colour }]])),
    `<text class="cross"${attrs({ x: px(g.glyph), y: px(g.asked) })}>${escaped(forbidden?.glyph ?? '')}</text>`, `<text class="asked"${attrs({ x: px(g.text), y: px(g.asked) })}>${escaped(told.input)}</text>`,
    `<text${attrs({ x: px(g.text), y: px(g.why) })}>${escaped(told.why)}</text>`,
    '</svg>'] : [], alt, 'figure/refuses');
};
