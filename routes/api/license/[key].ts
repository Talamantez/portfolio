// routes/api/license/[key].ts
import { Handlers } from "$fresh/server.ts";

interface LicenseData {
  key: string;
  tier: string;
  dailyLimit: number;
  monthlyLimit: number;
  features: string[];
  created: string;
  lastChecked: string;
  usageData: {
    daily: number;
    monthly: number;
  };
}

export const handler: Handlers = {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const key = url.pathname.split("/").pop();

    if (!key) {
      return new Response(JSON.stringify({
        error: "No license key provided"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const kv = await Deno.openKv();

    try {
      const licenseEntry = await kv.get<LicenseData>(["licenses", key]);

      if (!licenseEntry.value) {
        return new Response(JSON.stringify({
          error: "Invalid license key"
        }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Update last checked timestamp
      const updatedLicense = {
        ...licenseEntry.value,
        lastChecked: new Date().toISOString()
      };

      await kv.set(["licenses", key], updatedLicense);

      return new Response(JSON.stringify({
        valid: true,
        tier: updatedLicense.tier,
        limits: {
          daily: updatedLicense.dailyLimit,
          monthly: updatedLicense.monthlyLimit
        },
        usage: updatedLicense.usageData,
        features: updatedLicense.features
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error('License validation error:', error);
      return new Response(JSON.stringify({
        error: "Internal server error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    } finally {
      kv.close();
    }
  },

  async POST(req, _ctx) {
    const kv = await Deno.openKv();
    try {
      const url = new URL(req.url);
      const key = url.pathname.split("/").pop();

      if (!key) {
        return new Response(JSON.stringify({
          error: "No license key provided"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const body = await req.json().catch(() => ({}));
      const { tokens } = body;

      // Validate tokens
      if (typeof tokens !== 'number' || isNaN(tokens) || tokens < 0) {
        return new Response(JSON.stringify({
          error: "Invalid token count - must be a positive number"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const licenseEntry = await kv.get<LicenseData>(["licenses", key]);
      const now = new Date();

      // Create new license if it doesn't exist
      if (!licenseEntry.value) {
        const newLicense: LicenseData = {
          key,
          tier: "free",
          dailyLimit: 1000,
          monthlyLimit: 10000,
          features: ["basic_usage"],
          created: now.toISOString(),
          lastChecked: now.toISOString(),
          usageData: {
            daily: tokens,
            monthly: tokens
          }
        };

        // Check if initial usage exceeds limits
        if (tokens > newLicense.dailyLimit || tokens > newLicense.monthlyLimit) {
          return new Response(JSON.stringify({
            error: "Usage exceeds license limits"
          }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
          });
        }

        await kv.set(["licenses", key], newLicense);

        return new Response(JSON.stringify({
          success: true,
          usage: newLicense.usageData,
          limits: {
            daily: newLicense.dailyLimit,
            monthly: newLicense.monthlyLimit
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      // Calculate new usage
      let newDailyUsage = licenseEntry.value.usageData.daily;
      let newMonthlyUsage = licenseEntry.value.usageData.monthly;
      const lastChecked = new Date(licenseEntry.value.lastChecked);

      // Reset counters if needed
      if (lastChecked.getDate() !== now.getDate()) {
        newDailyUsage = tokens;
      } else {
        newDailyUsage += tokens;
      }

      if (lastChecked.getMonth() !== now.getMonth()) {
        newMonthlyUsage = tokens;
      } else {
        newMonthlyUsage += tokens;
      }

      // Check limits
      if (newDailyUsage > licenseEntry.value.dailyLimit && licenseEntry.value.dailyLimit !== -1) {
        return new Response(JSON.stringify({
          error: "Daily usage limit exceeded"
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (newMonthlyUsage > licenseEntry.value.monthlyLimit && licenseEntry.value.monthlyLimit !== -1) {
        return new Response(JSON.stringify({
          error: "Monthly usage limit exceeded"
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Update license with new usage data
      const updatedLicense = {
        ...licenseEntry.value,
        lastChecked: now.toISOString(),
        usageData: {
          daily: newDailyUsage,
          monthly: newMonthlyUsage
        }
      };

      await kv.set(["licenses", key], updatedLicense);

      return new Response(JSON.stringify({
        success: true,
        usage: updatedLicense.usageData,
        limits: {
          daily: updatedLicense.dailyLimit,
          monthly: updatedLicense.monthlyLimit
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      console.error('Usage update error:', error);
      return new Response(JSON.stringify({
        error: "Internal server error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    } finally {
      kv.close();
    }
  }
};