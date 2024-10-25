import { useState } from "preact/hooks";

export default function KvInspect() {
  const [data, setData] = useState(null);
  const [prefix, setPrefix] = useState("subscribers");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/kv-inspect?prefix=${prefix}`, {
        headers: {
          "Authorization": token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });

      // Handle different status codes
      if (response.status === 401) {
        throw new Error("Invalid admin token - please check your credentials");
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setData(data);
        console.log("data:", data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">KV Store Inspector</h1>

        <div className="mb-4 space-y-2">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Admin Token</label>
            <input
              type="password"
              placeholder="Bearer token"
              className="w-full p-2 border rounded"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-600">Prefix</label>
            <input
              type="text"
              placeholder="e.g., subscribers"
              className="w-full p-2 border rounded"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading || !token}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Loading..." : "Fetch Data"}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-4">
            <div className="p-2 bg-gray-100 rounded">
              Total Entries: {data.total}
            </div>
            {data.entries.map((entry, i) => (
              <div key={i} className="p-4 border rounded">
                <pre className="whitespace-pre-wrap">
                {JSON.stringify(entry, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
