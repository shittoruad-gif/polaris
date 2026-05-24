'use client';
import { useState } from 'react';

export default function BlogClient() {
  const [tab, setTab] = useState<'blog' | 'instagram'>('blog');
  const [blog, setBlog] = useState({ topic: '', tone: '親しみやすく/丁寧', trait: '' });
  const [ig, setIg] = useState({ desc: '', target: '20代女性', goal: '新規予約獲得' });
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true); setOut('');
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(
        tab === 'blog'
          ? { kind: 'blog', payload: blog }
          : { kind: 'instagram', payload: ig }
      ),
    });
    const j = await r.json();
    setOut(j.text || '');
    setBusy(false);
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('blog')} className={tab === 'blog' ? 'btn-gold' : 'btn-ghost'}>ブログ記事</button>
        <button onClick={() => setTab('instagram')} className={tab === 'instagram' ? 'btn-gold' : 'btn-ghost'}>Instagram</button>
      </div>

      <div className="card p-5 mb-6 grid md:grid-cols-2 gap-3">
        {tab === 'blog' ? (
          <>
            <label className="text-sm md:col-span-2">テーマ
              <input value={blog.topic} onChange={e => setBlog({ ...blog, topic: e.target.value })} className="w-full mt-1" placeholder="例：梅雨時期の髪のうねり対策" />
            </label>
            <label className="text-sm">トーン
              <select value={blog.tone} onChange={e => setBlog({ ...blog, tone: e.target.value })} className="w-full mt-1">
                <option>親しみやすく/丁寧</option><option>専門的</option><option>カジュアル</option>
              </select>
            </label>
            <label className="text-sm">サロン特徴
              <input value={blog.trait} onChange={e => setBlog({ ...blog, trait: e.target.value })} className="w-full mt-1" placeholder="例：髪質改善が得意な小規模サロン" />
            </label>
          </>
        ) : (
          <>
            <label className="text-sm md:col-span-2">写真の内容
              <input value={ig.desc} onChange={e => setIg({ ...ig, desc: e.target.value })} className="w-full mt-1" placeholder="例：ボブヘアのカラーチェンジ、ベージュ系" />
            </label>
            <label className="text-sm">ターゲット
              <select value={ig.target} onChange={e => setIg({ ...ig, target: e.target.value })} className="w-full mt-1">
                <option>20代女性</option><option>30代女性</option><option>40代女性</option><option>男性</option>
              </select>
            </label>
            <label className="text-sm">目的
              <select value={ig.goal} onChange={e => setIg({ ...ig, goal: e.target.value })} className="w-full mt-1">
                <option>新規予約獲得</option><option>ブランディング</option><option>キャンペーン告知</option>
              </select>
            </label>
          </>
        )}
        <div className="md:col-span-2">
          <button onClick={generate} disabled={busy} className="btn-gold">{busy ? '生成中…' : '▶ 生成'}</button>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">出力</h2>
          {out && (
            <button onClick={() => navigator.clipboard.writeText(out)} className="btn-ghost text-xs">コピー</button>
          )}
        </div>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed min-h-[160px] text-gray-800">{out || '入力して生成してください。'}</pre>
      </div>
    </>
  );
}
