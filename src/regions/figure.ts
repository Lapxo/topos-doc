import { cellOf, figureAt, figured, image, prose, resolved, shortest, type Asked } from '../helpers/capsule.ts';

/** The figure of a place: the cell its shortest example spells, drawn where a view draws it, with the marks it bears. */
export const render = (asked: Asked): readonly string[] => {
  const first = shortest(asked);
  const cell = first === undefined ? undefined : cellOf(asked, first.at);
  const at = figured(asked, 'ranges', 1).map(figureAt).find(Boolean);
  const marks = prose(asked, 'marks');
  return resolved(asked, at === undefined || cell === undefined ? [] : [image(asked, at, cell), ...(marks === undefined ? [] : ['', marks])]);
};
