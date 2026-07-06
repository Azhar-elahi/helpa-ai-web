import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" })

export const metadata: Metadata = {
  title: "Helpa AI — Your Smart Digital Assistant",
  description: "AI-powered automation, SEO, and web design for modern businesses. Scale smarter with Helpa AI.",
}

import { Providers } from "@/components/Providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="relative overflow-x-hidden font-sans antialiased">
        {/* Floating background blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-200/40 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-accent-pink/15 rounded-full blur-[80px] animate-float" style={{ animationDelay: "4s" }} />
          <div className="absolute top-[20%] left-[30%] w-[200px] h-[200px] bg-accent-teal/20 rounded-full blur-[60px] animate-float" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Providers>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  )
}
