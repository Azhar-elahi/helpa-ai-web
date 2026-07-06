"use client"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRef, useState } from "react"
import {
  ArrowLeft, CheckCircle2, Zap, Star, ArrowRight, ChevronDown,
  Search, MessageSquare, Globe, ShoppingCart, BarChart3, Settings,
  Play, Shield, Clock, TrendingUp, Users
} from "lucide-react"

/* ─── Service Data ─── */
const services: Record<string, {
  title: string; subtitle: string; tagline: string; content: string;
  image: string; previewImage: string; color: string; gradient: string; glow: string;
  icon: any;
  benefits: string[];
  process: { step: string; title: string; desc: string }[];
  stats: { value: string; label: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "seo-automation": {
    icon: Search,
    title: "SEO & Automation",
    subtitle: "Rank #1 on Google — completely hands-free",
    tagline: "Your AI-powered SEO engine that never sleeps",
    content: "Our intelligent AI agents continuously crawl search engines, analyze competitor strategies, identify high-value keyword gaps, and optimize your entire website. From technical SEO fixes to programmatic content generation, your rankings improve month after month without you touching a thing.",
    image: "/seo_automation_preview_1781651616804.png",
    previewImage: "/hero_dashboard_mockup_1781651601662.png",
    color: "from-cyan-500 to-blue-600",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    glow: "rgba(34,211,238,0.3)",
    benefits: [
      "Automatic keyword research & tracking",
      "Programmatic SEO page generation",
      "AI-powered backlink outreach",
      "Technical SEO audits & auto-fixes",
      "Competitor gap analysis",
      "Real-time ranking reports",
    ],
    process: [
      { step: "01", title: "Site Audit", desc: "Full technical audit of your existing website identifies all ranking blockers and opportunities." },
      { step: "02", title: "Strategy Build", desc: "AI builds a custom 90-day SEO roadmap based on your niche, competition, and goals." },
      { step: "03", title: "Continuous Optimization", desc: "Agents run 24/7 updating meta tags, building links, and generating content automatically." },
      { step: "04", title: "Rank & Report", desc: "Watch your rankings climb while receiving weekly automated performance reports." },
    ],
    stats: [
      { value: "312%", label: "Average Traffic Increase" },
      { value: "4.2x", label: "More Leads from SEO" },
      { value: "87%", label: "Clients Rank Page 1" },
    ],
    faqs: [
      { q: "How long does it take to see results?", a: "Most clients see movement within 30–60 days. Significant ranking improvements typically occur within 90 days." },
      { q: "Do you handle local SEO?", a: "Yes. We optimize for local search, Google Business Profile, and geo-targeted keywords." },
      { q: "What niches do you work in?", a: "We work across all industries — from e-commerce and SaaS to local services and B2B." },
    ],
  },
  "smart-chatbots": {
    icon: MessageSquare,
    title: "Smart AI Chatbots",
    subtitle: "Your 24/7 AI sales team that never sleeps",
    tagline: "Convert visitors into paying customers automatically",
    content: "We train custom AI chatbots on your company data, products, and services. They qualify visitors, book appointments directly into your calendar, answer complex queries, and hand off hot leads to your sales team — all without human intervention.",
    image: "/chatbot_interface_ui_1781653455550.png",
    previewImage: "/chatbot_interface_ui_1781653455550.png",
    color: "from-purple-500 to-pink-600",
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    glow: "rgba(168,85,247,0.3)",
    benefits: [
      "Trained on your exact business data",
      "Natural language understanding (NLP)",
      "Direct calendar booking integration",
      "Lead qualification & scoring",
      "Multi-language support",
      "Seamless human handoff",
    ],
    process: [
      { step: "01", title: "Data Training", desc: "We feed the AI your website, FAQs, product docs, and past sales conversations." },
      { step: "02", title: "Personality Config", desc: "Set the chatbot tone, name, and escalation rules to match your brand." },
      { step: "03", title: "Integration", desc: "Deploy on your website, WhatsApp, Instagram, or any other channel in minutes." },
      { step: "04", title: "Optimize", desc: "Monthly reviews of conversation data to continuously improve conversion rates." },
    ],
    stats: [
      { value: "3x", label: "More Leads Captured" },
      { value: "24/7", label: "Availability" },
      { value: "68%", label: "Reduction in Support Tickets" },
    ],
    faqs: [
      { q: "Can the bot book appointments?", a: "Yes. It integrates directly with Calendly, Google Calendar, and most booking platforms." },
      { q: "What if a customer asks something the bot doesn't know?", a: "It escalates gracefully to a human team member via email or Slack notification." },
      { q: "Does it work on mobile?", a: "Fully responsive across all devices and platforms including mobile apps." },
    ],
  },
  "social-media-bots": {
    icon: Globe,
    title: "Social Media Growth",
    subtitle: "Viral content & growth on complete autopilot",
    tagline: "Build a massive following without posting yourself",
    content: "Our social media AI generates platform-optimized content, designs graphics, schedules posts at peak engagement times, responds to comments, monitors competitors, and tracks your growth — all from one intelligent automation engine.",
    image: "/social_media_dashboard_1781653466869.png",
    previewImage: "/social_media_dashboard_1781653466869.png",
    color: "from-pink-500 to-orange-500",
    gradient: "from-pink-500/20 via-orange-500/10 to-transparent",
    glow: "rgba(236,72,153,0.3)",
    benefits: [
      "AI-generated posts for every platform",
      "Optimal time scheduling engine",
      "Hashtag optimization AI",
      "Competitor monitoring & insights",
      "Automated comment responses",
      "Monthly analytics & growth reports",
    ],
    process: [
      { step: "01", title: "Brand Analysis", desc: "We analyze your brand voice, past performance, and target audience to calibrate content." },
      { step: "02", title: "Content Calendar", desc: "AI builds a full month of content covering your products, value, and engagement hooks." },
      { step: "03", title: "Auto-Publish", desc: "Content goes live at peak times across Facebook, Instagram, X, LinkedIn, and TikTok." },
      { step: "04", title: "Engage & Grow", desc: "Automated engagement responses build community while you focus on business." },
    ],
    stats: [
      { value: "800%", label: "Average Follower Growth" },
      { value: "12h", label: "Time Saved Weekly" },
      { value: "4.5x", label: "Better Engagement Rate" },
    ],
    faqs: [
      { q: "Which platforms do you support?", a: "Facebook, Instagram, X (Twitter), LinkedIn, TikTok, Pinterest, and YouTube Shorts." },
      { q: "Do I approve content before it posts?", a: "Fully flexible — you can review and approve, or set it to fully automatic after the initial setup." },
      { q: "Can you replicate my writing style?", a: "Yes. We analyze your past content and train the AI to write in your authentic voice." },
    ],
  },
  "ecommerce-listing": {
    icon: ShoppingCart,
    title: "E-Commerce Automation",
    subtitle: "Scale your catalog effortlessly with AI",
    tagline: "From supplier to live listing in minutes, not days",
    content: "Automatically import thousands of products from any supplier, generate SEO-optimized descriptions, resize and enhance images, set pricing rules, and keep inventory synchronized across Shopify, WooCommerce, and any other platform — all hands-free.",
    image: "/ecommerce_products_ui_1781653476851.png",
    previewImage: "/ecommerce_products_ui_1781653476851.png",
    color: "from-teal-500 to-cyan-600",
    gradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
    glow: "rgba(20,184,166,0.3)",
    benefits: [
      "Bulk product import from any supplier",
      "AI-generated SEO descriptions",
      "Automatic image optimization",
      "Smart pricing & margin rules",
      "Real-time inventory sync",
      "Multi-platform management",
    ],
    process: [
      { step: "01", title: "Source Connect", desc: "Connect your suppliers, dropship sources, or product spreadsheets to our system." },
      { step: "02", title: "AI Enhancement", desc: "Each product gets unique SEO titles, descriptions, and properly tagged images." },
      { step: "03", title: "Multi-Platform Push", desc: "Products publish simultaneously to all your storefronts with correct categories." },
      { step: "04", title: "Inventory Sync", desc: "Stock levels, prices, and availability update automatically across all platforms." },
    ],
    stats: [
      { value: "10,000+", label: "Products Managed" },
      { value: "95%", label: "Time Saved on Listings" },
      { value: "2.8x", label: "Conversion Improvement" },
    ],
    faqs: [
      { q: "Does it work with Shopify?", a: "Yes — Shopify, WooCommerce, Amazon, eBay, Etsy, and custom stores via API." },
      { q: "Can it handle product variants?", a: "Fully supports all variant types: size, color, material, etc. with individual SKU management." },
      { q: "What about product images?", a: "We automatically remove backgrounds, resize for each platform, and enhance image quality." },
    ],
  },
  "growth-analytics": {
    icon: BarChart3,
    title: "Growth Analytics",
    subtitle: "Crystal-clear intelligence for smarter decisions",
    tagline: "See your entire business in one AI-powered dashboard",
    content: "Stop making decisions based on gut feelings. Our unified analytics platform connects every marketing tool you use, applies AI to identify patterns, predicts future trends, and tells you exactly where to invest for maximum ROI.",
    image: "/analytics_charts_ui_1781653487579.png",
    previewImage: "/analytics_charts_ui_1781653487579.png",
    color: "from-indigo-500 to-purple-600",
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
    glow: "rgba(99,102,241,0.3)",
    benefits: [
      "Unified dashboard for all platforms",
      "Predictive revenue forecasting",
      "Customer lifetime value modeling",
      "Funnel drop-off analysis",
      "Competitor benchmarking",
      "Custom automated reports",
    ],
    process: [
      { step: "01", title: "Data Integration", desc: "Connect Google Ads, Meta, HubSpot, Shopify, and 100+ other platforms in minutes." },
      { step: "02", title: "AI Analysis", desc: "Machine learning identifies your highest-ROI channels, audiences, and content types." },
      { step: "03", title: "Action Alerts", desc: "Get smart notifications when something needs attention — before it becomes a problem." },
      { step: "04", title: "Auto Reporting", desc: "Weekly executive summaries delivered to your inbox automatically." },
    ],
    stats: [
      { value: "100+", label: "Platform Integrations" },
      { value: "37%", label: "Average Cost Reduction" },
      { value: "5h", label: "Reporting Time Saved Weekly" },
    ],
    faqs: [
      { q: "Which platforms can it connect to?", a: "Google Analytics, Meta Ads, Google Ads, HubSpot, Shopify, Stripe, Mailchimp, and 100+ more." },
      { q: "Is the data real-time?", a: "Most integrations update every 15 minutes. Some platforms support true real-time streaming." },
      { q: "Can I create custom dashboards?", a: "Yes. Drag-and-drop dashboard builder lets you create any view you need." },
    ],
  },
  "task-automation": {
    icon: Settings,
    title: "Task Automation Bots",
    subtitle: "Replace repetitive manual labor with smart AI bots",
    tagline: "If humans do it repeatedly, AI can do it better",
    content: "Any process that involves clicking, typing, copying data, sending emails, or generating reports can be automated. Our bots work 24/7 without errors, dramatically cutting operational costs and freeing your team to focus on high-value work.",
    image: "/workflow_automation_ui_1781653498667.png",
    previewImage: "/workflow_automation_ui_1781653498667.png",
    color: "from-amber-500 to-orange-600",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    glow: "rgba(245,158,11,0.3)",
    benefits: [
      "Custom workflow design & deployment",
      "Cross-platform API integrations",
      "Automated data entry & extraction",
      "Scheduled task execution",
      "Error detection & recovery",
      "Full audit trail & logging",
    ],
    process: [
      { step: "01", title: "Process Mapping", desc: "We map your current workflows to identify the highest-value automation opportunities." },
      { step: "02", title: "Bot Design", desc: "Custom bots are designed and tested in a sandbox environment before going live." },
      { step: "03", title: "Deploy & Monitor", desc: "Bots go live with real-time monitoring dashboards and instant error alerts." },
      { step: "04", title: "Scale & Expand", desc: "As bots prove ROI, we expand automation to additional processes across your business." },
    ],
    stats: [
      { value: "50h+", label: "Saved Per Week" },
      { value: "99.8%", label: "Accuracy Rate" },
      { value: "6 weeks", label: "Average Payback Period" },
    ],
    faqs: [
      { q: "What kinds of tasks can be automated?", a: "Data entry, report generation, email sending, invoice processing, inventory updates, lead routing, and much more." },
      { q: "Do I need to install any software?", a: "No. All bots run in the cloud. You just provide access credentials and we handle everything." },
      { q: "What if a bot fails or encounters an error?", a: "Built-in error detection pauses the bot and alerts your team immediately via email and Slack." },
    ],
  },
}

/* ─── Helpers ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── SERVICE DETAIL PAGE ─── */
export default function ServiceDetail({ params }: { params: { slug: string } }) {
  const service = services[params.slug]
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Zap className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-slate-400 mb-8">This service doesn&apos;t exist or may have moved.</p>
          <Link href="/#features" className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary text-white font-semibold">
            <ArrowLeft className="w-4 h-4" /> View All Services
          </Link>
        </div>
      </div>
    )
  }

  const Icon = service.icon

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} pointer-events-none`} />
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none animate-glow-pulse"
          style={{ background: service.glow }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/#features"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Services
            </Link>
          </motion.div>

          {/* Service Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${service.color} bg-opacity-10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6`}>
              <Icon className="w-4 h-4" />
              {service.title}
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            {service.subtitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mb-8"
          >
            {service.tagline}
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-8 mb-10"
          >
            {service.stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <div className={`text-3xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                  {s.value}
                </div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Link
              href="/#contact"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r ${service.color} shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform`}
            >
              Get Started with {service.title} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── PREVIEW IMAGE ─── */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10" />
              <Image
                src={service.image}
                alt={service.title}
                width={1200}
                height={650}
                className="w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHAT WE DO ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className={`inline-block text-xs font-bold uppercase tracking-widest mb-4 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                What We Do
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Everything handled for you
              </h2>
              <p className="text-slate-400 leading-relaxed text-base sm:text-lg">{service.content}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl glass border border-white/5 hover:border-white/10 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-300">{b}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className={`inline-block text-xs font-bold uppercase tracking-widest mb-4 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                Our Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">How it works</h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {service.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="p-6 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  <div className={`text-5xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent opacity-30 mb-3`}>
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <span className={`inline-block text-xs font-bold uppercase tracking-widest mb-4 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                Common Questions
              </span>
              <h2 className="text-3xl font-bold text-white">Frequently asked</h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="rounded-2xl glass border border-white/5 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className={`relative p-10 sm:p-16 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 text-center`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-50 pointer-events-none`} />
              <div className="relative">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to automate {service.title.toLowerCase()}?
                </h2>
                <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                  Start your free trial today. No credit card required. Cancel anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/#contact"
                    className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r ${service.color} hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.3)]`}
                  >
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold btn-ghost text-white"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
