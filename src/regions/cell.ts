import { captioned, cellOfLines, declaredSample, described, figured, of, type Asked, type Handed } from '../helpers/capsule.ts';

/** Interval cells from the view's evidence, each scope kept separate and said in the place's own forms. */
export const render = (asked: Asked): readonly string[] => {
  const lines = declaredSample(asked, figured(asked, asked.region, 1)[0]);
  const groups = new Map<string, Handed[]>();
  for (const line of lines) {
    const scope = of(line, 'scope');
    const group = groups.get(scope) ?? [];
    group.push(line);
    groups.set(scope, group);
  }
  return [...groups.values()].flatMap((group) => {
    const cell = cellOfLines(group);
    if (cell === undefined) return [];
    const text = described(asked, cell) || captioned(asked, cell);
    return text ? [text] : [];
  });
};
