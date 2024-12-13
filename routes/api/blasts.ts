// routes/api/blasts.ts
import { Handlers } from "$fresh/server.ts";
import { Resend } from "npm:resend";

interface Subscriber {
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}

export const handler: Handlers = {
  async POST(req: Request) {
    const kv = await Deno.openKv();
    let resend: Resend;

    try {
      // Validate request body
      const body = await req.json();
      const { subject, content } = body;

      console.log("Received blast request:", { subject, contentLength: content?.length });

      if (!subject || !content) {
        throw new Error("Missing required fields: subject and content are required");
      }

      // Initialize Resend
      const apiKey = Deno.env.get("RESEND_API_KEY");
      if (!apiKey) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      resend = new Resend(apiKey);

      // Get subscribers
      const subscribers: Subscriber[] = [];
      const entries = kv.list<Subscriber>({ prefix: ["subscribers"] });
      
      for await (const { value } of entries) {
        if (value && value.status === "active") {
          subscribers.push(value);
        }
      }

      if (subscribers.length === 0) {
        throw new Error("No active subscribers found");
      }

      console.log(`Found ${subscribers.length} active subscribers`);

      // Send emails
      const results = await Promise.allSettled(
        subscribers.map(async (subscriber) => {
          try {
            const response = await resend.emails.send({
              from: "robert@conscious-robot.com",
              replyTo: "robert@conscious-robot.com",
              to: subscriber.email,
              subject,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Hello ${subscriber.firstName}!</h2>
                  ${content}
                  <hr style="margin: 20px 0;">
                  <p style="font-size: 12px; color: #666;">
                    You're receiving this because you subscribed to updates.
                    <a href="https://conscious-robot.com/unsubscribe?email=${encodeURIComponent(subscriber.email)}">
                      Unsubscribe
                    </a>
                  </p>
                </div>
              `.trim(),
            });
            return { email: subscriber.email, status: "success", response };
          } catch (error) {
            console.error(`Failed to send to ${subscriber.email}:`, error);
            return { email: subscriber.email, status: "failed", error: error.message };
          }
        })
      );

      // Analyze results
      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.status === "success"
      ).length;
      
      const failed = results.length - successful;

      return new Response(
        JSON.stringify({
          total: subscribers.length,
          successful,
          failed,
          details: results
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );

    } catch (error) {
      console.error("Blast error:", error);
      
      return new Response(
        JSON.stringify({
          error: "Failed to send email blast",
          details: error.message
        }),
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