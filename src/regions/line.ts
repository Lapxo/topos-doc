import { resolved, value, type Asked } from '../helpers/capsule.ts';

/** How a world is taken in: the sources/ line the place signed, and the uses/ line when that line is not a release digest. */
export const render = (asked: Asked): readonly string[] => {
  const pin = value(asked, `sources/${asked.name}`);
  if (pin === undefined) return [];
  const uses = value(asked, `uses/${asked.name}`) ?? '';
  const shown = [pin, ...(uses && !uses.startsWith('sha256:') ? [uses] : [])];
  return resolved(asked, shown);
};
