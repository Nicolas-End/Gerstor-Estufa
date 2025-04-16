import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Roboto,
  Quicksand,
} from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: "400",
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <Head>
        <title>Seja Bem-vindo ao Controle Verde</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${quicksand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
