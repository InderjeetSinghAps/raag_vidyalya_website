'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Loader2, X, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send query');

      toast.success('Query sent successfully! We will get back to you soon.');
      setName('');
      setEmail('');
      setMessage('');
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/30 bg-card p-6 shadow-2xl sm:p-8"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/10 blur-[80px]" />

            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Contact Us</h3>
                <p className="text-xs text-muted-foreground">
                  Send your inquiry directly to our team
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="h-11 rounded-xl border-border bg-background/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="h-11 rounded-xl border-border bg-background/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Message / Query
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message or question here..."
                  rows={4}
                  required
                  className="resize-none rounded-xl border-border bg-background/50 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-xl bg-gradient-to-r from-primary to-amber-500 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending Query...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
