import { attrs, css, drawn, escaped, examples, font, handed, hull, listOf, look, numeral, of, painted, placeOf, prose, px, receiptValue, receipts, regionLines, sampled, say, spacing, states, stem, style, value, type Asked } from '../helpers/capsule.ts';

/** The anatomy of a world, drawn from its own declaration: what it declares, its regions, the blob that pins it, and the runtime that runs it. The figure names that blob and never a release, which is named after the figure is drawn; nothing it draws carries a timestamp or an epoch, and its regions are drawn in sorted order. Where docs/world names an example, the declaration that example prints and nothing of the file it is written in; where it names none, the place's own capsule lines with its regions' longest file and its vectors. */
export const render = (asked: Asked): readonly string[] => {
  const selected = value(asked, 'docs/world');
  const shown = selected === undefined ? undefined : examples(asked).find((one) => one.name === selected);
  const sample = selected === undefined || shown !== undefined ? undefined : sampled(asked, selected);
  if (selected !== undefined && shown === undefined && sample === undefined) throw Error(`REFUSE·doc docs/world ${selected} was not handed`);
  const illustrative = shown !== undefined || sample !== undefined;
  const own = shown !== undefined ? handed(['**'], shown.printed.split('\n')) : sample?.lines ?? regionLines(asked, 'capsule');
  const said = (scope: string): string => of(own.find((line) => of(line, 'scope') === scope), 'value');
  const nameOf = (line: Parameters<typeof of>[0]): string => of(line, 'scope').slice(of(line, 'scope').indexOf('/') + 1);
  const declared = own.filter((line) => of(line, 'scope').startsWith('region/') && of(line, 'measure') === 'reads');
  const regions = [...new Set(declared.map(nameOf))].sort();
  const ordered = [...declared].sort((a, b) => (nameOf(a) < nameOf(b) ? -1 : nameOf(a) > nameOf(b) ? 1 : 0));
  const dir = value(asked, `form/runtime/${said('capsule/runtime')}/regions`);
  const files = dir === undefined || illustrative ? [] : receipts(asked, 'source').map(placeOf).filter((at) => at.startsWith(dir) && regions.includes(stem(at)));
  const lengths = [...new Set(files)].map((at) => numeral(receiptValue(asked, 'source', 'source/lines', at)));
  const longest = lengths.length && lengths.every(Number.isFinite) ? Math.max(...lengths) : undefined;
  const vectorCount = asked.regions.vectors === undefined ? undefined : receipts(asked, 'vectors').length;
  const measured = (key: string, fields: Readonly<Record<string, number | undefined>>): string => {
    const text = prose(asked, key) ?? '';
    for (const [field, number] of Object.entries(fields)) {
      if (text.includes(`{${field}}`) && number === undefined) throw Error(`REFUSE·doc ${key}/${field} has no handed measurement`);
    }
    return say(asked, key, Object.fromEntries(Object.entries(fields).filter((entry): entry is [string, number] => entry[1] !== undefined)));
  };
  const uses = own.find((line) => of(line, 'scope').startsWith('uses/'));
  const release = new Set([said('capsule/topos'), !illustrative ? value(asked, `uses/${asked.name}`) ?? '' : ''].filter((one) => one.startsWith('sha256:')));
  const blob = illustrative ? of(uses, 'value') : '';
  const pin = blob.startsWith('sha256:') && !release.has(blob) ? blob : '';
  const stages = [say(asked, 'figure/world/declares', { domain: said('capsule/domain'), runtime: said('capsule/runtime'), effects: said('capsule/effects') }),
    ...(!illustrative ? [measured('figure/world/regions', { count: regions.length, longest }), measured('figure/world/vectors', { count: vectorCount })]
      : ordered.map((line) => say(asked, 'figure/world/region', { name: nameOf(line), reads: of(line, 'value') }))),
    ...(pin ? [say(asked, 'figure/world/pinned', { place: asked.name })] : []), ...(illustrative && pin ? [say(asked, 'figure/world/adopted', { scope: of(uses, 'scope') })] : []), say(asked, 'figure/world/host', { runtime: said('capsule/runtime') })]
    .filter((stage): stage is string => Boolean(stage));
  const [held, alone] = states(asked);
  const g = spacing(asked, 'world');
  const [height, wide] = [stages.length * g.pitch, hull([numeral(look(asked, 'width/figure')), Math.ceil(g.margin + hull([0, ...stages.map((stage) => stage.length)]).hi * g.char)]).hi];
  return drawn(asked, own.length && stages.length ? [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: px(wide) && px(height) ? `0 0 ${px(wide)} ${px(height)}` : undefined, width: px(wide), height: px(height) })} role="img" aria-label="${escaped(listOf(asked, stages))}">`,
    ...style([css([['text', { ...font(asked, 'code', 'small'), fill: painted(asked, 'text').colour }], ['rect', { fill: 'none', stroke: alone?.colour }], ['line', { stroke: held?.colour }]])], css([['text', { fill: painted(asked, 'text-dark').colour }]])),
    ...stages.flatMap((stage, i) => [`<rect${attrs({ x: px(g.left), y: px(g.top + i * g.pitch), width: px(wide - g.left - g.left), height: px(g.box), rx: px(g.radius) })}/>`, `<text${attrs({ x: px(g.text), y: px(g.first + i * g.pitch) })}>${escaped(stage)}</text>`,
      ...(i ? [`<line${attrs({ x1: px(wide * g.axis), y1: px(i * g.pitch - g.join), x2: px(wide * g.axis), y2: px(i * g.pitch + g.top) })}/>`] : [])]),
    '</svg>'] : [], listOf(asked, stages), 'figure/world');
};
