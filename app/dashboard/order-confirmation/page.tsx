"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft, Home, Download, Calendar, MapPin, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useMedicalHistory } from "@/contexts/MedicalHistoryContext"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface OrderData {
  orderId: string
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  tax: number
  paymentMethod: string
  deliveryAddress: {
    name: string
    address: string
    city: string
    state?: string
    zipCode: string
    pincode?: string
    phone: string
    email?: string
  }
  orderDate: string
  estimatedDelivery: string
  status: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { addHistory } = useMedicalHistory()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [historySaved, setHistorySaved] = useState(false)

  useEffect(() => {
    console.log("Order confirmation page loaded")
    try {
      const savedOrder = localStorage.getItem("currentOrder")
      console.log("Saved order from localStorage:", savedOrder)
      
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder)
        setOrderData(parsedOrder)
        console.log("Order data set:", parsedOrder)
        
        // Save to medical history if not already saved
        if (!historySaved && parsedOrder.items.some((item: OrderItem) => 
          item.name.toLowerCase().includes('cream') || 
          item.name.toLowerCase().includes('medicine') || 
          item.name.toLowerCase().includes('tablet') ||
          item.name.toLowerCase().includes('capsule') ||
          item.name.toLowerCase().includes('ointment') ||
          item.name.toLowerCase().includes('drops') ||
          item.name.toLowerCase().includes('syrup')
        )) {
          // Save medicine orders to medical history
          addHistory({
            type: "Medicine",
            data: `Medicine Order - ${parsedOrder.orderId}`,
            details: {
              orderId: parsedOrder.orderId,
              items: parsedOrder.items,
              total: parsedOrder.total,
              orderDate: parsedOrder.orderDate,
              paymentMethod: parsedOrder.paymentMethod,
              deliveryAddress: parsedOrder.deliveryAddress,
              estimatedDelivery: parsedOrder.estimatedDelivery,
              type: "online_purchase",
              source: "DermaSense Shop"
            }
          })
          setHistorySaved(true)
          toast.success("Medicine order saved to medical history")
        }
      } else {
        console.log("No order found in localStorage")
        toast.error("No order found")
        router.push("/dashboard/shop")
      }
    } catch (error) {
      console.error("Error loading order data:", error)
      toast.error("Error loading order details")
      router.push("/dashboard/shop")
    } finally {
      setIsLoading(false)
    }
  }, [router, addHistory, historySaved])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card"
      case "upi":
        return "UPI"
      case "netbanking":
        return "Net Banking"
      case "cod":
        return "Cash on Delivery"
      default:
        return "Unknown"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "upi":
        return <CreditCard className="h-4 w-4" />
      case "netbanking":
        return <CreditCard className="h-4 w-4" />
      case "cod":
        return <CreditCard className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Button onClick={() => router.push("/dashboard/shop")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-green-600">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Thank you for your order. We&apos;ve received your payment and will process your order shortly.
          </p>
          <Badge variant="secondary" className="mt-2">
            Order ID: {orderData.orderId}
          </Badge>
        </div>
      </div>

      {/* Action Buttons - Removed Track Order button */}
      <div className="flex justify-center gap-4">
        <Button onClick={() => router.push("/dashboard/shop")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
        <Button variant="outline" onClick={() => toast.success("Invoice download coming soon!")}>
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Your order has been confirmed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(orderData.orderDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="flex items-center gap-2">
                  {getPaymentMethodIcon(orderData.paymentMethod)}
                  {getPaymentMethodName(orderData.paymentMethod)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(orderData.estimatedDelivery)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status</span>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({orderData.items.length} items)</span>
                <span>₹{orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{orderData.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 18%)</span>
                <span>₹{orderData.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span className="text-green-600">₹{orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </CardTitle>
            <CardDescription>Your order will be delivered to</CardDescription>
          </CardHeader>
          <CardContent>
            {orderData.deliveryAddress ? (
              <div className="space-y-2">
                <p className="font-semibold">{orderData.deliveryAddress.name}</p>
                <p className="text-sm text-muted-foreground">{orderData.deliveryAddress.address}</p>
                <p className="text-sm text-muted-foreground">
                  {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} - {orderData.deliveryAddress.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{orderData.deliveryAddress.phone}</p>
                {orderData.deliveryAddress.email && (
                  <p className="text-sm text-muted-foreground">{orderData.deliveryAddress.email}</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No delivery address provided</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>{orderData.items.length} items in your order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <div className="h-16 w-16 flex-none overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm">Order confirmed and payment received</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-1">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm">Your order is being prepared for shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-1">
                <CheckCircle className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm">You&apos;ll receive an email confirmation shortly</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-1">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm">Estimated delivery: {formatDate(orderData.estimatedDelivery)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

