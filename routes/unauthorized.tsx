// routes/unauthorized.tsx
export default function UnauthorizedPage() {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div class="w-full max-w-md">
          <div class="bg-white shadow-lg rounded-lg px-8 py-6 text-center">
            <div class="mb-6">
              <div class="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span class="text-yellow-600 text-2xl">⚠️</span>
              </div>
            </div>
            
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              Unauthorized Access
            </h1>
            
            <p class="text-gray-600 mb-6">
              You don't have permission to access the admin area.
              Please contact your administrator if you believe this is an error.
            </p>
  
            <a
              href="/"
              class="inline-block bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }