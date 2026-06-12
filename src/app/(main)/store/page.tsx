"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingBag, ShoppingCart, Search, MessageCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openCart } from "@/store/cartSlice"
import { useGetProductsQuery } from "@/store/api"
import type { StoreProduct } from "@/types"

export default function StorePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector((s) => s.cart.items.length)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 600)
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [search])

  const { data, isLoading: loading, error } = useGetProductsQuery({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
  })
  const products = data?.products ?? []
  const totalPages = data?.totalPages ?? 1

  const handleSendMessage = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    toast.success("Enquiry sent! We'll get back to you soon.")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">Our Store</h1>
          <p className="mt-1 text-sm text-muted-foreground">Instruments, books, and more</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>

      <div className="mt-8 mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => router.push(`/store/${product.id}`)}
                  className="flex flex-col group cursor-pointer rounded-xl border border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
                >
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-xl bg-background">
                    {product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <ShoppingBag className="size-10 text-muted-foreground/80 transition-colors group-hover:text-cyan-400/50" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col space-y-2 p-3">
                    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                    <div className="flex items-baseline gap-2">
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground/80 line-through">
                          &#x20B9;{product.originalPrice}
                        </span>
                      )}
                      <span className="text-sm font-bold text-cyan-400">
                        &#x20B9;{product.price}
                      </span>
                    </div>
                    {product.sellerName && (
                      <p className="text-[11px] text-muted-foreground/70 truncate">
                        {product.sellerAvatar && (
                          <Image
                            src={product.sellerAvatar}
                            alt=""
                            width={14}
                            height={14}
                            className="mr-1 inline-block rounded-full object-cover align-text-bottom"
                          />
                        )}
                        {/* {product.sellerName} */}
                        <span className="text-primary">{product.sellerName} </span>
                      </p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                      onClick={(e) => handleSendMessage(e, product.id)}
                    >
                      <MessageCircle className="size-3" />
                      Send Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <ShoppingBag className="mb-4 size-12 text-muted-foreground/80" />
                <p className="text-lg text-muted-foreground">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground/80">Try a different search</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className={p === page ? "bg-cyan-500 text-foreground hover:bg-cyan-400" : ""}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => dispatch(openCart())}
        className="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-cyan-500 text-foreground shadow-lg shadow-cyan-500/25 transition-transform hover:scale-110 active:scale-95"
      >
        <ShoppingCart className="size-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  )
}
