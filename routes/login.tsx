// routes/login.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { createSessionCookie } from "../middleware/session.ts";

// Handler for both GET and POST
export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const username = form.get("username")?.toString();
      const password = form.get("password")?.toString();
      const redirect = form.get("redirect")?.toString() ||
        "/admin/kv-inspector";

      console.log("[Login] Processing login for:", username);
      console.log("[Login] Redirect target:", redirect);

      if (!username || !password) {
        return new Response("", {
          status: 303,
          headers: {
            Location: `/login?error=invalid&redirect=${
              encodeURIComponent(redirect)
            }`,
          },
        });
      }

      // Find user by username
      const usersIterator = ctx.state.kv.list({ prefix: ["users"] });
      let userFound = null;

      for await (const entry of usersIterator) {
        if (entry.value?.username === username) {
          userFound = entry.value;
          break;
        }
      }

      if (!userFound) {
        return new Response("", {
          status: 303,
          headers: {
            Location: `/login?error=invalid&redirect=${
              encodeURIComponent(redirect)
            }`,
          },
        });
      }

      // Hash and compare password
      const hashedPassword = await hashPassword(password);
      const passwordMatch = hashedPassword === userFound.password;

      if (!passwordMatch) {
        return new Response("", {
          status: 303,
          headers: {
            Location: `/login?error=invalid&redirect=${
              encodeURIComponent(redirect)
            }`,
          },
        });
      }

      // Create session
      const sessionData = {
        isAdmin: true,
        username: username,
      };

      const sessionCookie = createSessionCookie(sessionData);
      console.log("[Login] Setting cookie:", sessionCookie);

      return new Response("", {
        status: 303,
        headers: {
          Location: redirect,
          "Set-Cookie": sessionCookie,
        },
      });
    } catch (error) {
      console.error("[Login] Error:", error);
      return new Response("", {
        status: 303,
        headers: { Location: "/login?error=server" },
      });
    }
  },

  // Handle OPTIONS requests for CORS
  OPTIONS(req) {
    return new Response(null, {
      headers: {
        "Allow": "GET, POST, OPTIONS",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  },
};


// Page component
export default function LoginPage(props: PageProps) {
  const searchParams = new URLSearchParams(props.url.search);
  const redirect = searchParams.get('redirect') || '/admin/kv-inspect';
  const error = searchParams.get('error');

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-lg rounded-lg px-8 py-6">
          <div class="mb-8 text-center">
            <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p class="text-gray-600 mt-2">Enter your credentials to access the admin area</p>
          </div>
          {error && (
            <div class="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
              {error === 'invalid'
                ? 'Invalid username or password'
                : 'An error occurred during login'}
            </div>
          )}
          <form action="/login" method="POST" class="space-y-6">
            <input type="hidden" name="redirect" value={redirect} />
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function for password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}