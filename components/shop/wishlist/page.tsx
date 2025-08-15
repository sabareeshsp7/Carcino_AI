"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/shop/product-card"
import { ProductDetail } from "@/components/shop/product-detail"
import { useWishlist, type WishlistProduct } from "../wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { type MedicalProduct } from "@/components/shop/medical-products"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<MedicalProduct | null>(null)
  const router = useRouter()

  const handleAddToCart = (product: MedicalProduct) => {
    addItem({ ...product, id: product.id.toString() })
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (product: WishlistProduct) => {
    removeFromWishlist(product.id)
    toast.success("Removed from wishlist", {
      description: `${product.name} has been removed from your wishlist.`,
    })
  }

  const handleAddAllToCart = () => {
    wishlistItems.forEach(product => {
      addItem({ ...product, id: product.id })
    })
    toast.success("Added to cart", {
      description: `${wishlistItems.length} items added to cart.`,
    })
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
            <p className="text-muted-foreground">Save your favorite products for later</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start browsing our products and add your favorites to your wishlist.
          </p>
          <Button onClick={() => router.push("/dashboard/shop")} className="bg-emerald-600 hover:bg-emerald-700">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAddAllToCart}
            disabled={wishlistItems.length === 0}
            className="flex-1 sm:flex-none"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add All to Cart
          </Button>
          <Button
            variant="outline"
            onClick={clearWishlist}
            disabled={wishlistItems.length === 0}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Wishlist Summary */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-600" />
            <span className="font-medium">
              {wishlistItems.length} items in your wishlist
            </span>
          </div>
          <Button 
            onClick={handleAddAllToCart}
            disabled={wishlistItems.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Add All to Cart
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={{
                ...product,
                id: parseInt(product.id),
                rating: 0,
                category: '',
                requiresPrescription: false,
                inStock: true
              } as MedicalProduct}
              view="grid"
              onAddToCart={handleAddToCart}
              onAddToWishlist={() => handleRemoveFromWishlist(product)}
              onShare={() => {}}
              onClick={() => setSelectedProduct({
                ...product,
                id: parseInt(product.id),
                rating: 0,
                category: '',
                requiresPrescription: false,
                inStock: true
              } as MedicalProduct)}
            />

            {/* Remove from Wishlist Button */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white"
              onClick={() => handleRemoveFromWishlist(product)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}
