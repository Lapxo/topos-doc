import { captioned, cellOf, classDef, examples, figureAt, figured, folder, glance, heading, image, labelOf, lawAt, numeral, of, offers, painted, placeOf, prose, receipts, relative, resolved, run, say, section, sentence, shortest, states, stem, titled, value, type Asked } from '../helpers/capsule.ts';
import { alphabet, byBytes } from '@lapxo/topos/wire';

/** What an example's calls rest on, drawn: each call the place offers and the laws it rests on, the one shown marked. */
const restsOn = (asked: Asked, called: readonly string[], shown: string): readonly string[] => {
  const ids = new Map<string, string>();
  const offered = (call: string): Readonly<Record<string, string>> | undefined => offers(asked).find((line) => of(line, 'scope').endsWith(`/${call}`));
  const calls = called.filter((call) => offers(asked).some((line) => of(line, 'scope').endsWith(`/${call}`) && of(line, 'restsOn') !== ''));
  const edges = calls.flatMap((call, i) => alphabet(of(offered(call), 'restsOn')).members.map((on) => `  c${i} --> ${ids.get(on) ?? ids.set(on, `l${ids.size}`).get(on)}`));
  const colour = states(asked)[0]?.colour;
  return edges.length ? ['```mermaid', 'flowchart LR', ...calls.map((call, i) => `  c${i}["${call}"]`), ...[...ids].map(([scope, id]) => `  ${id}(["${labelOf(asked, scope)}"])`), ...edges,
    ...classDef('shown', colour, painted(asked, 'text-on').colour), `  class ${ids.get(shown) ?? ''} shown`, '```'] : [];
};

/** One learning page: an example of the place, the law its calls rest on most, its figure captioned beneath, its run, and where it lies; on any other page, the example its docs/learn line names, else the shortest it ships, at a glance, with the sentence its cell says beneath. */
export const render = (asked: Asked): readonly string[] => {
  const one = examples(asked).find((example) => example.name === stem(asked.shape));
  if (one === undefined) return ((first) => (first === undefined ? [] : [...section(asked, 'learn'), ...glance(asked, first, folder(asked.shape)),
    ...((caption) => (caption ? ['', sentence(asked, caption)] : []))(((cell) => (cell === undefined ? '' : captioned(asked, cell)))(cellOf(asked, first.at)))]))(examples(asked).find((example) => example.name === value(asked, 'docs/learn')) ?? shortest(asked));
  const called = receipts(asked, 'source').filter((line) => placeOf(line) === one.at && of(line, 'scope') === 'source/calls').flatMap((line) => alphabet(of(line, 'value')).members);
  const rests = new Map<string, number>();
  for (const call of called) for (const on of alphabet(of(offers(asked).find((line) => of(line, 'scope').endsWith(`/${call}`)), 'restsOn')).members) rests.set(on, (rests.get(on) ?? 0) + 1);
  const shown = [...rests].sort((a, b) => b[1] - a[1] || byBytes(a[0], b[0]))[0]?.[0];
  const stated = shown === undefined ? undefined : lawAt(asked, shown);
  const graph = stated === undefined || shown === undefined ? [] : restsOn(asked, called, shown);
  const [cell, here] = [cellOf(asked, one.at), asked.shape.slice(0, asked.shape.lastIndexOf('/'))];
  const drawn = figured(asked, 'ranges', numeral(value(asked, 'form/page/statement'))).map(figureAt).find((at) => at !== undefined && stem(at) === one.name);
  const shownFigure = drawn !== undefined && cell !== undefined ? [image(asked, relative(here, drawn), cell), '', sentence(asked, captioned(asked, cell))] : shown !== undefined && shown === value(asked, 'notation/object') ? graph : [];
  return resolved(asked, [
    `# ${heading(asked, one.name)}`, '', ...(shownFigure.length ? [...shownFigure, ''] : []), ...(stated ? [sentence(asked, of(stated, 'about')), ''] : []),
    `## ${prose(asked, 'learn/run') ?? ''}`, '', ...run(asked, one), '',
    ...(graph.length && shownFigure !== graph ? [`## ${prose(asked, 'learn/rests') ?? ''}`, '', ...graph, ''] : []),
    ...titled(asked, 'learn/source', [say(asked, 'learn/source', { at: relative(here, one.at), place: asked.name })]),
  ]);
};
