import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "AyushVeda - Advancing AYUSH Knowledge Worldwide",
  description: "Leading AYUSH research, traditional medicine studies, and holistic healthcare insights from AyushVeda Publications",
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-light`}>{children}</body>
    </html>
  );
}
