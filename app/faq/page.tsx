"use client"
import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronDown, Sparkles, Search, ArrowRight, MessageCircle } from "lucide-react"

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const FAQ_CATEGORIES = [
  {
    category: "Getting Started",
    color: "from-cyan-500 to-blue-600",
    accent: "text-cyan-400",
    questions: [
      { q: "How quickly can I get started?", a: "Within 24–48 hours. After your onboarding call, our team configures your AI agents and runs test workflows before going live. Most clients have their first automated tasks running within the same week." },
      { q: "Do I need technical knowledge?", a: "Not at all. Our platform is built for business owners, not engineers. We handle all the technical setup. You just monitor results from a beautiful, simple dashboard." },
      { q: "What information do I need to provide to get started?", a: "Just your business details, target audience, goals, and access to your existing tools. Our onboarding team walks you through everything step by step." },
      { q: "Is there a free trial?", a: "Yes! Every plan includes a 14-day free trial with no credit card required. All leads, data, and automations created during the trial are yours to keep." },
    ]
  },
  {
    category: "Services & Features",
    color: "from-indigo-500 to-purple-600",
    accent: "text-indigo-400",
    questions: [
      { q: "What services does Helpa AI offer?", a: "We offer six core services: SEO & Website Automation, Smart AI Chatbots, Social Media Growth Bots, E-Commerce Automation, Growth Analytics, and Custom Task Automation. These can be used individually or as a combined package." },
      { q: "Can the AI chatbot book appointments?", a: "Yes. Our chatbots integrate directly with Calendly, Google Calendar, Acuity, and most booking platforms. Prospects can book calls without any human involvement." },
      { q: "Which social media platforms do you support?", a: "Facebook, Instagram, X (Twitter), LinkedIn, TikTok, Pinterest, and YouTube Shorts. Each platform gets content optimized for its specific algorithm and audience." },
      { q: "Can Helpa AI work with my existing tools?", a: "Absolutely. We integrate with 200+ platforms including HubSpot, Salesforce, Shopify, WooCommerce, Mailchimp, Google Workspace, Slack, and many more via our API gateway." },
    ]
  },
  {
    category: "Pricing & Billing",
    color: "from-purple-500 to-pink-600",
    accent: "text-purple-400",
    questions: [
      { q: "What are your pricing plans?", a: "We offer three tiers: Starter ($49/month), Growth ($199/month), and Enterprise (custom pricing). All plans include a 14-day free trial. View our full pricing section for details." },
      { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts. Cancel anytime from your dashboard with no cancellation fees. Your account remains active until the end of your billing period." },
      { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on your first paid month if you're not satisfied with the results. After that, our no-refund policy applies (which is why we offer a free trial first!)." },
      { q: "Are there any setup fees?", a: "No hidden setup fees. The price you see is the price you pay. Enterprise plans may include a one-time onboarding fee depending on complexity." },
    ]
  },
  {
    category: "Security & Privacy",
    color: "from-teal-500 to-cyan-600",
    accent: "text-teal-400",
    questions: [
      { q: "How is my data protected?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are GDPR compliant, SOC 2 certified, and undergo quarterly third-party security audits." },
      { q: "Do you share my data with third parties?", a: "Never. Your business data, leads, and customer information are exclusively yours. We do not sell, share, or use your data for any purpose beyond providing our service." },
      { q: "Can I export my data?", a: "Yes. Full data export is available anytime from your dashboard in CSV, JSON, or Excel formats. Your data is always yours to take with you." },
      { q: "Where are your servers located?", a: "Primary servers in the US and EU with redundant backups. You can request data residency in specific regions on Enterprise plans." },
    ]
  },
  {
    category: "Results & Performance",
    color: "from-amber-500 to-orange-600",
    accent: "text-amber-400",
    questions: [
      { q: "How long does it take to see results from SEO?", a: "Most clients see ranking movements within 30–60 days. Significant, measurable improvements typically occur within 90 days. Full dominance of target keywords usually happens within 6 months." },
      { q: "What ROI should I expect?", a: "Our clients average a 10x ROI within the first 6 months. This varies by service and industry, but every client receives a custom ROI projection during their free consultation." },
      { q: "What if the AI makes mistakes?", a: "All AI actions are logged and reversible. We have human oversight processes for high-stakes actions, and our monitoring systems catch anomalies within minutes." },
      { q: "Can I see a demo before committing?", a: "Yes! We offer live demos showing exactly how our AI would work for your specific business. Book a free demo call from our contact page." },
    ]
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = FAQ_CATEGORIES
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(q =>
        !search || q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(cat =>
      cat.questions.length > 0 && (!activeCategory || cat.category === activeCategory)
    )

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.questions.length, 0)

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* ─── HERO ─── */}
      <section className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-6 overflow-hidden text-center">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Knowledge Base
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-slate-400 mb-10"
          >
            Everything you need to know about Helpa AI. Can&apos;t find your answer?{" "}
            <Link href="/#contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contact us directly.</Link>
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-strong border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm"
            />
          </motion.div>

          {search && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-400 mt-3"
            >
              {totalResults} result{totalResults !== 1 ? "s" : ""} found for &ldquo;{search}&rdquo;
            </motion.p>
          )}
        </div>
      </section>

      {/* ─── CATEGORY FILTERS ─── */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !activeCategory
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "glass border border-white/5 text-slate-400 hover:text-white hover:border-white/10"
              }`}
            >
              All Topics
            </button>
            {FAQ_CATEGORIES.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.category
                    ? `bg-gradient-to-r ${cat.color} text-white`
                    : "glass border border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ CONTENT ─── */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-10">
          {filteredCategories.map((cat, catIdx) => (
            <Reveal key={cat.category} delay={catIdx * 0.05}>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${cat.color}`} />
                  <h2 className={`text-sm font-bold uppercase tracking-widest ${cat.accent}`}>
                    {cat.category}
                  </h2>
                </div>

                <div className="space-y-2">
                  {cat.questions.map((item, qIdx) => {
                    const key = `${cat.category}-${qIdx}`
                    const isOpen = openItems[key]

                    return (
                      <div key={key} className="rounded-2xl glass border border-white/5 overflow-hidden hover:border-white/8 transition-colors">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
                        >
                          <span className="font-semibold text-white text-sm sm:text-base pr-4 group-hover:text-cyan-300 transition-colors">
                            {item.q}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
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
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}

          {filteredCategories.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
              <p className="text-slate-400 mb-6">Try a different search term or{" "}
                <button onClick={() => setSearch("")} className="text-cyan-400 hover:text-cyan-300">clear the search</button>.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <MessageCircle className="w-12 h-12 text-cyan-400 mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-slate-400 mb-8">
              Our team responds to every message within 2 hours. We&apos;re here to help you make the right decision.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold text-white"
            >
              Contact Our Team <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
