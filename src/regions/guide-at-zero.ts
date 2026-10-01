import { count, laws, of, prose, resolved, say, value, type Asked } from '../helpers/capsule.ts';

/** How to contribute to a place with nothing yet written: the check to run and how many conjectures stand open. */
export const render = (asked: Asked): readonly string[] => resolved(asked, [`# ${prose(asked, 'guide/heading') ?? ''}`, '',
  say(asked, 'contributing', { check: value(asked, 'check') ?? say(asked, 'guide/owed'), open: count(asked, laws(asked).filter((line) => of(line, 'kind') === 'conjecture').length, true) })]);
