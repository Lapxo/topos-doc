import { lang, value, type Asked } from '@lapxo/topos/capsule';
import { steps } from '@lapxo/topos/wire';
import { numeral, pairs, type Render } from './asked.ts';
import { look } from './look.ts';
import { rule } from './language.ts';

export const zoom = (summary: string, lines: readonly string[]): readonly string[] => (lines.length ? [`<details><summary>${summary}</summary>`, '', ...lines, '', '</details>'] : []);
const inCell: ReadonlyMap<string, string> = new Map([['|', '\\|']]);
export const cellText = (text: string): string => [...text].map((one) => inCell.get(one) ?? one).join('').split('\n').join(' ').split(' ').filter(Boolean).join(' ');
export const escaped = (text: string): string => text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
export const folder = (at: string): string => steps(steps(at).slice(0, -1));
export const reaches = (asked: Asked, key: string): boolean => asked.at >= numeral(value(asked, `form/page/${key}`));
export const stem = (at: string): string => {
  const name = at.slice(at.lastIndexOf('/') + 1);
  return name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
};
/** The way from the directory of one `at` to another, step by step: up to what they share, then down. */
export const relative = (from: string, to: string): string => {
  const [a, b] = [steps(from).filter(Boolean), steps(to).filter(Boolean)];
  const differ = a.findIndex((step, i) => step !== b[i]);
  const shared = differ < 0 ? a.length : differ;
  return steps([...a.slice(shared).map(() => '..'), ...b.slice(shared)]);
};
export const painted = (asked: Asked, name: string): Render => ({ name, colour: look(asked, `colour/${name}`), glyph: look(asked, `glyph/${name}`) });
export const glyph = (asked: Asked, name: string): string => pairs(asked, 'notation/glue').find(([one]) => one === name)?.[1] ?? '';
export const states = (asked: Asked): readonly Render[] => pairs(asked, 'notation/renders').map(([state, name]) => ({ ...painted(asked, state), name }));
export const rendered = (asked: Asked, state: string): Render => ({ ...painted(asked, state), name: pairs(asked, 'notation/renders').find(([one]) => one === state)?.[1] ?? state });

/**
 * A region answered at the resolution asked: its head alone at zero, and the first steps of each line of its block below
 * three, the steps cut where the language's separator stands; a cut the language names no separator for is refused. A
 * region with no block keeps its heading and its lead paragraph below two, so a figure, one paragraph, is never cut.
 */
export const resolved = (asked: Asked, body: readonly string[]): readonly string[] => {
  if (reaches(asked, 'statement') || !body.length) return body;
  const head = body.findIndex((line) => line.startsWith('```'));
  if (head < 0) return asked.at > 1 ? body : ((lead) => (lead < 0 ? body : body.slice(0, lead)))(body.findIndex((line, i) => i > 1 && line === '' && body[i - 1] !== ''));
  const lines = body.slice(head + 1, body.lastIndexOf('```'));
  if (asked.at <= 1) return [...body.slice(0, head + 1), ...lines.slice(0, 1), '```'];
  const [cut] = rule(asked, 'separator');
  if (cut === undefined) throw new Error(`REFUSE·resolution ${asked.region}@${asked.at}: form/prose/${lang(asked)}/separator names no separator to cut its steps at`);
  return [...body.slice(0, head + 1), ...lines.map((line) => line.split(cut).slice(0, asked.at).join(cut)), '```'];
};
