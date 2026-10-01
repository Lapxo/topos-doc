import { cellText, prose, say, typedAs, value, type Asked } from '../helpers/capsule.ts';

/** The forms a place's values take, one each: every declaration of the type its docs name for forms, with what it is made of. */
export const render = (asked: Asked): readonly string[] => [`## ${prose(asked, 'reference/forms') ?? ''}`, '',
  ...[...new Set(typedAs(asked, 'source/declared/', value(asked, 'docs/forms') ?? '', 'args').map(([name, args]) => `- ${say(asked, 'reference/form', { name, args: cellText(args) })}`))].sort()];
