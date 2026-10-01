import { conjectured, count, lawAt, laws, of, receipts, resolved, say, section, type Asked } from '../helpers/capsule.ts';
import { byBytes, matches } from '@lapxo/topos/wire';

/** What is open at a place, none of it typed: the needs the place still names, else the cells the judge holds open, a law's said through its samples, then the demands the fold finds unpaid and the ceilings it finds broken, each as the fold said it and none its language has no words for; the laws kept as conjectures stand in only while the judge hands none. */
export const render = (asked: Asked): readonly string[] => {
  const needed = asked.lines.filter((line) => matches('needs/*', of(line, 'scope')) && of(line, 'value') !== 'withdraw');
  if (needed.length) return resolved(asked, [...section(asked, 'open'), '', ...needed.map((line) => `- ${of(line, 'about') || of(line, 'scope')}`)]);
  const facts = (family: string): readonly (readonly [string, string])[] => receipts(asked, 'state').filter((line) => of(line, 'scope').startsWith(`${family}/`))
    .sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope'))).map((line) => [of(line, 'scope').slice(family.length + 1), of(line, 'value')] as const);
  const said = (family: string): readonly string[] => facts(family).map(([scope, reading]) => say(asked, `open/${family}`, { scope, reading })).filter(Boolean).map((one) => `- ${one}`);
  const judged = facts('conjecture').map(([scope, reading]) => ((law) => (law === undefined ? say(asked, 'open/open', { scope, reading }) : conjectured(asked, law)))(lawAt(asked, scope))).filter(Boolean);
  const held = judged.length ? judged : laws(asked).filter((line) => of(line, 'kind') === 'conjecture').map((law) => conjectured(asked, law));
  const [unpaid, outside] = [said('unpaid'), said('outside')];
  if (!held.length && !unpaid.length && !outside.length) return [];
  return resolved(asked, [...section(asked, 'open'), ...[...(held.length ? ['', say(asked, judged.length ? 'open/judged' : 'open/lead', { count: count(asked, held.length, true) }), '', ...held.map((one) => `- ${one}`)] : []),
    ...(unpaid.length ? ['', ...unpaid] : []), ...(outside.length ? ['', ...outside] : [])].slice(1)]);
};
