import { of, prose, resolved, type Asked } from '../helpers/capsule.ts';
import { alphabet } from '@lapxo/topos/wire';

/** Atoms in order: the page/seq lines the place signed, else a walk from path/steps. Without either, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const lines = asked.lines.filter((one) => of(one, 'scope').startsWith(`page/${asked.region}/`) && of(one, 'about') !== '' && of(one, 'value') !== 'withdraw' && !of(one, 'scope').endsWith('/heading'));
  const steps = lines.length
    ? lines.map((one) => of(one, 'about'))
    : alphabet(of(asked.regions['path']?.receipts.find((line) => of(line, 'scope') === 'path/steps') ?? {}, 'value')).members.filter((one) => one !== 'none');
  if (!steps.length) return [];
  const heading = of(asked.lines.find((one) => of(one, 'scope') === `page/${asked.region}/heading`), 'about') || prose(asked, 'seq/heading');
  return resolved(asked, [...(heading ? [`## ${heading}`, ''] : []), ...steps.map((step, i) => `${i + 1}. ${step}`)]);
};
