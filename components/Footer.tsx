"use client"
import Link from "next/link"
import { Mail, Zap, Twitter, Linkedin, Github, MessageCircle, ArrowRight } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null

  const services = [
    { label: "SEO & Automation", href: "/services/seo-automation" },
    { label: "Smart Chatbots", href: "/services/smart-chatbots" },
    { label: "Social Media Bots", href: "/services/social-media-bots" },
    { label: "E-Commerce Listing", href: "/services/ecommerce-listing" },
    { label: "Growth Analytics", href: "/services/growth-analytics" },
    { label: "Task Automation", href: "/services/task-automation" },
  ]

  const company = [
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track" },
    { label: "Contact", href: "/#contact" },
  ]

  return (
    <footer className="relative border-t border-white/5 bg-[#030712] overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* CTA Strip */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-cyan-900/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Ready to transform your business?
            </h3>
            <p className="text-slate-400">Join hundreds of companies already using Helpa AI.</p>
          </div>
          <Link
            href="/#contact"
            className="shrink-0 flex items-center gap-2 px-7 py-4 rounded-full font-bold text-white btn-primary whitespace-nowrap"
          >
            Start Free Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl text-gradient">Helpa AI</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              AI-powered automation for modern businesses. Scale smarter, grow faster, work less.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>helpa.aiagency@gmail.com</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-5 text-sm uppercase tracking-wider">Services</h4>
            <div className="space-y-3">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className="block text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-5 text-sm uppercase tracking-wider">Company</h4>
            <div className="space-y-3">
              {company.map((c) => (
                <Link key={c.href} href={c.href} className="block text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-5 text-sm uppercase tracking-wider">Legal</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</p>
              <p className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</p>
              <p className="hover:text-cyan-400 transition-colors cursor-pointer">Cookie Policy</p>
              <p className="hover:text-cyan-400 transition-colors cursor-pointer">GDPR</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Helpa AI. All rights reserved. Built with ❤️ for ambitious businesses.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Twitter, label: "Twitter" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Github, label: "GitHub" },
              { Icon: MessageCircle, label: "Discord" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all hover:border-white/10"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
