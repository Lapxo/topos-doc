import { folder, lawName, laws, of, refusedCase, relative, resolved, sample, say, section, value, zoom, type Asked } from '../helpers/capsule.ts';
import { byBytes } from '@lapxo/topos/wire';

/** What a place refuses, shown by its falsifiers: the no sample of its object's law, else of the first law that keeps one and is no conjecture (a conjecture is open, never refused), and the first refused case of its vectors with the wire's own why, said as one paragraph with what the sample holds folded under it; nothing where it keeps neither. */
export const render = (asked: Asked): readonly string[] => {
  const kept = laws(asked).filter((line) => of(line, 'kind') !== 'conjecture' && sample(asked, line, 'no').held).sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope')));
  const law = kept.find((line) => of(line, 'scope') === value(asked, 'notation/object')) ?? kept[0];
  const no = law === undefined ? undefined : sample(asked, law, 'no');
  const told = refusedCase(asked);
  const here = folder(asked.shape);
  const said = [law === undefined ? '' : say(asked, 'refuses/lead', { law: lawName(asked, law), at: relative(here, no?.at ?? '') }),
    told === undefined ? '' : say(asked, 'refuses/case', { input: told.input, why: told.why, at: relative(here, told.at) })].filter(Boolean);
  return said.length ? resolved(asked, [...section(asked, 'refuses'), ...said,
    ...(no?.about?.length ? ['', ...zoom(say(asked, 'refuses/full'), no.about.flatMap((line) => [line, '']).slice(0, -1))] : [])]) : [];
};
