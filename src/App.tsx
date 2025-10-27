import { useCallback, useEffect, useMemo, useState } from "react";
import type { DuoUser } from "@/types/duolingo";
import { fetchUsersByUsernames } from "@/lib/duo.api";

import { getUserStreak, getUserXp } from "@/utils/helper";
import {
  upsertUsersCache,
  loadSavedUsernames,
  saveUsernames,
  getCachedByUsernames,
} from "@/lib/storage";

import { FriendControls } from "./components/friend-controls";
import { RankingTable } from "./components/ranking-table";
import { UserDetailsSheet } from "./components/user-details-sheet";
import { ChartsDashboard } from "./components/charts/charts-dashboard";
import { KpiCards } from "./components/kpi-cards";
import { LineSummary } from "./components/charts/line-summary";
import { DEFAULT_USERNAMES } from "./config";

function sanitizeList(arr: string[]): string[] {
  return Array.from(new Set(arr.map((u) => u.trim()).filter(Boolean))).slice(
    0,
    5
  );
}

export default function App() {
  const [usernames, setUsernames] = useState<string[]>(() => {
    const saved = loadSavedUsernames();
    const merged = sanitizeList([...DEFAULT_USERNAMES, ...saved]);
    return merged.length ? merged : sanitizeList([...DEFAULT_USERNAMES]);
  });

  const [metric, setMetric] = useState<"xp" | "streak">("xp");
  const [rows, setRows] = useState<DuoUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DuoUser | null>(null);

  const canAdd = usernames.filter(Boolean).length < 5;

  const metricValue = useCallback(
    (u: DuoUser) => (metric === "streak" ? getUserStreak(u) : getUserXp(u)),
    [metric]
  );

  const sortByMetric = useCallback(
    (arr: DuoUser[]) =>
      [...arr].sort((a, b) => metricValue(b) - metricValue(a)),
    [metricValue]
  );

  useEffect(() => {
    saveUsernames(usernames);
    const cached = getCachedByUsernames(usernames.filter(Boolean));
    if (cached.length) setRows(sortByMetric(cached));
  }, [usernames, sortByMetric]);

  useEffect(() => {
    if (rows.length === 0 && usernames.filter(Boolean).length > 0) {
      void (async () => {
        setLoading(true);
        try {
          const fresh = await fetchUsersByUsernames(usernames.filter(Boolean));
          if (fresh.length) {
            upsertUsersCache(fresh);
            setRows(sortByMetric(fresh));
          }
        } catch {
          /* */
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  const sorted = useMemo(() => sortByMetric(rows), [rows, sortByMetric]);

  const updateUsername = (i: number, val: string) =>
    setUsernames((prev) =>
      sanitizeList(prev.map((u, idx) => (idx === i ? val.trim() : u)))
    );

  const addRow = () =>
    canAdd && setUsernames((prev) => sanitizeList([...prev, ""]));

  const removeRow = (i: number) =>
    setUsernames((prev) => prev.filter((_, idx) => idx !== i));

  const onFetch = async () => {
    setError(null);
    setLoading(true);
    try {
      const list = usernames.map((u) => u.trim()).filter(Boolean);
      if (!list.length) {
        setRows([]);
        return;
      }

      const fresh = await fetchUsersByUsernames(list);
      if (fresh.length === 0) throw new Error("Nenhum usuário encontrado.");

      upsertUsersCache(fresh);
      setRows(sortByMetric(fresh));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Erro ao buscar dados";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (u: DuoUser) => {
    setSelected(u);
    setOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">
            Ranking Duolingo (até 5 amigos)
          </h1>
          <p className="text-sm text-neutral-300">
            Dados salvos localmente. Clique em{" "}
            <span className="font-semibold text-primary">
              Buscar & Classificar
            </span>{" "}
            para atualizar.
          </p>
        </header>

        <KpiCards users={sorted} />

        <FriendControls
          usernames={usernames}
          canAdd={canAdd}
          loading={loading}
          metric={metric}
          onChangeUsername={updateUsername}
          onAdd={addRow}
          onRemove={removeRow}
          onChangeMetric={setMetric}
          onFetch={onFetch}
        />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2">
            <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
              <h3 className="font-semibold mb-3 text-primary">
                Tabela de amigos
              </h3>
              <RankingTable rows={sorted} onRowClick={openDetails} />
            </div>

            <div className="mt-8">
              <h4 className="text-sm text-neutral-300 mb-2">Resumo (linha)</h4>
              <LineSummary users={sorted} />
            </div>
          </section>

          <aside className="xl:col-span-1">
            <ChartsDashboard users={sorted} />
          </aside>
        </div>

        <UserDetailsSheet open={open} onOpenChange={setOpen} user={selected} />
      </div>
    </div>
  );
}
