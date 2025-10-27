import type { DuoUser, DuoUsersResponse } from "@/types/duolingo";

export async function fetchUsersByUsernames(
  usernames: string[]
): Promise<DuoUser[]> {
  const list = usernames.map((u) => u.trim()).filter(Boolean);
  const acc: DuoUser[] = [];
  for (const username of list) {
    const res = await fetch(
      `/api/users?username=${encodeURIComponent(username)}`
    );
    if (!res.ok) throw new Error(`Falha ao buscar ${username}`);
    const json: DuoUsersResponse = await res.json();
    const user = Array.isArray(json?.users) ? json.users[0] : undefined;
    if (user) acc.push(user);
  }
  return acc;
}
