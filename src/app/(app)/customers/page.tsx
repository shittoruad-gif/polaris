import { prisma } from '@/lib/db';
import CustomerForm from './form';

export const dynamic = 'force-dynamic';

function classify(visits: number, lastVisit: Date | null): string {
  if (visits === 0) return '新規';
  if (visits >= 10) return '優良';
  if (lastVisit) {
    const days = (Date.now() - lastVisit.getTime()) / 86400000;
    if (days > 90) return '離脱予兆';
  }
  return '安定';
}

export default async function CustomersPage() {
  const rows = await prisma.customer.findMany({ orderBy: { updatedAt: 'desc' } });
  const seg = { 優良: 0, 安定: 0, 新規: 0, 離脱予兆: 0 } as Record<string, number>;
  rows.forEach(r => {
    const t = classify(r.visits, r.lastVisit);
    seg[t] = (seg[t] ?? 0) + 1;
  });

  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400">CUSTOMERS</p>
      <h1 className="font-serif text-2xl font-bold mb-6">顧客管理</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {(['優良','安定','新規','離脱予兆'] as const).map(k => (
          <div key={k} className="card p-4 text-center">
            <div className="text-xs text-gray-500">{k}</div>
            <div className="text-2xl font-bold">{seg[k] ?? 0}名</div>
          </div>
        ))}
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-3">顧客を追加</h2>
        <CustomerForm />
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-3">登録済み（{rows.length}件）</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500">まだ顧客がいません。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">氏名</th>
                  <th className="text-right">来店</th>
                  <th className="text-right">最終来店</th>
                  <th className="text-right">累計</th>
                  <th className="text-right">タグ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map(c => {
                  const tag = classify(c.visits, c.lastVisit);
                  return (
                    <tr key={c.id}>
                      <td className="py-2">{c.name}</td>
                      <td className="text-right">{c.visits}回</td>
                      <td className="text-right">{c.lastVisit ? c.lastVisit.toISOString().slice(0, 10) : '—'}</td>
                      <td className="text-right">¥{c.spend.toLocaleString()}</td>
                      <td className="text-right">
                        <span className={`pill ${tag === '離脱予兆' ? 'bg-rose-100 text-rose-700' : tag === '優良' ? 'bg-amber-100 text-amber-700' : ''}`}>{tag}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
