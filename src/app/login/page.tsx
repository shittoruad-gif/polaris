'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!r.ok) { setErr('パスワードが違います'); return; }
    router.push('/dashboard'); router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="font-serif text-2xl font-bold">Polaris</div>
          <div className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">SALON AI</div>
        </div>
        <label className="block text-sm">
          パスワード
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mt-1"
            autoFocus
            required
          />
        </label>
        {err && <p className="text-sm text-rose-600 mt-2">{err}</p>}
        <button disabled={loading} className="btn-gold w-full mt-5">
          {loading ? '確認中…' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
