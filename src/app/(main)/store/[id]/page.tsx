"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, ShoppingCart, Package } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch } from "@/store/hooks"
import { addToCart, openCart } from "@/store/cartSlice"
import { storeProducts } from "@/data"

export default function StoreProductPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const product = storeProducts.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 size-12 text-[#64748B]" />
          <p className="text-lg text-[#94A3B8]">Product not found</p>
          <Button variant="outline" className="mt-4 border-[#1E293B] text-[#94A3B8]" onClick={() => router.push("/store")}>
            Back to Store
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    toast.success("Added to cart!")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => router.push("/store")}
        className="mb-6 flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#94A3B8]"
      >
        <ArrowLeft className="size-4" />
        Back to Store
      </button>

      <div className="mb-6 flex h-64 items-center justify-center rounded-xl bg-[#0B1220]">
        <ShoppingBag className="size-16 text-[#64748B]" />
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{product.name}</h1>
            <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              {product.category}
            </Badge>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-cyan-400">&#x20B9;{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#64748B] line-through">&#x20B9;{product.originalPrice}</span>
          )}
        </div>

        <p className="leading-relaxed text-[#94A3B8]">{product.description}</p>

        <Badge
          variant="outline"
          className={`text-xs ${
            product.inStock
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </Badge>

        <div className="flex gap-3 pt-4">
          <Button
            variant="default"
            className="flex-1 bg-cyan-500 text-black hover:bg-cyan-400"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="size-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
            onClick={() => dispatch(openCart())}
          >
            View Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
