import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getSession } from '@/lib/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s.loggedIn) redirect('/login');
  const hasAi = !!process.env.ANTHROPIC_API_KEY;
  return (
    <div className="flex min-h-screen">
      <Sidebar hasAi={hasAi} />
      <main className="flex-1 min-w-0">
        <div className="p-5 sm:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
