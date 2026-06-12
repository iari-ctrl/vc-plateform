import type { ReactNode } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { cn } from '@/lib/utils';

/**
 * Reassures guests that their work is kept locally and offers to create an
 * account. Renders only when the server is reachable but no one is signed in
 * (`!isAuthed && apiUp`) — offline/guest-without-server gets no nag. Each call
 * site supplies its own `message` (what's stored on this device) and the
 * `reason` passed to the auth dialog.
 */
export function GuestBanner({ message, reason, className }: { message: ReactNode; reason: string; className?: string }) {
  const { isAuthed, apiUp } = useAuth();
  const { openAuth } = useUI();

  if (isAuthed || !apiUp) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] px-6 py-4',
        className,
      )}
    >
      <UserPlus size={20} className="shrink-0 text-[color:var(--primary)]" />
      <p className="flex-1 text-sm text-surface-variant">{message}</p>
      <button onClick={() => openAuth(reason)} className="btn-ghost shrink-0">Créer mon espace</button>
    </div>
  );
}
