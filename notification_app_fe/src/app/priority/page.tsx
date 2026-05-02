"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box, Container, Typography, Alert, Button, Skeleton, Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon from "@mui/icons-material/Star";
import NavBar from "@/components/NavBar";
import NotificationCard from "@/components/NotificationCard";
import { Notification, fetchNotifications, getTopNPriorityNotifications } from "@/lib/notifications";
import { createLogger } from "@/lib/logger";

const logger = createLogger("PriorityInboxPage");

export default function PriorityInboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const loadPriorityNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.info("Loading priority notifications");
    try {
      // Fetch a larger set to ensure we have enough to sort and pick top 10
      const data = await fetchNotifications({ limit: 50 });
      const top10 = getTopNPriorityNotifications(data, 10);
      setNotifications(top10);
    } catch (err) {
      logger.error("Failed to load priority notifications", { error: String(err) });
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("read_notification_ids");
    if (stored) setReadIds(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => { loadPriorityNotifications(); }, [loadPriorityNotifications]);

  const handleMarkRead = useCallback((id: string) => {
    logger.info("Marking priority notification as read", { id });
    setReadIds((prev) => {
      const next = new Set(prev); next.add(id);
      sessionStorage.setItem("read_notification_ids", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const unreadCount = notifications.filter(n => !readIds.has(n.ID)).length;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <NavBar unreadCount={unreadCount} />
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <StarIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography variant="h3" sx={{ color: "text.primary", lineHeight: 1 }}>PRIORITY INBOX</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Top 10 notifications prioritized by importance and recency
            </Typography>
          </Box>
          <Button size="small" startIcon={<RefreshIcon />} onClick={loadPriorityNotifications} disabled={loading} variant="outlined"
            sx={{ borderColor: "rgba(0,229,255,0.3)", color: "primary.main", "&:hover": { borderColor: "primary.main" } }}>
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "divider" }} />

        {error ? (
          <Alert severity="error" sx={{ bgcolor: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)" }}
            action={<Button size="small" onClick={loadPriorityNotifications} sx={{ color: "secondary.main" }}>Retry</Button>}>
            {error}
          </Alert>
        ) : loading ? (
          <Box>{[...Array(5)].map((_, i) => <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 1.5, borderRadius: 1, bgcolor: "rgba(255,255,255,0.05)" }} />)}</Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center", border: "1px dashed rgba(0,229,255,0.15)", borderRadius: 2 }}>
            <StarIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: "text.secondary" }}>No priority notifications found</Typography>
          </Box>
        ) : (
          <Box>
            {notifications.map((notification, index) => (
              <NotificationCard 
                key={notification.ID} 
                notification={notification} 
                isRead={readIds.has(notification.ID)} 
                onMarkRead={handleMarkRead}
                isPriority={true}
                priorityRank={index + 1}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
