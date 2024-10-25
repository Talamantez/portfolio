// routes/setup.tsx
import { PageProps } from "$fresh/server.ts";

export default function SetupPage(props: PageProps) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-lg rounded-lg px-8 py-6">
          <div class="mb-8 text-center">
            <h1 class="text-2xl font-bold text-gray-900">Create Admin User</h1>
            <p class="text-gray-600 mt-2">Set up your first administrator account</p>
          </div>

          <form action="/api/setup" method="POST" class="space-y-6">
            <div>
              <label 
                for="setupKey" 
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Setup Key
              </label>
              <input
                id="setupKey"
                name="setupKey"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin setup key"
              />
            </div>

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
                placeholder="Enter admin username"
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
                minlength={8}
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter secure password"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Admin User
            </button>
          </form>

          <p class="mt-4 text-sm text-gray-500 text-center">
            ⚠️ Remember to remove or protect this route after creating your admin user!
          </p>
        </div>
      </div>
    </div>
  );
}