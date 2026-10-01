import { attrs, escaped, fill, look, of, value, type Asked } from '../helpers/capsule.ts';
import { byBytes } from '@lapxo/topos/wire';

type Form = 'svg' | 'png' | 'gif' | 'video' | 'audio';

/** Whatever media a place's media/<name> lines name, each embedded by its form where the view places this region: a still (svg, png, gif) as an image, a video or an audio as its player, from its url or, for a digest, from where the place's form/page/media line keeps a digest; it knows forms, not media, embeds only what its lines name, and draws each at the place's look. */
export const render = (asked: Asked): readonly string[] => {
  const [kept, sha] = [value(asked, 'form/page/media'), 'sha256:'];
  const [still, players]: readonly (readonly Form[])[] = [['svg', 'png', 'gif'], ['video', 'audio']];
  const source = (said: string): string | undefined => (said.startsWith(sha) ? kept && fill(asked, 'page/media', kept, { digest: said.slice(sha.length) }) : said);
  const embed = (form: Form, src: string | undefined, about: string): string | undefined => (still.includes(form)
    ? `<p${attrs({ align: look(asked, 'align/figure') })}><img${attrs({ src, alt: escaped(about) })}${attrs({ width: look(asked, 'width/figure') })}></p>`
    : players.includes(form) ? `<${form}${attrs({ src, width: form === players[0] ? look(asked, 'width/figure') : undefined })} controls></${form}>` : undefined);
  const lines = asked.lines.filter((line) => of(line, 'scope').startsWith('media/')).sort((a, b) => byBytes(of(a, 'scope'), of(b, 'scope')));
  return lines.flatMap((line) => ((one) => (one ? ['', one] : []))(embed(of(line, 'measure') as Form, source(of(line, 'value')), of(line, 'about')))).slice(1);
};
