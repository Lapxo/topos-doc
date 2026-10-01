import { prose, resolved, type Asked } from '../helpers/capsule.ts';

/** The commands a root is worked with, as its prose writes them. */
export const render = (asked: Asked): readonly string[] => resolved(asked, ((said) => (said === undefined ? [] : ['```bash', said, '```']))(prose(asked, 'commands')));
