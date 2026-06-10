"use client"

import { Fragment, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, ShoppingCart, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart, openCart } from "@/store/cartSlice"
import { storeProducts } from "@/data"

const categories = ["All", "Instruments", "Books", "Apparel", "Accessories"]

export default function StorePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector((s) => s.cart.items.length)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const filtered = storeProducts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === "All" || p.category === category
    return matchSearch && matchCategory
  })

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    const product = storeProducts.find((p) => p.id === productId)
    if (product) {
      dispatch(addToCart(product))
      toast.success("Added to cart!")
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-white">Our Store</h1>
          <p className="mt-1 text-sm text-muted-foreground">Instruments, books, and more</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[#1E293B] bg-[#0B1220] pl-10 text-[#94A3B8] placeholder:text-[#64748B]"
          />
        </div>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
<TabsList className="bg-[#0B1220]/80 w-full justify-center rounded-none p-1">
      {categories.map((cat, i) => (
        <Fragment key={cat}>
          {i > 0 && <span key={`sep-${i}`} className="select-none px-1 text-[#1E293B] text-xs">|</span>}
          <TabsTrigger className="rounded-none px-3 text-xs font-medium text-[#64748B] transition-all duration-200 data-active:text-primary data-active:font-semibold hover:text-[#94A3B8]" value={cat}>
            {cat}
          </TabsTrigger>
        </Fragment>
      ))}
    </TabsList>
      </Tabs>

      <div className="mt-4">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/store/${product.id}`)}
              className="group cursor-pointer rounded-xl border border-[#1E293B] bg-[#0B1220] transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
            >
              <div className="flex aspect-video items-center justify-center rounded-t-xl bg-[#0B1220]">
                <ShoppingBag className="size-10 text-[#64748B] group-hover:text-cyan-400/50 transition-colors" />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-white">{product.name}</p>
                <div className="flex items-baseline gap-2">
                  {product.originalPrice && (
                    <span className="text-xs text-[#64748B] line-through">
                      &#x20B9;{product.originalPrice}
                    </span>
                  )}
                  <span className="text-sm font-bold text-cyan-400">
                    &#x20B9;{product.price}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    product.inStock
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                  onClick={(e) => handleAddToCart(e, product.id)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="size-3" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="mb-4 size-12 text-[#64748B]" />
            <p className="text-lg text-[#94A3B8]">No products found</p>
            <p className="mt-1 text-sm text-[#64748B]">Try a different search or category</p>
          </div>
        )}
      </div>

      <button
        onClick={() => dispatch(openCart())}
        className="fixed bottom-24 right-4 z-40 flex size-12 items-center justify-center rounded-full bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 transition-transform hover:scale-110 active:scale-95"
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
