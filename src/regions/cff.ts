import { entries, numeral, resolved, say, value, type Asked } from '../helpers/capsule.ts';
import { alphabet } from '@lapxo/topos/wire';

/** How a place is cited: itself as software, and the paper it rests on when it cites one with a DOI. */
export const render = (asked: Asked): readonly string[] => {
  const doiOf = (field: (measure: string) => string | undefined): string | undefined => (value(asked, 'sources/doi') === undefined ? undefined : field('doi'));
  const [paper, name] = [entries(asked, 'cites').find((one) => doiOf(one.field) !== undefined), value(asked, 'name')];
  if (name === undefined) return [];
  const quoted = (text: string): string => JSON.stringify(text);
  const person = (who: string, indent: string): readonly string[] => (([family = '', ...given]) => (given.length ? [`${indent}- family-names: ${quoted(family)}`, `${indent}  given-names: ${quoted(given.join(', '))}`]
    : [`${indent}- name: ${quoted(who)}`]))(who.split(', '));
  const optional = (key: string, scope: string): readonly string[] => ((said) => (said === undefined ? [] : [`${key}: ${quoted(said)}`]))(value(asked, scope));
  const [authors, year, version, publisher] = [alphabet(paper?.field('author') ?? '').members, paper?.field('year'), paper?.field('version'), paper?.field('publisher')];
  const preferred = paper === undefined ? [] : ['preferred-citation:', '  type: article', `  title: ${quoted(paper.title)}`, ...(authors.length ? ['  authors:', ...authors.flatMap((one) => person(one, '    '))] : []),
    ...(year !== undefined && Number.isInteger(numeral(year)) ? [`  year: ${year}`] : []), ...(version === undefined ? [] : [`  version: ${quoted(version)}`]),
    ...(publisher === undefined ? [] : ['  publisher:', `    name: ${quoted(publisher)}`]), `  doi: ${quoted(doiOf(paper.field) ?? '')}`];
  return resolved(asked, ['cff-version: 1.2.0', `message: ${quoted(paper ? say(asked, 'cff/paper', { title: paper.title }) : say(asked, 'cff/name', { name }))}`, 'type: software', `title: ${quoted(name)}`,
    ...optional('version', 'version'), ...((author) => (author === undefined ? [] : ['authors:', ...person(author, '  ')]))(value(asked, 'author')), ...optional('repository-code', 'repository'), ...optional('license', 'license'), ...preferred]);
};
