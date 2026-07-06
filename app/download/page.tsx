"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Monitor, ShieldCheck, Zap, X, Loader2, CheckCircle2 } from "lucide-react"

export default function DownloadPage() {
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<"form" | "otp" | "success">("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [otp, setOtp] = useState("")

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/download/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to request code")

      setStep("otp")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/download/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Invalid verification code")

      setStep("success")
      
      // Trigger download
      const link = document.createElement("a")
      link.href = "/installers/NovaMac-CRM-Setup.exe" // Users actual installer path
      link.download = "NovaMac-CRM-Setup.exe"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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
              onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl text-white font-semibold text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all w-full sm:w-auto justify-center group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              Download for Windows
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
              Simple email verification secures your trial and connects you directly to our CRM.
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

      {/* Modal Overlay */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0f19] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl overflow-hidden"
            >
              {/* Decorative blob in modal */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px]" />
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {step === "form" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Get Your Free Trial</h2>
                  <p className="text-slate-400 text-sm mb-6">Enter your details to receive a download link and activate your 4-day trial.</p>
                  
                  <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                      <input 
                        required 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                      <input 
                        required 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                      <input 
                        required 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                      {!loading && "Send Verification Code"}
                    </button>
                  </form>
                </div>
              )}

              {step === "otp" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                  <p className="text-slate-400 text-sm mb-6">We've sent a 6-digit code to <strong>{formData.email}</strong>.</p>
                  
                  <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Verification Code</label>
                      <input 
                        required 
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-center tracking-[0.5em] font-mono text-lg"
                        placeholder="000000"
                      />
                    </div>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                      {!loading && "Verify & Download"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-slate-400 text-sm hover:text-white transition-colors"
                    >
                      Back to details
                    </button>
                  </form>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                  <p className="text-slate-400 text-sm mb-6">Your 4-day trial has been activated and your download is starting automatically.</p>
                  
                  <button 
                    onClick={() => setShowModal(false)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl py-3 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
