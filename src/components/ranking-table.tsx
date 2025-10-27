import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import type { DuoUser } from "../types/duolingo";
import { getUserStreak, getUserXp, resolvePictureUrl } from "../utils/helper";

type Props = {
  rows: DuoUser[];

  onRowClick: (u: DuoUser) => void;
};

export function RankingTable({ rows, onRowClick }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-neutral-200">#</TableHead>
          <TableHead className="text-neutral-200">Usuário</TableHead>
          <TableHead className="text-neutral-200">Nome</TableHead>
          <TableHead className="text-neutral-200">Idioma atual</TableHead>
          <TableHead className="text-neutral-200">XP total</TableHead>
          <TableHead className="text-neutral-200">Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-neutral-400 py-6"
            >
              Nenhum dado ainda. Adicione usernames e clique em "Buscar &
              Classificar".
            </TableCell>
          </TableRow>
        ) : (
          rows.map((u, idx) => (
            <TableRow
              key={u.id ?? u.username}
              className="cursor-pointer hover:bg-neutral-900/70"
              onClick={() => onRowClick(u)}
            >
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {resolvePictureUrl(u.picture) && (
                    <img
                      src={resolvePictureUrl(u.picture)}
                      alt={u.username}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <span className="font-semibold">{u.username}</span>
                </div>
              </TableCell>
              <TableCell>{u.name ?? "—"}</TableCell>
              <TableCell>
                {u.learningLanguage || u.fromLanguage || "—"}
              </TableCell>
              <TableCell>{getUserXp(u)}</TableCell>
              <TableCell>{getUserStreak(u)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
