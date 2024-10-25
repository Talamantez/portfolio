// routes/api/setup.ts
import { FreshContext } from "$fresh/server.ts";
import { State } from "../../middleware/auth.ts";
import { createUser } from "../../middleware/auth.ts";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    // Initialize KV if it doesn't exist
    if (!ctx.state.kv) {
      console.log("[setup] Initializing KV connection...");
      ctx.state.kv = await Deno.openKv();
      console.log("[setup] KV connection established");
    }

    const form = await req.formData();
    const setupKey = form.get("setupKey");
    const username = form.get("username");
    const password = form.get("password");

    // Get the setup key from environment
    const requiredSetupKey = Deno.env.get("ADMIN_SETUP_KEY");
    
    if (!requiredSetupKey) {
      console.error("ADMIN_SETUP_KEY not configured in environment");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error" 
        }), {
          headers: { "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    // Verify setup key matches
    if (!setupKey || setupKey !== requiredSetupKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid setup key" 
        }), {
          headers: { "Content-Type": "application/json" },
          status: 403
        }
      );
    }

    // Validate inputs
    if (!username || !password || 
        typeof username !== 'string' || 
        typeof password !== 'string') {
      throw new Error("Invalid username or password");
    }

    // Check password length
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const userId = await createUser(ctx.state.kv, username, hashedPassword, true);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Admin user created successfully",
      userId 
    }), {
      headers: { "Content-Type": "application/json" },
      status: 201
    });

  } catch (error) {
    console.error("Setup error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    });
  }
}