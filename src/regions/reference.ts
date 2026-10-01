import { cellText, laws, of, offers, prose, say, typedAs, value, type Asked } from '../helpers/capsule.ts';

/** The head of a place's reference: how many operations, laws and forms the sections after it hold. */
export const render = (asked: Asked): readonly string[] => {
  const forms = new Set(typedAs(asked, 'source/declared/', value(asked, 'docs/forms') ?? '', 'args').map(([name, args]) => `- ${say(asked, 'reference/form', { name, args: cellText(args) })}`));
  return [`# ${prose(asked, 'reference/heading') ?? ''}`, '', say(asked, 'reference/lead', { operations: offers(asked).length, laws: laws(asked).filter((line) => of(line, 'form') !== 'formula').length, forms: forms.size })];
};
