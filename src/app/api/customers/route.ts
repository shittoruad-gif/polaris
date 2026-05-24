import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  visits: z.number().int().nonnegative(),
  lastVisit: z.string().nullable().optional(),
  spend: z.number().int().nonnegative(),
});

export async function POST(req: Request) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const body = schema.parse(await req.json());
  const row = await prisma.customer.create({
    data: {
      name: body.name,
      visits: body.visits,
      lastVisit: body.lastVisit ? new Date(body.lastVisit) : null,
      spend: body.spend,
    },
  });
  return NextResponse.json(row);
}

export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const rows = await prisma.customer.findMany({ orderBy: { updatedAt: 'desc' } });
  return NextResponse.json(rows);
}
