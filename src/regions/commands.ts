import { captured, prose, resolved, type Asked } from '../helpers/capsule.ts';

/** The commands a root is worked with, as its prose writes them, then what a capture receipt printed. Typed output is none of this region. */
export const render = (asked: Asked): readonly string[] => {
  const said = prose(asked, 'commands');
  const out = captured(asked, 'quickstart');
  const usage = captured(asked, 'usage');
  const blocks = [
    ...(said ? ['```bash', said, '```'] : []),
    ...(out ? ['```', out, '```'] : []),
    ...(usage ? ['```', usage, '```'] : []),
  ];
  return resolved(asked, blocks);
};
