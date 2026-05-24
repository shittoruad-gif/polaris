'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const ROUTES = [
  { href: '/dashboard',  label: 'ダッシュボード', icon: '📊' },
  { href: '/sales',      label: '売上入力',       icon: '💴' },
  { href: '/customers',  label: '顧客',           icon: '👥' },
  { href: '/reviews',    label: '口コミ',         icon: '💬' },
  { href: '/blog',       label: 'AI生成',         icon: '✍️' },
  { href: '/settings',   label: '設定',           icon: '⚙️' },
];

export default function Sidebar({ hasAi }: { hasAi: boolean }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="font-serif text-xl font-bold tracking-wider">Polaris</div>
        <div className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">SALON AI</div>
      </div>
      <nav className="flex-1 px-2 py-3 text-sm space-y-1">
        {ROUTES.map(r => (
          <Link key={r.href} href={r.href}
            className={`nav-item flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 ${path?.startsWith(r.href) ? 'active' : ''}`}>
            <span>{r.icon}</span><span>{r.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
        <span>
          <span className={`inline-block w-2 h-2 rounded-full mr-1.5 align-middle ${hasAi ? 'bg-emerald-500' : 'bg-gray-300'}`} />
          {hasAi ? 'AI接続済み' : 'AIキー未設定'}
        </span>
        <button onClick={async ()=>{ await fetch('/api/logout',{method:'POST'}); router.push('/login'); router.refresh(); }}
          className="text-gray-400 hover:text-rose-600">ログアウト</button>
      </div>
    </aside>
  );
}
