"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavBarProps {
  unreadCount?: number;
}

export default function NavBar({ unreadCount = 0 }: NavBarProps) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navLinks = [
    { href: "/", label: "All Notifications", icon: <NotificationsIcon sx={{ fontSize: 16 }} /> },
    { href: "/priority", label: "Priority Inbox", icon: <StarIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(5, 10, 20, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0, 229, 255, 0.12)",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "4px",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#000", fontWeight: 900, fontSize: "1rem", fontFamily: "Rajdhani, sans-serif" }}>
              CN
            </Typography>
          </Box>
          {!isMobile && (
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                letterSpacing: "0.15em",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 700,
              }}
            >
              CAMPUSNOTIFY
            </Typography>
          )}
        </Box>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link href={link.href} key={link.href} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: { xs: 1.5, sm: 2 },
                    py: 0.75,
                    borderRadius: "4px",
                    border: "1px solid",
                    borderColor: active ? "primary.main" : "transparent",
                    bgcolor: active ? "rgba(0, 229, 255, 0.1)" : "transparent",
                    color: active ? "primary.main" : "text.secondary",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "rgba(0, 229, 255, 0.4)",
                      color: "primary.light",
                    },
                  }}
                >
                  {link.icon}
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Rajdhani, sans-serif",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {link.label}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <Chip
            label={`${unreadCount} unread`}
            size="small"
            sx={{
              bgcolor: "rgba(255, 107, 107, 0.15)",
              color: "secondary.main",
              border: "1px solid rgba(255, 107, 107, 0.4)",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 600,
            }}
          />
        )}
      </Toolbar>
    </AppBar>
  );
}
