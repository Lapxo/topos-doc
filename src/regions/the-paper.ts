import { entries, parted, resolved, say, titled, value, type Asked, type Entry } from '../helpers/capsule.ts';
import { alphabet } from '@lapxo/topos/wire';

/** The paper a place rests on: what the place says of it, and each work it cites, as a reference. */
export const render = (asked: Asked): readonly string[] => {
  const reference = (one: Entry): string | undefined => {
    const doi = value(asked, 'sources/doi') === undefined ? undefined : one.field('doi');
    const address = doi === undefined ? one.field('address') : `${value(asked, 'sources/doi')}${doi}`;
    const [authors, year, version, publisher] = [alphabet(one.field('author') ?? '').members, one.field('year'), one.field('version'), one.field('publisher')];
    return address === undefined ? undefined : [authors.length > 1 ? `${authors.slice(0, -1).join(', ')}${say(asked, 'cite/and')}${authors[authors.length - 1]}` : authors[0],
      year === undefined ? undefined : `(${year}).`, `${version === undefined ? one.title : say(asked, 'cite/versioned', { title: one.title, version })}.`,
      publisher === undefined ? undefined : `${publisher}.`, address].filter(Boolean).join(' ');
  };
  return resolved(asked, titled(asked, 'the-paper', [...parted(asked, 'paper'), ...entries(asked, 'cites').flatMap((one) => reference(one) ?? [])]));
};
