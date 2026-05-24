import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD not set' }, { status: 500 });
  if (password !== expected) return NextResponse.json({ error: 'invalid' }, { status: 401 });
  const s = await getSession();
  s.loggedIn = true;
  await s.save();
  return NextResponse.json({ ok: true });
}
