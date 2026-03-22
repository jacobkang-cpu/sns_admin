import type { Metadata } from "next";

import { AppToaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital SNS Content Desk",
  description: "병원 SNS 콘텐츠 초안 검토와 게시 준비를 위한 내부 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}

