import { alphabetForm, WideMask, type State } from '@lapxo/obligations';
import { cell, observe, state } from '@lapxo/obligations/views/field';
import { found, of, placeOf, receipts, value, type Asked, type Handed } from '@lapxo/topos/capsule';
import { byBytes, matches, steps } from '@lapxo/topos/wire';
import { numeral, receiptValue } from './asked.ts';
import { hull } from './cells.ts';
import { relative } from './prose.ts';
import { fill, prose, say } from './language.ts';

export type Example = { readonly name: string; readonly source: string; readonly printed: string; readonly at: string; readonly state: State };

/** The examples a place runs, each a cell: the line that pins it and the reader that ran it are its origins, over the ids they name. */
export const examples = (asked: Asked, at = ''): readonly Example[] => {
  const got = receipts(asked, 'examples').filter((line) => placeOf(line) === at && matches('examples/*', of(line, 'scope')));
  return [...new Set(got.map((line) => of(line, 'scope')))].map((scope) => {
    const read = (measure: string): Handed | undefined => got.find((one) => of(one, 'scope') === scope && of(one, 'measure') === measure);
    const origins = [found(asked, scope), read('id')].filter((line): line is Handed => of(line, 'value') !== '');
    const tokens = [...new Set(origins.map((line) => of(line, 'value')))];
    const met = origins.reduce((at, line) => observe(at, { origin: of(line, 'by'), span: WideMask.fromTokens(tokens, new Set([of(line, 'value')])) }), cell<WideMask>(scope));
    return { name: steps(scope)[1] ?? '', source: of(read('source'), 'value'), printed: of(read('printed'), 'value'), at: of(read('at') ?? read('leaf'), 'value'), state: state(alphabetForm.lattice({ tokens }), met) };
  });
};
export const shortest = (asked: Asked, at = ''): Example | undefined => [...examples(asked, at)].sort((a, b) => a.source.split('\n').length - b.source.split('\n').length || byBytes(a.name, b.name))[0];
export const fence = (asked: Asked, one: Example): string => receiptValue(asked, 'source', 'source/lang', one.at) ?? '';
export const run = (asked: Asked, one: Example): readonly string[] => [`\`\`\`${fence(asked, one)}`, ...one.source.trim().split('\n'), '```', '', '```', ...one.printed.split('\n'), '```'];
/** An example at a glance, as a page read at the resolution its page's form/page/learn line names shows it, else at the one asked: the command that runs it and what it printed, at one only the lines that stand alone (a line with lines indented under it is their detail, and goes with them) and no more than form/page/example lets its blocks hold, and its source behind a link; each part under the place's own caption for it where it signs one. */
export const glance = (asked: Asked, one: Example, here: string): readonly string[] => {
  const printed = one.printed.split('\n');
  const depth = (line: string): number => line.length - line.trimStart().length;
  const next = (i: number): string => printed.slice(i + 1).find((line) => line.trim()) ?? '';
  const runner = asked.lines.find((line) => matches('form/runtime/*/run', of(line, 'scope')));
  const command = runner === undefined ? '' : fill(asked, steps(of(runner, 'scope')).slice(1).join('/'), of(runner, 'value'), { at: one.at });
  const [at, most] = [((learn) => (learn === undefined ? asked.at : numeral(learn)))(value(asked, 'form/page/learn')), numeral(value(asked, 'form/page/example'))];
  const outline = printed.filter((line, i) => line.trim() && !depth(line) && !depth(next(i)));
  const [ran, fenced] = [command ? ['```bash', command, '```'] : [], (body: readonly string[]): readonly string[] => ['```', ...body, '```']];
  const shown = at > 1 ? printed : Number.isFinite(most) ? outline.slice(0, hull([0, most - ran.length - fenced([]).length]).hi) : outline;
  const part = (key: string, body: readonly string[]): readonly string[] => (body.length ? [...((said) => (said ? [said, ''] : []))(prose(asked, `figure/learn/${key}`)), ...body] : []);
  const blocks = [part('run', ran), part('printed', fenced(shown)), ((link) => (link ? [link] : []))(say(asked, 'figure/learn/source', { at: relative(here, one.at) }))];
  return blocks.filter((block) => block.length).flatMap((block, i) => (i ? ['', ...block] : block));
};
