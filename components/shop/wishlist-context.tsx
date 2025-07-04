"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

// Define the product type that will be stored in wishlist
export interface WishlistProduct {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  // Add other properties as needed
}

interface WishlistContextType {
  wishlistItems: WishlistProduct[]
  wishlistCount: number
  addToWishlist: (product: WishlistProduct) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dermasense-wishlist")
      if (saved) {
        setWishlistItems(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
  }, [])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("dermasense-wishlist", JSON.stringify(wishlistItems))
    } catch (error) {
      console.error("Error saving wishlist:", error)
    }
  }, [wishlistItems])

  const addToWishlist = (product: WishlistProduct) => {
    setWishlistItems(prev => {
      // Check if item already exists
      if (prev.some(item => item.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId)
  }

  const wishlistCount = wishlistItems.length

  const value = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}