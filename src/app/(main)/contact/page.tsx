"use client"

import { useState } from "react"
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
        <div className="mb-10">
          <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <div className="mt-1.5 h-0.5 w-10 rounded-full bg-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Get in touch with us. We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Phone className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Phone
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {contactInfo.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {contactInfo.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Address
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {contactInfo.address}
                </p>
              </div>
            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-card p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] sm:p-8"
          >
            <h2 className="text-lg font-semibold text-foreground">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We typically respond within 24 hours.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Message
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  rows={5}
                  className="resize-none bg-background"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full border-0 text-sm font-medium text-[#081527] transition-all duration-200 active:scale-[0.96]"
                style={{
                  background: "var(--color-primary, #D4A44A)",
                }}
              >
                <Send className="mr-2 size-4" />
                Send Message
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-12">
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
                  className="flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(212,164,74,0.2),0_4px_12px_rgba(0,0,0,0.2)] active:scale-[0.97]"
                >
                  <Icon className="size-4 text-primary" />
                  {link.label}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
