import { cellText, of, receiptValue, resolved, section, type Asked } from '../helpers/capsule.ts';
import { alphabet } from '@lapxo/topos/wire';

/** Members with the same parts, drawn as a table. Without a receipt that names them, nothing. */
export const render = (asked: Asked): readonly string[] => {
  const pins = alphabet(receiptValue(asked, 'rests', 'rests-on/pins') ?? '').members.filter((one) => one !== 'none');
  const fromUses = asked.lines.filter((one) => of(one, 'scope').startsWith('uses/') && of(one, 'value') !== 'withdraw').map((one) => of(one, 'scope').slice('uses/'.length).split('/')[0] ?? '').filter(Boolean);
  const regions = alphabet(receiptValue(asked, 'rests', 'rests-on/regions') ?? '').members.filter((one) => one !== 'none');
  const pinsHeld = [...new Set([...pins, ...fromUses])];
  const members = [...pinsHeld.map((name) => ({ kind: 'pin', name })), ...regions.map((name) => ({ kind: 'region', name }))];
  if (!members.length) return [];
  return resolved(asked, [
    ...section(asked, 'set'),
    '| | |',
    '|---|---|',
    ...members.map((one) => `| ${cellText(one.kind)} | ${cellText(one.name)} |`),
  ]);
};
