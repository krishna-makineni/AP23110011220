"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00E5FF",
      light: "#6EFFFF",
      dark: "#00B2CC",
      contrastText: "#000000",
    },
    secondary: {
      main: "#FF6B6B",
      light: "#FF9E9E",
      dark: "#C73B3B",
    },
    background: {
      default: "#050A14",
      paper: "#0D1628",
    },
    text: {
      primary: "#E8F4FD",
      secondary: "#7B9BB5",
    },
    success: { main: "#00C853" },
    warning: { main: "#FFD600" },
    info: { main: "#00E5FF" },
    error: { main: "#FF6B6B" },
    divider: "rgba(0, 229, 255, 0.12)",
  },
  typography: {
    fontFamily: '"Space Mono", "Courier New", monospace',
    h1: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 700,
      letterSpacing: "0.05em",
    },
    h2: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 700,
      letterSpacing: "0.04em",
    },
    h3: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 600,
      letterSpacing: "0.03em",
    },
    h4: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Space Mono", monospace',
      fontSize: "0.875rem",
    },
    body2: {
      fontFamily: '"Space Mono", monospace',
      fontSize: "0.75rem",
    },
    caption: {
      fontFamily: '"Space Mono", monospace',
      fontSize: "0.7rem",
      opacity: 0.7,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        
        body {
          background: #050A14;
          background-image: 
            radial-gradient(ellipse at 20% 50%, rgba(0, 229, 255, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(255, 107, 107, 0.03) 0%, transparent 50%);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D1628; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 255, 0.6); }
      `,
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(0, 229, 255, 0.08)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.08em",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 600,
          letterSpacing: "0.08em",
        },
      },
    },
  },
});

export default theme;
