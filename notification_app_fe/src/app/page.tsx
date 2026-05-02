"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Container, Typography, ToggleButtonGroup, ToggleButton,
  Alert, Button, Skeleton, Divider, InputAdornment, TextField, Pagination,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import SearchIcon from "@mui/icons-material/Search";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NavBar from "@/components/NavBar";
import NotificationCard from "@/components/NotificationCard";
import { Notification, NotificationType, fetchNotifications } from "@/lib/notifications";
import { createLogger } from "@/lib/logger";

const logger = createLogger("AllNotificationsPage");
const PAGE_SIZE = 20;

const TYPE_FILTERS: { value: NotificationType | "All"; label: string; icon: React.ReactNode }[] = [
  { value: "All", label: "All", icon: <AllInboxIcon sx={{ fontSize: 16 }} /> },
  { value: "Placement", label: "Placements", icon: <WorkIcon sx={{ fontSize: 16 }} /> },
  { value: "Result", label: "Results", icon: <EmojiEventsIcon sx={{ fontSize: 16 }} /> },
  { value: "Event", label: "Events", icon: <EventIcon sx={{ fontSize: 16 }} /> },
];

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<NotificationType | "All">("All");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    logger.info("Loading notifications", { typeFilter, page });
    try {
      const params: Parameters<typeof fetchNotifications>[0] = { limit: PAGE_SIZE, page };
      if (typeFilter !== "All") params.notification_type = typeFilter;
      const data = await fetchNotifications(params);
      setNotifications(data);
      setTotalPages(data.length === PAGE_SIZE ? page + 1 : page);
    } catch (err) {
      logger.error("Failed to load notifications", { error: String(err) });
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, [typeFilter, page]);

  useEffect(() => {
    const stored = sessionStorage.getItem("read_notification_ids");
    if (stored) setReadIds(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const handleMarkRead = useCallback((id: string) => {
    logger.info("Marking notification as read", { id });
    setReadIds((prev) => {
      const next = new Set(prev); next.add(id);
      sessionStorage.setItem("read_notification_ids", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const handleMarkAllRead = useCallback(() => {
    logger.info("Marking all as read");
    setReadIds((prev) => {
      const next = new Set([...prev, ...notifications.map(n => n.ID)]);
      sessionStorage.setItem("read_notification_ids", JSON.stringify([...next]));
      return next;
    });
  }, [notifications]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return notifications;
    const q = searchQuery.toLowerCase();
    return notifications.filter(n => n.Message.toLowerCase().includes(q) || n.Type.toLowerCase().includes(q));
  }, [notifications, searchQuery]);

  const unreadCount = useMemo(() => notifications.filter(n => !readIds.has(n.ID)).length, [notifications, readIds]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <NavBar unreadCount={unreadCount} />
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ color: "text.primary", lineHeight: 1, mb: 0.5 }}>NOTIFICATIONS</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {unreadCount > 0 ? <><Box component="span" sx={{ color: "primary.main" }}>{unreadCount}</Box> unread · {notifications.length} total</> : `${notifications.length} notifications · all read`}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {unreadCount > 0 && (
              <Button size="small" startIcon={<DoneAllIcon />} onClick={handleMarkAllRead} variant="outlined"
                sx={{ borderColor: "rgba(0,229,255,0.3)", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}>
                Mark all read
              </Button>
            )}
            <Button size="small" startIcon={<RefreshIcon />} onClick={loadNotifications} disabled={loading} variant="outlined"
              sx={{ borderColor: "rgba(0,229,255,0.3)", color: "primary.main", "&:hover": { borderColor: "primary.main" } }}>
              Refresh
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <ToggleButtonGroup value={typeFilter} exclusive
            onChange={(_, val) => { if (val !== null) { setTypeFilter(val); setPage(1); } }}
            size="small"
            sx={{ "& .MuiToggleButton-root": { borderColor: "rgba(0,229,255,0.2)", color: "text.secondary", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, letterSpacing: "0.06em", "&.Mui-selected": { bgcolor: "rgba(0,229,255,0.1)", color: "primary.main", borderColor: "primary.main" } } }}>
            {TYPE_FILTERS.map(f => (
              <ToggleButton key={f.value} value={f.value} sx={{ gap: 0.5, px: 2 }}>{f.icon}{f.label}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField size="small" placeholder="Search notifications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} /></InputAdornment> } }}
            sx={{ flex: 1, maxWidth: 320, "& .MuiOutlinedInput-root": { bgcolor: "background.paper", "& fieldset": { borderColor: "rgba(0,229,255,0.2)" }, "&:hover fieldset": { borderColor: "rgba(0,229,255,0.4)" }, "&.Mui-focused fieldset": { borderColor: "primary.main" } } }} />
        </Box>

        <Divider sx={{ mb: 3, borderColor: "divider" }} />

        {error ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Alert severity={error.includes("401") || error.includes("Unauthorized") ? "warning" : "error"} 
              sx={{ bgcolor: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", mb: 2 }}
              action={
                <Button size="small" onClick={() => (window as any).openAuthModal?.()} sx={{ color: "primary.main", fontWeight: 700 }}>
                  Fix Authentication
                </Button>
              }>
              {error.includes("401") || error.includes("Unauthorized") 
                ? "Authentication required to view notifications." 
                : error}
            </Alert>
            <Button startIcon={<RefreshIcon />} onClick={loadNotifications} variant="text" sx={{ color: "text.secondary" }}>Retry Fetch</Button>
          </Box>
        ) : loading ? (
          <Box>{[...Array(6)].map((_, i) => <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 1.5, borderRadius: 1, bgcolor: "rgba(255,255,255,0.05)" }} />)}</Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center", border: "1px dashed rgba(0,229,255,0.15)", borderRadius: 2 }}>
            <AllInboxIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "text.secondary" }}>No notifications found</Typography>
          </Box>
        ) : (
          <>
            {filtered.map(notification => (
              <NotificationCard key={notification.ID} notification={notification} isRead={readIds.has(notification.ID)} onMarkRead={handleMarkRead} />
            ))}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary"
                  sx={{ "& .MuiPaginationItem-root": { color: "text.secondary", borderColor: "divider", "&.Mui-selected": { bgcolor: "rgba(0,229,255,0.15)", color: "primary.main" } } }} />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
