import { db } from '@/src/db/client';
import { cardScans } from '@/src/db/schema';

export interface ScanMetadata {
  cardId: string;
  contactId?: string;
  deviceType?: string;
  browser?: string;
  referrer?: string;
  ipAddress?: string;
  userAgent?: string;
  geolocation?: {
    country?: string;
    city?: string;
    lat?: number;
    lng?: number;
  };
}

export async function trackScan(metadata: ScanMetadata) {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hourOfDay = now.getHours();

    await db.insert(cardScans).values({
      cardId: metadata.cardId,
      contactId: metadata.contactId || null,
      deviceType: metadata.deviceType || null,
      browser: metadata.browser || null,
      referrer: metadata.referrer || null,
      ipAddress: metadata.ipAddress || null,
      geolocation: metadata.geolocation || null,
      dayOfWeek,
      hourOfDay,
      scannedAt: now,
    });

    return true;
  } catch (error) {
    console.error('Scan tracking error:', error);
    return false;
  }
}

export function parseUserAgent(userAgent: string): {
  deviceType: string;
  browser: string;
} {
  const ua = userAgent.toLowerCase();
  
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
    deviceType = /ipad|tablet/.test(ua) ? 'tablet' : 'mobile';
  }

  let browser = 'other';
  if (/chrome/.test(ua) && !/edg/.test(ua)) browser = 'chrome';
  else if (/safari/.test(ua) && !/chrome/.test(ua)) browser = 'safari';
  else if (/firefox/.test(ua)) browser = 'firefox';
  else if (/edg/.test(ua)) browser = 'edge';

  return { deviceType, browser };
}

// Get geolocation from IP (placeholder - would use real service)
export async function getGeolocation(ipAddress: string): Promise<{
  country?: string;
  city?: string;
  lat?: number;
  lng?: number;
} | null> {
  // TODO: Integrate with IP geolocation service (e.g., ipapi.co, MaxMind)
  return null;
}

