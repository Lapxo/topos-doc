import { cellText, pairs, prose, type Asked } from '../helpers/capsule.ts';

/** The alphabet of a place's notation, a row each: every symbol with what it stands for, the cell's members and then its types. */
export const render = (asked: Asked): readonly string[] => [`## ${prose(asked, 'reference/alphabet') ?? ''}`, '', prose(asked, 'reference/alphabet-table') ?? '', '|---|---|',
  ...['notation/cell', 'notation/types'].flatMap((scope) => pairs(asked, scope).map(([members, symbol]) => `| ${cellText(symbol)} | ${cellText(members)} |`))];
