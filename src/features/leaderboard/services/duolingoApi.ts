import type { DuoUser } from "@/types/duolingo";

export const fetchDuolingoUsers = async (
  usernames: string[]
): Promise<DuoUser[]> => {
  const valid = usernames.filter(Boolean);
  if (!valid.length) return [];

  const results = await Promise.allSettled(
    valid.map(async (username) => {
      const res = await fetch(
        `/api/users?username=${encodeURIComponent(username)}`
      );
      if (!res.ok) throw new Error(`User ${username} not found`);
      const json = await res.json();
      return json.users?.[0] as DuoUser | undefined;
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<DuoUser> =>
        r.status === "fulfilled" && !!r.value
    )
    .map((r) => r.value);
};
