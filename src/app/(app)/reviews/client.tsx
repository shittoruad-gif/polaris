'use client';
import { useState } from 'react';

type Row = { id: number; author: string; stars: number; text: string; reply: string; replied: boolean };

export default function ReviewClient({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [form, setForm] = useState({ author: '', stars: 5, text: '' });
  const [busy, setBusy] = useState<number | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      const row = await r.json();
      setRows([{ ...row, reply: row.reply ?? '' }, ...rows]);
      setForm({ author: '', stars: 5, text: '' });
    }
  }

  async function generateReply(id: number) {
    const row = rows.find(r => r.id === id); if (!row) return;
    setBusy(id);
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        kind: 'review_reply',
        payload: { author: row.author, stars: row.stars, text: row.text },
      }),
    });
    const j = await r.json();
    setRows(rows.map(x => x.id === id ? { ...x, reply: j.text } : x));
    setBusy(null);
  }

  async function save(id: number) {
    const row = rows.find(r => r.id === id); if (!row) return;
    await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reply: row.reply, replied: true }),
    });
    setRows(rows.map(x => x.id === id ? { ...x, replied: true } : x));
  }

  return (
    <>
      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-3">口コミを追加</h2>
        <form onSubmit={add} className="grid md:grid-cols-4 gap-3">
          <input className="md:col-span-1" placeholder="投稿者名" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
          <select value={form.stars} onChange={e => setForm({ ...form, stars: Number(e.target.value) })}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</option>)}
          </select>
          <input className="md:col-span-2" placeholder="本文" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} required />
          <div className="md:col-span-4"><button className="btn-gold">追加</button></div>
        </form>
      </div>

      <div className="space-y-4">
        {rows.length === 0 && <p className="text-sm text-gray-500">口コミがありません。</p>}
        {rows.map(r => (
          <div key={r.id} className="card p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-bold">{r.author}</span>
                <span className="text-amber-500 ml-2">{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</span>
              </div>
              <span className={`pill ${r.replied ? 'bg-emerald-100 text-emerald-700' : ''}`}>{r.replied ? '返信済' : '未返信'}</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{r.text}</p>
            <button onClick={() => generateReply(r.id)} disabled={busy === r.id} className="btn-gold text-xs">
              {busy === r.id ? '生成中…' : (r.reply ? '再生成' : 'AI返信ドラフト')}
            </button>
            {r.reply && (
              <>
                <textarea value={r.reply}
                  onChange={e => setRows(rows.map(x => x.id === r.id ? { ...x, reply: e.target.value } : x))}
                  className="w-full mt-3 text-sm" rows={5} />
                <button onClick={() => save(r.id)} className="btn-ghost text-xs mt-2">返信済として保存</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
