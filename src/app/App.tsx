import { ChartsDashboard } from "@/features/leaderboard/components/charts/charts-dashboard";
import { LineSummary } from "@/features/leaderboard/components/charts/line-summary";
import { FriendControls } from "@/features/leaderboard/components/friend-controls";
import { KpiCards } from "@/features/leaderboard/components/kpi-cards";
import { RankingTable } from "@/features/leaderboard/components/ranking-table";
import { UserDetailsSheet } from "@/features/leaderboard/components/user-details-sheet";
import { useLeaderboard } from "@/features/leaderboard/hooks/useLeaderboard";
import type { DuoUser } from "@/types/duolingo";

import { useState } from "react";

export default function App() {
  const {
    usernames,
    users,
    loading,
    error,
    metric,
    canAdd,
    refresh,
    updateUsername,
    addUsername,
    removeUsername,
    setMetric,
  } = useLeaderboard();

  const [selected, setSelected] = useState<DuoUser | null>(null);
  const [open, setOpen] = useState(false);

  const openDetails = (user: DuoUser) => {
    setSelected(user);
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

        <KpiCards users={users} />

        <FriendControls
          usernames={usernames}
          canAdd={canAdd}
          loading={loading}
          metric={metric}
          onChangeUsername={updateUsername}
          onAdd={addUsername}
          onRemove={removeUsername}
          onChangeMetric={setMetric}
          onFetch={refresh}
        />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 space-y-8">
            <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
              <h3 className="font-semibold mb-3 text-primary">
                Tabela de amigos
              </h3>
              <RankingTable rows={users} onRowClick={openDetails} />
            </div>

            <div>
              <h4 className="text-sm text-neutral-300 mb-2">Resumo (linha)</h4>
              <LineSummary users={users} />
            </div>
          </section>

          <aside className="xl:col-span-1">
            <ChartsDashboard users={users} />
          </aside>
        </div>

        <UserDetailsSheet open={open} onOpenChange={setOpen} user={selected} />
      </div>
    </div>
  );
}
