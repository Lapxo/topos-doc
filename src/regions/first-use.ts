import { folder, glance, say, section, shortest, type Asked } from '../helpers/capsule.ts';

/** How a place is first used: its shortest example at a glance, the command that runs it and what it printed. */
export const render = (asked: Asked): readonly string[] => ((first) => (first === undefined ? []
  : [...section(asked, 'first-use'), say(asked, 'first-use/lead', { name: first.name }), '', ...glance(asked, first, folder(asked.shape))]))(shortest(asked));
