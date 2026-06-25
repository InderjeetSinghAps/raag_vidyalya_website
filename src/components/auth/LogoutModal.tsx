"use client"

import { LogOut, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { resolveImageUrl } from "@/store/api"
import type { User } from "@/types"

const glassDialog =
  "sm:max-w-md border-border/50 bg-card/95 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-card/90 [&>button]:text-muted-foreground"

export function LogoutModal({
  open,
  onOpenChange,
  user,
  isLoggingOut,
  onLogout,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: User | null
  isLoggingOut: boolean
  onLogout: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 pt-2"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10">
              <LogOut className="size-6 text-red-500" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-lg text-foreground">
                Log Out
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to log out? You&apos;ll need
                to sign in again to access your account.
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="mx-auto mt-2 flex w-full max-w-xs items-center gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            {user.profileImage || user.avatar ? (
              <img
                src={resolveImageUrl(
                  (user.profileImage || user.avatar)!,
                )}
                alt=""
                referrerPolicy="no-referrer"
                className="size-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {(user.name || user.userName || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name || user.userName}
              </p>
              <p className="truncate text-xs text-muted-foreground/60">
                {user.email}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="mt-4 flex gap-3"
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          <Button
            onClick={onLogout}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(239,68,68,0.25)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(239,68,68,0.4)] hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Logging Out...
              </>
            ) : (
              "Log Out"
            )}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
