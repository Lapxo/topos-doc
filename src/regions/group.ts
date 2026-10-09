import { of, resolved, type Asked } from '../helpers/capsule.ts';

/** Atoms under a heading the place signs. A title is one #; other headings ##. Without a heading, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const lines = asked.lines.filter((one) => {
    const scope = of(one, 'scope');
    return (scope === `page/${asked.region}` || scope.startsWith(`page/${asked.region}/`)) && of(one, 'about') !== '' && of(one, 'value') !== 'withdraw';
  });
  if (!lines.length) return [];
  return resolved(asked, lines.map((line) => {
    const scope = of(line, 'scope');
    const mark = scope.endsWith('/title') ? '#' : '##';
    return `${mark} ${of(line, 'about')}`;
  }));
};
