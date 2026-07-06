"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Search, Check, Clock, Package, Truck, Home, Loader2 } from "lucide-react"

interface Step { status: string; date: string; description: string; completed: boolean; current: boolean; icon: React.ReactNode }

const mockTimeline: Step[] = [
  { status: "Order Received", date: "Jun 10, 2026", description: "Project requirements confirmed and deposit received.", completed: true, current: false, icon: <Package className="w-5 h-5" /> },
  { status: "Strategy Phase", date: "Jun 12, 2026", description: "AI audit and competitive analysis completed.", completed: true, current: false, icon: <Check className="w-5 h-5" /> },
  { status: "In Production", date: "Jun 14, 2026", description: "Building automation workflows and design systems.", completed: false, current: true, icon: <Loader2 className="w-5 h-5" /> },
  { status: "Quality Review", date: "Pending", description: "Internal testing and client preview.", completed: false, current: false, icon: <Clock className="w-5 h-5" /> },
  { status: "Delivered", date: "Pending", description: "Final handoff with documentation and training.", completed: false, current: false, icon: <Home className="w-5 h-5" /> },
]

export default function TrackPage() {
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Step[] | null>(null)
  const [error, setError] = useState("")

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return
    setLoading(true); setError(""); setResult(null)
    setTimeout(() => {
      if (orderId.toUpperCase().startsWith("HP")) setResult(mockTimeline)
      else setError("Order ID not found. Please check your ID and try again. Format: HP-XXXX")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-white shadow-lg shadow-brand-500/20 mb-4">
            <Truck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">Track Your Order</h1>
          <p className="text-slate-500 text-sm sm:text-base">Enter your Order ID to see real-time progress</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. HP-8821-XJ"
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm sm:text-base shadow-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-white btn-primary flex items-center justify-center gap-2 disabled:opacity-70 text-sm sm:text-base">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Tracking...</> : "Track Order"}
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-center p-4 rounded-xl bg-red-50 text-red-600 text-sm mb-6">
              {error}
            </motion.div>
          )}
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 80 }}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pb-6 border-b border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID</div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900">{orderId.toUpperCase()}</div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-sm font-medium border border-brand-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />In Progress
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute left-5 sm:left-6 top-4 bottom-4 w-0.5 bg-slate-200" />
                  <div className="space-y-6 sm:space-y-8">
                    {result.map((step, idx) => (
                      <motion.div key={step.status} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.15 }} className="relative flex gap-4 sm:gap-5">
                        <div className="relative z-10 flex-shrink-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            step.completed ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20" :
                            step.current ? "bg-brand-50 border-brand-500 text-brand-600 animate-pulse" :
                            "bg-white border-slate-200 text-slate-400"
                          }`}>
                            {step.icon}
                          </div>
                        </div>
                        <div className="flex-1 pt-1 sm:pt-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <h3 className={`font-semibold text-sm sm:text-base ${step.completed || step.current ? "text-slate-900" : "text-slate-400"}`}>{step.status}</h3>
                            <span className="text-xs sm:text-sm text-slate-400">{step.date}</span>
                          </div>
                          <p className={`text-xs sm:text-sm ${step.completed || step.current ? "text-slate-500" : "text-slate-300"}`}>{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
