import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WhenWeMeet",
    template: "%s · WhenWeMeet",
  },
  description:
    "회원가입·로그인 없이 링크 하나로 팀원들의 가능한 시간을 모아 최적의 미팅 시간을 찾는 서비스",
  keywords: ["일정", "팀", "when2meet", "WhenWeMeet", "스케줄"],
  authors: [{ name: "WhenWeMeet" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-full flex-col">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
          >
            본문으로 건너뛰기
          </a>
          <main id="main-content" className="flex flex-1 flex-col" role="main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
