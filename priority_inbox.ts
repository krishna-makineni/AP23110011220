/**
 * Stage 1: Priority Inbox Algorithm
 * Campus Notifications Platform - Affordmed
 *
 * Fetches notifications from the API and computes the top N priority notifications
 * based on type weight (Placement > Result > Event) and recency.
 */

import { createLogger } from "./src/lib/logger";

const logger = createLogger("PriorityInboxScript");

type NotificationType = "Placement" | "Result" | "Event";

interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

// Priority weights: Placement > Result > Event
const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Compute priority score for a notification.
 * Score = (type_weight * 1000) + (1000 / age_in_seconds + 1)
 *
 * This ensures:
 * 1. Type weight is the dominant factor (multiplied by 1000)
 * 2. Within same type, more recent notifications rank higher
 * 3. Score degrades smoothly as notification ages
 */
function computePriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHTS[notification.Type] ?? 0;
  const ageSeconds =
    (Date.now() - new Date(notification.Timestamp).getTime()) / 1000;
  const recencyScore = 1000 / (ageSeconds + 1);
  const score = weight * 1000 + recencyScore;
  logger.debug("Computed score", { id: notification.ID, type: notification.Type, ageSeconds, score });
  return score;
}

/**
 * Get top N priority notifications from a list.
 * Uses a max-heap approach via sorting for clarity.
 *
 * For production with large N, a proper min-heap of size N would be O(M log N)
 * vs O(M log M) for sort. For typical campus notification volumes, sort is fine.
 */
function getTopNPriorityNotifications(notifications: Notification[], n: number): Notification[] {
  logger.info("Computing top N priority notifications", { total: notifications.length, n });

  const scored = notifications.map((notif) => ({
    notification: notif,
    score: computePriorityScore(notif),
  }));

  scored.sort((a, b) => b.score - a.score);
  const topN = scored.slice(0, n).map((s) => s.notification);

  logger.info("Top N computed", { resultCount: topN.length });
  return topN;
}

async function fetchNotifications(): Promise<Notification[]> {
  const url = "http://20.207.122.201/evaluation-service/notifications";
  const token = "YOUR_TOKEN_HERE"; // Replace with the token you got from the web app
  logger.info("Fetching notifications from API", { url });

  const response = await fetch(url, {
    headers: { 
      "Content-Type": "application/json",
      ...(token !== "YOUR_TOKEN_HERE" && { "Authorization": `Bearer ${token}` })
    },
  });

  if (!response.ok) {
    logger.error("API request failed", { status: response.status });
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  logger.info("Notifications fetched", { count: data.notifications?.length ?? 0 });
  return data.notifications ?? [];
}

async function main() {
  const TOP_N = 10; // Display top 10 notifications

  logger.info("=== Campus Priority Inbox - Stage 1 ===");
  logger.info("Configuration", { TOP_N });

  try {
    const notifications = await fetchNotifications();

    if (notifications.length === 0) {
      logger.warn("No notifications found");
      return;
    }

    const topNotifications = getTopNPriorityNotifications(notifications, TOP_N);

    // Display results
    process.stdout.write(`\n${"=".repeat(70)}\n`);
    process.stdout.write(`TOP ${TOP_N} PRIORITY NOTIFICATIONS\n`);
    process.stdout.write(`${"=".repeat(70)}\n\n`);

    topNotifications.forEach((notif, index) => {
      const score = computePriorityScore(notif);
      const ageMs = Date.now() - new Date(notif.Timestamp).getTime();
      const ageMins = Math.floor(ageMs / 60000);

      process.stdout.write(`#${index + 1} [${notif.Type.toUpperCase()}] ${notif.Message}\n`);
      process.stdout.write(
        `    ID: ${notif.ID}\n` +
        `    Timestamp: ${notif.Timestamp} (${ageMins}m ago)\n` +
        `    Priority Score: ${score.toFixed(2)} (weight: ${TYPE_WEIGHTS[notif.Type]})\n\n`
      );
    });

    process.stdout.write(`${"=".repeat(70)}\n`);
    process.stdout.write(`\nSummary:\n`);
    const counts = { Placement: 0, Result: 0, Event: 0 };
    topNotifications.forEach(n => counts[n.Type]++);
    process.stdout.write(`  Placement: ${counts.Placement}, Result: ${counts.Result}, Event: ${counts.Event}\n`);
    process.stdout.write(`  Total processed: ${notifications.length} | Top N: ${TOP_N}\n\n`);

  } catch (err) {
    logger.error("Script execution failed", { error: String(err) });
    process.exit(1);
  }
}

main();
