import { useState } from 'react';
import { Modal } from './Modal';
import { Button, Spinner } from './primitives';
import { Fleuron } from '@/components/ornaments/Ornaments';
import { useAuth } from '@/context/AuthContext';
import { ApiError, API_ENABLED } from '@/lib/api';

export function AuthDialog({ open, onClose, reason }: { open: boolean; onClose: () => void; reason?: string }) {
  const { login, register, apiUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password, name);
      onClose();
      reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="auth-title">
      <div className="p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <Fleuron className="mb-3 text-lg" />
          <h2 id="auth-title" className="font-headline text-headline-md font-semibold">
            {mode === 'login' ? 'Retrouvez votre espace' : 'Créez votre espace'}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-surface-variant">
            {reason ?? 'Sauvegardez votre progression, vos notes et vos favoris. La navigation reste libre — un compte ne sert qu’à vous suivre entre appareils.'}
          </p>
        </div>

        {!apiUp && (
          <div className="mb-5 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-xs text-surface-variant">
            {API_ENABLED ? (
              <>Le serveur n’est pas démarré : vous explorez en <strong>mode invité</strong>. Vos données sont conservées localement sur cet appareil.</>
            ) : (
              <>Démo statique sans serveur : connectez-vous en <strong>administrateur</strong> avec <span className="font-mono text-foreground/80">admin</span> / <span className="font-mono text-foreground/80">admin</span>. Vos données restent locales à cet appareil.</>
            )}
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-full border border-outline-variant bg-surface-container-low p-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`rounded-full py-2 text-sm font-medium transition-colors ${
                mode === m ? 'bg-surface-container-lowest text-foreground shadow-editorial-xs' : 'text-surface-variant'
              }`}
            >
              {m === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <Field name="name" label="Nom" value={name} onChange={setName} type="text" placeholder="Comment vous appeler ?" autoComplete="name" />
          )}
          <Field name="email" label={API_ENABLED ? 'Email' : 'Identifiant'} value={email} onChange={setEmail} type={API_ENABLED ? 'email' : 'text'} placeholder={API_ENABLED ? 'vous@exemple.com' : 'admin'} required autoComplete={API_ENABLED ? 'email' : 'username'} />
          <Field name="password" label="Mot de passe" value={password} onChange={setPassword} type="password" placeholder="••••••••" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />

          {error && <p role="alert" className="text-sm text-error">{error}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Spinner /> : mode === 'login' ? 'Se connecter' : 'Créer mon espace'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-surface-variant">
          Compte de démo :{' '}
          {API_ENABLED ? (
            <><span className="font-mono text-foreground/80">demo@vcpx.io</span> · <span className="font-mono text-foreground/80">demo1234</span></>
          ) : (
            <><span className="font-mono text-foreground/80">admin</span> · <span className="font-mono text-foreground/80">admin</span></>
          )}
        </p>
      </div>
    </Modal>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  type,
  placeholder,
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  const id = `auth-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-surface-variant">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm outline-none transition-colors focus:border-[color:var(--primary)] focus:bg-surface-container-lowest"
      />
    </div>
  );
}
