import { of, resolved, type Asked } from '../helpers/capsule.ts';

/** The license a place is given under, as its line says it. */
export const render = (asked: Asked): readonly string[] => resolved(asked, asked.lines.filter((line) => of(line, 'scope') === 'license' && of(line, 'about') !== '').flatMap((line) => of(line, 'about').split('\n')));
