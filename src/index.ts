import{shell,receiptShell}from'@lapxo/topos/capsule';
import type{Asked}from'@lapxo/topos/capsule';
import{alphabet}from'@lapxo/topos/wire';
import * as r0 from './regions/alphabet.ts';
import * as r1 from './regions/bond.ts';
import * as r2 from './regions/cff.ts';
import * as r3 from './regions/check.ts';
import * as r4 from './regions/claims.ts';
import * as r5 from './regions/commands.ts';
import * as r6 from './regions/door.ts';
import * as r7 from './regions/unreceipted.ts';
import * as r8 from './regions/figure.ts';
import * as r9 from './regions/figure-fold.ts';
import * as r10 from './regions/figure-line.ts';
import * as r11 from './regions/figure-refuses.ts';
import * as r12 from './regions/figure-world.ts';
import * as r13 from './regions/first-use.ts';
import * as r14 from './regions/forms.ts';
import * as r15 from './regions/guide-at-zero.ts';
import * as r16 from './regions/hero.ts';
import * as r17 from './regions/how-they-rest.ts';
import * as r18 from './regions/idea.ts';
import * as r19 from './regions/install.ts';
import * as r20 from './regions/line.ts';
import * as r21 from './regions/learn.ts';
import * as r22 from './regions/license.ts';
import * as r23 from './regions/media.ts';
import * as r24 from './regions/notation.ts';
import * as r25 from './regions/open.ts';
import * as r26 from './regions/open-conjectures.ts';
import * as r27 from './regions/operations.ts';
import * as r28 from './regions/pointers.ts';
import * as r29 from './regions/ranges.ts';
import * as r30 from './regions/reading.ts';
import * as r31 from './regions/reference.ts';
import * as r32 from './regions/refuses.ts';
import * as r33 from './regions/regions.ts';
import * as r34 from './regions/rested-on-by.ts';
import * as r35 from './regions/the-object.ts';
import * as r36 from './regions/the-paper.ts';
import * as r37 from './regions/units.ts';
import * as r38 from './regions/what-holds.ts';
import * as r39 from './regions/wire.ts';
import * as r40 from './regions/say.ts';
import * as r41 from './regions/term.ts';
import * as r42 from './regions/count.ts';
import * as r43 from './regions/seq.ts';
import * as r44 from './regions/exchange.ts';
import * as r45 from './regions/set.ts';
import * as r46 from './regions/cell.ts';
import * as r47 from './regions/ref.ts';
import * as r48 from './regions/group.ts';
type Fields=Readonly<Record<string,string>>;
const provided=(asked:Asked):readonly Fields[]=>{const lines=(asked as Asked & {provider?:{lines?:readonly Fields[]}}).provider?.lines;if(lines===undefined)throw Error('REFUSE·world provider standing not handed');return lines;};
const own=(lines:readonly Fields[]):readonly Fields[]=>lines.filter(f=>['form','prose','notation'].includes((f.scope??'').split('/')[0]!));
const readsOf=(lines:readonly Fields[],name:string,role:string):readonly string[]=>lines.filter(f=>f.scope==='region/'+name&&f.role===role&&f.measure==='reads').flatMap(f=>alphabet(f.value??'').members);
export const render=(asked:Asked)=>{const lines=provided(asked);return shell({
  "alphabet":{reads:readsOf(lines,"alphabet","render"),region:(a:Asked)=>r0.render({...a,lines:[...a.lines,...own(lines)]})},
  "bond":{reads:readsOf(lines,"bond","render"),region:(a:Asked)=>r1.render({...a,lines:[...a.lines,...own(lines)]})},
  "cff":{reads:readsOf(lines,"cff","render"),region:(a:Asked)=>r2.render({...a,lines:[...a.lines,...own(lines)]})},
  "check":{reads:readsOf(lines,"check","render"),region:(a:Asked)=>r3.render({...a,lines:[...a.lines,...own(lines)]})},
  "claims":{reads:readsOf(lines,"claims","render"),region:(a:Asked)=>r4.render({...a,lines:[...a.lines,...own(lines)]})},
  "commands":{reads:readsOf(lines,"commands","render"),region:(a:Asked)=>r5.render({...a,lines:[...a.lines,...own(lines)]})},
  "door":{reads:readsOf(lines,"door","render"),region:(a:Asked)=>r6.render({...a,lines:[...a.lines,...own(lines)]})},
  "figure":{reads:readsOf(lines,"figure","render"),region:(a:Asked)=>r8.render({...a,lines:[...a.lines,...own(lines)]})},
  "figure-fold":{reads:readsOf(lines,"figure-fold","render"),region:(a:Asked)=>r9.render({...a,lines:[...a.lines,...own(lines)]})},
  "figure-line":{reads:readsOf(lines,"figure-line","render"),region:(a:Asked)=>r10.render({...a,lines:[...a.lines,...own(lines)]})},
  "figure-refuses":{reads:readsOf(lines,"figure-refuses","render"),region:(a:Asked)=>r11.render({...a,lines:[...a.lines,...own(lines)]})},
  "figure-world":{reads:readsOf(lines,"figure-world","render"),region:(a:Asked)=>r12.render({...a,lines:[...a.lines,...own(lines)]})},
  "first-use":{reads:readsOf(lines,"first-use","render"),region:(a:Asked)=>r13.render({...a,lines:[...a.lines,...own(lines)]})},
  "forms":{reads:readsOf(lines,"forms","render"),region:(a:Asked)=>r14.render({...a,lines:[...a.lines,...own(lines)]})},
  "guide-at-zero":{reads:readsOf(lines,"guide-at-zero","render"),region:(a:Asked)=>r15.render({...a,lines:[...a.lines,...own(lines)]})},
  "hero":{reads:readsOf(lines,"hero","render"),region:(a:Asked)=>r16.render({...a,lines:[...a.lines,...own(lines)]})},
  "how-they-rest":{reads:readsOf(lines,"how-they-rest","render"),region:(a:Asked)=>r17.render({...a,lines:[...a.lines,...own(lines)]})},
  "idea":{reads:readsOf(lines,"idea","render"),region:(a:Asked)=>r18.render({...a,lines:[...a.lines,...own(lines)]})},
  "install":{reads:readsOf(lines,"install","render"),region:(a:Asked)=>r19.render({...a,lines:[...a.lines,...own(lines)]})},
  "line":{reads:readsOf(lines,"line","render"),region:(a:Asked)=>r20.render({...a,lines:[...a.lines,...own(lines)]})},
  "learn":{reads:readsOf(lines,"learn","render"),region:(a:Asked)=>r21.render({...a,lines:[...a.lines,...own(lines)]})},
  "license":{reads:readsOf(lines,"license","render"),region:(a:Asked)=>r22.render({...a,lines:[...a.lines,...own(lines)]})},
  "media":{reads:readsOf(lines,"media","render"),region:(a:Asked)=>r23.render({...a,lines:[...a.lines,...own(lines)]})},
  "notation":{reads:readsOf(lines,"notation","render"),region:(a:Asked)=>r24.render({...a,lines:[...a.lines,...own(lines)]})},
  "open":{reads:readsOf(lines,"open","render"),region:(a:Asked)=>r25.render({...a,lines:[...a.lines,...own(lines)]})},
  "open-conjectures":{reads:readsOf(lines,"open-conjectures","render"),region:(a:Asked)=>r26.render({...a,lines:[...a.lines,...own(lines)]})},
  "operations":{reads:readsOf(lines,"operations","render"),region:(a:Asked)=>r27.render({...a,lines:[...a.lines,...own(lines)]})},
  "pointers":{reads:readsOf(lines,"pointers","render"),region:(a:Asked)=>r28.render({...a,lines:[...a.lines,...own(lines)]})},
  "ranges":{reads:readsOf(lines,"ranges","render"),region:(a:Asked)=>r29.render({...a,lines:[...a.lines,...own(lines)]})},
  "reading":{reads:readsOf(lines,"reading","render"),region:(a:Asked)=>r30.render({...a,lines:[...a.lines,...own(lines)]})},
  "reference":{reads:readsOf(lines,"reference","render"),region:(a:Asked)=>r31.render({...a,lines:[...a.lines,...own(lines)]})},
  "refuses":{reads:readsOf(lines,"refuses","render"),region:(a:Asked)=>r32.render({...a,lines:[...a.lines,...own(lines)]})},
  "regions":{reads:readsOf(lines,"regions","render"),region:(a:Asked)=>r33.render({...a,lines:[...a.lines,...own(lines)]})},
  "rested-on-by":{reads:readsOf(lines,"rested-on-by","render"),region:(a:Asked)=>r34.render({...a,lines:[...a.lines,...own(lines)]})},
  "the-object":{reads:readsOf(lines,"the-object","render"),region:(a:Asked)=>r35.render({...a,lines:[...a.lines,...own(lines)]})},
  "the-paper":{reads:readsOf(lines,"the-paper","render"),region:(a:Asked)=>r36.render({...a,lines:[...a.lines,...own(lines)]})},
  "units":{reads:readsOf(lines,"units","render"),region:(a:Asked)=>r37.render({...a,lines:[...a.lines,...own(lines)]})},
  "what-holds":{reads:readsOf(lines,"what-holds","render"),region:(a:Asked)=>r38.render({...a,lines:[...a.lines,...own(lines)]})},
  "wire":{reads:readsOf(lines,"wire","render"),region:(a:Asked)=>r39.render({...a,lines:[...a.lines,...own(lines)]})},
  "say":{reads:readsOf(lines,"say","render"),region:(a:Asked)=>r40.render({...a,lines:[...a.lines,...own(lines)]})},
  "term":{reads:readsOf(lines,"term","render"),region:(a:Asked)=>r41.render({...a,lines:[...a.lines,...own(lines)]})},
  "count":{reads:readsOf(lines,"count","render"),region:(a:Asked)=>r42.render({...a,lines:[...a.lines,...own(lines)]})},
  "seq":{reads:readsOf(lines,"seq","render"),region:(a:Asked)=>r43.render({...a,lines:[...a.lines,...own(lines)]})},
  "exchange":{reads:readsOf(lines,"exchange","render"),region:(a:Asked)=>r44.render({...a,lines:[...a.lines,...own(lines)]})},
  "set":{reads:readsOf(lines,"set","render"),region:(a:Asked)=>r45.render({...a,lines:[...a.lines,...own(lines)]})},
  "cell":{reads:readsOf(lines,"cell","render"),region:(a:Asked)=>r46.render({...a,lines:[...a.lines,...own(lines)]})},
  "ref":{reads:readsOf(lines,"ref","render"),region:(a:Asked)=>r47.render({...a,lines:[...a.lines,...own(lines)]})},
  "group":{reads:readsOf(lines,"group","render"),region:(a:Asked)=>r48.render({...a,lines:[...a.lines,...own(lines)]})},
})(asked);};
export const receipt=(asked:Asked)=>{const lines=provided(asked);return receiptShell({
  "unreceipted":{reads:readsOf(lines,"unreceipted","receipt"),region:(a:Asked)=>r7.receipt({...a,lines:[...a.lines,...own(lines)]})},
})(asked);};

export { observe } from './sample-lines.ts';
