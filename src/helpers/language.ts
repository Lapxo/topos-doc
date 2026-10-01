import { found, lang, listed, of, type Asked } from '@lapxo/topos/capsule';

type Fields = Readonly<Record<string, string | number>>;

/** A rule of the place's language: the tokens its form says of one kind of text. */
export const rule = (asked: Asked, name: string): readonly string[] => listed(asked, `form/prose/${lang(asked)}/${name}`);
const upper = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
export const words = (asked: Asked, slug: string): string => (rule(asked, 'words').includes('spaces') ? slug.split('-').join(' ') : slug);
export const heading = (asked: Asked, slug: string): string => (rule(asked, 'heading').includes('capital') ? upper(words(asked, slug)) : words(asked, slug));
export const count = (asked: Asked, n: number, first = false): string => {
  const word = rule(asked, 'numbers')[n] ?? String(n);
  return first && rule(asked, 'sentence').includes('capital') ? upper(word) : word;
};
export const listOf = (asked: Asked, items: readonly string[]): string => {
  const [comma = ', ', and = ' and '] = rule(asked, 'list');
  return items.length > 1 ? `${items.slice(0, -1).join(comma)}${and}${items[items.length - 1]}` : items.join('');
};
export const stated = (asked: Asked, state: string): string => rule(asked, `state/${state}`)[0] ?? '';
/** What the place's language says under one key: its own prose line, else the page word every world shares under form/prose/<lang>/page/, else nothing. fill writes into a text the fields its key's form/template line names, and nothing else; say fills the prose. */
export const prose = (asked: Asked, key: string): string | undefined => ((line) => (line === undefined ? undefined : of(line, 'about')))(found(asked, `prose/${lang(asked)}/${key}`) ?? found(asked, `form/prose/${lang(asked)}/page/${key}`));
export const fill = (asked: Asked, key: string, text: string, fields: Fields = {}): string => listed(asked, `form/template/${key}`).reduce((said, field) => said.split(`{${field}}`).join(String(fields[field] ?? '')), text);
export const say = (asked: Asked, key: string, fields: Fields = {}): string => fill(asked, key, prose(asked, key) ?? '', fields);
/** A text as the language writes a sentence: its trailing marks cut, capital first and a period last where its rule says so. */
export const sentence = (asked: Asked, text: string): string => {
  const said = rule(asked, 'sentence');
  let end = text.length;
  while (end > 0 && '.;:, \n'.includes(text.charAt(end - 1))) end -= 1;
  const start = said.includes('capital') ? `${text.charAt(0).toUpperCase()}${text.slice(1, end)}` : text.slice(0, end);
  return said.includes('period') ? `${start}.` : start;
};
export const parted = (asked: Asked, key: string): readonly string[] => ((said) => (said === undefined ? [] : [said.trim()]))(prose(asked, key));
export const section = (asked: Asked, key: string): readonly string[] => ((said) => (said ? [`## ${said}`, ''] : []))(prose(asked, `${key}/heading`));
export const titled = (asked: Asked, key: string, parts: readonly string[]): readonly string[] => (parts.length
  ? [...section(asked, key), ...parts.flatMap((part) => [part, ''])].slice(0, -1) : []);
