import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Studio",
  description: "中学英語を楽しく学ぶ学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}