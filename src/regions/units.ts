import { cellText, prose, typedAs, value, type Asked } from '../helpers/capsule.ts';

/** The units a place's values are counted in, a row each: every function that returns the type its docs name for units, with what it is given. */
export const render = (asked: Asked): readonly string[] => [`## ${prose(asked, 'reference/units') ?? ''}`, '', prose(asked, 'reference/units-table') ?? '', '|---|---|',
  ...[...new Set(typedAs(asked, 'source/returns/', value(asked, 'docs/units') ?? '', 'params').map(([name, params]) => `| ${name} | \`${cellText(params)}\` |`))].sort()];
