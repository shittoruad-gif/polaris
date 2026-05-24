'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SalesForm() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [amount, setAmount] = useState('');
  const [newCust, setNewCust] = useState('');
  const [repeatPct, setRepeatPct] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/sales', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        month,
        amount: Number(amount),
        newCust: Number(newCust),
        repeatPct: Number(repeatPct),
      }),
    });
    setLoading(false);
    setAmount(''); setNewCust(''); setRepeatPct('');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-3">
      <label className="text-sm">月
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} required className="w-full mt-1" />
      </label>
      <label className="text-sm">売上(¥)
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full mt-1" />
      </label>
      <label className="text-sm">新規客数
        <input type="number" value={newCust} onChange={e => setNewCust(e.target.value)} required className="w-full mt-1" />
      </label>
      <label className="text-sm">リピート率(%)
        <input type="number" min={0} max={100} value={repeatPct} onChange={e => setRepeatPct(e.target.value)} required className="w-full mt-1" />
      </label>
      <div className="md:col-span-4">
        <button disabled={loading} className="btn-gold">{loading ? '保存中…' : '保存（同月は上書き）'}</button>
      </div>
    </form>
  );
}
