import { FreshContext } from "$fresh/server.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";

// Define our session and auth state types
export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface User {
  id: string;
  username: string;
  password: string; // Hashed password
  createdAt: number;
}

// Define the state interface with proper Deno.Kv type
export interface State {
  session: Session | null;
  isAdmin: boolean;
  kv?: Deno.Kv;
}

// KV collection prefixes using array keys for proper lexicographic ordering
const SESSION_PREFIX = ["sessions"];
const USER_PREFIX = ["users"];
const USER_BY_USERNAME_PREFIX = ["users_by_username"];
const USER_ADMIN_PREFIX = ["users", "admin"];
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Main middleware handler
export async function handler(
  req: Request,
  ctx: FreshContext<State>,
): Promise<Response> {

  // Initialize auth state
  // ctx.state.session = null;
  // ctx.state.isAdmin = false;
  // Initialize KV if not already present
  if (!ctx.state.kv) {
    ctx.state.kv = await Deno.openKv();
  }

  const cookies = getCookies(req.headers);
  const sessionId = cookies.sessionId;

  if (!sessionId) {
    // No session found, redirect to login
    const url = new URL(req.url);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/login?redirect=${encodeURIComponent(url.pathname)}`,
        "Set-Cookie":
          "sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  }

  // Try to get session from KV
  const sessionEntry = await ctx.state.kv.get<Session>([
    ...SESSION_PREFIX,
    sessionId,
  ]);

  if (!sessionEntry.value || sessionEntry.value.expiresAt <= Date.now()) {
    // Invalid or expired session, clear cookie and redirect to login
    const url = new URL(req.url);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/login?redirect=${encodeURIComponent(url.pathname)}`,
        "Set-Cookie":
          "sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  }

  // Valid session found
  ctx.state.session = sessionEntry.value;

  // Check admin status
  const adminEntry = await ctx.state.kv.get<boolean>([
    ...USER_ADMIN_PREFIX,
    sessionEntry.value.userId,
  ]);
  ctx.state.isAdmin = adminEntry.value || false;

  if (!ctx.state.isAdmin) {
    // User is not an admin, redirect to unauthorized page
    return new Response(null, {
      status: 302,
      headers: { Location: `/unauthorized` },
    });
  }

  // Refresh session if needed
  if (sessionEntry.value.expiresAt - Date.now() < SESSION_DURATION / 2) {
    await refreshSession(ctx.state.kv, sessionEntry.value);
  }

  return await ctx.next();
}

// Helper to create a new user with atomic operation
export async function createUser(
  kv: Deno.Kv,
  username: string,
  hashedPassword: string,
  isAdmin = false,
): Promise<string> {
  const userId = crypto.randomUUID();
  const user: User = {
    id: userId,
    username,
    password: hashedPassword,
    createdAt: Date.now(),
  };
  console.log("preparing result");
  // Use atomic operation to ensure username uniqueness
  const result = await kv.atomic()
    .check({ key: [...USER_BY_USERNAME_PREFIX, username], versionstamp: null })
    .set([...USER_PREFIX, userId], user)
    .set([...USER_BY_USERNAME_PREFIX, username], userId)
    .set([...USER_ADMIN_PREFIX, userId], isAdmin)
    .commit();

  if (!result.ok) {
    throw new Error("Username already exists");
  }

  return userId;
}

// Helper to create a new session
export async function createSession(
  kv: Deno.Kv,
  userId: string,
  headers: Headers,
): Promise<Session> {
  const session: Session = {
    id: crypto.randomUUID(),
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };

  await kv.set([...SESSION_PREFIX, session.id], session);

  setCookie(headers, {
    name: "sessionId",
    value: session.id,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: SESSION_DURATION / 1000,
  });

  return session;
}

// Helper to refresh a session
async function refreshSession(kv: Deno.Kv, session: Session): Promise<Session> {
  const updatedSession: Session = {
    ...session,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  await kv.set([...SESSION_PREFIX, session.id], updatedSession);
  return updatedSession;
}

// Helper to end a session
export async function endSession(
  kv: Deno.Kv,
  sessionId: string,
  headers: Headers,
): Promise<void> {
  await kv.delete([...SESSION_PREFIX, sessionId]);

  deleteCookie(headers, "sessionId", {
    path: "/",
    secure: true,
    httpOnly: true,
  });
}

// Helper to verify user credentials using KV getMany for efficient lookups
export async function verifyCredentials(
  kv: Deno.Kv,
  username: string,
  password: string,
): Promise<string | null> {
  const userIdEntry = await kv.get<string>([
    ...USER_BY_USERNAME_PREFIX,
    username,
  ]);
  if (!userIdEntry.value) return null;

  const userEntry = await kv.get<User>([...USER_PREFIX, userIdEntry.value]);
  if (!userEntry.value) return null;

  if (userEntry.value.password !== password) return null;

  return userEntry.value.id;
}

// Helper to list all sessions for a user
export async function listUserSessions(
  kv: Deno.Kv,
  userId: string,
): Promise<Session[]> {
  const sessions: Session[] = [];
  const sessionsIterator = kv.list<Session>({ prefix: SESSION_PREFIX });

  for await (const entry of sessionsIterator) {
    if (entry.value.userId === userId) {
      sessions.push(entry.value);
    }
  }

  return sessions;
}
