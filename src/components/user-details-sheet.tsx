import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import type { DuoUser } from "../types/duolingo";
import { getUserStreak, getUserXp, resolvePictureUrl } from "../utils/helper";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: DuoUser | null;
};

export function UserDetailsSheet({ open, onOpenChange, user }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[480px] bg-neutral-950 text-white border-neutral-800"
      >
        <SheetHeader>
          <SheetTitle>Detalhes do usuário</SheetTitle>
          <SheetDescription className="text-neutral-400">
            Informações públicas retornadas pelo Duolingo.
          </SheetDescription>
        </SheetHeader>

        {!user ? (
          <div className="mt-6 text-neutral-400">
            Selecione um usuário na tabela.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              {resolvePictureUrl(user.picture) && (
                <img
                  src={resolvePictureUrl(user.picture)}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-neutral-400">
                  {user.name || "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-neutral-900/60 rounded-xl p-3">
                <div className="text-neutral-400">XP total</div>
                <div className="text-lg font-semibold">{getUserXp(user)}</div>
              </div>
              <div className="bg-neutral-900/60 rounded-xl p-3">
                <div className="text-neutral-400">Streak</div>
                <div className="text-lg font-semibold">
                  {getUserStreak(user)}
                </div>
              </div>
              <div className="bg-neutral-900/60 rounded-xl p-3">
                <div className="text-neutral-400">De</div>
                <div className="font-medium">{user.fromLanguage || "—"}</div>
              </div>
              <div className="bg-neutral-900/60 rounded-xl p-3">
                <div className="text-neutral-400">Aprendendo</div>
                <div className="font-medium">
                  {user.learningLanguage || "—"}
                </div>
              </div>
            </div>

            <div className="bg-neutral-900/60 rounded-xl p-3">
              <div className="text-neutral-400 mb-1">Cursos</div>
              {user.courses?.length ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {user.courses.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium">{c.title}</span>{" "}
                      <span className="text-neutral-400">
                        ({c.learningLanguage} ← {c.fromLanguage}) — {c.xp} XP
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-neutral-400 text-sm">—</div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
