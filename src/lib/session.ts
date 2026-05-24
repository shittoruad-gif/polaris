import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = { loggedIn?: boolean };

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'change-this-to-a-32-char-random-string!!',
  cookieName: 'polaris_session',
  cookieOptions: {
    // HTTP配信時はSecureを付けるとブラウザがCookieを保存しないため、明示フラグで制御
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const store = await cookies();
  return getIronSession<SessionData>(store, sessionOptions);
}

export async function requireAuth() {
  const s = await getSession();
  if (!s.loggedIn) throw new Error('UNAUTHORIZED');
  return s;
}
