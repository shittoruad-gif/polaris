export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const hasAi = !!process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400">SETTINGS</p>
      <h1 className="font-serif text-2xl font-bold mb-6">設定</h1>

      <div className="card p-5 mb-6">
        <h2 className="font-bold mb-3">AI接続</h2>
        <p className="text-sm">
          ステータス：
          <span className={`pill ml-2 ${hasAi ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200'}`}>
            {hasAi ? '接続済み' : '未設定'}
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-2">モデル: <code>{model}</code></p>
        <p className="text-xs text-gray-500 mt-3">
          APIキーはサーバーの環境変数 <code>ANTHROPIC_API_KEY</code> で設定します。Coolifyの「Environment Variables」から登録してください。
        </p>
      </div>

      <div className="card p-5">
        <h2 className="font-bold mb-3">データ</h2>
        <p className="text-sm text-gray-600">データは PostgreSQL に保存されています。バックアップは <code>pg_dump</code> で取得できます。</p>
      </div>
    </div>
  );
}
