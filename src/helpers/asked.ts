import { of, placeOf, receipts, value, type Asked, type Handed } from '@lapxo/topos/capsule';
import { canonical, fields, fromLine } from '@lapxo/topos/wire';

export type Render = { readonly name: string; readonly colour?: string; readonly glyph?: string };
export const pairs = (asked: Asked, scope: string): readonly (readonly [string, string])[] => fields(value(asked, scope) ?? '');
export const receiptLine = (asked: Asked, region: string, scope: string, place?: string, measure?: string): Handed | undefined => receipts(asked, region)
  .find((line) => of(line, 'scope') === scope && (place === undefined || placeOf(line) === place) && (measure === undefined || of(line, 'measure') === measure));
export const receiptValue = (asked: Asked, region: string, scope: string, place?: string, measure?: string): string | undefined =>
  ((line) => (line === undefined ? undefined : of(line, 'value')))(receiptLine(asked, region, scope, place, measure));
/** A number a value says, read through the wire as the frame reads its counts: an interval by its low end, one number as the interval it alone spans, and none where the wire reads no number. */
export const numeral = (said: string | undefined): number => {
  const read = (value: string): number | undefined => {
    try {
      const got = fromLine(canonical({ at: 'place:numeral', by: 'reader', form: 'interval', measure: 'count', role: 'reads', scope: 'numeral', value }), null);
      return got.kind === 'fact' && got.value.bound.kind === 'interval' ? got.value.bound.lo ?? undefined : undefined;
    } catch {
      return undefined;
    }
  };
  return said === undefined ? NaN : read(said) ?? read(`${said}..${said}`) ?? NaN;
};
