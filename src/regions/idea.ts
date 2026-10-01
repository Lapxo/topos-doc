import { parted, resolved, titled, type Asked } from '../helpers/capsule.ts';

/** The idea a place carries, under its heading. */
export const render = (asked: Asked): readonly string[] => resolved(asked, titled(asked, 'idea', parted(asked, 'idea')));
