"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BookOpen,
  // Download,
  Trophy,
  ChevronRight,
  Bookmark,
  Wallet,
  CreditCard,
  FileText,
  MessageSquare,
  Lock,
  Globe,
  Pencil,
  Shield,
  User,
  GraduationCap,
  Clock,
  Scale,
  Camera,
  Phone,
  Headphones,
  MessageCircle,
  Mail,
  Music,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateUser } from "@/store/authSlice"
import { setLanguage, Language } from "@/store/languageSlice"
import { useGetUserDetailQuery, useUpdateUserMutation, useChangePasswordMutation, useSetPasswordMutation, resolveImageUrl } from "@/store/api"
import { toast } from "sonner"
import { contactInfo } from "@/data/contact"

const inputClass =
  "h-11 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25"

const selectClass =
  "!h-11 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:hover:border-white/[0.15]"

const modalOverlay = "sm:max-w-md [&>button]:text-muted-foreground"

const glassDialog =
  "sm:max-w-md border-border/50 bg-card/95 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-card/90 [&>button]:text-muted-foreground"

const goldButtonClass =
  "h-11 w-full rounded-xl bg-gradient-to-r from-[#D4A44A] to-[#C49A3A] text-sm font-semibold text-white shadow-[0_4px_20px_rgba(212,164,74,0.2)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(212,164,74,0.35)] hover:brightness-110 active:scale-[0.98]"

type MenuItem = {
  label: string
  icon: React.ElementType
  action: "modal" | "link" | "toast"
  value: string
}

const menuGroups: { title: string; icon: React.ElementType; items: MenuItem[] }[] = [
  {
    title: "Learning",
    icon: GraduationCap,
    items: [
      { label: "My Enrollments", icon: BookOpen, action: "link", value: "/courses/my-courses" },
      { label: "Bookmarks", icon: Bookmark, action: "link", value: "/courses/bookmarks" },
      // { label: "My Downloads", icon: Download, action: "toast", value: "Downloads coming soon!" },
    ],
  },
  {
    title: "Account",
    icon: User,
    items: [
      { label: "Edit Profile", icon: Pencil, action: "modal", value: "editProfile" },
      { label: "Set Password", icon: Lock, action: "modal", value: "setPassword" },
      { label: "Change Language", icon: Globe, action: "modal", value: "changeLanguage" },
    ],
  },
  {
    title: "Subscription & Wallet",
    icon: Wallet,
    items: [
      { label: "My Wallet", icon: Wallet, action: "toast", value: "Wallet coming soon!" },
      { label: "Subscription", icon: CreditCard, action: "toast", value: "Subscription coming soon!" },
    ],
  },
  {
    title: "Support & Legal",
    icon: Scale,
    items: [
      { label: "Contest History", icon: Trophy, action: "toast", value: "Contest history coming soon!" },
      { label: "Contact Support", icon: Headphones, action: "modal", value: "contactSupport" },
      { label: "Suggestion Box", icon: MessageSquare, action: "modal", value: "suggestion" },
      { label: "Privacy Policy", icon: Shield, action: "modal", value: "privacy" },
      { label: "Terms & Conditions", icon: FileText, action: "modal", value: "terms" },
      { label: "About", icon: User, action: "link", value: "/about" },
    ],
  },
]

// ── Modals ──

function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const [updateUserApi, { isLoading: saving }] = useUpdateUserMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [age, setAge] = useState(user?.age?.toString() || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [phoneCode, setPhoneCode] = useState(user?.countryCode || "+91")
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(user?.name || "")
    setEmail(user?.email || "")
    setAge(user?.age?.toString() || "")
    setGender(user?.gender || "")
    setPhoneCode(user?.countryCode || "+91")
    setPhoneNumber(user?.phoneNumber || "")
    setPhotoPreview(null)
  }, [open, user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setPhotoPreview(ev?.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const phoneCodes = ["+91", "+1", "+44", "+61", "+971", "+65", "+977", "+92", "+880"]

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    try {
      const payload: Record<string, unknown> = {}
      if (name.trim() !== user?.name) payload.userName = name.trim()
      if (gender && gender !== user?.gender) payload.gender = gender
      if (age) payload.age = Number(age)
      if (phoneNumber) {
        payload.phoneNumber = phoneNumber
        payload.countryCode = phoneCode
      }
      if (photoPreview) payload.profileImage = photoPreview

      if (Object.keys(payload).length > 0) {
        await updateUserApi(payload).unwrap()
      }

      dispatch(updateUser({
        name: name.trim(),
        email: email.trim(),
        gender,
        age: age ? Number(age) : undefined,
        phoneNumber,
        countryCode: phoneCode,
      }))
      toast.success("Profile updated")
      onClose()
    } catch {
      toast.error("Failed to update profile")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Pencil className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update your personal information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          {/* Photo */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative overflow-hidden rounded-full"
            >
              <div className="size-20 rounded-full bg-muted transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/40 group-hover:ring-offset-2 ring-offset-background flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="size-full object-cover" />
                ) : (
                  <User className="size-8 text-muted-foreground/60" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Camera className="size-6 text-white drop-shadow-md" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Profile Info */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">Profile Info</span>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
            </div>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">Personal Details</span>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Age</Label>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className={inputClass} min={1} max={150} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Gender</Label>
                  <Select value={gender} onValueChange={(v) => v && setGender(v)}>
                    <SelectTrigger className={selectClass}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Phone</Label>
                <div className="flex gap-2">
                  <Select value={phoneCode} onValueChange={(v) => v && setPhoneCode(v)}>
                    <SelectTrigger className={selectClass + " w-[110px] shrink-0"}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phoneCodes.map((code) => (
                        <SelectItem key={code} value={code}>{code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Phone number"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className={goldButtonClass}>{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SetPasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [changePassword, { isLoading: saving }] = useChangePasswordMutation()
  const [setPassword, _] = useSetPasswordMutation()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!open) return
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
  }, [open])

  const strength = Math.min(newPassword.length, 12)
  const strengthBars = Math.floor(strength / 4) + (strength > 0 ? 1 : 0)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
  const strengthLabels = ["", "Weak", "Fair", "Strong"]

  const handleSave = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    try {
      if (currentPassword) {
        await changePassword({ oldPassword: currentPassword, newPassword }).unwrap()
      } else {
        await setPassword({ newPassword }).unwrap()
      }
      toast.success("Password updated successfully")
      onClose()
    } catch {
      toast.error("Failed to update password")
    }
  }

  const inputWithToggle = (
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    toggle: () => void,
    placeholder: string,
  ) => (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Lock className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Set Password</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Change your account password.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Current Password</Label>
            {inputWithToggle(currentPassword, setCurrentPassword, showCurrent, () => setShowCurrent((p) => !p), "Enter current password")}
          </div>

          <div className="h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">New Password</Label>
            {inputWithToggle(newPassword, setNewPassword, showNew, () => setShowNew((p) => !p), "Enter new password")}
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strengthBars
                          ? strengthColors[strengthBars - 1] + " shadow-[0_0_6px_rgba(212,164,74,0.3)]"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                  {strengthLabels[strengthBars - 1] || ""}
                </p>
              </div>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Confirm New Password</Label>
            {inputWithToggle(confirmPassword, setConfirmPassword, showConfirm, () => setShowConfirm((p) => !p), "Confirm new password")}
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-[10px] font-medium text-red-400">Passwords do not match</p>
            )}
          </div>

          <Button onClick={handleSave} disabled={saving} className={goldButtonClass}>{saving ? "Updating..." : "Update Password"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ChangeLanguageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch()
  const language = useAppSelector((s) => s.language)

  const languages = [
    { value: "english", label: "English", display: "English", flag: "🇬🇧" },
    { value: "hindi", label: "Hindi", display: "हिन्दी", flag: "🇮🇳" },
    { value: "punjabi", label: "Punjabi", display: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  ]

  const handleSelect = (value: string) => {
    dispatch(setLanguage(value as Language))
    const lang = languages.find((l) => l.value === value)
    toast.success(`Language changed to ${lang?.label || value}`)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Globe className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Choose Language</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Select your preferred language.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4 grid gap-3">
          {languages.map((lang) => {
            const active = language === lang.value
            return (
              <button
                key={lang.value}
                onClick={() => handleSelect(lang.value)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_rgba(212,164,74,0.1)]"
                    : "border-border/50 bg-transparent hover:border-primary/20 hover:bg-white/[0.02]"
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className={`text-base font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                  {lang.display}
                </span>
                {active && (
                  <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-primary/20">
                    <span className="size-2.5 rounded-full bg-primary" />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SuggestionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your suggestion")
      return
    }
    if (!text.trim()) {
      toast.error("Please enter your suggestion")
      return
    }
    toast.success("Thank you! Your suggestion has been submitted.")
    setTitle("")
    setText("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Suggestion Box</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                We&apos;d love to hear your feedback or ideas.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span>
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Title</Label>
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your suggestion"
              className={inputClass}
            />
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</Label>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts, suggestions, or ideas..."
              rows={5}
              className="resize-none rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25"
            />
            <div className="mt-1.5 text-right text-[10px] font-medium text-muted-foreground/40">
              {text.length} characters
            </div>
          </div>

          <Button onClick={handleSubmit} className={goldButtonClass}>Submit Feedback</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sections = [
    {
      title: "Data Collection",
      text: "Your privacy matters to us. Raag Vidyalaya collects only the information necessary to provide our educational services, including your name, email address, and course progress data.",
    },
    {
      title: "Your Data Is Yours",
      text: "We do not sell, rent, or share your personal information with third parties for their marketing purposes. Your data is stored securely and used solely to improve your learning experience.",
      highlight: "We do not sell, rent, or share your personal information",
    },
    {
      title: "Deletion",
      text: "You may request deletion of your account and associated data at any time by contacting our support team.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Privacy Policy</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                How we handle your data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-5 text-sm">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary/80">
                  {section.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {section.highlight ? (
                    <>
                      {section.text.replace(section.highlight, "")}
                      <span className="text-primary/80 font-medium">{section.highlight}</span>
                    </>
                  ) : (
                    section.text
                  )}
                </p>
                {i < sections.length - 1 && (
                  <div className="mt-4 h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
                )}
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground/40">Last updated: June 2026</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const sections = [
    {
      title: "Acceptance",
      text: "By using Raag Vidyalaya, you agree to these terms. Our platform provides educational content on Gurmat Sangeet for personal, non-commercial use only.",
    },
    {
      title: "Intellectual Property",
      text: 'All course materials, raag notations, and audio content are protected by copyright. You may not redistribute, resell, or publicly perform any content without written permission.',
      highlight: "protected by copyright",
    },
    {
      title: "Changes",
      text: "We reserve the right to update these terms. Continued use of the platform after changes constitutes acceptance of the new terms.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={glassDialog}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Terms & Conditions</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Please read these terms carefully.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-5 text-sm">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary/80">
                  {section.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {section.highlight ? (
                    <>
                      {section.text.replace(section.highlight, "")}
                      <span className="text-primary/80 font-medium">{section.highlight}</span>
                    </>
                  ) : (
                    section.text
                  )}
                </p>
                {i < sections.length - 1 && (
                  <div className="mt-4 h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
                )}
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground/40">Last updated: June 2026</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function ContactSupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const supportCards = [
    {
      icon: Mail,
      label: "Email Us",
      value: contactInfo.email,
      action: "mailto:" + contactInfo.email,
    },
    {
      icon: Phone,
      label: "Call Us",
      value: contactInfo.phone,
      action: "tel:" + contactInfo.phone,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us on WhatsApp",
      action: "https://wa.me/" + contactInfo.phone.replace(/\D/g, ""),
    },
    {
      icon: Clock,
      label: "Support Hours",
      value: "Mon–Sat, 9:00 AM – 6:00 PM (IST)",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-2xl dark:border-white/[0.06] dark:bg-card/90 [&>button]:text-muted-foreground">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Headphones className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Contact Support</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                How can we help you?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-2 space-y-3">
          {supportCards.map((card) => {
            const Inner = (
              <div className="group relative flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_16px_-4px_rgba(212,164,74,0.12)] dark:border-white/[0.06] dark:bg-white/[0.03]">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <card.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{card.label}</p>
                  <p className="text-xs text-muted-foreground">{card.value}</p>
                </div>
              </div>
            )

            if (card.action) {
              return (
                <a key={card.label} href={card.action} target="_blank" rel="noopener noreferrer">
                  {Inner}
                </a>
              )
            }
            return <div key={card.label}>{Inner}</div>
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ──

const cardClass =
  "rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.04]"

// const userStats = [
//   { icon: BookOpen, value: "3", label: "Courses" },
//   { icon: Music, value: "12", label: "Raags" },
//   { icon: Clock, value: "48", label: "Hours" },
// ]

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)
  const [mounted, setMounted] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const { data: serverUser } = useGetUserDetailQuery()

  useEffect(() => {
    if (serverUser) {
      dispatch(updateUser(serverUser))
    }
  }, [serverUser, dispatch])

  const handleItemClick = (item: MenuItem) => {
    if (item.action === "link") {
      router.push(item.value)
    } else if (item.action === "modal") {
      setActiveModal(item.value)
    } else {
      toast.info(item.value)
    }
  }

  const closeModal = () => setActiveModal(null)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile hero */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerItem}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="mb-10 flex flex-col items-center text-center"
      >
        <div className="relative mb-5">
          <div className="pointer-events-none absolute -inset-3 rounded-full bg-[#D4A44A]/[0.08] blur-2xl" aria-hidden="true" />
          {mounted && (user?.profileImage || user?.avatar) ? (
            <img
              src={resolveImageUrl((user?.profileImage || user?.avatar)!)}
              alt={user?.name || "User"}
              referrerPolicy="no-referrer"
              className="size-20 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
              {mounted && user?.name ? (
                <span className="text-2xl font-bold text-foreground">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="size-8 text-muted-foreground/60" />
              )}
            </div>
          )}
        </div>

        <h1 className="text-xl font-bold text-foreground">{mounted && user?.name ? user.name : "User"}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground/80">{mounted ? user?.email || "" : ""}</p>

        {/* <div className="mt-5 flex gap-6">
          {userStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <stat.icon className="size-4 text-muted-foreground/50" />
              <span className="mt-1 bg-gradient-to-r from-[#D4A44A] to-[#F5D485] bg-clip-text text-lg font-bold text-transparent">
                {stat.value}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div> */}

        <div className="mt-5 flex items-center gap-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <span className="size-1.5 rounded-full bg-primary/60" />
          <span className="h-px w-8 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </motion.div>

      {/* Menu groups */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-5"
      >
        {menuGroups.map((group) => {
          const GroupIcon = group.icon

          return (
            <motion.div
              key={group.title}
              variants={staggerItem}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl dark:border-white/[0.06] dark:bg-white/[0.04]"
            >
              {/* Accent bar */}
              <div className="h-0.5 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10">
                  <GroupIcon className="size-3.5 text-primary" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                  {group.title}
                </p>
              </div>

              {/* Items */}
              {group.items.map((item, index) => (
                <div key={item.label}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className="group/item relative flex w-full items-center gap-3 px-4 py-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-white/[0.02] hover:text-foreground"
                  >
                    {/* Gold left bar on hover */}
                    <span className="absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 rounded-full bg-primary/60 transition-all duration-200 group-hover/item:h-5" />

                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 transition-all duration-200 group-hover/item:bg-primary/10">
                      <item.icon className="size-4 text-muted-foreground/60 transition-all duration-200 group-hover/item:text-primary" />
                    </div>

                    <span className="flex-1 text-left transition-all duration-200 group-hover/item:translate-x-0.5">
                      {item.label === "Set Password" && user?.hasPassword ? "Change Password" : item.label}
                    </span>

                    <ChevronRight className="size-4 text-muted-foreground/30 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:text-primary" />
                  </button>
                  {index < group.items.length - 1 && (
                    <div className="mx-4 h-px bg-border/40" />
                  )}
                </div>
              ))}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Modals */}
      <EditProfileModal open={activeModal === "editProfile"} onClose={closeModal} />
      <SetPasswordModal open={activeModal === "setPassword"} onClose={closeModal} />
      <ChangeLanguageModal open={activeModal === "changeLanguage"} onClose={closeModal} />
      <SuggestionModal open={activeModal === "suggestion"} onClose={closeModal} />
      <PrivacyModal open={activeModal === "privacy"} onClose={closeModal} />
      <TermsModal open={activeModal === "terms"} onClose={closeModal} />
      <ContactSupportModal open={activeModal === "contactSupport"} onClose={closeModal} />
    </div>
  )
}
