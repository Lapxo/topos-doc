import { of, value, type Asked } from '@lapxo/topos/capsule';
import { numeral } from './asked.ts';
import { escaped } from './prose.ts';

type Said = Readonly<Record<string, string | undefined>>;
const stands = (said: Said): readonly (readonly [string, string])[] => Object.entries(said).filter((pair): pair is [string, string] => Boolean(pair[1]));

/** The look a place is handed: its form/style/<key> line, or nothing where it holds none. */
export const look = (asked: Asked, key: string): string | undefined => value(asked, `form/style/${key}`);
/** One figure's spacing and timing: each form/style/<figure>/<name> line as a number under its name; one it holds no line for is no number. */
export const spacing = (asked: Asked, figure: string): Readonly<Record<string, number>> => Object.fromEntries(asked.lines.filter((line) => of(line, 'scope').startsWith(`form/style/${figure}/`))
  .map((line) => [of(line, 'scope').slice(`form/style/${figure}/`.length), numeral(of(line, 'value'))]));
/** Attributes and style rules written only for what stands: a missing line renders without its attribute, never with a value of the world's own; a number that is none is no attribute. */
export const attrs = (said: Said): string => stands(said).map(([k, v]) => ` ${k}="${escaped(v)}"`).join('');
export const css = (rules: readonly (readonly [string, Said])[]): string => rules.map(([at, said]) => [at, stands(said).map(([k, v]) => `${k}:${v}`).join(';')] as const).filter(([, body]) => body).map(([at, body]) => `${at}{${body}}`).join('');
export const between = (v: number, [a, b]: readonly [number, number], [c, d]: readonly [number, number]): number => c + ((v - a) / (b - a)) * (d - c);
export const px = (n: number): string | undefined => (Number.isFinite(n) ? String(numeral(n.toFixed(1))) : undefined);
export const secs = (n: number): string | undefined => (Number.isFinite(n) ? `${n.toFixed(1)}s` : undefined);
export const font = (asked: Asked, family: string, size: string): Said => ((face, at) => (face && at ? { font: `${at} ${face}` } : { 'font-family': face, 'font-size': at }))(look(asked, `font/${family}`), look(asked, `size/${size}`));
export const style = (light: readonly string[], night: string): readonly string[] => ((lit) => (lit.length || night ? ['<style>', ...lit, ...(night ? [`@media (prefers-color-scheme:dark){${night}}`] : []), '</style>'] : []))(light.filter(Boolean));
export const classDef = (name: string, fill: string | undefined, text: string | undefined): readonly string[] => ((said) => (said ? [`  classDef ${name} ${said}`] : []))([fill && `fill:${fill}`, text && `color:${text}`, fill && `stroke:${fill}`].filter(Boolean).join(','));
