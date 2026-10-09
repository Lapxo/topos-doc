import { of, resolved, sentence, type Asked } from '../helpers/capsule.ts';

/** One sentence, carrying the strength of the line that said it: exact, sample or declared. Without a line, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const lines = asked.lines.filter((one) => {
    const scope = of(one, 'scope');
    return (scope === `page/${asked.region}` || scope.startsWith(`page/${asked.region}/`)) && of(one, 'value') !== 'withdraw' && of(one, 'about') !== '';
  });
  if (!lines.length) return [];
  const out: string[] = [];
  let heading = '';
  for (const line of lines) {
    const cap = of(line, 'shape');
    if (cap && cap !== heading && !cap.includes('.')) {
      heading = cap;
      out.push(`## ${cap}`, '');
    }
    const strength = of(line, 'kind') || 'declared';
    out.push(`${sentence(asked, of(line, 'about'))} · ${strength}`);
  }
  return resolved(asked, out);
};
