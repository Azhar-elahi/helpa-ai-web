"use client"
import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Zap, Search, MessageSquare, ShoppingCart, BarChart3, Settings,
  ArrowRight, CheckCircle, Star, ChevronDown, ChevronRight,
  Users, TrendingUp, Award, Clock, Globe, Sparkles, Play,
  Mail, Phone, MapPin, Send, Shield
} from "lucide-react"

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
}

/* ─── Reveal Wrapper ─── */
function Reveal({ children, className = "", delay = 0, variants = fadeUp }: {
  children: React.ReactNode; className?: string; delay?: number; variants?: any
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section Header ─── */
function SectionHeader({ tag, title, subtitle, light = false }: {
  tag: string; title: React.ReactNode; subtitle: string; light?: boolean
}) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
      <Reveal>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          {tag}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 ${light ? "text-white" : "text-white"}`}>
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed">{subtitle}</p>
      </Reveal>
    </div>
  )
}

/* ─── HERO SECTION ─── */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 10 })
    }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Grid pattern bg */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", stiffness: 30, damping: 20 }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ x: -mousePos.x, y: -mousePos.y }}
        transition={{ type: "spring", stiffness: 20, damping: 15 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none"
      />
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] animate-float pointer-events-none" />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            left: Math.random() * 100 + "%",
            background: i % 2 === 0 ? "#22d3ee" : "#6366f1",
            animationDuration: Math.random() * 10 + 8 + "s",
            animationDelay: Math.random() * 5 + "s",
            opacity: 0.4,
          }}
        />
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 text-slate-300 text-xs sm:text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          AI-Powered Platform for Modern Business
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">LIVE</span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.95] mb-8">
            <span className="text-white">Automate.</span>
            <br />
            <span className="text-gradient animate-gradient-shift">Dominate.</span>
            <br />
            <span className="text-white opacity-60">Scale.</span>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl text-slate-400 leading-relaxed mb-10 px-4"
        >
          From AI-powered lead generation to stunning websites — Helpa AI handles everything so you can focus on what matters.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4"
        >
          <Link
            href="/#contact"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white btn-primary text-base sm:text-lg"
          >
            Start Free Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/#features"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold btn-ghost text-base sm:text-lg"
          >
            <Play className="w-5 h-5 text-cyan-400" />
            See Our Services
          </Link>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-500"
        >
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "24/7", label: "AI Support" },
            { value: "10x", label: "Average ROI" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl" />
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10" />
            <Image
              src="/hero_dashboard_mockup_1781651601662.png"
              alt="Helpa AI Dashboard — Smart automation platform"
              width={1200}
              height={700}
              className="w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs"
      >
        <span>Scroll to explore</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ─── SERVICES SECTION ─── */
const SERVICES = [
  {
    slug: "seo-automation",
    icon: Search,
    title: "SEO & Automation",
    desc: "AI agents continuously optimize your website, build backlinks, and rank you #1 on Google — completely hands-free.",
    image: "/seo_automation_preview_1781651616804.png",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(34,211,238,0.2)",
    tags: ["Keyword Research", "Auto Ranking", "Backlinks"],
  },
  {
    slug: "smart-chatbots",
    icon: MessageSquare,
    title: "Smart Chatbots",
    desc: "24/7 AI sales representatives that qualify leads, book appointments, and answer complex queries instantly.",
    image: "/chatbot_interface_ui_1781653455550.png",
    color: "from-purple-500 to-pink-600",
    glow: "rgba(168,85,247,0.2)",
    tags: ["Lead Capture", "NLP", "Calendar Sync"],
  },
  {
    slug: "social-media-bots",
    icon: Globe,
    title: "Social Media Growth",
    desc: "Generate viral content, schedule posts, and grow your following across all platforms on complete autopilot.",
    image: "/social_media_dashboard_1781653466869.png",
    color: "from-pink-500 to-orange-500",
    glow: "rgba(236,72,153,0.2)",
    tags: ["Auto-Posting", "Viral Content", "Analytics"],
  },
  {
    slug: "ecommerce-listing",
    icon: ShoppingCart,
    title: "E-Commerce Automation",
    desc: "Bulk import products, generate SEO descriptions, and sync inventory across Shopify and WooCommerce.",
    image: "/ecommerce_products_ui_1781653476851.png",
    color: "from-teal-500 to-cyan-600",
    glow: "rgba(20,184,166,0.2)",
    tags: ["Bulk Import", "SEO Listings", "Inventory Sync"],
  },
  {
    slug: "growth-analytics",
    icon: BarChart3,
    title: "Growth Analytics",
    desc: "Unified intelligence dashboard connecting all marketing platforms. See exactly where to invest for maximum ROI.",
    image: "/analytics_charts_ui_1781653487579.png",
    color: "from-indigo-500 to-purple-600",
    glow: "rgba(99,102,241,0.2)",
    tags: ["Real-time Data", "Predictive AI", "Custom Reports"],
  },
  {
    slug: "task-automation",
    icon: Settings,
    title: "Task Automation Bots",
    desc: "If it involves clicking, typing, or moving data, we automate it. Save your team 50+ hours every single week.",
    image: "/workflow_automation_ui_1781653498667.png",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.2)",
    tags: ["Custom Workflows", "API Integration", "Zero Errors"],
  },
]

function Services() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="features" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          tag="Our Services"
          title={<>Everything you need to <span className="text-gradient">dominate</span> online</>}
          subtitle="Six powerful AI-driven services working together to grow your business 24/7 without you lifting a finger."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon
            return (
              <Reveal key={svc.slug} delay={i * 0.08}>
                <Link href={`/services/${svc.slug}`}>
                  <div
                    className="group relative h-full rounded-2xl overflow-hidden border border-white/5 cursor-pointer transition-all duration-500 hover:border-white/15"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      boxShadow: hovered === i ? `0 0 40px ${svc.glow}` : "none",
                    }}
                  >
                    {/* Service Image */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                      <Image
                        src={svc.image}
                        alt={svc.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${svc.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />

                      {/* Icon Badge */}
                      <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-[#0a0f1e]">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">{svc.desc}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {svc.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-400 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 group-hover:gap-3 transition-all">
                        Explore Service <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── HOW IT WORKS ─── */
function HowItWorks() {
  const steps = [
    { num: "01", icon: Users, title: "Connect Your Business", desc: "Sign up and tell us about your goals, industry, and current challenges. Takes less than 5 minutes.", color: "text-cyan-400", bg: "from-cyan-500/10 to-cyan-500/5" },
    { num: "02", icon: Settings, title: "Configure AI Agents", desc: "We set up and train AI agents specifically for your business model, voice, and target audience.", color: "text-indigo-400", bg: "from-indigo-500/10 to-indigo-500/5" },
    { num: "03", icon: Sparkles, title: "AI Goes to Work", desc: "Your agents run 24/7 — scraping leads, sending emails, posting content, and optimizing your SEO.", color: "text-purple-400", bg: "from-purple-500/10 to-purple-500/5" },
    { num: "04", icon: TrendingUp, title: "Watch Revenue Grow", desc: "Monitor real-time results on your dashboard and watch your pipeline fill up automatically.", color: "text-pink-400", bg: "from-pink-500/10 to-pink-500/5" },
  ]

  return (
    <section id="how-it-works" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <SectionHeader
          tag="The Process"
          title={<>Four steps to <span className="text-gradient">transform</span> your business</>}
          subtitle="Getting started is effortless. Our AI handles the complexity while you handle the growth."
        />

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-gradient-to-r from-cyan-500/30 via-indigo-500/50 to-pink-500/30" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <Reveal key={step.num} delay={i * 0.12}>
                  <div className="relative text-center group">
                    {/* Step Number */}
                    <div className={`relative w-[72px] h-[72px] mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.bg} border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 z-10`}>
                      <Icon className={`w-7 h-7 ${step.color}`} />
                      <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#0a0f1e] border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {step.num}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <Reveal delay={0.4}>
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 to-cyan-900/20 border border-indigo-500/20 text-center">
            <p className="text-slate-300 text-lg mb-4">Join 500+ businesses already running on Helpa AI</p>
            <Link href="/#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold text-white">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── RESULTS / STATS ─── */
function Results() {
  const stats = [
    { value: "500+", label: "Businesses Automated", icon: Users },
    { value: "10M+", label: "Tasks Completed", icon: Settings },
    { value: "98%", label: "Client Satisfaction", icon: Star },
    { value: "40h", label: "Saved Per Week", icon: Clock },
  ]

  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-cyan-950/30" />
      <div className="section-divider mb-16" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl glass border border-white/5 group hover:border-indigo-500/30 transition-all hover:glow-border-indigo">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1 text-gradient">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
      <div className="section-divider mt-16" />
    </section>
  )
}

/* ─── PRICING ─── */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      desc: "Perfect for small businesses just getting started with AI automation",
      features: ["1 Active AI Agent", "1,000 Tasks/month", "Basic SEO Reports", "Email Support", "Dashboard Access"],
      cta: "Start Free Trial",
      popular: false,
      color: "border-white/5",
      glow: "",
      btnClass: "btn-ghost",
    },
    {
      name: "Growth",
      price: "$199",
      period: "/month",
      desc: "For growing teams that need serious automation and real-time results",
      features: ["5 Active AI Agents", "Unlimited Tasks", "Advanced Analytics", "Priority Support", "Custom Workflows", "API Access", "Social Media Bots"],
      cta: "Start Free Trial",
      popular: true,
      color: "border-indigo-500/30",
      glow: "shadow-[0_0_50px_rgba(99,102,241,0.15)]",
      btnClass: "btn-primary",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Tailored AI infrastructure for large organizations with unique needs",
      features: ["Unlimited AI Swarms", "Dedicated Infrastructure", "White-label Options", "24/7 Phone Support", "Custom AI Models", "SLA Guarantee", "Onboarding Team"],
      cta: "Contact Sales",
      popular: false,
      color: "border-white/5",
      glow: "",
      btnClass: "btn-ghost",
    },
  ]

  return (
    <section id="pricing" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <SectionHeader
          tag="Pricing Plans"
          title={<>Simple, <span className="text-gradient">transparent</span> pricing</>}
          subtitle="No hidden fees. No contracts. Cancel anytime. Start with a free trial on any plan."
        />

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div className={`relative h-full rounded-3xl glass border ${plan.color} ${plan.glow} p-6 sm:p-8 flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
                {plan.popular && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-400/30">
                      MOST POPULAR
                    </div>
                  </>
                )}

                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-500 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#contact"
                  className={`w-full py-3.5 rounded-xl font-bold text-center transition-all ${plan.btnClass} ${plan.popular ? "text-white" : "text-slate-300"}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="text-center text-slate-500 text-sm mt-8">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── TESTIMONIALS ─── */
function Testimonials() {
  const reviews = [
    { name: "Sarah Chen", role: "CEO, Vertex Labs", text: "Helpa AI transformed our lead generation completely. 300% increase in qualified leads within the first 30 days. The ROI is insane.", stars: 5, init: "SC", color: "from-cyan-500 to-blue-600" },
    { name: "Marcus Johnson", role: "Founder, Nexus Digital", text: "We went from manually sending 50 emails a day to 500+ automated emails with personalization. The team saves 50+ hours every week now.", stars: 5, init: "MJ", color: "from-purple-500 to-pink-600" },
    { name: "Aiko Tanaka", role: "CMO, Tokyo Stream", text: "Our SEO rankings skyrocketed. Now ranking #1 for 15 competitive keywords. The automated content engine is a game-changer.", stars: 5, init: "AT", color: "from-teal-500 to-cyan-600" },
    { name: "David Park", role: "Director, Seoul AI Corp", text: "The website they built converts at 8% (industry average is 2%). The animations and UX design are absolutely world-class. 10/10.", stars: 5, init: "DP", color: "from-amber-500 to-orange-600" },
    { name: "Priya Sharma", role: "CEO, GrowthLab India", text: "From zero online presence to 10,000 monthly visitors in 3 months. Helpa's AI SEO bots are the real deal. Worth every penny.", stars: 5, init: "PS", color: "from-indigo-500 to-purple-600" },
    { name: "Alex Rivera", role: "Founder, NovaScale", text: "The chatbot they deployed books 15–20 discovery calls a week completely on autopilot. Our sales team only shows up for the meetings.", stars: 5, init: "AR", color: "from-pink-500 to-rose-600" },
  ]

  return (
    <section id="testimonials" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          tag="Client Stories"
          title={<>Trusted by <span className="text-gradient">innovators</span> worldwide</>}
          subtitle="Real results from real businesses. Here's what our clients say about working with Helpa AI."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {reviews.map((review, i) => (
            <Reveal key={review.name} delay={i * 0.08}>
              <div className="h-full p-6 sm:p-7 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed mb-6 text-sm sm:text-base flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {review.init}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{review.name}</p>
                    <p className="text-xs text-slate-400">{review.role}</p>
                  </div>
                  <Award className="w-4 h-4 text-amber-400 ml-auto opacity-50" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ SECTION (inline) ─── */
const FAQ_ITEMS = [
  { q: "How quickly can I get started?", a: "You can be up and running within 24-48 hours. After your onboarding call, our team configures your AI agents and runs test workflows before going live." },
  { q: "Do I need technical knowledge to use Helpa AI?", a: "Not at all. Our platform is built for business owners, not engineers. We handle all the technical setup. You just monitor results from a simple dashboard." },
  { q: "Can Helpa AI work with my existing tools?", a: "Yes. We integrate with 200+ platforms including HubSpot, Salesforce, Shopify, WooCommerce, Google Workspace, Slack, and many more via our API." },
  { q: "What happens to my data?", a: "Your data is encrypted at rest and in transit. We are GDPR compliant and never share your data with third parties. Full data export is available anytime." },
  { q: "Is there a free trial?", a: "Yes! Every plan comes with a 14-day free trial, no credit card required. You keep all leads and data generated during the trial regardless of whether you continue." },
  { q: "What makes Helpa AI different from other automation tools?", a: "Most tools require you to build workflows manually. Helpa AI uses autonomous agents that self-optimize. They learn from results and continuously improve without your input." },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          tag="FAQ"
          title={<>Common <span className="text-gradient">questions</span> answered</>}
          subtitle="Everything you need to know. Can't find your answer? Contact our team."
        />

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="rounded-2xl glass border border-white/5 overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-semibold text-white text-sm sm:text-base pr-4">{item.q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm sm:text-base text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-10 text-center">
            <p className="text-slate-400 mb-4">Still have questions?</p>
            <Link href="/faq" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              View Full FAQ Page <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── CONTACT SECTION ─── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.")
      return
    }
    setError("")
    setSending(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1800))
    setSending(false)
    setSent(true)
  }

  return (
    <section id="contact" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <SectionHeader
          tag="Get In Touch"
          title={<>Start your <span className="text-gradient">AI journey</span> today</>}
          subtitle="Tell us about your business and we'll show you exactly how Helpa AI can transform it. No sales pressure, just real value."
        />

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 max-w-5xl mx-auto">
          {/* Info Panel */}
          <Reveal variants={fadeLeft}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Why reach out?</h3>
              <p className="text-slate-400 leading-relaxed">
                Every business is unique. On our first call, we analyze your current workflow, identify the biggest automation opportunities, and give you a custom growth plan — completely free.
              </p>

              <div className="space-y-4">
                {[
                  { Icon: Clock, title: "Quick Response", desc: "We reply within 2 hours during business hours", color: "text-cyan-400" },
                  { Icon: Shield, title: "No Commitment", desc: "Free consultation with zero sales pressure", color: "text-indigo-400" },
                  { Icon: TrendingUp, title: "Custom Plan", desc: "A tailored AI strategy built just for your business", color: "text-purple-400" },
                ].map(({ Icon, title, desc, color }) => (
                  <div key={title} className="flex items-start gap-4 p-4 rounded-xl glass border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{title}</p>
                      <p className="text-xs text-slate-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>helpa.aiagency@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Available worldwide · Remote-first team</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={0.15}>
            <div className="glass-strong rounded-3xl border border-white/8 p-6 sm:p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                  <p className="text-slate-400">We'll get back to you within 2 hours. Check your inbox!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Service Interested In</label>
                    <select
                      value={form.service}
                      onChange={e => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-slate-300 focus:outline-none focus:border-indigo-500/60 transition-all text-sm appearance-none"
                    >
                      <option value="">Select a service...</option>
                      {SERVICES.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                      <option value="all">All Services (Full Package)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your business and what you're trying to achieve..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/8 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm resize-none"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 rounded-xl font-bold text-white btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {sending ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                          <Settings className="w-5 h-5" />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  return (
    <div className="bg-[#030712] min-h-screen overflow-x-hidden">
      <Hero />
      <div className="section-divider" />
      <Services />
      <div className="section-divider" />
      <HowItWorks />
      <Results />
      <div className="section-divider" />
      <Pricing />
      <div className="section-divider" />
      <Testimonials />
      <div className="section-divider" />
      <FAQSection />
      <div className="section-divider" />
      <Contact />
    </div>
  )
}
