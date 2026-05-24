'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerForm() {
  const [name, setName] = useState('');
  const [visits, setVisits] = useState('0');
  const [lastVisit, setLastVisit] = useState('');
  const [spend, setSpend] = useState('0');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name,
        visits: Number(visits),
        lastVisit: lastVisit || null,
        spend: Number(spend),
      }),
    });
    setLoading(false);
    setName(''); setVisits('0'); setLastVisit(''); setSpend('0');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-3">
      <label className="text-sm md:col-span-2">氏名
        <input value={name} onChange={e => setName(e.target.value)} required className="w-full mt-1" />
      </label>
      <label className="text-sm">来店回数
        <input type="number" min={0} value={visits} onChange={e => setVisits(e.target.value)} className="w-full mt-1" />
      </label>
      <label className="text-sm">累計(¥)
        <input type="number" min={0} value={spend} onChange={e => setSpend(e.target.value)} className="w-full mt-1" />
      </label>
      <label className="text-sm">最終来店日
        <input type="date" value={lastVisit} onChange={e => setLastVisit(e.target.value)} className="w-full mt-1" />
      </label>
      <div className="md:col-span-4">
        <button disabled={loading} className="btn-gold">{loading ? '保存中…' : '追加'}</button>
      </div>
    </form>
  );
}
