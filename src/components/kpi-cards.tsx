import type { DuoUser } from "@/types/duolingo";
import { getUserStreak, getUserXp } from "@/utils/helper";

type Props = { users: DuoUser[] };

const Card = ({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) => (
  <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
    <div className="text-neutral-400 text-sm">{title}</div>
    <div className="mt-1 text-2xl font-semibold">{value}</div>
    {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
  </div>
);

export function KpiCards({ users }: Props) {
  const totalXp = users.reduce((a, u) => a + getUserXp(u), 0);
  const avgStreak = users.length
    ? Math.round(users.reduce((a, u) => a + getUserStreak(u), 0) / users.length)
    : 0;
  const top = [...users].sort((a, b) => getUserXp(b) - getUserXp(a))[0];

  const cursosAtivos = users.reduce(
    (acc, u) => acc + (u.courses?.filter((c) => c.xp > 0).length ?? 0),
    0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="XP total do grupo" value={totalXp.toLocaleString()} />
      <Card title="Streak médio" value={`${avgStreak} d`} />
      <Card
        title="Top do grupo"
        value={top ? top.username : "—"}
        sub={top ? `${getUserXp(top)} XP` : ""}
      />
      <Card title="Cursos ativos (grupo)" value={cursosAtivos.toString()} />
    </div>
  );
}
