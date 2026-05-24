import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const body = await req.json();
  const row = await prisma.review.update({
    where: { id: Number(params.id) },
    data: { reply: body.reply ?? null, replied: !!body.replied },
  });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  await prisma.review.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
