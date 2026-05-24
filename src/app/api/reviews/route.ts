import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';
import { z } from 'zod';

const schema = z.object({
  author: z.string().min(1),
  stars: z.number().int().min(1).max(5),
  text: z.string().min(1),
});

export async function POST(req: Request) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const body = schema.parse(await req.json());
  const row = await prisma.review.create({ data: body });
  return NextResponse.json(row);
}

export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const rows = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(rows);
}
