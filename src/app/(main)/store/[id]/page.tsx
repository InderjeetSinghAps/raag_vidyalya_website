"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Package, MessageCircle, ChevronLeft, ChevronRight, Loader2, User, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProductByIdQuery } from "@/store/api"

export default function StoreProductPage() {
  const params = useParams()
  const router = useRouter()
  const { data: product, isLoading: loading, error } = useGetProductByIdQuery(params.id as string)
  const [selectedImage, setSelectedImage] = useState(0)
  const [avatarError, setAvatarError] = useState(false)
  const handleSendMessage = () => {
    if (!product?.sellerPhone) {
      toast.error("Seller contact not available")
      return
    }
    const clean = product.sellerPhone.replace(/\D/g, "")
    const message = `Hello! I'm interested in the "${product.name}".\n\u{1F4CC} Description: ${product.description}\n\u{1F4B0} Price: \u20B9${product.price}${product.originalPrice ? ` (Original: \u20B9${product.originalPrice})` : ''}\n\u{1F3AF} Category: ${product.category}\nCould you please share more details or help me with the purchase?`
    window.open(`https://api.whatsapp.com/send/?phone=${clean}&text=${encodeURIComponent(message)}`, "_blank")
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 size-12 text-muted-foreground/80" />
          <p className="text-lg text-muted-foreground">Product not found</p>
          <Button variant="outline" className="mt-4 border-border text-muted-foreground" onClick={() => router.push("/store")}>
            Back to Store
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/store")}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Store
      </button>

      <div className="mb-6 space-y-3">
        <div className="group relative flex h-120 items-center justify-center overflow-hidden rounded-xl bg-background">
          {product.images.length > 0 ? (
            <>
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 size-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => Math.max(0, i - 1))}
                    disabled={selectedImage === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-sm transition-all hover:bg-background disabled:opacity-30 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => Math.min(product.images.length - 1, i + 1))}
                    disabled={selectedImage === product.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-sm transition-all hover:bg-background disabled:opacity-30 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}
            </>
          ) : (
            <ShoppingBag className="size-16 text-muted-foreground/80" />
          )}
        </div>

        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === selectedImage
                    ? 'border-cyan-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-90'
                }`}
              >
                <img src={img} alt="" width={64} height={64} referrerPolicy="no-referrer" className="size-16 object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{product.name}</h1>
            <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              {product.category}
            </Badge>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-cyan-400">&#x20B9;{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground/80 line-through">&#x20B9;{product.originalPrice}</span>
          )}
        </div>

        {product.sellerName && product.sellerUserId && (
          <div
            onClick={() => router.push(`/user/${product.sellerUserId}`)}
            className="flex h-auto cursor-pointer items-center gap-4 rounded-3xl bg-[#0B1020] p-4 shadow-[0_15px_40px_rgba(0,0,0,.4)] transition-colors hover:bg-[#0D1528]"
          >
            <div className="relative shrink-0">
              {product.sellerAvatar && !avatarError ? (
                <img
                  src={product.sellerAvatar}
                  alt={product.sellerName}
                  referrerPolicy="no-referrer"
                  className="size-[60px] rounded-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="flex size-[60px] items-center justify-center rounded-full bg-white/5">
                  <User className="size-6 text-white/40" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full shadow-[0_0_10px_rgba(245,190,50,.4)] transition-transform duration-250 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f7d36a, #d4a017)',
                  border: '2px solid #0f172a',
                }}
              >
                <ShieldCheck className="size-3 text-black" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-base font-semibold text-white">
                  {product.sellerName}
                </p>
                <ShieldCheck className="size-3.5 shrink-0 text-amber-400" />
              </div>
              <span className="mt-0.5 inline-block rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-400">
                ✓ Verified Seller
              </span>
              {product.sellerEmail && (
                <p className="mt-1 text-[10px] text-[#6B7280] truncate">
                  {product.sellerEmail}
                </p>
              )}
              {product.sellerPhone && (
                <p className="text-[11px] text-[#6B7280]">
                  {product.sellerCountryCode ? `${product.sellerCountryCode} ` : ''}{product.sellerPhone}
                </p>
              )}
            </div>
          </div>
        )}

        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
              >
#{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="default"
            className="flex-1 bg-cyan-500 text-foreground hover:bg-cyan-400"
            onClick={handleSendMessage}
          >
            <MessageCircle className="size-4" />
            Send Message
          </Button>
          <Button
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            onClick={() => router.push("/store")}
          >
            Back to Store
          </Button>
        </div>
      </div>
    </div>
  )
}
