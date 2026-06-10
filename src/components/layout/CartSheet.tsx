"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { closeCart, removeFromCart, updateQuantity } from "@/store/cartSlice"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function CartSheet() {
  const { items, isOpen } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch(closeCart())
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-[#94A3B8] text-sm">
              Your cart is empty
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 items-center"
              >
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                    unoptimized
                  />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-[#06B6D4]">
                    &#x20B9;{item.product.price}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="text-sm text-white w-6 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => dispatch(removeFromCart(item.product.id))}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-[#1E293B] p-4">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-[#94A3B8]">Total</span>
              <span className="text-white font-medium">
                &#x20B9;{total.toFixed(2)}
              </span>
            </div>
            <Button className="w-full bg-[#06B6D4] text-black hover:bg-[#06B6D4]/80">
              Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
