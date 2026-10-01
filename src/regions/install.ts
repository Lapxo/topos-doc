import { found, of, resolved, value, type Asked } from '../helpers/capsule.ts';

/** How a place is taken in: a world by the one line that pins it, as its own lock pins it; anything else by its installer and its name, as one command. */
export const render = (asked: Asked): readonly string[] => {
  const [pin, how, name] = [found(asked, `uses/${asked.name}`), value(asked, 'install'), value(asked, 'name')];
  return resolved(asked, pin !== undefined ? ['```text', `${of(pin, 'scope')} ${of(pin, 'value')}`, '```'] : how === undefined || name === undefined ? [] : ['```bash', `${how} ${name}`, '```']);
};
