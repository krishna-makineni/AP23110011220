import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import AuthManager from "@/components/AuthManager";

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Stay updated with the latest campus news and events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
          <AuthManager />
        </ThemeRegistry>
      </body>
    </html>
  );
}
