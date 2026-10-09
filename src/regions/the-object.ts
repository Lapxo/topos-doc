import { aligned, classDef, hull, labelOf, lawName, moves, object, of, painted, pairs, prose, reaches, resolved, resting, say, spacing, states, tuple, type Asked } from '../helpers/capsule.ts';
import { alphabet } from '@lapxo/topos/wire';

/** The states the object moves through and the moves between them, each dangerous move said so, drawn as a machine. */
const machine = (asked: Asked): readonly string[] => {
  const [drawn, renders] = [moves(asked), pairs(asked, 'notation/renders')];
  if (drawn === undefined) return [];
  const colours = renders.flatMap(([state, name]) => ((colour) => (colour === undefined ? [] : [[state, name, colour] as const]))(painted(asked, state).colour));
  return ['```mermaid', 'stateDiagram-v2', ...renders.map(([state, name]) => `  state "${state} · ${name}" as ${state}`),
    ...drawn.map((move) => `  ${move.from} --> ${move.to}${move.dangerous ? `: ${say(asked, 'states/dangerous')}` : move.why ? `: ${move.why}` : ''}`),
    ...colours.flatMap(([, name, colour]) => classDef(name, colour, painted(asked, 'text-on').colour)), ...colours.map(([state, name]) => `  class ${state} ${name}`), '```'];
};

/** What the object rests on, drawn: the object and each law it rests on. */
const rests = (asked: Asked): readonly string[] => {
  const [held, on] = [object(asked), alphabet(of(object(asked), 'restsOn')).members];
  if (held === undefined || !on.length || !resting(asked, of(held, 'scope')).length) return [];
  const colour = states(asked)[0]?.colour;
  return [`## ${prose(asked, 'reference/rests') ?? ''}`, '', '```mermaid', 'flowchart BT', `  o(["${lawName(asked, held)}"])`, ...on.map((scope, i) => `  r${i}(["${labelOf(asked, scope)}"])`), ...on.map((_, i) => `  o --> r${i}`),
    ...classDef('object', colour, painted(asked, 'text-on').colour), '  class o object', '```'];
};

/** The object a place is about: its tuple and formulas and the states it can be in, each with its glyph; at eight, its machine and what it rests on. */
export const render = (asked: Asked): readonly string[] => {
  if (reaches(asked, 'whole')) return [`## ${prose(asked, 'reference/states') ?? ''}`, '', ...machine(asked), '', ...rests(asked)];
  const head = tuple(asked);
  const written = head === undefined ? [] : ['```text', head, ...aligned(asked), '```'];
  const [glyphs, rows] = [new Map(pairs(asked, 'notation/renders').map(([state]) => [state, painted(asked, state).glyph ?? ''] as const)), pairs(asked, 'notation/states')];
  const seen = new Set<string>();
  const unique = rows.filter(([, state]) => (seen.has(state) ? false : (seen.add(state), true)));
  const [width, widest, gap] = [hull([0, ...unique.map(([when]) => when.length)]).hi, hull([0, ...unique.map(([, state]) => state.length)]).hi, spacing(asked, 'table/gap')];
  const table = unique.length ? ['```text', ...unique.map(([when, state]) => `${when.padEnd(width + gap.state)}${state.padEnd(widest + gap.glyph)}${glyphs.get(state) ?? ''}`), '```'] : [];
  return resolved(asked, !written.length && !table.length ? [] : [`## ${prose(asked, 'the-object/heading') ?? ''}`, '', ...written, ...(table.length ? ['', ...table] : [])]);
};
