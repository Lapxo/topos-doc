import { found, of, resolved, type Asked } from '../helpers/capsule.ts';

/** A word and what it means, from the place's own line for that word. Without a line, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const line = asked.lines.find((one) => of(one, 'scope').startsWith('term/') && of(one, 'value') !== 'withdraw')
    ?? found(asked, `term/${asked.region}`) ?? found(asked, 'notation/object');
  const word = of(line, 'value');
  const meaning = of(line, 'about');
  return !word && !meaning ? [] : resolved(asked, [`**${word}**${meaning ? ` — ${meaning}` : ''}`]);
};
