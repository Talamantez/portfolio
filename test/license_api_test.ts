/// <reference lib="deno.unstable" />
// test/license_api_test.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

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

Deno.test({
  name: "License API Tests",
  async fn(t) {
    const kv = await Deno.openKv();
    const testKey = "test-key-123";
    
    // Set up test data
    const testLicense: LicenseData = {
      key: testKey,
      tier: "pro",
      dailyLimit: 1000,
      monthlyLimit: 10000,
      features: ["basic_usage", "advanced_features"],
      created: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      usageData: {
        daily: 0,
        monthly: 0
      }
    };

    // Clean up function
    async function cleanup() {
      await kv.delete(["licenses", testKey]);
      await kv.close();
    }

    // Test invalid license key
    await t.step("GET /api/license/[key] - invalid key", async () => {
      const response = await fetch(`http://localhost:8000/api/license/invalid-key`);
      assertEquals(response.status, 404);
      const data = await response.json();
      assertEquals(data.error, "Invalid license key");
    });

    // Test valid license key
    await t.step("GET /api/license/[key] - valid key", async () => {
      // Set up test license
      await kv.set(["licenses", testKey], testLicense);

      const response = await fetch(`http://localhost:8000/api/license/${testKey}`);
      assertEquals(response.status, 200);
      const data = await response.json();
      assertEquals(data.valid, true);
      assertEquals(data.tier, "pro");
    });

    // Test update usage
    await t.step("POST /api/license/[key] - update usage", async () => {
      const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokens: 5 }),
      });

      assertEquals(response.status, 200);
      const data = await response.json();
      assertEquals(data.success, true);
      assertEquals(data.usage.daily, 5);
    });

    // Test cumulative usage
    await t.step("POST /api/license/[key] - cumulative usage", async () => {
      const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokens: 10 }),
      });

      assertEquals(response.status, 200);
      const data = await response.json();
      assertEquals(data.success, true);
      assertEquals(data.usage.daily, 15); // 5 + 10
    });

    // Test malformed request
    await t.step("POST /api/license/[key] - malformed request", async () => {
      const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{invalid json}",
      });

      assertEquals(response.status, 500);
      const data = await response.json();
      assertEquals(data.error, "Internal server error");
    });

    // Test invalid token count
    await t.step("POST /api/license/[key] - invalid token count", async () => {
      const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokens: "invalid" }),
      });

      assertEquals(response.status, 500);
    });

    // Register cleanup to run at the end
    await t.step({
      name: "cleanup",
      fn: async () => {
        await cleanup();
      },
      sanitizeResources: false,
      sanitizeOps: false
    });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});