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

    // Initialize KV connection
    const kv = await Deno.openKv();

    try {
      // Get license data
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
    // Clean up test data from KV store
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

      const body = await req.json();
      const { tokens = 0 } = body;

      // Validate tokens is a number
      if (typeof tokens !== 'number' || isNaN(tokens)) {
        return new Response(JSON.stringify({
          error: "Invalid token count - must be a number"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const kv = await Deno.openKv();
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

      // Update existing license usage data
      const updatedLicense = {
        ...licenseEntry.value,
        lastChecked: now.toISOString(),
        usageData: {
          daily: licenseEntry.value.usageData.daily + tokens,
          monthly: licenseEntry.value.usageData.monthly + tokens
        }
      };

      // Check if we need to reset counters
      const lastChecked = new Date(licenseEntry.value.lastChecked);
      if (lastChecked.getDate() !== now.getDate()) {
        updatedLicense.usageData.daily = tokens;
      }
      if (lastChecked.getMonth() !== now.getMonth()) {
        updatedLicense.usageData.monthly = tokens;
      }

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
      if (typeof kv !== 'undefined') {
        kv.close();
      }
    }
  }
};