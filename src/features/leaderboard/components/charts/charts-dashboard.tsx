import { useMemo } from "react";
import type { DuoUser } from "@/types/duolingo";
import { getUserStreak, getUserXp } from "@/utils/helper";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";
import { colorForIndex } from "./colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

type Props = { users: DuoUser[] };

export function ChartsDashboard({ users }: Props) {
  const labels = useMemo(() => users.map((u) => u.username), [users]);
  const xpData = useMemo(() => users.map(getUserXp), [users]);
  const streakData = useMemo(() => users.map(getUserStreak), [users]);

  const xpPie = useMemo(() => {
    const total = xpData.reduce((a, b) => a + b, 0) || 1;
    return xpData.map((v) => Math.round((v / total) * 100));
  }, [xpData]);

  const { topCourseTitles, courseStacksByUser } = useMemo(() => {
    const counter = new Map<string, number>();
    const byUser: number[][] = [];
    for (const u of users) {
      for (const c of u.courses ?? []) {
        counter.set(c.title, (counter.get(c.title) ?? 0) + c.xp);
      }
    }
    const sortedTitles = Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);

    for (const u of users) {
      byUser.push(
        sortedTitles.map(
          (title) => (u.courses ?? []).find((c) => c.title === title)?.xp ?? 0
        )
      );
    }
    return { topCourseTitles: sortedTitles, courseStacksByUser: byUser };
  }, [users]);

  const radar = useMemo(() => {
    const xpMax = Math.max(...xpData, 1);
    const streakMax = Math.max(...streakData, 1);
    const coursesCount = users.map(
      (u) => (u.courses ?? []).filter((c) => c.xp > 0).length
    );
    const coursesMax = Math.max(...coursesCount, 1);

    return {
      labels: ["XP total", "Streak", "Cursos ativos"],
      datasets: users.map((u, i) => ({
        label: u.username,
        data: [
          getUserXp(u) / xpMax,
          getUserStreak(u) / streakMax,
          (u.courses ?? []).filter((c) => c.xp > 0).length / coursesMax,
        ],
        backgroundColor: `${colorForIndex(i)}30`,
        borderColor: colorForIndex(i),
        pointBackgroundColor: colorForIndex(i),
        pointBorderColor: "#fff",
      })),
    };
  }, [users, xpData, streakData]);

  const axisTicks = { color: "#a3a3a3" };
  const gridColor = "rgba(255,255,255,0.1)";

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: { ticks: axisTicks, grid: { color: gridColor } },
      y: { ticks: axisTicks, grid: { color: gridColor } },
    },
  } as const;

  const stackedBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { color: "#e5e5e5" } },
    },
    scales: {
      x: { stacked: true, ticks: axisTicks, grid: { color: gridColor } },
      y: { stacked: true, ticks: axisTicks, grid: { color: gridColor } },
    },
  } as const;

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { color: "#e5e5e5" } },
    },
    cutout: "60%",
  } as const;

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { color: "#e5e5e5" } },
    },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: { display: false },
        grid: { color: gridColor },
        angleLines: { color: gridColor },
        pointLabels: { color: "#e5e5e5" },
      },
    },
  } as const;

  const xpBarData = {
    labels,
    datasets: [
      {
        label: "XP total",
        data: xpData,
        backgroundColor: labels.map((_, i) => `${colorForIndex(i)}80`),
        borderColor: labels.map((_, i) => colorForIndex(i)),
        borderWidth: 1.5,
      },
    ],
  };

  const streakBarData = {
    labels,
    datasets: [
      {
        label: "Streak (dias)",
        data: streakData,
        backgroundColor: labels.map((_, i) => `${colorForIndex(i)}80`),
        borderColor: labels.map((_, i) => colorForIndex(i)),
        borderWidth: 1.5,
      },
    ],
  };

  const xpDoughnutData = {
    labels,
    datasets: [
      {
        label: "% do XP total",
        data: xpPie,
        backgroundColor: labels.map((_, i) => `${colorForIndex(i)}cc`),
        borderColor: "#0a0a0a",
        borderWidth: 2,
      },
    ],
  };

  const courseStackedData = {
    labels,
    datasets: topCourseTitles.map((title, i) => ({
      label: title,
      data: courseStacksByUser.map((row) => row[i]),
      backgroundColor: `${colorForIndex(i)}90`,
      borderColor: colorForIndex(i),
      borderWidth: 1,
    })),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
        <h3 className="font-semibold mb-3 text-primary">
          XP total por usuário
        </h3>
        <Bar options={barOptions} data={xpBarData} />
      </div>

      <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
        <h3 className="font-semibold mb-3 text-primary">
          Streak (dias) por usuário
        </h3>
        <Bar options={barOptions} data={streakBarData} />
      </div>

      <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
        <h3 className="font-semibold mb-3 text-primary">
          Participação no XP do grupo
        </h3>
        <Doughnut options={doughnutOptions} data={xpDoughnutData} />
      </div>

      <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4">
        <h3 className="font-semibold mb-3 text-primary">
          XP por curso (Top 5)
        </h3>
        {topCourseTitles.length ? (
          <Bar options={stackedBarOptions} data={courseStackedData} />
        ) : (
          <div className="text-neutral-400 text-sm">
            Sem cursos suficientes para exibir.
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 lg:col-span-2">
        <h3 className="font-semibold mb-3 text-primary">
          Comparativo de perfil (normalizado)
        </h3>
        <Radar data={radar} options={radarOptions} />
      </div>
    </div>
  );
}
