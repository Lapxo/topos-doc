import { SPANS, attrs, cellOf, look, numeral, prose, px, say, shortest, spacing, states, stem, type Asked } from '../helpers/capsule.ts';

/** A place's mark: its shortest example's cell as a bond, two arcs closed and filled where the claims meet and drawn apart where they miss; filled as the last state when the render is named for it. */
export const render = (asked: Asked): readonly string[] => {
  const first = shortest(asked);
  const cell = first === undefined ? undefined : cellOf(asked, first.at);
  if (cell === undefined) return [];
  const [held, alone, broken] = states(asked);
  const last = states(asked)[states(asked).length - 1]?.name;
  const [meets, { r, top, bottom, apart, axis }, mark] = [SPANS.inhabited(cell.held), spacing(asked, 'bond'), look(asked, 'width/mark')];
  const [mid, stroke] = [px(numeral(mark) * axis), { stroke: alone?.colour, 'stroke-width': look(asked, 'stroke/mark'), 'stroke-linecap': look(asked, 'stroke/cap') }];
  const title = meets ? say(asked, 'cell/bond', { count: cell.claims.length }) : `${cell.claims.length} ${say(asked, 'cell/apart', { apart: prose(asked, 'apart') ?? '' })}`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({ viewBox: mark ? `0 0 ${mark} ${mark}` : undefined, width: mark, height: mark })} role="img" aria-labelledby="title">`,
    `<title id="title">${title}</title>`,
    ...(meets ? [`<path d="M${mid} ${top} A${r} ${r} 0 0 1 ${mid} ${bottom} A${r} ${r} 0 0 1 ${mid} ${top} Z"${attrs({ fill: (last !== undefined && stem(asked.shape).endsWith(`-${last}`) ? broken : held)?.colour })}/>`] : []),
    `<path d="M${mid} ${top} A${r} ${r} 0 1 0 ${mid} ${bottom}" fill="none"${attrs(stroke)}/>`,
    `<path d="M${mid} ${top} A${r} ${r} 0 1 1 ${mid} ${bottom}" fill="none"${attrs(stroke)}${meets ? '' : attrs({ transform: px(apart) ? `translate(${px(apart)} 0)` : undefined })}/>`,
    '</svg>',
  ];
};
