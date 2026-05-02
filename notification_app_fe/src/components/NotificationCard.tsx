"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import StarIcon from "@mui/icons-material/Star";
import CircleIcon from "@mui/icons-material/Circle";
import { Notification, NotificationType } from "@/lib/notifications";

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  isPriority?: boolean;
  priorityRank?: number;
  onMarkRead: (id: string) => void;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  Placement: {
    color: "#00E5FF",
    bgColor: "rgba(0, 229, 255, 0.08)",
    icon: <WorkIcon sx={{ fontSize: 16 }} />,
    label: "PLACEMENT",
  },
  Result: {
    color: "#FF6B6B",
    bgColor: "rgba(255, 107, 107, 0.08)",
    icon: <EmojiEventsIcon sx={{ fontSize: 16 }} />,
    label: "RESULT",
  },
  Event: {
    color: "#FFD600",
    bgColor: "rgba(255, 214, 0, 0.08)",
    icon: <EventIcon sx={{ fontSize: 16 }} />,
    label: "EVENT",
  },
};

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export default function NotificationCard({
  notification,
  isRead,
  isPriority,
  priorityRank,
  onMarkRead,
}: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.Type];

  return (
    <Card
      onClick={() => !isRead && onMarkRead(notification.ID)}
      sx={{
        mb: 1.5,
        cursor: isRead ? "default" : "pointer",
        bgcolor: isRead ? "background.paper" : config.bgColor,
        border: "1px solid",
        borderColor: isRead ? "divider" : config.color + "33",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          borderColor: isRead ? "divider" : config.color + "66",
          transform: isRead ? "none" : "translateX(4px)",
        },
        "&::before": !isRead
          ? {
              content: '""',
              position: "absolute",
              left: -3,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: "60%",
              bgcolor: config.color,
              borderRadius: "0 2px 2px 0",
            }
          : {},
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          {/* Priority rank badge */}
          {isPriority && priorityRank && (
            <Box
              sx={{
                minWidth: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: config.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                mt: 0.25,
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: config.color, fontWeight: 700, fontSize: "0.65rem" }}
              >
                #{priorityRank}
              </Typography>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={config.icon as React.ReactElement}
                label={config.label}
                size="small"
                sx={{
                  bgcolor: "transparent",
                  color: config.color,
                  border: "1px solid " + config.color + "55",
                  height: 20,
                  "& .MuiChip-label": { px: 0.75, fontSize: "0.6rem" },
                  "& .MuiChip-icon": { color: config.color + " !important", ml: 0.5 },
                }}
              />
              {isPriority && (
                <Tooltip title="Priority notification">
                  <StarIcon sx={{ fontSize: 14, color: "#FFD600" }} />
                </Tooltip>
              )}
              {!isRead && (
                <CircleIcon
                  sx={{ fontSize: 8, color: config.color, animation: "pulse 2s infinite" }}
                />
              )}
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: isRead ? "text.secondary" : "text.primary",
                fontWeight: isRead ? 400 : 700,
                fontSize: "0.85rem",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
              }}
            >
              {notification.Message}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {new Date(notification.Timestamp).toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: config.color + "99" }}>
                · {formatRelativeTime(notification.Timestamp)}
              </Typography>
            </Box>
          </Box>

          {/* Unread indicator */}
          {!isRead && (
            <Tooltip title="Click to mark as read">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.ID);
                }}
                sx={{
                  color: config.color,
                  opacity: 0.7,
                  p: 0.5,
                  "&:hover": { opacity: 1 },
                }}
              >
                <CircleIcon sx={{ fontSize: 10 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
