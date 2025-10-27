import type { DuoUser } from "@/types/duolingo";

const KEY_USERS = "duo.users.cache.v1";
const KEY_NAMES = "duo.usernames.v1";

export type CachedUser = {
  username: string;
  data: DuoUser;
  updatedAt: number;
};

export type UsersCache = Record<string, CachedUser>;

const safeParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const norm = (u: string) => u.trim().toLowerCase();

export function loadCache(): UsersCache {
  return safeParse<UsersCache>(localStorage.getItem(KEY_USERS)) ?? {};
}

export function saveCache(cache: UsersCache) {
  localStorage.setItem(KEY_USERS, JSON.stringify(cache));
}

export function upsertUsersCache(users: DuoUser[]) {
  const cache = loadCache();
  const now = Date.now();
  for (const u of users) {
    if (!u?.username) continue;
    cache[norm(u.username)] = {
      username: u.username,
      data: u,
      updatedAt: now,
    };
  }
  saveCache(cache);
}

export function getCachedByUsernames(usernames: string[]): DuoUser[] {
  const cache = loadCache();
  const out: DuoUser[] = [];
  for (const name of usernames) {
    const hit = cache[norm(name)];
    if (hit?.data) out.push(hit.data);
  }
  return out;
}

export function loadSavedUsernames(): string[] {
  return safeParse<string[]>(localStorage.getItem(KEY_NAMES)) ?? [""];
}

export function saveUsernames(usernames: string[]) {
  localStorage.setItem(KEY_NAMES, JSON.stringify(usernames));
}
