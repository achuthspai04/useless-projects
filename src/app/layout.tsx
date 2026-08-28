import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Splash from "./splash";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const drowner = localFont({
  src: "../fonts/Drowner.otf",
  variable: "--font-drowner",
});

const jrk = localFont({
  src: "../fonts/JRK.otf",
  variable: "--font-jrk",
});

const nanumPen = localFont({
  src: "../fonts/NanumPenScript-Regular.ttf",
  variable: "--font-nanum-pen",
});

const helvetica = localFont({
  src: [
    { path: "../fonts/Helvetica.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Helvetica-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-helvetica",
});

export const metadata: Metadata = {
  title: "useless-projects",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${drowner.variable} ${jrk.variable} ${nanumPen.variable} ${helvetica.variable} h-full snap-y snap-mandatory scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Splash>{children}</Splash>
      </body>
    </html>
  );
}
