"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Monitor, ShieldCheck, Zap } from "lucide-react"
import { useSession } from "next-auth/react"
import AuthModal from "@/components/AuthModal"

export default function DownloadPage() {
  const { data: session, status } = useSession()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleDownloadClick = () => {
    if (status === "authenticated") {
      // Trigger download instantly since user is logged in
      const link = document.createElement("a")
      link.href = "/installers/NovaMac-CRM-Setup.exe" // Users actual installer path
      link.download = "NovaMac-CRM-Setup.exe"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Show login/signup modal
      setShowAuthModal(true)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 relative flex flex-col items-center justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] opacity-70" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-semibold mb-6 backdrop-blur-md shadow-lg shadow-cyan-500/5">
            NovaMac Webscraper CRM v1.0.0
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6 tracking-tight">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              NovaMac CRM
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the full power of NovaMac right from your operating system. Download now to begin your free 4-day auto-activated trial!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={handleDownloadClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-white font-semibold text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all w-full sm:w-auto justify-center group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              {status === "authenticated" ? "Download Now" : "Login to Download"}
            </motion.button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Supports Windows 10/11 (64-bit). Includes a 4-day active trial.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24"
        >
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md text-left hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] group-hover:bg-cyan-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 relative z-10">
               <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Instant Setup</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Download and start scraping immediately. Your 4-day trial is activated automatically.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md text-left hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] group-hover:bg-indigo-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 relative z-10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Secure Verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Simple account login secures your trial and connects you directly to our CRM.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md text-left hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[50px] group-hover:bg-pink-500/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 relative z-10">
              <Monitor className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 relative z-10">CRM Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Everything syncs seamlessly into your Airtable dashboard for easy management.
            </p>
          </div>
        </motion.div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
