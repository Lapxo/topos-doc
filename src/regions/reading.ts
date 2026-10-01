import { listed, of, placeOf, receipts, say, stem, titled, type Asked } from '../helpers/capsule.ts';
import { steps } from '@lapxo/topos/wire';

/** How a place is read, every line shown: each of its views, named by its module's stem or, where two modules share one, by the step that holds it, and the question the language of its code says it answers, in the order its docs/reading line names and otherwise as its receipts come, never by their letters. */
export const render = (asked: Asked): readonly string[] => {
  const rows = receipts(asked, 'source').filter((line) => of(line, 'scope') === 'source/answers');
  const named = (at: string): string => (rows.filter((one) => stem(placeOf(one)) === stem(at)).length > 1 ? (([last, parent = last]) => parent)([...steps(at)].reverse()) ?? stem(at) : stem(at));
  const order = listed(asked, 'docs/reading');
  const rank = (name: string): number => ((at) => (at < 0 ? order.length : at))(order.indexOf(name));
  const answered = rows.map((line) => [named(placeOf(line)), of(line, 'value')] as const)
    .sort((a, b) => rank(a[0]) - rank(b[0])).map(([name, answer]) => say(asked, 'reading/view', { name, answer })).filter(Boolean).map((one) => `- ${one}`);
  return answered.length ? [...titled(asked, 'reading', [say(asked, 'reading/lead')]), '', ...answered] : [];
};
