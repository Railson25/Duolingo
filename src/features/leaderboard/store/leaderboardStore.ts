import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DuoUser } from "@/types/duolingo";

type Metric = "xp" | "streak";

interface LeaderboardState {
  usernames: string[];
  metric: Metric;
  users: DuoUser[];
  loading: boolean;
  error: string | null;

  setUsernames: (usernames: string[]) => void;
  setMetric: (metric: Metric) => void;
  setUsers: (users: DuoUser[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addUsername: () => void;
  removeUsername: (index: number) => void;
  updateUsername: (index: number, value: string) => void;
}

const sanitize = (arr: string[]) =>
  Array.from(new Set(arr.map((u) => u.trim()).filter(Boolean))).slice(0, 5);

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set) => ({
      usernames: [],
      metric: "xp",
      users: [],
      loading: false,
      error: null,

      setUsernames: (usernames) => set({ usernames: sanitize(usernames) }),
      setMetric: (metric) => set({ metric }),
      setUsers: (users) => set({ users }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addUsername: () =>
        set((state) => {
          if (state.usernames.length >= 5) return state;
          return { usernames: sanitize([...state.usernames, ""]) };
        }),

      removeUsername: (index) =>
        set((state) => ({
          usernames: state.usernames.filter((_, i) => i !== index),
        })),

      updateUsername: (index, value) =>
        set((state) => ({
          usernames: sanitize(
            state.usernames.map((u, i) => (i === index ? value : u))
          ),
        })),
    }),
    {
      name: "duolingo-leaderboard",
    }
  )
);
