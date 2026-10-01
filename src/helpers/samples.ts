import { handed, of, placeOf, receipts, value, type Asked, type Handed } from '@lapxo/topos/capsule';
import { alphabet, byBytes } from '@lapxo/topos/wire';

/** The word a reader says a sample's lines under. */
type Said = 'lines';

/** A wire sample the place ships: the yes sample `prefer` names when it says lines, else the first by file that does, read through the wire. */
export const sampled = (asked: Asked, prefer = ''): { readonly at: string; readonly lines: readonly Handed[] } | undefined => {
  const field: Said = 'lines';
  const yes = `${value(asked, 'samples/yes') ?? 'yes'}/`;
  const said = receipts(asked, 'laws').filter((line) => of(line, 'scope') === `said/${field}` && placeOf(line).startsWith(yes)).sort((a, b) => byBytes(placeOf(a), placeOf(b)));
  const [one] = [...said.filter((line) => placeOf(line) === prefer), ...said];
  return one === undefined ? undefined : { at: placeOf(one), lines: handed(['**'], of(one, 'value').split('\n')) };
};
/** The wire sample a view names in its needs, and no other: what a figure drawn from a declared sample draws. */
export const declaredSample = (asked: Asked, view: Handed | undefined): readonly Handed[] => ((at) => (at === undefined ? [] : ((one) => (one?.at === at ? one.lines : []))(sampled(asked, at))))(
  alphabet(of(view, 'needs')).members.find((need) => need.startsWith(`${value(asked, 'samples/yes') ?? 'yes'}/`)));
