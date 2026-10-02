import { found, resolved, value, type Asked } from '../helpers/capsule.ts';
import { render as line } from './line.ts';

/** How a place is taken in: a world by the two lines that pin it; a package by its installer and its name. */
export const render = (asked: Asked): readonly string[] => {
  if (found(asked, `uses/${asked.name}`) !== undefined || found(asked, `sources/${asked.name}`) !== undefined) return line(asked);
  const [how, name] = [value(asked, 'install'), value(asked, 'name')];
  return resolved(asked, how === undefined || name === undefined ? [] : ['```bash', `${how} ${name}`, '```']);
};
