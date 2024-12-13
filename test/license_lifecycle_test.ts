// # test/license_lifecycle_test.ts
import { assert, assertEquals, assertExists } from "https://deno.land/std/assert/mod.ts";

interface LicenseInfo {
  valid: boolean;
  tier: string;
  limits: {
    daily: number;
    monthly: number;
  };
  usage: {
    daily: number;
    monthly: number;
  };
  features: string[];
}

Deno.test("License Key Lifecycle", async (t) => {
  const testKey = `test-${Date.now()}-${crypto.randomUUID()}`;
  let licenseInfo: LicenseInfo;

  await t.step("1. Initial License Check", async () => {
    const response = await fetch(`http://localhost:8000/api/license/${testKey}`);
    assertEquals(response.status, 404);
    const data = await response.json();
    assertEquals(data.error, "Invalid license key");
  });

  await t.step("2. First Usage - Should Create License", async () => {
    const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens: 100 })
    });

    assertEquals(response.status, 200);
    const data = await response.json();
    
    assertExists(data.success);
    assertExists(data.usage);
    assertExists(data.limits);
    assertEquals(data.usage.daily, 100);
    assertEquals(data.usage.monthly, 100);
    
    licenseInfo = data;
  });

  await t.step("3. Verify License Info", async () => {
    const response = await fetch(`http://localhost:8000/api/license/${testKey}`);
    assertEquals(response.status, 200);
    const data = await response.json();

    assertEquals(data.usage.daily, licenseInfo.usage.daily);
    assertEquals(data.usage.monthly, licenseInfo.usage.monthly);
    assertEquals(data.limits.daily, licenseInfo.limits.daily);
    assertEquals(data.limits.monthly, licenseInfo.limits.monthly);
  });

  await t.step("4. Cumulative Usage", async () => {
    const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens: 150 })
    });

    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data.usage.daily, 250); // 100 + 150
    assertEquals(data.usage.monthly, 250);
  });

  await t.step("5. Usage Limits", async () => {
    // Try to exceed daily limit
    const exceedLimit = licenseInfo.limits.daily + 1000;
    const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens: exceedLimit })
    });

    assertEquals(response.status, 429); // Too Many Requests
    const data = await response.json();
    assertExists(data.error);
    assert(data.error.includes("limit exceeded"));
  });

  await t.step("6. Invalid Usage Updates", async () => {
    const invalidInputs = [
      { tokens: -1 },
      { tokens: "invalid" },
      { tokens: null },
      { badField: 100 }
    ];

    for (const input of invalidInputs) {
      const response = await fetch(`http://localhost:8000/api/license/${testKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });

      assertEquals(response.status, 400);
      const data = await response.json();
      assertExists(data.error);
    }
  });

  // Clean up test data from KV store
  const kv = await Deno.openKv();
  try {
    await kv.delete(["licenses", testKey]);
  } finally {
    await kv.close();
  }
});