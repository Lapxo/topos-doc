import { cellText, count, keys, lawAt, lawKey, lawName, laws, numeral, of, prose, reaches, receipts, relative, resolved, sample, say, sentence, titled, value, zoom, type Asked, type Handed } from '../helpers/capsule.ts';
import { alphabet, byBytes } from '@lapxo/topos/wire';

/** Every law of a place in one table, the reference's section: its kind, view, what it rests on, its formula, samples and whether it was reproduced. */
const table = (asked: Asked): readonly string[] => {
  const read = new Map(receipts(asked, 'laws').map((line) => [of(line, 'scope'), of(line, 'value')]));
  const here = asked.shape.slice(0, asked.shape.lastIndexOf('/'));
  const reproduced = (line: Handed): string => ((got) => (got === undefined ? say(asked, 'reference/underived') : say(asked, numeral(got) === 1 ? 'reference/yes' : 'reference/no')))([...read].find(([scope]) => scope.endsWith(`/${lawKey(line)}/reproduced`))?.[1]);
  const row = (line: Handed): string => {
    const [yes, no, formula] = [sample(asked, line, 'yes'), sample(asked, line, 'no'), of(laws(asked).find((one) => of(one, 'form') === 'formula' && of(one, 'scope').startsWith(`${of(line, 'scope')}/`)), 'value')];
    return `| ${lawKey(line)} | ${of(line, 'kind') || say(asked, 'reference/unkinded')} | ${of(line, 'view') || say(asked, 'reference/any')} | ${cellText(keys(asked, of(line, 'restsOn'))) || say(asked, 'reference/nothing')} | ${cellText(of(line, 'about'))} | ${formula ? `\`${cellText(formula)}\`` : ''} | ${yes.held && yes.at ? `[${say(asked, 'reference/yes')}](${relative(here, yes.at)})` : say(asked, 'reference/none')} | ${cellText((no.about ?? [])[0] ?? say(asked, 'reference/derived'))} | ${reproduced(line)} |`;
  };
  return [`## ${prose(asked, 'reference/laws') ?? ''}`, '', prose(asked, 'reference/laws-table') ?? '', '|---|---|---|---|---|---|---|---|---|',
    ...laws(asked).filter((line) => of(line, 'form') !== 'formula').sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope'))).map(row)];
};

/** What holds of a place: its axioms, those the most laws rest on spelled out, the rest folded, and what was measured; at eight, every law. */
export const render = (asked: Asked): readonly string[] => {
  if (reaches(asked, 'whole')) return table(asked);
  const rests = new Map<string, number>();
  for (const line of laws(asked)) for (const on of alphabet(of(line, 'restsOn')).members) rests.set(on, (rests.get(on) ?? 0) + 1);
  const held = laws(asked).filter((line) => of(line, 'kind') === 'axiom');
  if (!held.length) return [];
  const spelled = ((said) => (said === undefined ? 0 : numeral(said)))(value(asked, 'docs/what-holds'));
  const leaned = [...held].sort((a, b) => (rests.get(of(b, 'scope')) ?? 0) - (rests.get(of(a, 'scope')) ?? 0));
  const [rest, measured] = [held.filter((line) => !leaned.slice(0, spelled).includes(line)), lawAt(asked, value(asked, 'docs/measured') ?? '')];
  return resolved(asked, [
    ...titled(asked, 'what-holds', [say(asked, 'what-holds/lead', { count: count(asked, held.length), spelled: count(asked, spelled, true) }),
      ...leaned.slice(0, spelled).map((line) => say(asked, 'what-holds/axiom', { sentence: sentence(asked, of(line, 'about')), name: lawName(asked, line), rests: rests.get(of(line, 'scope')) ?? 0 }))]),
    ...(rest.length ? ['', ...zoom(say(asked, 'what-holds/others', { count: count(asked, rest.length) }), rest.map((line) => `- ${say(asked, 'what-holds/other', { name: lawName(asked, line), about: of(line, 'about') })}`))] : []),
    ...(measured === undefined ? [] : ['', say(asked, 'what-holds/measured', { sentence: sentence(asked, of(measured, 'about')), measured: (sample(asked, measured, 'yes').about ?? []).slice(-1)[0] ?? '' }).trim()]),
  ]);
};
