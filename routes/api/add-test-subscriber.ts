// routes/api/add-test-subscriber.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request) {
    const kv = await Deno.openKv();
    try {
      const testSubscriber = {
        email: "robert.m.talamantez@gmail.com",
        firstName: "Test",
        lastName: "User",
        createdAt: new Date().toISOString(),
        status: "active"
      };

      await kv.set(["subscribers", testSubscriber.email], testSubscriber);
      
      return new Response(
        JSON.stringify({ 
          message: "Test subscriber added",
          subscriber: testSubscriber 
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("Error adding test subscriber:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    } finally {
      await kv.close();
    }
  }
};