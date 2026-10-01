import { of, type Asked, type Handed } from '@lapxo/topos/capsule';
import { alphabet, atResolution } from '@lapxo/topos/wire';
import { escaped, folder, relative } from './prose.ts';
import { section } from './language.ts';
import { attrs, look } from './look.ts';

export const figured = (asked: Asked, region: string, at: number): readonly Handed[] => asked.lines.filter((line) => of(line, 'scope').startsWith('view/') && ((members) => members.length === 1 && members.some((token) => ((read) => read.name === region && read.at === at)(atResolution(token))))(alphabet(of(line, 'value')).members));
export const figureAt = (line: Handed): string | undefined => of(line, 'shape') || undefined;
/** A figure on any page: its drawing on the page the view that draws it alone, at one, writes; anywhere else that page's image, under the heading its place signs for it where it signs one and with its caption beneath; and nothing where it has nothing to draw: no sample, no figure, no heading and no caption. */
export const drawn = (asked: Asked, drawing: readonly string[], alt: string, key = '', beneath: readonly string[] = []): readonly string[] => ((at) => (!drawing.length || at === undefined ? [] : asked.shape === at ? drawing
  : [...(key ? section(asked, key) : []), `<p${attrs({ align: look(asked, 'align/figure') })}><img src="${relative(folder(asked.shape), at)}" alt="${escaped(alt)}"${attrs({ width: look(asked, 'width/figure') })}></p>`,
    ...(beneath.length ? ['', ...beneath] : [])]))(figured(asked, asked.region, 1).map(figureAt).find(Boolean));

