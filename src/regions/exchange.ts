import { examples, glance, folder, of, resolved, section, type Asked } from '../helpers/capsule.ts';

/** What was said and what came back: each example is one exchange. Without an example receipt or a page/exchange line, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const held = examples(asked);
  const said = asked.lines.filter((one) => of(one, 'scope').startsWith(`page/${asked.region}/`) && of(one, 'about') !== '' && of(one, 'value') !== 'withdraw' && !of(one, 'scope').endsWith('/heading'));
  if (!held.length && !said.length) return [];
  const heading = of(asked.lines.find((one) => of(one, 'scope') === `page/${asked.region}/heading`), 'about');
  return resolved(asked, [
    ...(heading ? [`## ${heading}`, ''] : section(asked, 'exchange')),
    ...held.flatMap((one, i) => [...(i ? [''] : []), ...glance(asked, one, folder(asked.shape))]),
    ...said.map((one) => of(one, 'about')),
  ]);
};
