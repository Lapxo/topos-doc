import { of, receiptValue, resolved, say, section, states, value, type Asked } from '../helpers/capsule.ts';

/** How a reader checks the place: the cases it holds, and the repository, the command and the fold that check it. */
export const render = (asked: Asked): readonly string[] => {
  const [glyph, folds] = [states(asked)[0]?.glyph ?? '', asked.lines.find((one) => of(one, 'scope') === 'fold' && of(one, 'role') === 'writes')];
  const [repository, resolvedAt, command] = [value(asked, 'repository'), value(asked, 'repository/resolved'), value(asked, 'check')];
  const how = [...(repository === undefined || resolvedAt === undefined ? [] : [say(asked, 'check/repository', { glyph, repository })]),
    ...(command === undefined ? [] : [say(asked, 'check/command', { glyph, check: command })]), ...(folds === undefined ? [] : [say(asked, 'check/fold', { fold: of(folds, 'value'), about: of(folds, 'about') })])];
  return resolved(asked, [...section(asked, 'check'), say(asked, 'check/held', { glyph, count: receiptValue(asked, 'cases', 'cases/held') ?? 0 }), ...(how.length ? ['', how.join(' · ')] : [])]);
};
