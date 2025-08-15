"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Grid, List, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductCard } from "@/components/shop/product-card"
import { ProductDetail } from "@/components/shop/product-detail"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/components/shop/wishlist-context"
import { toast } from "sonner"
import { medicalProducts, type MedicalProduct as Product } from "@/components/shop/medical-products"

export default function ShopPage() {
  const router = useRouter()
  
  // Fix: Make sure to destructure cartCount from useCart
  const { addItem, cartCount } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange] = useState([0, 2000])
  const [view, setView] = useState<"grid" | "list">("grid")

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(medicalProducts.map(p => p.category)))
    return ["all", ...cats]
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = medicalProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  const handleAddToCart = (product: Product) => {
    const cartProduct = {
      ...product,
      id: product.id.toString()
    }
    addItem(cartProduct)
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = (product: Product) => {
    const wishlistProduct = {
      ...product,
      id: product.id.toString()
    }
    
    if (isInWishlist(product.id.toString())) {
      removeFromWishlist(product.id.toString())
      toast.success("Removed from wishlist", {
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(wishlistProduct)
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const handleShare = (product: Product) => {
    const shareUrl = `${window.location.origin}/shop/product/${product.id}`
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: shareUrl,
      }).catch((error) => console.log("Error sharing", error))
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied", {
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Shop</h1>
          <p className="text-muted-foreground">
            Professional medical equipment and supplies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/wishlist")}
          >
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/cart")}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">View</label>
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("grid")}
                  className="flex-1"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("list")}
                  className="flex-1"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {medicalProducts.length} products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className={view === "grid" 
            ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                view={view}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onShare={handleShare}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
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
