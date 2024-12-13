// utils/licenseManager.ts
import { Kv } from "kv";

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

const TIERS = {
  free: {
    dailyLimit: 1000,
    monthlyLimit: 10000,
    features: ['basic_usage']
  },
  pro: {
    dailyLimit: 10000,
    monthlyLimit: 100000,
    features: ['basic_usage', 'advanced_features', 'priority_support']
  },
  enterprise: {
    dailyLimit: -1, // Unlimited
    monthlyLimit: -1,
    features: ['basic_usage', 'advanced_features', 'priority_support', 'custom_features']
  }
};

export async function createLicense(tier: keyof typeof TIERS): Promise<string> {
  const kv = await Deno.openKv();
  try {
    const licenseKey = crypto.randomUUID();
    const tierConfig = TIERS[tier];

    const licenseData: LicenseData = {
      key: licenseKey,
      tier,
      dailyLimit: tierConfig.dailyLimit,
      monthlyLimit: tierConfig.monthlyLimit,
      features: tierConfig.features,
      created: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      usageData: {
        daily: 0,
        monthly: 0
      }
    };

    await kv.set(["licenses", licenseKey], licenseData);
    return licenseKey;

  } finally {
    kv.close();
  }
}

export async function upgradeLicense(key: string, newTier: keyof typeof TIERS): Promise<void> {
  const kv = await Deno.openKv();
  try {
    const licenseEntry = await kv.get<LicenseData>(["licenses", key]);
    if (!licenseEntry.value) {
      throw new Error("License not found");
    }

    const tierConfig = TIERS[newTier];
    const updatedLicense = {
      ...licenseEntry.value,
      tier: newTier,
      dailyLimit: tierConfig.dailyLimit,
      monthlyLimit: tierConfig.monthlyLimit,
      features: tierConfig.features
    };

    await kv.set(["licenses", key], updatedLicense);

  } finally {
    kv.close();
  }
}

export async function deactivateLicense(key: string): Promise<void> {
  const kv = await Deno.openKv();
  try {
    await kv.delete(["licenses", key]);
  } finally {
    kv.close();
  }
}

export async function getLicenseInfo(key: string): Promise<LicenseData | null> {
  const kv = await Deno.openKv();
  try {
    const licenseEntry = await kv.get<LicenseData>(["licenses", key]);
    return licenseEntry.value || null;
  } finally {
    kv.close();
  }
}