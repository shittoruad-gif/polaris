import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';
import { z } from 'zod';

const schema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.number().int().nonnegative(),
  newCust: z.number().int().nonnegative(),
  repeatPct: z.number().int().min(0).max(100),
});

export async function POST(req: Request) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const body = schema.parse(await req.json());
  const row = await prisma.sale.upsert({
    where: { month: body.month },
    update: body,
    create: body,
  });
  return NextResponse.json(row);
}

export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const rows = await prisma.sale.findMany({ orderBy: { month: 'asc' } });
  return NextResponse.json(rows);
}
