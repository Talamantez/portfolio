import { Component } from "preact";
import { useState } from "preact/hooks";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });
      if (!response.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="newsletter" class="my-12">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
        <p class="text-base md:text-lg mb-6">
          Subscribe to our newsletter for updates and tech insights.
        </p>
        <form onSubmit={handleSubmit} class="max-w-lg mx-auto">
          <div class="mb-4">
            <label htmlFor="subscribe-email" class="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="subscribe-email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label htmlFor="firstName" class="block mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label htmlFor="lastName" class="block mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              class="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300 w-full"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
          {status === "success" && (
            <p class="mt-4 text-center text-green-600">Successfully subscribed!</p>
          )}
          {status === "error" && (
            <p class="mt-4 text-center text-red-600">Failed to subscribe. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}