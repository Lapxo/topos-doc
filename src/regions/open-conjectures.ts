import { conjectured, count, lawKey, laws, of, pairs, prose, resolved, sample, say, sentence, zoom, type Asked, type Handed } from '../helpers/capsule.ts';

/** The conjectures a place keeps open: each with what would show it and what would break it, grouped by who holds them. */
export const render = (asked: Asked): readonly string[] => {
  const held = laws(asked).filter((line) => of(line, 'kind') === 'conjecture');
  if (!held.length) return [];
  const bullet = (line: Handed): string => `- ${conjectured(asked, line)}`;
  const who = pairs(asked, 'open/who');
  const groups = [...new Set(who.map(([group]) => group))].map((group) => [group, held.filter((line) => who.some(([g, one]) => g === group && lawKey(line) === one))] as const);
  const loose = held.filter((line) => !who.some(([, one]) => lawKey(line) === one));
  const full = held.map((line) => `${sentence(asked, of(line, 'about'))} ${(sample(asked, line, 'no').about ?? [])[0] ?? ''}`.trim());
  return resolved(asked, [`## ${prose(asked, 'open/heading') ?? ''}`, '', say(asked, 'open/lead', { count: count(asked, held.length, true) }),
    ...groups.flatMap(([group, lines]) => (lines.length ? ['', say(asked, 'open/group', { count: count(asked, lines.length, true), group }), '', ...lines.map(bullet)] : [])),
    ...(loose.length ? ['', ...loose.map(bullet)] : []), '', ...zoom(say(asked, 'open/full'), full.flatMap((part) => [part, '']).slice(0, -1))]);
};
