// middleware/session.ts
export interface SessionState {
  isAdmin: boolean;
  username: string;
}

export async function getSession(req: Request): Promise<SessionState | null> {
  const cookies = req.headers.get("cookie");
  console.log("[Session] Raw cookies:", cookies);
  
  const sessionCookie = cookies?.match(/session=([^;]+)/)?.[1];
  console.log("[Session] Extracted session cookie:", sessionCookie);

  if (!sessionCookie) {
    console.log("[Session] No session cookie found");
    return null;
  }
  
  try {
    const decoded = atob(sessionCookie);
    console.log("[Session] Decoded cookie:", decoded);
    const session = JSON.parse(decoded);
    console.log("[Session] Parsed session:", session);
    return session;
  } catch (error) {
    console.error("[Session] Error parsing session:", error);
    return null;
  }
}

export function createSessionCookie(data: SessionState): string {
  const encoded = btoa(JSON.stringify(data));
  console.log("[Session] Creating new session cookie. Data:", data);
  return `session=${encoded}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`;
}