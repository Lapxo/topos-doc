import { heading, of, receipts, resolved, say, section, stem, words, type Asked } from '../helpers/capsule.ts';
import { alphabet, atResolution, byBytes } from '@lapxo/topos/wire';

/** Where the rest of a place is read: every page one of its views has written, the learning pages together. */
export const render = (asked: Asked): readonly string[] => {
  const written = new Set(receipts(asked, 'state').filter((one) => of(one, 'measure') === 'fact' && of(one, 'value') === 'present').map((one) => of(one, 'scope').slice(of(one, 'scope').indexOf('/') + 1)));
  const views = asked.lines.filter((line) => of(line, 'scope').startsWith('view/') && of(line, 'role') === 'demands');
  const pages = [...new Map(views.filter((view) => of(view, 'shape').endsWith('.md') && of(view, 'shape').includes('/') && written.has(of(view, 'shape'))).map((view) => [of(view, 'shape'), view])).values()];
  const learn = pages.filter((view) => alphabet(of(view, 'value')).members.some((token) => atResolution(token).name === 'learn')).sort((a, b) => byBytes(of(a, 'shape'), of(b, 'shape')));
  const rest = pages.filter((view) => !learn.includes(view)).map((view) => [heading(asked, stem(of(view, 'shape')).toLowerCase()), of(view, 'shape')] as const).sort((a, b) => byBytes(a[0], b[0]));
  const bullets = [...rest.map(([title, shape]) => `- [${title}](${shape})`),
    ...(learn.length ? [`- ${say(asked, 'pointers/learn', { pages: learn.map((view) => `[${words(asked, stem(of(view, 'shape')))}](${of(view, 'shape')})`).join(', ') })}`] : [])];
  return resolved(asked, bullets.length ? [...section(asked, 'pointers'), ...bullets] : []);
};
