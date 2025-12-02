import { useEffect, useRef } from "react";
import { useLeaderboardStore } from "../store/leaderboardStore";
import { fetchDuolingoUsers } from "../services/duolingoApi";
import { upsertUsersCache, getCachedByUsernames } from "@/lib/storage";
import { getUserXp, getUserStreak } from "@/utils/helper";
import type { DuoUser } from "@/types/duolingo";
import { DEFAULT_USERNAMES_MUTABLE as DEFAULT_USERNAMES } from "@/config/config";

export const useLeaderboard = () => {
  const store = useLeaderboardStore();

  const hasAutoFetchedRef = useRef(false);

  const metricValue = (u: DuoUser) =>
    store.metric === "streak" ? getUserStreak(u) : getUserXp(u);

  const sortedUsers = [...store.users].sort(
    (a, b) => metricValue(b) - metricValue(a)
  );

  useEffect(() => {
    const saved = getCachedByUsernames(DEFAULT_USERNAMES);

    if (saved.length) {
      store.setUsers(saved);
      store.setUsernames(
        Array.from(
          new Set([...DEFAULT_USERNAMES, ...saved.map((u) => u.username)])
        ).slice(0, 5)
      );
    } else {
      store.setUsernames(DEFAULT_USERNAMES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const fresh = await fetchDuolingoUsers(store.usernames);

      if (fresh.length === 0) {
        throw new Error("Nenhum usuário encontrado");
      }

      upsertUsersCache(fresh);

      store.setUsers(fresh);
    } catch (err) {
      console.error("[useLeaderboard.refresh] erro:", err);
      store.setError(err instanceof Error ? err.message : "Erro ao buscar");
    } finally {
      console.log("[useLeaderboard.refresh] finalizando, setLoading(false)");
      store.setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !hasAutoFetchedRef.current &&
      store.usernames.length > 0 &&
      !store.loading
    ) {
      console.log("[useLeaderboard] chamando refresh automaticamente");
      hasAutoFetchedRef.current = true;

      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.usernames, store.loading]);

  return {
    ...store,
    users: sortedUsers,
    refresh,
    canAdd: store.usernames.length < 5,
  };
};
