import { found, resolved, value, type Asked } from '../helpers/capsule.ts';

/** How a world is taken in today: two lock lines, the releases URL its sources/ line names, and the fetch until the host resolves sources itself. */
export const render = (asked: Asked): readonly string[] => {
  const world = asked.name;
  const pin = value(asked, `sources/${world}`) ?? (found(asked, `uses/${world}`) === undefined ? undefined : `github:Lapxo/${world}`);
  const named = (pin ?? `github:Lapxo/${world}`).split(/\s+/)[0] ?? `github:Lapxo/${world}`;
  const repo = named.startsWith('github:') ? named.slice('github:'.length) : named.startsWith('https://github.com/') ? named.slice('https://github.com/'.length).replace(/\/releases\/?$/, '') : '';
  const url = repo ? `https://github.com/${repo}/releases` : '';
  const open = found(asked, 'host/resolve') === undefined;
  const lines = [`sources/${world} value=${named}`, `uses/${world} sha256:<release digest>`, ...(url ? [url] : [])];
  const fetch = open ? [
    'Fetch the release asset, verify its sha256 equals the uses/ line, place it in bound/cas/blobs/. Fold: its pages appear.',
    'open: line/install needs=host/resolve — when bound resolves sources/ itself, the fetch line leaves the page by fold.',
  ] : [];
  return resolved(asked, ['## Line', '', 'Add to your lock:', ...lines, ...fetch]);
};
