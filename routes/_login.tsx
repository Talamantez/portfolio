// routes/login.tsx
import { PageProps } from "$fresh/server.ts";

export default function LoginPage(props: PageProps) {
  const searchParams = new URLSearchParams(props.url.search);
  const redirect = searchParams.get('redirect') || '/admin/dashboard';
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
          {/* Changed the form action to just /login */}
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