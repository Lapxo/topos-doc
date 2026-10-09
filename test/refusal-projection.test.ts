import test from 'node:test';
import assert from 'node:assert/strict';
import { refusedCases } from '../src/helpers/refused.ts';
import type { Asked, Handed } from '@lapxo/topos/capsule';

// Contract inputs only: these are not native receipts or acceptance captures.
const input = (records: Handed[]): Asked => ({
  name: 'place', region: 'figure-refuses', at: 1, shape: 'refuses.svg', reads: [], lines: [],
  regions: { captures: { lines: [], receipts: records } },
});
const row = (measure: string, value: string, by = 'reader'): Handed => ({
  scope: 'capture/example/refused/0', measure, value, at: 'place:example', by,
});
const held = [row('input', 'an asked coordinate'), row('why', 'the declared boundary refused it')];

test('the declared captures region supplies a refusal projection', () => {
  assert.deepEqual(refusedCases(input(held)), [{ input: 'an asked coordinate', why: 'the declared boundary refused it', at: 'example', name: 'capture/example' }]);
});
test('identical observations do not duplicate a refusal', () => {
  assert.deepEqual(refusedCases(input([...held, ...held.map(r => ({ ...r, by: 'another-reader' }))])), refusedCases(input(held)));
});
test('incompatible observations refuse instead of choosing the first', () => {
  for (const records of [[...held, row('why', 'a different reading', 'another-reader')], [row('why', 'a different reading', 'another-reader'), ...held]]) {
    assert.throws(() => refusedCases(input(records)), /REFUSE·doc capture\/example\/refused\/0\/why has incompatible observations/);
  }
});
test('absence remains no refusal observation', () => {
  assert.deepEqual(refusedCases(input([])), []);
});
