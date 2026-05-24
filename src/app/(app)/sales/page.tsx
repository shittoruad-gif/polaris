import { prisma } from '@/lib/db';
import SalesForm from './form';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
  const sales = await prisma.sale.findMany({ orderBy: { month: 'desc' } });
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400">SALES</p>
      <h1 className="font-serif text-2xl font-bold mb-6">売上入力</h1>

      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-3">月次データを追加 / 更新</h2>
        <SalesForm />
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-3">登録済み（{sales.length}件）</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-gray-500">まだデータがありません。</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-500 border-b">
                <tr>
                  <th className="text-left py-2">月</th>
                  <th className="text-right">売上</th>
                  <th className="text-right">新規</th>
                  <th className="text-right">リピート率</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sales.map(s => (
                  <tr key={s.id}>
                    <td className="py-2">{s.month}</td>
                    <td className="text-right">¥{s.amount.toLocaleString()}</td>
                    <td className="text-right">{s.newCust}名</td>
                    <td className="text-right">{s.repeatPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
