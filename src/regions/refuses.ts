import { folder, lawName, laws, of, refusedCases, relative, resolved, sample, say, section, value, zoom, type Asked } from '../helpers/capsule.ts';
import { byBytes } from '@lapxo/topos/wire';

/** What a place refuses, shown by its captured REFUSE lines, else by its falsifiers: the no sample of its object's law, else of the first law that keeps one and is no conjecture, and the first refused case of its vectors with the wire's own why. */
export const render = (asked: Asked): readonly string[] => {
  const told = refusedCases(asked);
  const here = folder(asked.shape);
  const captured = told.map((one) => `- ${one.name}: ${one.why || one.input}`).filter((one) => one.length > 3);
  if (captured.length) {
    return resolved(asked, [...section(asked, 'refuses'), ...(say(asked, 'refuses/lead') ? [say(asked, 'refuses/lead')] : []), '', ...captured]);
  }
  const kept = laws(asked).filter((line) => of(line, 'kind') !== 'conjecture' && sample(asked, line, 'no').recorded).sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope')));
  const law = kept.find((line) => of(line, 'scope') === value(asked, 'notation/object')) ?? kept[0];
  const no = law === undefined ? undefined : sample(asked, law, 'no');
  const said = [law === undefined ? '' : say(asked, 'refuses/lead', { law: lawName(asked, law), at: relative(here, no?.at ?? '') })].filter(Boolean);
  return said.length ? resolved(asked, [...section(asked, 'refuses'), ...said,
    ...(no?.about?.length ? ['', ...zoom(say(asked, 'refuses/full'), no.about.flatMap((line) => [line, '']).slice(0, -1))] : [])]) : [];
};
