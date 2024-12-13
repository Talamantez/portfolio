// routes/admin/newsletter.tsx
import { useState } from "preact/hooks";

export default function Newsletter() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/blasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });
      if (!response.ok) throw new Error("Failed to send blast");
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div class="max-w-4xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Send Newsletter</h1>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label class="block mb-2">Content (HTML)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
            rows={10}
            class="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
        >
          {status === "sending" ? "Sending..." : "Send Newsletter"}
        </button>
      </form>
    </div>
  );
};