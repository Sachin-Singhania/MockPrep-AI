import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"
import "./globals.css"
import AuthProvider from "./provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MockPrep AI - Master Your Next Interview",
  description: "AI-powered mock interview platform with instant feedback and personalized questions.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider >
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
