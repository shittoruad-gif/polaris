import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/session';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const { id } = await params;
  const body = await req.json();
  const row = await prisma.review.update({
    where: { id: Number(id) },
    data: { reply: body.reply ?? null, replied: !!body.replied },
  });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'unauth' }, { status: 401 }); }
  const { id } = await params;
  await prisma.review.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
