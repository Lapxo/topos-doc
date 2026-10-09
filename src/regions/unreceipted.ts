import { counted, type Asked } from '../helpers/capsule.ts';
import { unreceipted } from '../helpers/shown.ts';

/** How many numbers and typed CLI lines a door still prints that no receipt said. Zero is the frame's default. */
export const receipt = (asked: Asked) => counted({ ...asked, region: 'door' }, 'unreceipted', unreceipted(asked), 'unreceipted');
