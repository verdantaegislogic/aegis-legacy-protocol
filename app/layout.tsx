import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Aegis Legacy Protocol",
  description: "Operational dashboard for communication integrity and protocol health.",
}

export const viewport: Viewport = {
  themeColor: "#0b1015",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
