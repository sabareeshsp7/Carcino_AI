"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/shop/product-card"
import { ProductDetail } from "@/components/shop/product-detail"
import { useWishlist } from "@/components/shop/wishlist-context"
import { useCart } from "@/contexts/cart-context"
import { toast } from "sonner"
import { type MedicalProduct } from "@/components/shop/medical-products"

export default function WishlistPage() {
  const [selectedProduct, setSelectedProduct] = useState<MedicalProduct | null>(null)
  const { wishlistItems, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist()
  const { addItem } = useCart()
  const router = useRouter()

  const handleAddToCart = (product: MedicalProduct) => {
    addItem(product)
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleRemoveFromWishlist = (product: MedicalProduct) => {
    removeFromWishlist(product.id)
    toast.success("Removed from wishlist", {
      description: `${product.name} has been removed from your wishlist.`,
    })
  }

  const handleShare = (product: MedicalProduct) => {
    const shareUrl = `${window.location.origin}/shop/product/${product.id}`

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied", {
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const handleClearWishlist = () => {
    clearWishlist()
    toast.success("Wishlist cleared", {
      description: "All items have been removed from your wishlist.",
    })
  }

  const handleAddAllToCart = () => {
    wishlistItems.forEach(product => {
      if (product.inStock) {
        addItem(product)
      }
    })
    toast.success("Added to cart", {
      description: `${wishlistItems.filter(p => p.inStock).length} items added to cart.`,
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
        <div className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-red-50 p-6 mb-6">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Start adding products to your wishlist by clicking the heart icon on any product you love.
          </p>
          <Button 
            onClick={() => router.push("/dashboard/shop")}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
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
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAddAllToCart}
            className="hover:bg-emerald-50 border-emerald-200"
            disabled={wishlistItems.filter(p => p.inStock).length === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
          <Button
            variant="outline"
            onClick={handleClearWishlist}
            className="hover:bg-red-50 border-red-200 text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Wishlist Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="text-2xl font-bold text-emerald-700">{wishlistCount}</div>
          <div className="text-sm text-emerald-600">Total Items</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">
            {wishlistItems.filter(p => p.inStock).length}
          </div>
          <div className="text-sm text-blue-600">In Stock</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-700">
            ₹{wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
          </div>
          <div className="text-sm text-purple-600">Total Value</div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((product) => (
          <div key={product.id} className="relative">
            <ProductCard
              product={product}
              view="grid"
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleRemoveFromWishlist}
              onShare={handleShare}
              onClick={() => setSelectedProduct(product)}
            />
            
            {/* Remove from Wishlist Button */}
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2 z-20 h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => handleRemoveFromWishlist(product)}
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
                <Badge variant="destructive" className="text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}