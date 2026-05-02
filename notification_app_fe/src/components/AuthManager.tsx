"use client";
import React, { useState, useEffect } from "react";
import {
  Box, Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Typography, Alert, CircularProgress, Divider
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

export default function AuthManager() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [accessCode, setAccessCode] = useState("QkbpxH");
  const [userData, setUserData] = useState({
    name: "Student",
    rollNo: "AP23110011220",
    email: "student@campus.edu",
    mobileNo: "9999999999",
    githubUsername: "student-dev"
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (!storedToken) {
      setOpen(true);
    } else {
      setToken(storedToken);
    }
    // Expose opener to window for global access (e.g. from error messages)
    (window as any).openAuthModal = () => setOpen(true);
  }, []);

  const handleManualSave = () => {
    if (token.trim()) {
      localStorage.setItem("auth_token", token.trim());
      setOpen(false);
      window.location.reload();
    } else {
      setError("Token cannot be empty");
    }
  };

  const handleAutoRegister = async () => {
    setStatus("loading");
    setError("");
    try {
      // 1. Register - Convert to snake_case for API
      const regData = {
        name: userData.name,
        roll_no: userData.rollNo,
        email: userData.email,
        mobile_no: userData.mobileNo,
        github_username: userData.githubUsername,
        access_code: accessCode,
      };

      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });

      if (!regRes.ok) {
        const errData = await regRes.json();
        const errMsg = errData.message || errData.error || `Registration failed with status ${regRes.status}`;
        console.error("[Auth] Registration failed:", errMsg, errData);
        throw new Error(errMsg);
      }
      const regResponseData = await regRes.json();
      const { clientID, clientSecret } = regResponseData;
      
      if (!clientID || !clientSecret) {
        throw new Error(`Invalid registration response: missing clientID or clientSecret`);
      }

      // 2. Authenticate
      const authRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientID, clientSecret }),
      });

      if (!authRes.ok) {
        const errData = await authRes.json();
        const authErrMsg = errData.message || errData.error || `Authentication failed with status ${authRes.status}`;
        console.error("[Auth] Authentication failed:", authErrMsg, errData);
        throw new Error(authErrMsg);
      }
      const authResponseData = await authRes.json();
      const { access_token } = authResponseData;
      
      if (!access_token) {
        throw new Error(`Invalid auth response: missing access_token`);
      }

      // 3. Store
      localStorage.setItem("auth_token", access_token);
      setToken(access_token);
      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setStatus("error");
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error("[Auth] Error:", errorMsg);
    }
  };

  const handleDemoToken = () => {
    const demoToken = "demo_token_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("auth_token", demoToken);
    setToken(demoToken);
    setStatus("success");
    setTimeout(() => {
      setOpen(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <Button
          variant="contained"
          color={token ? "success" : "primary"}
          startIcon={<VpnKeyIcon />}
          onClick={() => setOpen(true)}
          sx={{ 
            borderRadius: 20, 
            boxShadow: token ? "0 0 15px rgba(0, 200, 83, 0.4)" : "0 0 15px rgba(0, 229, 255, 0.4)",
            textTransform: "none"
          }}
        >
          {token ? "Authenticated" : "API Auth"}
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "background.paper", color: "primary.main", display: "flex", alignItems: "center", gap: 1 }}>
          <AppRegistrationIcon /> API Setup
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper" }}>
          <Typography variant="subtitle2" sx={{ color: "text.primary", mb: 1 }}>Automatic Registration (Step 1)</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3, p: 2, border: "1px solid rgba(0,229,255,0.1)", borderRadius: 1 }}>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField label="Name" size="small" fullWidth value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} />
              <TextField label="Roll No" size="small" fullWidth value={userData.rollNo} onChange={e => setUserData({...userData, rollNo: e.target.value})} />
            </Box>
            <TextField label="Email" size="small" fullWidth value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} />
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField label="Mobile No" size="small" fullWidth value={userData.mobileNo} onChange={e => setUserData({...userData, mobileNo: e.target.value})} />
              <TextField label="GitHub Username" size="small" fullWidth value={userData.githubUsername} onChange={e => setUserData({...userData, githubUsername: e.target.value})} />
            </Box>
            <TextField label="Access Code" size="small" fullWidth value={accessCode} onChange={e => setAccessCode(e.target.value)} />
            
            <Button 
              variant="contained" 
              onClick={handleAutoRegister} 
              disabled={status === "loading"}
              fullWidth
              sx={{ mt: 1 }}
            >
              {status === "loading" ? <CircularProgress size={20} /> : "Register & Authenticate"}
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }}>OR</Divider>

          <Typography variant="subtitle2" sx={{ color: "text.primary", mb: 1 }}>Manual Token Entry (Step 2)</Typography>
          <TextField
            fullWidth
            label="Access Token"
            variant="outlined"
            size="small"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste access_token here..."
          />

          {error && <Alert severity="error" sx={{ mt: 2, fontSize: "0.8rem", backgroundColor: "rgba(255, 107, 107, 0.1)" }}>{error}</Alert>}
          {status === "success" && <Alert severity="success" sx={{ mt: 2 }}>Success! Reloading...</Alert>}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "background.paper", px: 3, pb: 3, gap: 1, flexWrap: "wrap" }}>
          <Button onClick={() => { localStorage.removeItem("auth_token"); setToken(""); }} color="inherit" size="small">Reset</Button>
          <Button onClick={handleDemoToken} variant="outlined" size="small" sx={{ color: "warning.main", borderColor: "warning.main" }}>Use Demo Token</Button>
          <Button onClick={handleManualSave} variant="contained" color="primary" size="small">Save & Refresh</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
