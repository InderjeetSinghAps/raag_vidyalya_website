"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, ShoppingBag, MessageCircle, User, Package } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useGetUserWithProductsQuery } from "@/store/api"

export default function UserPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoading } = useGetUserWithProductsQuery(params.id as string)

  const handleContactSeller = () => {
    if (!data) return
    const { user } = data
    if (!user.phoneNumber) {
      toast.error("Seller contact not available")
      return
    }
    const clean = user.phoneNumber.replace(/\D/g, "")
    const msg = `Hello! I saw your profile on Raag Vidyalya.\n📌 Store: ${user.userName}\n\nI'm interested in the products you have listed.\nCould you please share more details or help me with the purchase?`
    window.open(`https://api.whatsapp.com/send/?phone=${clean}&text=${encodeURIComponent(msg)}`, "_blank")
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[768px] items-center justify-center px-4 py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-[768px] px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="mb-4 size-12 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">User not found</p>
          <Button variant="outline" className="mt-4 border-border text-muted-foreground" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const { user, products } = data

  return (
    <div className="mx-auto w-full max-w-[768px] px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-[rgba(212,160,23,.2)] p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,.4)]"
        style={{
          background: 'radial-gradient(circle at top right, rgba(212,160,23,.18), transparent 45%), linear-gradient(180deg, rgba(10,20,50,.95), rgba(3,8,23,1))'
        }}
      >
        <div className="pointer-events-none absolute -top-20 right-0 size-[300px] rounded-full bg-[rgba(212,160,23,.08)] blur-[80px]" />
        <div className="pointer-events-none absolute -top-10 -right-10 size-[220px] rounded-full bg-[rgba(212,160,23,.05)] blur-sm" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 size-[140px] rounded-full bg-[rgba(212,160,23,.04)] blur-sm" />
        <div className="relative z-10">
          <div className="relative mx-auto mb-4 size-20">
            <div className="pointer-events-none absolute inset-0 size-20 rounded-full bg-[rgba(212,160,23,.15)] blur-[40px]" />
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.userName}
                referrerPolicy="no-referrer"
                className="size-20 rounded-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-white/5">
                <User className="size-8 text-white/40" />
              </div>
            )}
            {user.verifiedIcon && (
              <div className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full border-2 border-[#D4A017] bg-black/80 shadow-[0_0_12px_rgba(245,190,50,.4)] transition-transform duration-250 hover:scale-105">
                <img src={user.verifiedIcon} alt="Verified" className="size-4" />
              </div>
            )}
          </div>

          <h1 className="text-lg font-semibold text-white">{user.userName}</h1>

          <span className="mt-1.5 inline-block rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-0.5 text-[10px] font-semibold tracking-wide text-amber-400 uppercase">
            Verified Seller
          </span>

          {user.email && (
            <p className="mt-3 text-[11px] text-[#6B7280]">{user.email}</p>
          )}
          {user.phoneNumber && (
            <p className="text-[11px] text-[#6B7280]">
              {user.countryCode ? `${user.countryCode} ` : ''}{user.phoneNumber}
            </p>
          )}

          <button
            onClick={handleContactSeller}
            className="mt-4 flex h-16 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#D4A017] text-lg font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 hover:bg-[#B88914] hover:shadow-[0_10px_25px_rgba(212,160,23,.35)] active:scale-[0.98]"
          >
            <MessageCircle className="size-5" />
            Chat on WhatsApp
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-amber-500/10 bg-[#0B1020] p-4 text-center">
          {user.verifiedIcon && <Package className="mx-auto mb-2 size-5 text-amber-400" />}
          <p className="text-3xl font-bold text-amber-400">{products.length}</p>
          <p className="mt-0.5 text-sm text-[#6B7280]">Products</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/10 bg-[#0B1020] p-4 text-center">
          {user.verifiedIcon && <img src={user.verifiedIcon} alt="" className="mx-auto mb-2 size-5" />}
          <p className="text-3xl font-bold text-emerald-400">Active</p>
          <p className="mt-0.5 text-sm text-[#6B7280]">Status</p>
        </div>
      </div>

      <div className="mb-4 mt-12 flex items-center gap-3">
        <div className="h-9 w-1 rounded-full bg-yellow-500" />
        <h2 className="text-xl font-bold text-foreground">Products ({products.length})</h2>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="mb-4 size-12 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">No products listed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/store/${product.id}`)}
              className="flex flex-col group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
            >
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-xl bg-background">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 size-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <ShoppingBag className="size-10 text-muted-foreground/80 transition-colors group-hover:text-cyan-400/50" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  {product.originalPrice ? (
                    <>
                      <span className="text-xs text-muted-foreground/80 line-through">&#x20B9;{product.originalPrice}</span>
                      <span className="text-sm font-bold text-amber-400">&#x20B9;{product.price}</span>
                      {(() => {
                        const discount = Math.round((1 - product.price / product.originalPrice) * 100)
                        return discount > 0 ? (
                          <span className="ml-auto rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">{discount}% OFF</span>
                        ) : null
                      })()}
                    </>
                  ) : (
                    <span className="text-sm font-bold text-amber-400">&#x20B9;{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
