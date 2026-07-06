"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, LogOut, Zap, Search, Activity, TrendingUp, Server, Database,
  Bell, LayoutGrid, CheckCircle, AlertCircle, Plus, Mail,
  Briefcase, DollarSign, Download, BarChart3, Clock, Globe,
  Check, ArrowRight, Settings, Loader2, ChevronDown, Command, X,
  MessageSquare, Palette, Sparkles, RefreshCw, Terminal, Send,
  ChevronRight, Play, Cpu, TrendingDown, Users, Info
} from "lucide-react"

/* ─── Types ─── */
type LeadStatus = "raw" | "new" | "contacted" | "marketing" | "development" | "closed" | "skipped" | "Queued" | "New Client" | "New" | "Sent"
type UserRole = "admin" | "marketing" | "developer"
type ToastType = "success" | "error" | "info" | "warning"

interface Lead {
  id: string; name: string; company: string; email: string
  source: string; value: number; status: LeadStatus
  lastContact: string; avatar: string; niche?: string; country?: string
}

interface Notification {
  id: string; time: string; message: string
  type: "info" | "success" | "warning" | "error"; read: boolean; linkTo?: string
}

interface Toast { message: string; type: ToastType; id: string }

/* ─── Workspaces ─── */
const ALL_WORKSPACES = [
  { id: "overview", label: "Overview", icon: LayoutGrid, roles: ["admin"] },
  { id: "intelligence", label: "Intelligence", icon: Search, roles: ["admin", "marketing"] },
  { id: "triage", label: "Triage", icon: Activity, roles: ["admin", "marketing"] },
  { id: "marketing", label: "Marketing", icon: TrendingUp, roles: ["admin", "marketing"] },
  { id: "development", label: "Development", icon: Server, roles: ["admin", "developer"] },
  { id: "database", label: "Database", icon: Database, roles: ["admin"] },
]

/* ─── Status Badge ─── */
const statusColors: Record<string, string> = {
  raw: "bg-slate-700 text-slate-300",
  new: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  New: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Queued: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  "New Client": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  contacted: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  marketing: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  Sent: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  development: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
  closed: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  skipped: "bg-red-500/20 text-red-400 border border-red-500/30",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${statusColors[status] || "bg-slate-700 text-slate-300"}`}>
      {status}
    </span>
  )
}

/* ─── AI Responses for Copilot ─── */
function getAIResponse(input: string, leads: Lead[]): string {
  const q = input.toLowerCase()
  const total = leads.length
  const triage = leads.filter(l => ["new", "Queued", "New Client", "New"].includes(l.status))
  const closed = leads.filter(l => l.status === "closed")
  const revenue = closed.reduce((a, b) => a + b.value, 0)
  const marketing = leads.filter(l => ["marketing", "contacted", "Sent"].includes(l.status))

  if (q.includes("lead") && (q.includes("how many") || q.includes("count") || q.includes("total")))
    return `You currently have ${total} total leads in the system. ${triage.length} are pending triage, ${marketing.length} are in marketing campaigns, and ${closed.length} have been closed.`
  if (q.includes("revenue") || q.includes("money") || q.includes("value"))
    return `Total closed revenue is $${revenue.toLocaleString()} from ${closed.length} converted clients. Your pipeline still has ${marketing.length} leads in marketing with an estimated value of $${marketing.reduce((a, b) => a + b.value, 0).toLocaleString()}.`
  if (q.includes("triage") || q.includes("pending") || q.includes("review"))
    return `There are ${triage.length} leads pending your review in the Triage Pipeline. I recommend processing them now — the sooner you route them to marketing, the higher your conversion rate will be.`
  if (q.includes("best") && q.includes("lead"))
    return closed.length > 0 ? `Your highest value closed lead was ${closed.sort((a,b) => b.value - a.value)[0]?.name} from ${closed.sort((a,b) => b.value - a.value)[0]?.company} at $${Math.max(...closed.map(l=>l.value)).toLocaleString()}.` : "No closed leads yet. Focus on converting your triage pipeline first."
  if (q.includes("scrape") || q.includes("gmaps") || q.includes("extract"))
    return "To deploy a GMaps scraper, go to the Intelligence workspace and click 'Deploy GMaps Extractor'. You can target by region, niche, and set how many leads to extract."
  if (q.includes("email") || q.includes("campaign") || q.includes("drip"))
    return "To trigger an email campaign, go to the Marketing workspace. You can send AI-generated personalized emails to individual leads, run drip sequences, or do manual custom outreach."
  if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
    return `Hello! I'm Helpa Intelligence. You have ${total} leads and $${revenue.toLocaleString()} in closed revenue. How can I help you grow your pipeline today?`
  if (q.includes("help") || q.includes("what can you do"))
    return "I can answer questions about your pipeline, revenue, lead counts, recommend actions, explain how to use any feature, and give you smart insights. Try asking: 'How many leads do I have?' or 'What's my revenue?'"
  if (q.includes("conversion") || q.includes("rate"))
    return total > 0 ? `Your current conversion rate is ${((closed.length / total) * 100).toFixed(1)}%. Industry average is 2-5%. You have ${triage.length} unprocessed leads — routing them faster will improve this metric.` : "No data yet. Start by adding leads through the Intelligence workspace."
  return `I analyzed your query. Currently managing ${total} leads with $${revenue.toLocaleString()} in closed revenue. For specific actions, navigate to the relevant workspace or ask me a more specific question about your pipeline.`
}

/* ─── Main Dashboard ─── */
export default function AdminDashboard() {
  /* Auth */
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [role, setRole] = useState<UserRole>("admin")

  /* Data */
  const [activeWorkspace, setActiveWorkspace] = useState("overview")
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  /* Notifications */
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  /* Toasts */
  const [toasts, setToasts] = useState<Toast[]>([])

  /* Commands */
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const [commandArgs, setCommandArgs] = useState<Record<string, string>>({})
  const [isProcessingCmd, setIsProcessingCmd] = useState(false)
  const [commandRunning, setCommandRunning] = useState<string | null>(null) // full-screen loading

  /* Custom Email */
  const [customEmailModal, setCustomEmailModal] = useState<{ isOpen: boolean; leadId: string | null }>({ isOpen: false, leadId: null })
  const [emailDraft, setEmailDraft] = useState({ subject: "", body: "" })
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  /* Expanded Lead Row */
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null)

  /* AI Copilot */
  const [aiOpen, setAiOpen] = useState(false)
  const [aiLog, setAiLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Helpa Intelligence online ✦ Ask me anything about your pipeline, revenue, or how to use any feature." }
  ])
  const [aiInput, setAiInput] = useState("")
  const [aiTyping, setAiTyping] = useState(false)
  const aiScrollRef = useRef<HTMLDivElement>(null)

  /* ─── Toast System ─── */
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { message, type, id }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  /* ─── Notification System ─── */
  const addNotification = useCallback((message: string, type: Notification["type"] = "info", linkTo?: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    const id = Math.random().toString(36).slice(2)
    setNotifications(prev => [{ id, time, message, type, read: false, linkTo }, ...prev].slice(0, 60))
    showToast(message, type === "error" ? "error" : type === "warning" ? "warning" : "success")
  }, [showToast])

  /* ─── Load Leads ─── */
  const leadsRef = useRef(leads);
  useEffect(() => { leadsRef.current = leads }, [leads]);

  const loadLeads = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const res = await fetch("/api/leads")
      const data = await res.json()
      if (data.leads) {
        if (silent && leadsRef.current.length > 0) {
          const oldLeads = leadsRef.current;
          const newLeads = data.leads;
          
          // Check for new leads
          const newlyAdded = newLeads.filter((nl: any) => !oldLeads.find((ol: any) => ol.id === nl.id));
          if (newlyAdded.length > 0) {
            const msg = newlyAdded.length === 1 ? `New lead arrived: ${newlyAdded[0].name}` : `${newlyAdded.length} new leads arrived from Swarm!`
            addNotification(msg, "info")
            showToast(msg, "info")
          }

          // Check for remote status changes
          newLeads.forEach((nl: any) => {
            const ol = oldLeads.find((old: any) => old.id === nl.id);
            if (ol && ol.status !== nl.status) {
              addNotification(`Lead ${nl.name} updated to ${nl.status} remotely!`, "success", nl.status === "development" ? "development" : undefined)
            }
          });
        }
        setLeads(data.leads)
        setLastSync(new Date())
      }
    } catch {
      if (!silent) showToast("Failed to sync leads", "error")
    } finally {
      setIsLoading(false)
    }
  }, [showToast, addNotification])

  useEffect(() => {
    if (!authenticated) return
    loadLeads()
    const interval = setInterval(() => loadLeads(true), 15000)
    return () => clearInterval(interval)
  }, [authenticated, loadLeads])

  /* ─── Auto-scroll AI chat ─── */
  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight
    }
  }, [aiLog, aiTyping])

  /* ─── Auth ─── */
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    const u = username.toLowerCase().trim()
    if (u === "admin" && password === "admin123") {
      setRole("admin"); setActiveWorkspace("overview"); setAuthenticated(true)
      setTimeout(() => addNotification("Welcome back, Admin. System sync initiated.", "success"), 300)
    } else if (u === "marketing" && password === "mktg123") {
      setRole("marketing"); setActiveWorkspace("triage"); setAuthenticated(true)
      setTimeout(() => addNotification("Welcome, Marketing. Pipeline loaded.", "success"), 300)
    } else if (u === "dev" && password === "dev123") {
      setRole("developer"); setActiveWorkspace("development"); setAuthenticated(true)
      setTimeout(() => addNotification("Welcome, Developer. Environment loaded.", "success"), 300)
    } else {
      setAuthError("Invalid credentials. Check username and password.")
    }
  }

  /* ─── Execute Command ─── */
  const executeCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeCommand) return

    const cmd = activeCommand
    const payload = { command: cmd, args: commandArgs, user: role }

    // Close modal, show full-screen loading
    setActiveCommand(null)
    setCommandArgs({})
    setCommandRunning(cmd)
    setIsProcessingCmd(true)

    try {
      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        addNotification(`✓ Command complete: ${cmd.toUpperCase()}`, "success")
        setTimeout(() => loadLeads(true), 2000)
      } else {
        throw new Error(data.error || "Command failed")
      }
    } catch (err: any) {
      addNotification(`✗ Failed: ${err.message}`, "error")
    } finally {
      setIsProcessingCmd(false)
      setCommandRunning(null)
    }
  }

  /* ─── Update Lead Status ─── */
  const updateLeadStatus = async (leadId: string, status: string, leadData: any, custom_subject?: string, custom_body?: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: status as LeadStatus } : l))
    showToast("Processing...", "info")
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status, leadData, custom_subject, custom_body })
      })
      if (!res.ok) throw new Error("API error")
      addNotification(`Processed: ${leadData.name} → ${status}`, "success", status === "development" ? "development" : undefined)
      setTimeout(() => loadLeads(true), 1500)
    } catch {
      addNotification(`Action failed for ${leadData.name}. Check your connection.`, "error")
      loadLeads()
    }
  }

  /* ─── Custom Email Send ─── */
  const handleCustomEmailSend = async () => {
    if (!customEmailModal.leadId || !emailDraft.subject || !emailDraft.body) return
    const lead = leads.find(l => l.id === customEmailModal.leadId)
    setIsSendingEmail(true)
    await updateLeadStatus(customEmailModal.leadId, "contacted", lead, emailDraft.subject, emailDraft.body)
    setIsSendingEmail(false)
    setCustomEmailModal({ isOpen: false, leadId: null })
    setEmailDraft({ subject: "", body: "" })
  }

  /* ─── Inline Edit ─── */
  const handleInlineEdit = async (leadId: string, field: string, value: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, [field]: value } : l))
    try {
      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "updatelead", args: { lead_id: leadId, field, value }, user: role })
      })
      if (!res.ok) throw new Error()
      showToast(`Updated ${field} ✓`, "success")
    } catch {
      showToast(`Failed to update ${field}`, "error")
      loadLeads()
    }
  }

  /* ─── AI Copilot Handler ─── */
  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || aiTyping) return
    const userMsg = aiInput.trim()
    setAiLog(prev => [...prev, { role: "user", text: userMsg }])
    setAiInput("")
    setAiTyping(true)
    const thinkTime = 800 + Math.random() * 600
    setTimeout(() => {
      const reply = getAIResponse(userMsg, leads)
      setAiLog(prev => [...prev, { role: "ai", text: reply }])
      setAiTyping(false)
    }, thinkTime)
  }

  /* ─── Derived State ─── */
  const allowedWorkspaces = ALL_WORKSPACES.filter(ws => ws.roles.includes(role))
  const unreadNotifs = notifications.filter(n => !n.read).length
  const triageLeads = leads.filter(l => ["new", "Queued", "New Client", "New"].includes(l.status))
  const devLeads = leads.filter(l => l.status === "development")
  const marketingLeads = leads.filter(l => ["marketing", "contacted", "Sent"].includes(l.status))
  const closedLeads = leads.filter(l => l.status === "closed")
  const closedRevenue = closedLeads.reduce((a, b) => a + b.value, 0)

  /* ─── Action Button Component ─── */
  const ActionButton = ({ icon: Icon, label, command, variant = "default" }: {
    icon: any; label: string; command: string; variant?: "default" | "primary" | "danger"
  }) => (
    <button
      onClick={() => { setActiveCommand(command); setCommandArgs({}) }}
      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group text-left
        ${variant === "primary"
          ? "bg-indigo-600/20 border-indigo-500/30 hover:bg-indigo-600/30 hover:border-indigo-500/50"
          : variant === "danger"
          ? "bg-red-600/10 border-red-500/20 hover:bg-red-600/20 hover:border-red-500/40"
          : "bg-slate-900 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700"}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center
          ${variant === "primary" ? "bg-indigo-500/20 text-indigo-400" : variant === "danger" ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-700"}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className={`font-semibold text-sm ${variant === "primary" ? "text-indigo-300" : variant === "danger" ? "text-red-300" : "text-slate-300 group-hover:text-white"}`}>
          {label}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
    </button>
  )

  /* ─── Lead Row Component ─── */
  const LeadRow = ({ lead, actions }: { lead: Lead; actions: React.ReactNode }) => {
    const isExpanded = expandedLeadId === lead.id
    return (
      <div className="border-b border-slate-800/60 last:border-0 group">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 sm:gap-0 cursor-pointer hover:bg-slate-900/40 transition-colors"
          onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0 group-hover:border-cyan-500/30 transition-colors">
              {lead.avatar}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors truncate">{lead.name}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 truncate">
                <span className="truncate">{lead.company}</span>
                <span className="text-slate-700">·</span>
                <span className="truncate">{lead.email}</span>
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-600 ml-1 transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:ml-4" onClick={e => e.stopPropagation()}>
            {actions}
          </div>
        </div>

        {/* Expanded Detail Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mx-3 mb-3 p-5 rounded-2xl bg-black/40 border border-slate-800/60">
                <div className="grid md:grid-cols-3 gap-5">
                  {/* Intelligence Profile */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Intelligence Profile
                    </h5>
                    <div className="space-y-2">
                      {[
                        { label: "Source", value: lead.source },
                        { label: "Niche", value: lead.niche || "General" },
                        { label: "Country", value: lead.country || "Unknown" },
                        { label: "Est. Value", value: `$${lead.value.toLocaleString()}`, highlight: true },
                        { label: "Last Contact", value: lead.lastContact },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">{item.label}</span>
                          <span className={item.highlight ? "text-emerald-400 font-bold" : "text-slate-300 font-medium"}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Draft */}
                  <div className="col-span-2 space-y-3">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Generated Outreach Draft
                    </h5>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                      <p className="text-[10px] text-indigo-400 mb-1.5 font-mono font-bold">
                        SUBJECT: Quick question about {lead.company}&apos;s online presence
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Hi {lead.name.split(" ")[0]}, I came across {lead.company} and was genuinely impressed by your work in the {lead.niche || "industry"} space. I&apos;m reaching out because our AI recently identified 3 specific opportunities to improve your digital visibility — one of which could realistically drive 40%+ more inbound traffic within 90 days. Would you be open to a quick 5-minute call this week to walk you through what we found? No pressure, just sharing genuine insights.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); setCustomEmailModal({ isOpen: true, leadId: lead.id }) }}
                        className="flex-1 py-2 text-xs rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors font-semibold"
                      >
                        Send Custom Email
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); updateLeadStatus(lead.id, "contacted", lead) }}
                        className="flex-1 py-2 text-xs rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/30 transition-colors font-semibold"
                      >
                        Send AI Draft Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  /* ─── AUTH SCREEN ─── */
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md">
          <div className="glass-strong rounded-3xl border border-white/8 p-8 sm:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-5">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Client Portal</h1>
              <p className="text-slate-400 text-sm">Secure access — authorized users only</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Username" autoComplete="username"
                  className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all text-base"
                />
              </div>
              <div>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" autoComplete="current-password"
                  className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all text-base"
                />
              </div>
              <AnimatePresence>
                {authError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {authError}
                  </motion.div>
                )}
              </AnimatePresence>
              <button type="submit" className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.6)] active:scale-[0.98]">
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-600 bg-black/30 p-3 rounded-xl border border-white/5">
              <p className="font-semibold text-slate-500 mb-1">Demo Access</p>
              <p>admin / admin123 &nbsp;·&nbsp; marketing / mktg123 &nbsp;·&nbsp; dev / dev123</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ─── MAIN DASHBOARD ─── */
  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans">

      {/* ─── Full-Screen Command Loading Overlay ─── */}
      <AnimatePresence>
        {commandRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#030712]/95 backdrop-blur-xl"
          >
            {/* Outer ring */}
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400 animate-spin" />
              <div className="absolute inset-2 rounded-full border-r-4 border-indigo-500/50 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Terminal className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Executing Command</h2>
            <p className="text-slate-400 mb-4 font-mono text-sm">
              <span className="text-cyan-400">$</span> {commandRunning}
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI agents are working...
            </div>
            {/* Animated progress bar */}
            <div className="mt-8 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toast Stack ─── */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-sm font-medium shadow-2xl backdrop-blur-xl ${
                t.type === "success" ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                : t.type === "error" ? "bg-red-950/90 border-red-500/30 text-red-300"
                : t.type === "warning" ? "bg-amber-950/90 border-amber-500/30 text-amber-300"
                : "bg-slate-900/90 border-slate-700 text-slate-300"
              }`}
            >
              {t.type === "success" ? <CheckCircle className="w-4 h-4" />
                : t.type === "error" ? <AlertCircle className="w-4 h-4" />
                : t.type === "warning" ? <AlertCircle className="w-4 h-4" />
                : <Info className="w-4 h-4" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ─── TOP NAV ─── */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[#030712]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo + Workspaces */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-white hidden sm:block text-sm">Helpa Control</span>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:flex items-center gap-0.5 bg-white/[0.03] border border-white/5 rounded-xl p-1">
              {allowedWorkspaces.map(ws => {
                const Icon = ws.icon
                return (
                  <button
                    key={ws.id}
                    onClick={() => setActiveWorkspace(ws.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      activeWorkspace === ws.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {ws.label}
                    {ws.id === "triage" && triageLeads.length > 0 && (
                      <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">{triageLeads.length}</span>
                    )}
                    {ws.id === "development" && devLeads.length > 0 && (
                      <span className="bg-cyan-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{devLeads.length}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Sync indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>

            {/* Refresh */}
            <button onClick={() => loadLeads()} className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => { setIsNotifOpen(!isNotifOpen); setNotifications(prev => prev.map(n => ({ ...n, read: true }))) }}
                className="relative p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#030712] animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-white/8 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-white text-sm">Notifications</h3>
                        <button onClick={() => setNotifications([])} className="text-xs text-slate-500 hover:text-red-400 transition-colors">Clear all</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 text-sm">
                            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500/40" />
                            All caught up!
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => { if (n.linkTo) { setActiveWorkspace(n.linkTo); setIsNotifOpen(false) } }}
                              className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 ${n.linkTo ? "cursor-pointer hover:bg-white/5" : ""} transition-colors`}
                            >
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                n.type === "success" ? "bg-emerald-400"
                                : n.type === "error" ? "bg-red-400"
                                : n.type === "warning" ? "bg-amber-400"
                                : "bg-blue-400"
                              }`} />
                              <div>
                                <p className="text-xs font-medium text-slate-200">{n.message}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{n.time}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/8">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                {role.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-white capitalize">{role}</p>
                <p className="text-[9px] text-emerald-400 uppercase tracking-widest">Verified</p>
              </div>
              <button onClick={() => { setAuthenticated(false); setUsername(""); setPassword("") }} className="ml-1 text-slate-500 hover:text-red-400 transition-colors p-0.5">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile workspace selector */}
        <div className="lg:hidden px-4 pb-3">
          <select
            value={activeWorkspace}
            onChange={e => setActiveWorkspace(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/8 rounded-xl text-white text-sm font-semibold focus:outline-none"
          >
            {allowedWorkspaces.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.label} {ws.id === "triage" && triageLeads.length > 0 ? `(${triageLeads.length} pending)` : ""}</option>
            ))}
          </select>
        </div>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWorkspace}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >

            {/* ══════ OVERVIEW ══════ */}
            {activeWorkspace === "overview" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">System Overview</h1>
                  <p className="text-slate-500 mt-1 text-sm">
                    Real-time pipeline telemetry
                    {lastSync && <span> · Last sync: {lastSync.toLocaleTimeString()}</span>}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Users, label: "Total Leads", value: leads.length, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                    { icon: Activity, label: "Pending Triage", value: triageLeads.length, color: "text-amber-400", bg: "bg-amber-500/10", alert: triageLeads.length > 0 },
                    { icon: TrendingUp, label: "In Marketing", value: marketingLeads.length, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    { icon: DollarSign, label: "Closed Revenue", value: `$${closedRevenue.toLocaleString()}`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  ].map(stat => {
                    const Icon = stat.icon
                    return (
                      <div key={stat.label} className={`p-5 rounded-2xl glass border ${stat.alert ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "border-white/5"} relative overflow-hidden`}>
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-3xl font-extrabold text-white`}>{isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : stat.value}</p>
                        {stat.alert && (
                          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Recent notifications */}
                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Recent Activity</h3>
                    <button onClick={() => loadLeads()} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  </div>
                  <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-sm">No recent activity. Execute a command to get started.</div>
                    ) : (
                      notifications.slice(0, 10).map(n => (
                        <div key={n.id} className="flex items-center gap-3 p-4">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${n.type === "success" ? "bg-emerald-400" : n.type === "error" ? "bg-red-400" : n.type === "warning" ? "bg-amber-400" : "bg-blue-400"}`} />
                          <p className="text-sm text-slate-300 flex-1">{n.message}</p>
                          <span className="text-[10px] text-slate-600 shrink-0">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ══════ INTELLIGENCE ══════ */}
            {activeWorkspace === "intelligence" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">Intelligence Gathering</h1>
                  <p className="text-slate-500 mt-1 text-sm">Deploy autonomous scraping and lead extraction agents</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ActionButton icon={Search} label="Deploy GMaps Extractor" command="gmid" variant="primary" />
                  <ActionButton icon={Plus} label="Manual Lead Entry" command="addlead" />
                  <ActionButton icon={Globe} label="Web Scrape Target" command="webscrape" />
                </div>
              </div>
            )}

            {/* ══════ TRIAGE ══════ */}
            {activeWorkspace === "triage" && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                      Lead Triage
                      {triageLeads.length > 0 && (
                        <span className="text-sm px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold animate-pulse">
                          {triageLeads.length} Pending
                        </span>
                      )}
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Review and route incoming prospects. Click a row to expand.</p>
                  </div>
                  <button onClick={() => { setActiveCommand("pushleads"); setCommandArgs({}) }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors font-semibold text-sm">
                    <Play className="w-4 h-4" /> Force Push Pipeline
                  </button>
                </div>

                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Action Required</h3>
                    <StatusBadge status={triageLeads.length > 0 ? "new" : "closed"} />
                  </div>
                  {isLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></div>
                  ) : triageLeads.length === 0 ? (
                    <div className="p-16 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500/40 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-white mb-2">Inbox Zero!</h3>
                      <p className="text-slate-500 text-sm">Deploy a scraper to find more leads.</p>
                    </div>
                  ) : (
                    <div>
                      {triageLeads.map(lead => (
                        <LeadRow key={lead.id} lead={lead} actions={
                          <>
                            <button onClick={() => updateLeadStatus(lead.id, "skipped", lead)} className="px-3 py-2 rounded-lg text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all">
                              Skip
                            </button>
                            <button onClick={() => updateLeadStatus(lead.id, "marketing", lead)} className="px-3 py-2 rounded-lg text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all">
                              → Marketing
                            </button>
                            <button onClick={() => { setCustomEmailModal({ isOpen: true, leadId: lead.id }) }} className="px-3 py-2 rounded-lg text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Custom Email
                            </button>
                            <button onClick={() => updateLeadStatus(lead.id, "contacted", lead)} className="px-3 py-2 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-1">
                              <Zap className="w-3 h-3" /> AI Email
                            </button>
                          </>
                        } />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════ MARKETING ══════ */}
            {activeWorkspace === "marketing" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">Marketing Hub</h1>
                  <p className="text-slate-500 mt-1 text-sm">Manage campaigns, drip sequences, and follow-ups</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Automation Controls</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ActionButton icon={ArrowRight} label="Push Pipeline" command="pushleads" variant="primary" />
                    <ActionButton icon={Clock} label="Show Due Follow-ups" command="followups" />
                    <ActionButton icon={Mail} label="Trigger Drip Sequence" command="rundrip" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Campaigns ({marketingLeads.length})</h3>
                  <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                    {marketingLeads.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 text-sm">No active campaigns. Route leads from Triage first.</div>
                    ) : (
                      marketingLeads.map(lead => (
                        <LeadRow key={lead.id} lead={lead} actions={
                          <StatusBadge status={lead.status} />
                        } />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ══════ DEVELOPMENT ══════ */}
            {activeWorkspace === "development" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white">Development Pipeline</h1>
                  <p className="text-slate-500 mt-1 text-sm">Manage client orders, templates, and deployments</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Production Board ({devLeads.length})</h3>
                    <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                      {devLeads.length === 0 ? (
                        <div className="p-16 text-center">
                          <Server className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                          <p className="text-slate-500 text-sm">No active development orders. Close a deal to see clients here.</p>
                        </div>
                      ) : (
                        devLeads.map(lead => (
                          <LeadRow key={lead.id} lead={lead} actions={
                            <button onClick={() => setActiveCommand("orderstatus")} className="px-3 py-2 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                              Update Status
                            </button>
                          } />
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <ActionButton icon={Plus} label="Create Design Order" command="createorder" variant="primary" />
                      <ActionButton icon={Clock} label="Track Order" command="trackorder" />
                      <ActionButton icon={Palette} label="Generate AI Templates" command="buildtemplates" />
                      <ActionButton icon={Check} label="Select Template" command="selecttemplate" />
                      <ActionButton icon={Globe} label="Build Final Site" command="buildfullsite" variant="primary" />
                      <ActionButton icon={Download} label="Download Templates" command="downloadtemplates" />
                      <ActionButton icon={Download} label="Download Site" command="downloadsite" />
                      <ActionButton icon={Server} label="Trigger Deployment" command="dc" variant="danger" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════ DATABASE ══════ */}
            {activeWorkspace === "database" && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white">Master Database</h1>
                    <p className="text-slate-500 mt-1 text-sm">Click any field to edit inline. Click a row to expand intelligence.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setActiveCommand("report"); setCommandArgs({}) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors font-semibold text-sm">
                      <BarChart3 className="w-4 h-4" /> Report
                    </button>
                    <button onClick={() => { setActiveCommand("dc"); setCommandArgs({}) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors font-semibold text-sm">
                      <Check className="w-4 h-4" /> Direct Close
                    </button>
                  </div>
                </div>

                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-black/30 border-b border-white/5">
                        <tr>
                          {["Business / Contact", "Email", "Status", "Value", "Last Touch"].map(h => (
                            <th key={h} className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr><td colSpan={5} className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto" /></td></tr>
                        ) : leads.length === 0 ? (
                          <tr><td colSpan={5} className="p-12 text-center text-slate-500">No leads yet. Deploy a scraper from Intelligence.</td></tr>
                        ) : (
                          leads.map(lead => (
                            <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-cyan-400 text-xs font-bold shrink-0">
                                    {lead.avatar}
                                  </div>
                                  <div>
                                    <input
                                      defaultValue={lead.name}
                                      onBlur={e => { if (e.target.value !== lead.name) handleInlineEdit(lead.id, "Name", e.target.value) }}
                                      className="bg-transparent text-white font-semibold text-sm focus:outline-none border-b border-transparent hover:border-slate-600 focus:border-indigo-500 transition-colors w-full max-w-[160px] pb-0.5"
                                    />
                                    <div className="text-[11px] text-slate-500">{lead.company}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <input
                                  defaultValue={lead.email}
                                  onBlur={e => { if (e.target.value !== lead.email) handleInlineEdit(lead.id, "Email", e.target.value) }}
                                  className="bg-transparent text-slate-400 text-xs focus:outline-none border-b border-transparent hover:border-slate-600 focus:border-indigo-500 transition-colors w-full max-w-[180px] pb-0.5"
                                />
                              </td>
                              <td className="px-5 py-4">
                                <StatusBadge status={lead.status} />
                              </td>
                              <td className="px-5 py-4 text-emerald-400 font-bold text-sm">${lead.value.toLocaleString()}</td>
                              <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{lead.lastContact}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── CUSTOM EMAIL MODAL ─── */}
      <Modal isOpen={customEmailModal.isOpen} onClose={() => !isSendingEmail && setCustomEmailModal({ isOpen: false, leadId: null })} title="Custom Outreach Email">
        <div className="space-y-5">
          <p className="text-sm text-slate-400">Write a personalized email to send to this prospect. This bypasses the AI auto-generation.</p>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject Line *</label>
            <input
              value={emailDraft.subject}
              onChange={e => setEmailDraft({ ...emailDraft, subject: e.target.value })}
              placeholder="e.g. Quick question about your website..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Body *</label>
            <textarea
              value={emailDraft.body}
              onChange={e => setEmailDraft({ ...emailDraft, body: e.target.value })}
              placeholder={"Hi [Name],\n\nI noticed...\n\nBest,\nYour Name"}
              rows={7}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all text-sm resize-none font-mono"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setCustomEmailModal({ isOpen: false, leadId: null })} disabled={isSendingEmail} className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleCustomEmailSend}
              disabled={!emailDraft.subject || !emailDraft.body || isSendingEmail}
              className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.4)]"
            >
              {isSendingEmail ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Now</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── COMMAND MODAL ─── */}
      <Modal isOpen={!!activeCommand} onClose={() => !isProcessingCmd && setActiveCommand(null)} title="Execute System Command">
        <form onSubmit={executeCommand} className="space-y-6">
          {/* Command Header */}
          <div className="p-4 bg-black/40 border border-white/8 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Terminal className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Selected Command</p>
              <p className="font-bold text-white font-mono">{activeCommand}</p>
            </div>
          </div>

          {/* GMaps Extractor Args */}
          {activeCommand === "gmid" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extraction Mode</label>
                <select onChange={e => setCommandArgs({ ...commandArgs, mode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm appearance-none">
                  <option value="" disabled>Select Mode...</option>
                  <option value="standard">Standard Search</option>
                  <option value="deep">Deep Search</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Region</label>
                <select onChange={e => setCommandArgs({ ...commandArgs, country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm appearance-none">
                  <option value="" disabled>Select Region...</option>
                  {["Australia", "Canada", "Dubai", "USA", "UK", "Germany", "Pakistan"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Industry Niche</label>
                <select onChange={e => setCommandArgs({ ...commandArgs, niche: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm appearance-none">
                  <option value="" disabled>Select Niche...</option>
                  {["dentist", "gym", "restaurant", "roofing", "spa", "real estate", "law firm", "salon"].map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Number of Leads</label>
                <input type="number" min="1" max="100" placeholder="e.g. 10"
                  onChange={e => setCommandArgs({ ...commandArgs, leads: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm" />
              </div>
            </div>
          )}

          {/* Add Lead Args */}
          {activeCommand === "addlead" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                <input required onChange={e => setCommandArgs({ ...commandArgs, name: e.target.value })} placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Company *</label>
                <input required onChange={e => setCommandArgs({ ...commandArgs, company: e.target.value })} placeholder="Acme Corp"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
                <input required type="email" onChange={e => setCommandArgs({ ...commandArgs, email: e.target.value })} placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Niche</label>
                <input onChange={e => setCommandArgs({ ...commandArgs, niche: e.target.value })} placeholder="e.g. Restaurant"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Est. Value ($)</label>
                <input type="number" onChange={e => setCommandArgs({ ...commandArgs, value: e.target.value })} placeholder="e.g. 500"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm" />
              </div>
            </div>
          )}

          {/* Commands that need a target ID */}
          {["createorder", "orderstatus", "trackorder", "buildtemplates", "selecttemplate", "buildfullsite", "report", "downloadtemplates", "downloadsite", "webscrape"].includes(activeCommand || "") && (
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target ID / Value</label>
              <input
                onChange={e => setCommandArgs({ ...commandArgs, value: e.target.value })}
                placeholder={activeCommand === "webscrape" ? "https://target-website.com" : "Lead ID, Order ID, or reference"}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white focus:outline-none focus:border-indigo-500/60 text-sm"
              />
            </div>
          )}

          {/* Confirmation-only commands */}
          {["pushleads", "rundrip", "followups", "dc"].includes(activeCommand || "") && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-sm">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-300">
                <strong>Immediate action:</strong> This command will execute across the entire system right now. Make sure you&apos;re ready before confirming.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setActiveCommand(null)} className="flex-1 py-3.5 rounded-xl font-bold bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessingCmd}
              className="flex-1 py-3.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(99,102,241,0.4)] disabled:opacity-70"
            >
              {isProcessingCmd ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : <><Play className="w-4 h-4" /> Confirm & Execute</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── AI COPILOT PANEL ─── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {aiOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-[340px] sm:w-[380px] bg-[#0a0f1e] border border-white/8 rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.12)] overflow-hidden flex flex-col"
              style={{ height: 480 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Helpa Intelligence</h3>
                    <p className="text-[10px] text-emerald-400">Online · {leads.length} leads in scope</p>
                  </div>
                </div>
                <button onClick={() => setAiOpen(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={aiScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600/30 text-indigo-100 border border-indigo-500/30 rounded-tr-sm"
                        : "bg-white/[0.04] text-slate-300 border border-white/5 rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/5 rounded-tl-sm flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleAiSend} className="px-4 py-4 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 focus-within:border-indigo-500/40 transition-colors">
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    placeholder="Ask about your pipeline..."
                    disabled={aiTyping}
                    className="flex-1 bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!aiInput.trim() || aiTyping}
                    className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shrink-0"
                  >
                    {aiTyping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5 text-center">Try: &quot;How many leads?&quot; · &quot;What&apos;s my revenue?&quot; · &quot;Any pending triage?&quot;</p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={() => setAiOpen(!aiOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all ${
            aiOpen ? "bg-slate-800 border border-white/10" : "bg-gradient-to-br from-cyan-500 to-indigo-600"
          }`}
        >
          {aiOpen ? <X className="w-5 h-5" /> : <Sparkles className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  )
}

/* ─── MODAL Component ─── */
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg glass-strong border border-white/8 rounded-3xl p-6 sm:p-8 shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-y-auto max-h-[90vh]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
)
