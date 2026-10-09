import { attrs, entries, found, listed, look, of, prose, receiptValue, say, sentence, states, value, type Asked, type Render } from '../helpers/capsule.ts';
import { canonical, fromLine } from '@lapxo/topos/wire';

/** The badges a place wears, in the order its own docs/badges line names them, else the order every world's wire/badges/world default names: each a value, a count or a receipt of the place. */
const badges = (asked: Asked): readonly string[] => {
  const [held, alone] = states(asked);
  const part = (text: string): string => encodeURIComponent(text.split('-').join('--').split('_').join('__').split(' ').join('_'));
  const shield = (label: string, message: string, colour: Render | undefined): string => `![${label} ${message}](${value(asked, 'sources/badges') ?? ''}/${part(label)}-${part(message)}-${(colour?.colour ?? '').slice(1)})`;
  const measured = (region: string, scope: string): number | undefined => {
    const said = receiptValue(asked, region, scope);
    if (said === undefined) return undefined;
    for (const text of [said, `${said}..${said}`]) {
      try {
        const got = fromLine(canonical({ at: 'place:badge', by: 'reader', form: 'interval', measure: 'count', role: 'reads', scope, value: text }), null);
        if (got.kind !== 'fact' || got.value.bound.kind !== 'interval') continue;
        const { lo, hi } = got.value.bound;
        if (lo !== null && lo === hi && Number.isFinite(lo)) return lo;
      } catch {
        // Invalid or uncertain evidence supplies no exact count.
      }
    }
    return undefined;
  };
  const cases = measured('cases', 'cases/held');
  const depends = found(asked, 'dependencies') === undefined ? undefined : listed(asked, 'dependencies').length;
  const verdict = receiptValue(asked, 'state', 'second/verdict');
  const doi = entries(asked, 'cites').map((one) => (value(asked, 'sources/doi') === undefined ? undefined : one.field('doi'))).find(Boolean);
  const valued = (key: string): readonly string[] => {
    const said = value(asked, key);
    if (said === undefined) return [];
    const label = say(asked, `badge/${key}`) || key;
    const message = said === label || said.startsWith(`${label} `) ? said.slice(label.length).trim() : said;
    return message === '' ? [] : [shield(label, message, alone)];
  };
  const n = (scope: string): number | undefined => measured('state', scope);
  const digest = receiptValue(asked, 'state', 'release/digest') ?? '';
  const lawCounts = ['verdict/met', 'verdict/short', 'verdict/over', 'verdict/refused', 'verdict/forks'].map(n);
  const complete = verdict !== undefined && lawCounts.every((one): one is number => one !== undefined);
  const broken = !complete || lawCounts.slice(1).some((one) => one !== 0) || verdict !== 'agrees';
  const drawn: Readonly<Record<string, () => readonly string[]>> = {
    dependencies: () => depends === undefined ? [] : [shield(say(asked, 'badge/dependencies'), String(depends), depends ? alone : held)],
    cases: () => (cases !== undefined ? [shield(say(asked, 'badge/cases'), say(asked, 'badge/held', { count: cases }), held)] : []),
    verify: () => verdict === undefined ? [] : [shield(say(asked, 'badge/verify') || 'verify', verdict, verdict === 'agrees' ? held : alone)],
    doi: () => (doi === undefined ? [] : [`[${shield(say(asked, 'badge/doi'), doi, alone)}](${value(asked, 'sources/doi') ?? ''}${doi})`]),
    release: () => (digest ? [shield(say(asked, 'badge/release') || 'release', digest.replace(/^[^:]*:/, '').slice(0, 12), held)] : []),
    claims: () => ((c) => (c !== undefined ? [shield(say(asked, 'badge/claims') || 'claims', String(c), held)] : []))(n('verdict/claims')),
    second: () => ((c) => c === undefined ? [] : [shield(say(asked, 'badge/second') || 'second', String(c), verdict === 'agrees' ? held : alone)])(n('verdict/met')),
    laws: () => complete ? [shield(say(asked, 'badge/laws') || 'laws', `${lawCounts[0]}/${lawCounts.slice(0, 4).reduce((sum, one) => sum + (one ?? 0), 0)}`, broken ? alone : held)] : [],
  };
  const named = found(asked, 'docs/badges') !== undefined ? listed(asked, 'docs/badges')
    : (listed(asked, 'wire/badges/world').length ? listed(asked, 'wire/badges/world') : listed(asked, 'audit/wire/badges/world'));
  return [named.flatMap((name) => (drawn[name] ?? (() => valued(name)))()).join(' ')];
};

/** The head of a place's page: its logo, its name, its badges and what it is, its docs/tagline line's words where it has one, as a sentence of its language. */
export const render = (asked: Asked): readonly string[] => [
  ...((logo) => (logo === undefined ? [] : [`<p${attrs({ align: look(asked, 'align/figure') })}><img src="${logo}" alt=""${attrs({ width: look(asked, 'width/logo') })}></p>`, '']))(value(asked, 'docs/logo')),
  `# ${value(asked, 'name') ?? asked.name}`, '', ...badges(asked), ...((what) => (what === undefined ? [] : ['', sentence(asked, what)]))(of(found(asked, 'docs/tagline'), 'about') || prose(asked, 'what'))];
