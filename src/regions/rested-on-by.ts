import { of, receipts, resolved, say, section, type Asked } from '../helpers/capsule.ts';
import { byBytes, steps } from '@lapxo/topos/wire';

/** The places that rest on this one, the inverse of how they rest: each place the fold names once its source resolves, with its repository and, where it keeps one, the document that says what it is. */
export const render = (asked: Asked): readonly string[] => {
  const said = receipts(asked, 'state').filter((line) => of(line, 'scope').startsWith('rested/'));
  const field = (place: string, name: string): string => of(said.find((line) => of(line, 'scope') === `rested/${place}/${name}`), 'value');
  const places = [...new Set(said.map((line) => steps(of(line, 'scope'))[1] ?? ''))].filter((place) => field(place, 'source')).sort(byBytes);
  return resolved(asked, places.length ? [...section(asked, 'rested'), ...places.map((place) => `- ${say(asked, 'rested/place', { place, repository: field(place, 'repository') })}${
    field(place, 'what') ? ` · ${say(asked, 'rested/what', { repository: field(place, 'repository'), what: field(place, 'what') })}` : ''}`)] : []);
};
