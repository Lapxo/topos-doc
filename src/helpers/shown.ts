import { of, receipts, type Asked } from '@lapxo/topos/capsule';
import { receiptValue } from './asked.ts';
import { prose } from './language.ts';

const NUMBER = /(?<![\w./-])\d+(?:\.\d+)?(?![\w./-])/g;
const TYPED = /^(?:# |\/\/ )(?:SAME |RECEIPTS |NEEDS |OPEN |RENDER |verbs |flags |exit )/;
const STAMP = /20\d{2}-\d{2}-\d{2}|T\d{2}:\d{2}:\d{2}|epoch=\d{9,}/;

/** Values already said by a receipt: nothing else may appear as a number or as CLI output. */
export const receipted = (asked: Asked): readonly string[] => [...receipts(asked, 'state'), ...receipts(asked, 'cases'), ...receipts(asked, 'captures'), ...receipts(asked, 'laws')]
  .flatMap((line) => [of(line, 'value'), of(line, 'scope')]).filter(Boolean);

export const captured = (asked: Asked, name: string): string | undefined => {
  const got = receiptValue(asked, 'captures', `capture/${name}`);
  return got && got !== 'none' ? got : undefined;
};

/** How many numbers and typed CLI lines a door's prose still carries that no receipt said. */
export function unreceipted(asked: Asked): number {
  const held = new Set(receipted(asked));
  const commands = prose(asked, 'commands') ?? '';
  const idea = prose(asked, 'idea') ?? '';
  const typed = commands.split('\n').filter((line) => TYPED.test(line)).length;
  const loose = [...`${idea}\n${commands}`.matchAll(NUMBER)].map((one) => one[0]).filter((n) => ![...held].some((said) => said.includes(n))).length;
  return typed + loose;
}

export const stamped = (text: string): boolean => STAMP.test(text);
export const animated = (text: string): boolean => text.includes('<animate');
