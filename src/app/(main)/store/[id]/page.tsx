"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Package, MessageCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetProductByIdQuery } from "@/store/api"

export default function StoreProductPage() {
  const params = useParams()
  const router = useRouter()
  const { data: product, isLoading: loading, error } = useGetProductByIdQuery(params.id as string)
  const [selectedImage, setSelectedImage] = useState(0)

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
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
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
                <Image src={img} alt="" width={64} height={64} className="size-16 object-cover" />
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

        <p className="leading-relaxed text-muted-foreground">{product.description}</p>

        {product.sellerName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {product.sellerAvatar && (
              <Image
                src={product.sellerAvatar}
                alt=""
                width={24}
                height={24}
                className="size-6 rounded-full object-cover"
              />
            )}
            <span>{product.sellerName}</span>
          </div>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400"
              >
                {tag}
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
