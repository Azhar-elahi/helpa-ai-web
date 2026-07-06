"use client"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Award, Users, TrendingUp, Globe, Zap, Target, Heart,
  ArrowRight, CheckCircle, Star, Sparkles, Shield, Clock
} from "lucide-react"

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const stats = [
  { value: "500+", label: "Businesses Served", icon: Users },
  { value: "10M+", label: "Tasks Automated", icon: Zap },
  { value: "98%", label: "Client Retention", icon: Heart },
  { value: "40h", label: "Saved Per Week", icon: Clock },
]

const values = [
  { icon: Target, title: "Results-Obsessed", desc: "We don't celebrate effort — we celebrate results. Every decision is made with ROI in mind.", color: "from-cyan-500/20 to-cyan-500/5", iconColor: "text-cyan-400" },
  { icon: Shield, title: "Transparency First", desc: "No black boxes. Every AI action is logged, every result is measurable, every decision explainable.", color: "from-indigo-500/20 to-indigo-500/5", iconColor: "text-indigo-400" },
  { icon: Sparkles, title: "Innovation Always", desc: "We ship improvements every two weeks. Our clients get the latest AI capabilities automatically.", color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400" },
  { icon: Heart, title: "Client-Centered", desc: "We measure our success by your success. Our entire team's incentive is aligned with your growth.", color: "from-pink-500/20 to-pink-500/5", iconColor: "text-pink-400" },
]

const team = [
  { name: "Ahmed Hassan", role: "CEO & AI Architect", init: "AH", color: "from-cyan-500 to-blue-600" },
  { name: "Fatima Malik", role: "Head of Automation", init: "FM", color: "from-purple-500 to-pink-600" },
  { name: "Omar Khan", role: "Lead Engineer", init: "OK", color: "from-teal-500 to-cyan-600" },
  { name: "Zara Ali", role: "SEO Intelligence Lead", init: "ZA", color: "from-indigo-500 to-purple-600" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      {/* ─── HERO ─── */}
      <section className="relative pt-28 sm:pt-36 pb-20 px-4 sm:px-6 overflow-hidden text-center">
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              About Helpa AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8"
          >
            We believe <span className="text-gradient">AI should work</span> for everyone
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Helpa AI was founded on a simple belief: every business, regardless of size, deserves access to the same AI automation tools that Fortune 500 companies use. We make that possible.
          </motion.p>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.label} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl glass border border-white/5 text-center group hover:border-indigo-500/20 transition-all">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">{s.value}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── MISSION ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Democratizing AI for every business on the planet
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                In 2023, we saw a clear divide: large enterprises were automating their entire operations with AI, while small and medium businesses were still doing everything manually. The tools existed, but they were complex, expensive, and required entire tech teams to manage.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                We built Helpa AI to bridge that gap. Today, a two-person startup can run the same AI-powered lead generation, SEO, and marketing automation as a 500-person corporation — at a fraction of the cost.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-primary font-semibold text-white"
              >
                Start Your AI Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                <Image
                  src="/hero_dashboard_mockup_1781651601662.png"
                  alt="Helpa AI Platform Dashboard"
                  width={700}
                  height={450}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/50 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What we stand for</h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <Reveal key={v.title} delay={i * 0.1}>
                  <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${v.color} border border-white/5 hover:border-white/10 transition-all hover:scale-[1.01]`}>
                    <div className="w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center mb-5">
                      <Icon className={`w-6 h-6 ${v.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">The Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The minds behind the machine</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A distributed team of AI engineers, marketers, and automation specialists united by one goal: your business growth.</p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.1}>
                <div className="text-center p-6 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all group hover:scale-[1.03]">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform`}>
                    {member.init}
                  </div>
                  <h3 className="font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AWARDS ─── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">Recognition</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Award-winning innovation</h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { award: "Best AI Startup 2024", org: "TechCrunch Disrupt", icon: Award },
              { award: "Top Automation Tool", org: "G2 Crowd Reviews", icon: Star },
              { award: "Most Innovative SaaS", org: "Product Hunt", icon: Sparkles },
            ].map((a, i) => {
              const Icon = a.icon
              return (
                <Reveal key={a.award} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl glass border border-amber-500/10 hover:border-amber-500/20 transition-all text-center group">
                    <Icon className="w-8 h-8 text-amber-400 mx-auto mb-4 group-hover:scale-125 transition-transform" />
                    <h3 className="font-bold text-white text-sm mb-1">{a.award}</h3>
                    <p className="text-xs text-slate-500">{a.org}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border border-indigo-500/20">
              <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-6 animate-glow-pulse" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join our growing family</h2>
              <p className="text-slate-400 mb-8 text-lg">500+ businesses already running on autopilot. What are you waiting for?</p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-bold text-white"
              >
                Start Free Today <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
