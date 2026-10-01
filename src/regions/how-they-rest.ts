import { lang, listOf, of, prose, say, value, zoom, type Asked, type Handed } from '../helpers/capsule.ts';
import { alphabet, byBytes, matches, steps } from '@lapxo/topos/wire';

/** What rests on what, each edge in its own direction: at the root every place's dependencies on the others, drawn; at a place, in one sentence, the places its pins name that its own dependencies name too; at the instrument, which pins none, the releases its dep lines read. */
export const render = (asked: Asked): readonly string[] => {
  const where = (glob: string): readonly Handed[] => asked.lines.filter((line) => matches(glob, of(line, 'scope')));
  const packages = new Map(where('*/name').map((line) => [of(line, 'value'), steps(of(line, 'scope'))[0] ?? ''] as const));
  const among = where('*/dependencies').flatMap((line) => alphabet(of(line, 'value')).members.map((spec) => [...packages].find(([name]) => spec.startsWith(`${name}@`))?.[1])
    .filter((to): to is string => to !== undefined).map((to) => `  ${steps(of(line, 'scope'))[0] ?? ''} --> ${to}`)).sort(byBytes);
  const summary = asked.lines.find((line) => of(line, 'scope').startsWith(`prose/${lang(asked)}/`) && of(line, 'scope').endsWith('/rests'));
  if (among.length) return zoom(of(summary, 'about'), ['```mermaid', 'flowchart RL', ...among, '```']);
  const prefix = ((name) => name.slice(0, name.lastIndexOf('/') + 1))(value(asked, 'name') ?? '');
  const depends = alphabet(value(asked, 'dependencies') ?? '').members;
  const needed = [...new Set(where('needs/*').map((line) => steps(of(line, 'scope'))[1] ?? ''))].filter((one) => one && one !== asked.name);
  const pinned = [...new Set(where('uses/*').map((line) => steps(of(line, 'scope'))[1] ?? ''))].filter((one) => depends.some((spec) => spec.startsWith(`${prefix}${one}@`)));
  const read = [...new Set(where('dep/*').filter((line) => of(line, 'role') === 'reads').map((line) => steps(of(line, 'scope'))[1] ?? ''))];
  const rests = (needed.length ? needed : pinned.length ? pinned : read).filter((one) => one && one !== asked.name).sort(byBytes);
  return rests.length ? [...((heading) => (heading ? [`## ${heading}`, ''] : []))(prose(asked, 'rests/heading')), say(asked, 'rests/on', { names: listOf(asked, rests) })] : [];
};
