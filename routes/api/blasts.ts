import { Handlers } from "$fresh/server.ts";
import { Resend } from "npm:resend";

interface Subscriber {
  email: string;
  firstName: string;
  lastName: string;
  status: string;
}

interface EmailResult {
  success: boolean;
  email: string;
  error?: string;
  data?: any;
}

export const handler: Handlers = {
  async POST(req: Request, _ctx) {
    const kv = await Deno.openKv();
    const results: EmailResult[] = [];
    
    try {
      console.log("[Email Blast] Starting process");
      
      // Validate request body
      const body = await req.json().catch((e) => {
        console.error("[Email Blast] JSON parse error:", e);
        return {};
      });
      
      const { subject, content } = body;
      console.log("[Email Blast] Request payload:", { subject, contentLength: content?.length });
      
      if (!subject || !content) {
        throw new Error("Subject and content are required");
      }

      // Validate Resend API key
      const apiKey = Deno.env.get("RESEND_API_KEY");
      if (!apiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }
      
      // Initialize Resend with validation
      const resend = new Resend(apiKey);
      if (!resend) {
        throw new Error("Failed to initialize Resend client");
      }
      console.log("[Email Blast] Resend client initialized");

      // Fetch subscribers with validation
      const entries = kv.list<Subscriber>({ prefix: ["subscribers"] });
      const subscribers: Subscriber[] = [];
      
      for await (const { value } of entries) {
        if (value && value.status === "active") {
          if (!value.email || !value.firstName) {
            console.warn("[Email Blast] Invalid subscriber data:", value);
            continue;
          }
          subscribers.push(value);
        }
      }
      
      console.log(`[Email Blast] Found ${subscribers.length} valid subscribers`);
      
      if (subscribers.length === 0) {
        throw new Error("No active subscribers found");
      }

      // Send emails with individual error handling
      for (const subscriber of subscribers) {
        try {
          console.log(`[Email Blast] Sending to ${subscriber.email}`);
          
          const response = await resend.emails.send({
            from: "Tester <onboarding@resend.dev>",
            // from: "Robert Peng <robert@conscious-robot.com>",
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

          console.log(`[Email Blast] Success for ${subscriber.email}:`, response);
          results.push({
            success: true,
            email: subscriber.email,
            data: response
          });
        } catch (error) {
          console.error(`[Email Blast] Failed for ${subscriber.email}:`, error);
          results.push({
            success: false,
            email: subscriber.email,
            error: error.message || 'Unknown error'
          });
        }
      }

      // Generate detailed summary
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log("[Email Blast] Complete summary:", {
        total: subscribers.length,
        successful,
        failed,
        results
      });

      return new Response(
        JSON.stringify({
          total: subscribers.length,
          successful,
          failed,
          results
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    } catch (error) {
      console.error("[Email Blast] Critical error:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to send email blast",
          details: error.message,
          results
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