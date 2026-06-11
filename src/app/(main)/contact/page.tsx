"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Phone,
  Mail,
  MapPin,
  Smartphone,
  ExternalLink,
  Camera,
  Play,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { contactInfo, socialLinks } from "@/data/contact"

const socialIcons: Record<string, React.ElementType> = {
  "play-store": Smartphone,
  "app-store": ExternalLink,
  instagram: Camera,
  youtube: Play,
}

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error("Please fill in all fields")
      return
    }
    toast.success("Message sent successfully! We'll get back to you soon.")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="mb-12"
        >
          <h1 className="font-display text-balance text-4xl font-bold text-foreground sm:text-5xl">
            Contact Us
          </h1>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-transparent" />
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="h-0.5 w-8 rounded-full bg-gradient-to-l from-primary/50 to-transparent" />
          </div>
          <p className="mt-4 max-w-lg text-sm text-muted-foreground">
            Get in touch with us. We&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Left column */}
          <div className="space-y-5">
            {/* Info cards */}
            {[
              { icon: Phone, label: "Phone", value: contactInfo.phone },
              { icon: Mail, label: "Email", value: contactInfo.email },
              { icon: MapPin, label: "Address", value: contactInfo.address },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i, ease: [0.2, 0, 0, 1] }}
                className="group relative flex items-center gap-4 rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_-4px_rgba(212,164,74,0.15)] dark:border-white/[0.06] dark:bg-white/[0.04]"
              >
                <div className="absolute left-0 top-2 h-8 w-0.5 rounded-full bg-primary/40 transition-all duration-300 group-hover:bg-primary/60" />
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.04]"
            >
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=76.45,31.20,76.55,31.27&layer=mapnik&marker=31.2325,76.5025"
                width="100%"
                height="200"
                title="Shri Anandpur Sahib Location"
                className="block"
                style={{ border: 0 }}
                loading="lazy"
              />
            </motion.div>
          </div>

          {/* Right column — Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-2xl sm:p-8 dark:border-white/[0.06] dark:bg-white/[0.04]"
          >
            <div className="pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-[#D4A44A]/[0.04] blur-[100px]" aria-hidden="true" />

            <div className="relative">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We typically respond within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-11 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="h-11 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Message
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    rows={5}
                    className="resize-none rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15]"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-gradient-to-r from-[#D4A44A] to-[#C49A3A] text-sm font-semibold text-white shadow-[0_4px_20px_rgba(212,164,74,0.2)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(212,164,74,0.35)] hover:brightness-110 active:scale-[0.98]"
                >
                  <Send className="mr-2 size-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mt-12"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Follow Us
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.icon] || ExternalLink
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground active:scale-[0.96]"
                >
                  <Icon className="size-4" />
                  {link.label}
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
