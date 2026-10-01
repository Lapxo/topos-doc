import { cellOf, figureAt, figured, folder, found, image, of, prose, relative, resolved, say, shortest, type Asked } from '../helpers/capsule.ts';
import { alphabet } from '@lapxo/topos/wire';

/** The door of a place: the figure of its shortest example, and its sentence as text with a small link to the document its docs/what line names, where it has words for that link, else the sentence as the link; its name is the hero's. */
export const render = (asked: Asked): readonly string[] => {
  const drawn = figured(asked, 'ranges', 1)[0];
  const figure = drawn === undefined ? undefined : figureAt(drawn);
  const one = figure === undefined ? undefined : shortest(asked);
  const cell = one === undefined ? undefined : cellOf(asked, one.at);
  const [what] = alphabet(of(found(asked, 'docs/what'), 'needs')).members;
  const parts = [...(figure !== undefined && cell !== undefined ? [image(asked, figure, cell)] : []),
    ...(what === undefined ? [] : [((link, words) => (words ? `${say(asked, `${asked.region}/what`)} [${words}](${link})` : `[${say(asked, `${asked.region}/what`)}](${link})`))(relative(folder(asked.shape), what), prose(asked, `${asked.region}/words`))])];
  return resolved(asked, parts.flatMap((part, i) => (i ? ['', part] : [part])));
};
