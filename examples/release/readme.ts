// A place's README asked of this world through the one contract: its own lock as it stands, the regions a view names read
// from their own files by role as a host reads them, and the page they write from the place's lines alone.
import { readFileSync } from 'node:fs';
import { declarationOf, shell } from '@lapxo/topos/capsule';
import { answer } from '@lapxo/topos/contract';
import { PROTOCOL } from '@lapxo/topos/wire';

const lock = readFileSync(new URL('../../capsule.bound', import.meta.url), 'utf8').split('\n').filter((line) => line.startsWith('bound-lock/1'));
const { regions } = declarationOf(lock);
const view = ['idea', 'install'];
const render = shell(Object.fromEntries(await Promise.all(view.map(async (name) => [name, { reads: regions[name] ?? [], region: (await import(`../../src/regions/${name}.ts`)).render }] as const))));
const lines = [
  'bound-lock/1 at=policy:acme/words by=target form=alphabet measure=id role=writes scope=lang value=en',
  'bound-lock/1 at=policy:acme/look by=target form=alphabet measure=id role=writes scope=form/page/statement value=3',
  'bound-lock/1 at=policy:acme/words by=target form=alphabet measure=id role=writes scope=name value=@acme/gauge',
  'bound-lock/1 at=policy:acme/words by=target form=alphabet measure=id role=writes scope=install value="npm install"',
  'bound-lock/1 about="A gauge that says where its readings meet." at=policy:acme/words by=target form=alphabet measure=text role=writes scope=prose/en/idea value=lock',
  'bound-lock/1 about="What it is" at=policy:acme/words by=target form=alphabet measure=text role=writes scope=prose/en/idea/heading value=lock',
];
const page = view.flatMap((region) => ((got) => (got.kind === 'fact' ? [...got.lines, ''] : [got.why]))(
  answer({ render }, { protocol: PROTOCOL, verb: 'render', rootScope: '', files: [], lines, region, at: 3, shape: 'README.md', name: 'acme', reads: regions[region] ?? [] }, '') as { kind: string; lines: string[]; why: string }));

for (const line of lock.filter((one) => / scope=capsule\//.test(one))) console.log(line);
console.log(page.join('\n'));
