import { prisma } from '@/lib/db';
import ReviewClient from './client';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
  const rows = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <p className="text-xs tracking-widest text-gray-400">REVIEWS</p>
      <h1 className="font-serif text-2xl font-bold mb-6">口コミ返信</h1>
      <ReviewClient initial={rows.map(r => ({
        id: r.id, author: r.author, stars: r.stars, text: r.text,
        reply: r.reply ?? '', replied: r.replied,
      }))} />
    </div>
  );
}
