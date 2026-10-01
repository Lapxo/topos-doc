import { cellText, count, listOf, of, prose, regionLines, resolved, say, type Asked } from '../helpers/capsule.ts';
import { alphabet, byBytes, steps } from '@lapxo/topos/wire';

const rules = (asked: Asked): readonly string[] => ((held) => (!held.length ? [] : [`# ${prose(asked, 'regions/heading') ?? ''}`, '', say(asked, 'regions/laws', { count: count(asked, held.length, true) }), '', prose(asked, 'regions/laws-table') ?? '', '|---|---|',
  ...held.map((line) => `| ${steps(steps(of(line, 'scope')).slice(1))} | ${cellText(of(line, 'about'))} |`)]))(asked.lines.filter((line) => of(line, 'scope').startsWith('audit/') && of(line, 'role') === 'demands' && of(line, 'about') !== '').sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope'))));

/** The reference of a capsule: each region its own lock declares, what it reads and what it writes; of a place with none, the laws it states. */
export const render = (asked: Asked): readonly string[] => {
  const own = [...asked.lines, ...regionLines(asked, 'capsule')];
  const said = (scope: string, measure?: string): readonly string[] => own.filter((line) => of(line, 'scope') === scope && (measure === undefined || of(line, 'measure') === measure)).flatMap((line) => alphabet(of(line, 'value')).members);
  const names = [...new Set(own.filter((line) => (of(line, 'scope').startsWith('region/') && of(line, 'measure') === 'reads') || of(line, 'scope').startsWith('capsule/reads/'))
    .map((line) => of(line, 'scope').slice(of(line, 'scope').lastIndexOf('/') + 1)))].sort();
  return resolved(asked, !names.length ? rules(asked) : [`# ${prose(asked, 'regions/heading') ?? ''}`, '', say(asked, 'regions/lead', { count: count(asked, names.length, true), effects: listOf(asked, said('capsule/effects')) || alphabet({ polarity: 'permit', members: [] }) }), '',
    prose(asked, 'regions/table') ?? '', '|---|---|---|', ...names.map((name) => `| ${name} | ${cellText([...said(`region/${name}`, 'reads'), ...said(`capsule/reads/${name}`)].join(' · '))} | ${cellText([...said(`region/${name}`, 'writes'), ...said(`capsule/writes/${name}`)].join(' · ')) || say(asked, 'regions/leaf')} |`)]);
};
