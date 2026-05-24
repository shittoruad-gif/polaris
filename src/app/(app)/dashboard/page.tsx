import { prisma } from '@/lib/db';
import { generate } from '@/lib/ai';
import DashboardChart from './chart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const sales = await prisma.sale.findMany({ orderBy: { month: 'asc' } });
  const last = sales[sales.length - 1];
  const prev = sales[sales.length - 2];

  if (!last) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-bold mb-3">ダッシュボード</h1>
        <div className="card p-8 text-center text-gray-600">
          まだ売上データがありません。<br />
          <a href="/sales" className="btn-gold inline-block mt-4">売上を入力する</a>
        </div>
      </div>
    );
  }

  const diff = prev ? ((last.amount - prev.amount) / prev.amount) * 100 : 0;
  const customers = await prisma.customer.count();

  const ai = await generate({
    system: 'あなたはサロン経営の助言者です。簡潔・具体的に、見出し付きで日本語で答えます。',
    user: `直近の月次売上: ${JSON.stringify(sales)}\n登録顧客数: ${customers}\n注目すべき変化と、次の打ち手を3点、優先順位付きで示してください。`,
    fallback:
`■ 注目すべき変化
・直近の売上は前月比 ${diff.toFixed(1)}%。リピート率 ${last.repeatPct}%。
・新規 ${last.newCust} 名。

■ 次の打ち手
1. 30日以内未来店の「離脱予兆」顧客にLINE個別フォロー
2. 既存優良顧客への新メニュー先行案内
3. 体験価値訴求のブログを月2本投下`,
  });

  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400">DASHBOARD</p>
      <h1 className="font-serif text-2xl font-bold mb-6">経営ダッシュボード</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="今月売上" value={`¥${last.amount.toLocaleString()}`}
             delta={prev ? `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%` : '—'} good={diff >= 0} />
        <Kpi label="新規客数" value={`${last.newCust}名`}
             delta={prev ? `${last.newCust - prev.newCust >= 0 ? '+' : ''}${last.newCust - prev.newCust}` : '—'}
             good={!prev || last.newCust >= prev.newCust} />
        <Kpi label="リピート率" value={`${last.repeatPct}%`}
             delta={prev ? `${last.repeatPct - prev.repeatPct >= 0 ? '+' : ''}${last.repeatPct - prev.repeatPct}pt` : '—'}
             good={!prev || last.repeatPct >= prev.repeatPct} />
        <Kpi label="登録顧客数" value={`${customers}名`} delta="—" good />
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-3">月次推移</h2>
        <DashboardChart sales={sales.map(s => ({ m: s.month, amount: s.amount, repeat: s.repeatPct }))} />
      </div>

      <div className="card p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">AIによる経営示唆</h2>
          <span className="pill">{ai.fromAi ? 'AI' : 'テンプレ'}</span>
        </div>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{ai.text}</pre>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, good }: { label: string; value: string; delta: string; good: boolean }) {
  return (
    <div className="card p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`text-xs mt-1 ${good ? 'text-emerald-600' : 'text-rose-600'}`}>{good ? '▲' : '▼'} {delta}</div>
    </div>
  );
}
