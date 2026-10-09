import { of, resolved, type Asked } from '../helpers/capsule.ts';

/** Values of the receipt scopes the page names, preserving their measured bounds. */
export const render = (asked: Asked): readonly string[] => {
  const receipts = Object.values(asked.regions).flatMap((region) => region.receipts);
  const named = asked.lines.filter((one) => of(one, 'scope').startsWith(`page/${asked.region}/`) && of(one, 'value') !== 'withdraw')
    .flatMap((one) => {
      const scope = of(one, 'scope').slice(`page/${asked.region}/`.length);
      const matches = receipts.filter((line) => of(line, 'scope') === scope);
      if (matches.length !== 1) return [];
      const got = of(matches[0], 'value');
      return got ? [`${of(one, 'about') || scope} ${got}`] : [];
    });
  return resolved(asked, named);
};
