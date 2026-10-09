import { of, placeOf, receipts, regionLines, value, type Asked, type Handed } from '@lapxo/topos/capsule';
import { alphabet } from '@lapxo/topos/wire';
import { receiptValue } from './asked.ts';
import { say, sentence, words } from './language.ts';

export type Sample = { readonly recorded: boolean; readonly at: string | undefined; readonly about: readonly string[] | undefined; readonly title: string | undefined; readonly brief: string | undefined };

export const laws = (asked: Asked): readonly Handed[] => regionLines(asked, 'laws');
export const offers = (asked: Asked): readonly Handed[] => regionLines(asked, 'offers');
export const lawId = (law: Handed): string => placeOf(law);
export const lawKey = (law: Handed): string => of(law, 'scope').slice(lawId(law).lastIndexOf('/') + 1);
export const lawName = (asked: Asked, law: Handed): string => words(asked, of(law, 'scope').slice(lawId(law).length + 1));
export const lawAt = (asked: Asked, scope: string): Handed | undefined => laws(asked).find((one) => of(one, 'scope') === scope);
export const keys = (asked: Asked, rested: string): string => alphabet(rested).members
  .map((scope) => ((law) => (law === undefined ? scope : lawKey(law)))(lawAt(asked, scope))).join(', ');
export const object = (asked: Asked): Handed | undefined => lawAt(asked, value(asked, 'notation/object') ?? '');
export const resting = (asked: Asked, scope: string): readonly Handed[] => offers(asked).filter((line) => alphabet(of(line, 'restsOn')).members.includes(scope));

/** The module an offer is implemented in: the one of its needs the language of the place said something of. */
export const moduleOf = (asked: Asked, offer: Handed): string | undefined => alphabet(of(offer, 'needs')).members
  .find((need) => receiptValue(asked, 'source', 'source/carries', need) !== undefined || receipts(asked, 'source').some((one) => placeOf(one) === need));

/** A declared sample's recorded metadata; its presence says nothing about whether a law holds. */
export const sample = (asked: Asked, law: Handed, side: string): Sample => {
  const family = value(asked, `samples/${side}`);
  const at = family === undefined ? undefined : alphabet(of(law, 'needs')).members.find((need) => need.startsWith(`${family.replace(/\/$/, '')}/`));
  const said = (field: string): string | undefined => (at === undefined ? undefined : receiptValue(asked, 'laws', `said/${field}`, at));
  return { recorded: at !== undefined && receipts(asked, 'laws').some((line) => placeOf(line) === at && of(line, 'scope').startsWith('said/')), at, about: said('about')?.split('\n'), title: said('title'), brief: said('brief') };
};
/** A conjecture as its two samples say it: its title, what it claims and what would break it. */
export const conjectured = (asked: Asked, law: Handed): string => ((yes: Sample, no: Sample) => say(asked, 'open/conjecture', { title: yes.title ?? sentence(asked, lawName(asked, law)).slice(0, -1),
  brief: yes.brief ?? of(law, 'about'), breaks: no.brief ?? (no.about ?? [])[0] ?? '' }))(sample(asked, law, 'yes'), sample(asked, law, 'no'));
