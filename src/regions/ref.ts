import { of, relative, resolved, folder, type Asked } from '../helpers/capsule.ts';

/** A pointer to another place or view. Without a shape, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const views = asked.lines.filter((line) => of(line, 'scope').startsWith('view/') && of(line, 'shape').endsWith('.md'));
  const here = folder(asked.shape);
  const links = views.map((line) => {
    const at = of(line, 'shape');
    const title = of(line, 'shape').replace(/^.*\//, '').replace(/\.md$/, '') || of(line, 'scope').slice('view/'.length);
    return `- [${title}](${relative(here, at)})`;
  });
  return links.length ? resolved(asked, links) : [];
};
