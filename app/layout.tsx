import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: "내 권리 선택 극장",
    description: "가상 생활 장면에서 지켜져야 할 권리와 여러 안전한 도움 요청 방법을 연습하는 초등 저학년 교육용 웹앱",
    openGraph: {
      title: "내 권리 선택 극장",
      description: "말해도, 보여 줘도, 가리켜도 괜찮아요. 도움을 연결할 책임은 어른에게 있어요.",
      type: "website",
      images: [{ url: socialImage, width: 1728, height: 900, alt: "내 권리 선택 극장 소개 카드" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "내 권리 선택 극장",
      description: "말해도, 보여 줘도, 가리켜도 괜찮아요.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
