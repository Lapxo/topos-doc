import { attrs, css, drawn, escaped, examples, font, handed, hull, listOf, look, numeral, of, painted, placeOf, px, receiptValue, receipts, regionLines, say, spacing, states, stem, style, value, type Asked } from '../helpers/capsule.ts';

/** The anatomy of a world, drawn from its own declaration: what it declares, its regions, the blob that pins it, and the runtime that runs it; where docs/world names an example, the declaration that example prints and nothing of the file it is written in: each region with the reads its line declares, the topos release it is packed against, the blob its uses line names and that line, then the host; where it names none, the place's own capsule lines with its regions' longest file and its vectors. */
export const render = (asked: Asked): readonly string[] => {
  const shown = examples(asked).find((one) => one.name === value(asked, 'docs/world'));
  const own = shown === undefined ? regionLines(asked, 'capsule') : handed(['**'], shown.printed.split('\n'));
  const said = (scope: string): string => of(own.find((line) => of(line, 'scope') === scope), 'value');
  const declared = own.filter((line) => of(line, 'scope').startsWith('region/') && of(line, 'measure') === 'reads');
  const regions = [...new Set(declared.map((line) => of(line, 'scope').slice(of(line, 'scope').indexOf('/') + 1)))];
  const dir = value(asked, `form/runtime/${said('capsule/runtime')}/regions`);
  const files = dir === undefined || shown !== undefined ? [] : receipts(asked, 'source').map(placeOf).filter((at) => at.startsWith(dir) && regions.includes(stem(at)));
  const longest = hull([0, ...[...new Set(files)].map((at) => numeral(receiptValue(asked, 'source', 'source/lines', at)) || 0)]).hi;
  const uses = own.find((line) => of(line, 'scope').startsWith('uses/'));
  const pin = shown === undefined ? value(asked, `uses/${asked.name}`) ?? '' : of(uses, 'value');
  const stages = [say(asked, 'figure/world/declares', { domain: said('capsule/domain'), runtime: said('capsule/runtime'), effects: said('capsule/effects') }),
    ...(shown === undefined ? [say(asked, 'figure/world/regions', { count: regions.length, longest }), say(asked, 'figure/world/vectors', { count: receipts(asked, 'vectors').length })]
      : [...declared.map((line) => say(asked, 'figure/world/region', { name: of(line, 'scope').slice(of(line, 'scope').indexOf('/') + 1), reads: of(line, 'value') })), say(asked, 'figure/world/topos', { digest: said('capsule/topos') })]),
    say(asked, 'figure/world/blob', { digest: pin }), ...(shown === undefined ? [say(asked, 'figure/world/pinned', { place: asked.name })] : [say(asked, 'figure/world/adopted', { scope: of(uses, 'scope') })]), say(asked, 'figure/world/host', { runtime: said('capsule/runtime') })]
    .filter(Boolean);
  const [held, alone] = states(asked);
  const g = spacing(asked, 'world');
  const [height, wide] = [stages.length * g.pitch, hull([numeral(look(asked, 'width/figure')), Math.ceil(g.margin + hull([0, ...stages.map((stage) => stage.length)]).hi * g.char)]).hi];
  return drawn(asked, own.length && pin && stages.length ? [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: px(wide) && px(height) ? `0 0 ${px(wide)} ${px(height)}` : undefined, width: px(wide), height: px(height) })} role="img" aria-label="${escaped(listOf(asked, stages))}">`,
    ...style([css([['text', { ...font(asked, 'code', 'small'), fill: painted(asked, 'text').colour }], ['rect', { fill: 'none', stroke: alone?.colour }], ['line', { stroke: held?.colour }]])], css([['text', { fill: painted(asked, 'text-dark').colour }]])),
    ...stages.flatMap((stage, i) => [`<rect${attrs({ x: px(g.left), y: px(g.top + i * g.pitch), width: px(wide - g.left - g.left), height: px(g.box), rx: px(g.radius) })}/>`, `<text${attrs({ x: px(g.text), y: px(g.first + i * g.pitch) })}>${escaped(stage)}</text>`,
      ...(i ? [`<line${attrs({ x1: px(wide * g.axis), y1: px(i * g.pitch - g.join), x2: px(wide * g.axis), y2: px(i * g.pitch + g.top) })}/>`] : [])]),
    '</svg>'] : [], listOf(asked, stages), 'figure/world');
};
