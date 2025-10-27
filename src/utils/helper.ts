import type { DuoUser } from "../types/duolingo";

export const getUserXp = (u: DuoUser): number => u.totalXp ?? 0;

export const getUserStreak = (u: DuoUser): number =>
  u.streak ?? u.siteStreak ?? u.streakData?.currentStreak?.length ?? 0;

export const resolvePictureUrl = (picture?: string): string | undefined => {
  if (!picture) return undefined;
  if (picture.startsWith("//")) return `https:${picture}`;
  return picture;
};
