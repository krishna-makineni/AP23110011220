import { createLogger } from "./logger";

const logger = createLogger("NotificationService");

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

const API_BASE = "/api/notifications";

export const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export async function fetchNotifications(params?: {
  limit?: number;
  page?: number;
  notification_type?: NotificationType;
}): Promise<Notification[]> {
  logger.info("Fetching notifications", { params });

  const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const url = new URL(API_BASE, base);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.notification_type)
    url.searchParams.set("notification_type", params.notification_type);

  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const res = await fetch(url.toString(), {
      headers: { 
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      const errData = await res.json();
      const msg = errData.message || errData.error || `API error: ${res.status}`;
      logger.error("API request failed", { status: res.status, message: msg });
      
      // Clear invalid token on 401
      if (res.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        throw new Error("Invalid or expired token. Please authenticate again.");
      }
      
      throw new Error(msg);
    }

    const data: NotificationsResponse = await res.json();
    logger.info("Notifications fetched successfully", {
      count: data.notifications?.length ?? 0,
    });
    return data.notifications ?? [];
  } catch (err) {
    logger.error("Failed to fetch notifications", { error: String(err) });
    throw err;
  }
}

/**
 * Priority score = type weight * 1000 + recency score
 * Recency score = 1 / (age in seconds + 1) * 1000
 */
export function computePriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHTS[notification.Type] ?? 0;
  const ageSeconds =
    (Date.now() - new Date(notification.Timestamp).getTime()) / 1000;
  const recencyScore = 1000 / (ageSeconds + 1);
  return weight * 1000 + recencyScore;
}

export function getTopNPriorityNotifications(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  logger.info("Computing top priority notifications", { total: notifications.length, n });
  return [...notifications]
    .sort((a, b) => {
      // Primary: Weightage (Placement > Result > Event)
      const weightA = TYPE_WEIGHTS[a.Type] || 0;
      const weightB = TYPE_WEIGHTS[b.Type] || 0;
      if (weightA !== weightB) {
        return weightB - weightA;
      }
      // Secondary: Recency (Most recent first)
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, n);
}
