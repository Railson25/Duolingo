import { useMemo } from "react";
import type { DuoUser } from "@/types/duolingo";
import { getUserStreak, getUserXp } from "@/utils/helper";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { colorForIndex, brand } from "./colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Props = { users: DuoUser[] };

export function LineSummary({ users }: Props) {
  const labels = useMemo(() => users.map((u) => u.username), [users]);
  const xpData = useMemo(() => users.map(getUserXp), [users]);
  const stData = useMemo(() => users.map(getUserStreak), [users]);

  const data = {
    labels,
    datasets: [
      {
        label: "XP total",
        data: xpData,
        borderColor: brand,
        backgroundColor: `${brand}33`,
        tension: 0.35,
        pointRadius: 2.5,
        pointBackgroundColor: brand,
      },
      {
        label: "Streak (dias)",
        data: stData,
        borderColor: colorForIndex(1),
        backgroundColor: `${colorForIndex(1)}33`,
        tension: 0.35,
        pointRadius: 2.5,
        pointBackgroundColor: colorForIndex(1),
        yAxisID: "y2",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const, labels: { color: "#e5e5e5" } },
    },
    scales: {
      x: {
        ticks: { color: "#d4d4d4" },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
      y: {
        ticks: { color: "#d4d4d4" },
        grid: { color: "rgba(255,255,255,0.08)" },
      },
      y2: {
        position: "right" as const,
        ticks: { color: "#a3e635" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return <Line data={data} options={options} />;
}
