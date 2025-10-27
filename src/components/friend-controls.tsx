import { Button } from "../components/ui/button";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type Props = {
  usernames: string[];
  canAdd: boolean;
  loading: boolean;
  metric: "xp" | "streak";
  onChangeUsername: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChangeMetric: (m: "xp" | "streak") => void;
  onFetch: () => void;
};

export function FriendControls({
  usernames,
  canAdd,
  loading,
  metric,
  onChangeUsername,
  onAdd,
  onRemove,
  onChangeMetric,
  onFetch,
}: Props) {
  return (
    <div className="bg-neutral-900/70 rounded-2xl p-4 border border-neutral-800 space-y-2">
      {usernames.map((u, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row gap-2 sm:items-center"
        >
          <input
            className="w-full bg-neutral-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60"
            placeholder={`username #${i + 1}`}
            value={u}
            onChange={(e) => onChangeUsername(i, e.target.value)}
          />

          {usernames.length > 1 && (
            <Button
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 w-full sm:w-auto self-end sm:self-auto"
              onClick={() => onRemove(i)}
            >
              Remover
            </Button>
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2 justify-between pt-2">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onAdd}
            disabled={!canAdd}
            variant="secondary"
            className="bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 border border-neutral-700 w-full sm:w-auto"
            title={canAdd ? "Adicionar campo" : "Limite de 5 atingido"}
          >
            + Adicionar
          </Button>

          <UiSelect
            value={metric}
            onValueChange={(v) => onChangeMetric(v as "xp" | "streak")}
          >
            <SelectTrigger className="w-full sm:w-56 max-w-full bg-neutral-800 border border-neutral-700 text-neutral-100 focus:ring-2 focus:ring-primary/60">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800">
              <SelectItem value="xp">Ordenar por XP total</SelectItem>
              <SelectItem value="streak">Ordenar por Streak</SelectItem>
            </SelectContent>
          </UiSelect>
        </div>

        <Button
          onClick={onFetch}
          disabled={loading}
          className="btn-primary w-full sm:w-auto shrink-0"
        >
          {loading ? "Carregando..." : "Buscar & Classificar"}
        </Button>
      </div>
    </div>
  );
}
