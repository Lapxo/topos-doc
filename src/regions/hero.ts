import { attrs, entries, found, listed, look, numeral, of, prose, receiptValue, say, sentence, states, value, type Asked, type Render } from '../helpers/capsule.ts';

/** The badges a place wears, in the order its own docs/badges line names them, else the order every world's audit/wire/badges/world default names: each a value, a count or a receipt of the place. */
const badges = (asked: Asked): readonly string[] => {
  const [held, alone] = states(asked);
  const part = (text: string): string => encodeURIComponent(text.split('-').join('--').split('_').join('__').split(' ').join('_'));
  const shield = (label: string, message: string, colour: Render | undefined): string => `![${label} ${message}](${value(asked, 'sources/badges') ?? ''}/${part(label)}-${part(message)}-${(colour?.colour ?? '').slice(1)})`;
  const [cases, depends, verdict] = [((held) => (held === undefined ? 0 : numeral(held)))(receiptValue(asked, 'cases', 'cases/held')), listed(asked, 'dependencies').length, receiptValue(asked, 'state', 'second/verdict') ?? 'none'];
  const doi = entries(asked, 'cites').map((one) => (value(asked, 'sources/doi') === undefined ? undefined : one.field('doi'))).find(Boolean);
  const valued = (key: string): readonly string[] => ((said) => (said === undefined ? [] : [shield(say(asked, `badge/${key}`), said, alone)]))(value(asked, key));
  const drawn: Readonly<Record<string, () => readonly string[]>> = {
    dependencies: () => [shield(say(asked, 'badge/dependencies'), String(depends), depends ? alone : held)],
    cases: () => [shield(say(asked, 'badge/cases'), say(asked, 'badge/held', { count: cases }), cases ? held : alone)],
    verify: () => [shield(say(asked, 'badge/verify'), verdict, verdict === 'agrees' ? held : alone)],
    doi: () => (doi === undefined ? [] : [`[${shield(say(asked, 'badge/doi'), doi, alone)}](${value(asked, 'sources/doi') ?? ''}${doi})`]),
  };
  return [(found(asked, 'docs/badges') === undefined ? listed(asked, 'audit/wire/badges/world') : listed(asked, 'docs/badges')).flatMap((name) => (drawn[name] ?? (() => valued(name)))()).join(' ')];
};

/** The head of a place's page: its logo, its name, its badges and what it is, its docs/tagline line's words where it has one, as a sentence of its language. */
export const render = (asked: Asked): readonly string[] => [
  ...((logo) => (logo === undefined ? [] : [`<p${attrs({ align: look(asked, 'align/figure') })}><img src="${logo}" alt=""${attrs({ width: look(asked, 'width/logo') })}></p>`, '']))(value(asked, 'docs/logo')),
  `# ${value(asked, 'name') ?? asked.name}`, '', ...badges(asked), ...((what) => (what === undefined ? [] : ['', sentence(asked, what)]))(of(found(asked, 'docs/tagline'), 'about') || prose(asked, 'what'))];
