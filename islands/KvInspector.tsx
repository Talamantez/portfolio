import { useState } from 'preact/hooks';

export default function KVInspector() {
  const [data, setData] = useState(null);
  const [prefix, setPrefix] = useState('subscribers');
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/kv-inspect?prefix=${prefix}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">KV Store Inspector</h1>
      
      <div className="mb-4 space-y-2">
        <input
          type="password"
          placeholder="Admin Token"
          className="w-full p-2 border rounded"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prefix (e.g., subscribers)"
          className="w-full p-2 border rounded"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="p-2 bg-gray-100 rounded">
            Total Entries: {data.total}
          </div>
          {data.entries.map((entry, i) => (
            <div key={i} className="p-4 border rounded">
              <div className="font-mono text-sm">
                <div className="font-bold">Key: {JSON.stringify(entry.key)}</div>
                <div className="mt-2 whitespace-pre-wrap">
                  Value: {JSON.stringify(entry.value, null, 2)}
                </div>
                <div className="text-gray-500 mt-2">
                  Version: {entry.versionstamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}