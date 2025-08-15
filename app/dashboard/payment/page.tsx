"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Wallet, Building, CheckCircle, Package, Loader2, Truck } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCart } from "@/contexts/cart-context"

const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "upi", "netbanking", "cod"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
  upiId: z.string().optional(),
  bankName: z.string().optional(),
})

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, cartCount, cartTotal, clearCart } = useCart()
  interface DeliveryAddress {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  interface OrderData {
    orderId: string;
    items: Array<{ id: string; name: string; price: number; quantity: number }>; // Replace with the actual structure of cart items
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
    paymentMethod: string;
    deliveryAddress: DeliveryAddress | null;
    orderDate: string;
    estimatedDelivery: string;
    status: string;
  }

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [showRedirecting, setShowRedirecting] = useState(false)
  const [redirectStep, setRedirectStep] = useState(0)
  const [paymentCompleted, setPaymentCompleted] = useState(false)

  // Different redirect steps based on payment method
  const getRedirectSteps = (paymentMethod: string) => {
    if (paymentMethod === "cod") {
      return [
        "Order confirmed successfully...",
        "Preparing your order...",
        "Scheduling delivery...",
        "Redirecting to order summary..."
      ]
    } else {
      return [
        "Payment confirmed successfully...",
        "Generating order details...",
        "Preparing order confirmation...",
        "Redirecting to order summary..."
      ]
    }
  }

  // Move the redirect logic to useEffect but prevent after payment
  useEffect(() => {
    // Fix: Don't redirect if payment is completed or in progress
    if (paymentCompleted || isProcessing || showRedirecting) return

    try {
      const savedAddress = sessionStorage.getItem("deliveryAddress") || localStorage.getItem("deliveryAddress")
      if (savedAddress) {
        setDeliveryAddress(JSON.parse(savedAddress))
      } else {
        setShouldRedirect(true)
      }
    } catch (error) {
      console.error("Error loading delivery address:", error)
      setShouldRedirect(true)
    }
  }, [paymentCompleted, isProcessing, showRedirecting])

  // Handle redirect in separate useEffect but prevent after payment
  useEffect(() => {
    // Fix: Don't redirect if payment is completed or in progress
    if (paymentCompleted || isProcessing || showRedirecting) return

    if (shouldRedirect) {
      toast.error("Please complete your cart first")
      router.push("/dashboard/cart")
    }
  }, [shouldRedirect, router, paymentCompleted, isProcessing, showRedirecting])

  // Check if cart is empty but prevent after payment
  useEffect(() => {
    // Fix: Don't redirect if payment is completed or in progress
    if (paymentCompleted || isProcessing || showRedirecting) return

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty")
      router.push("/dashboard/shop")
    }
  }, [cartItems, router, paymentCompleted, isProcessing, showRedirecting])

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  })

  const paymentMethod = form.watch("paymentMethod")

  // Calculate totals
  const subtotal = cartTotal || 0
  const shipping = 50
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + shipping + tax

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true)
    setPaymentCompleted(true) // Fix: Set payment completed flag immediately

    try {
      // Different processing time and message for COD
      const processingTime = values.paymentMethod === "cod" ? 1500 : 2000
      await new Promise((resolve) => setTimeout(resolve, processingTime))

      // Create order data
      const newOrderData = {
        orderId: `ORD-${Date.now()}`,
        items: cartItems,
        total: total,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        paymentMethod: values.paymentMethod,
        deliveryAddress: deliveryAddress,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: values.paymentMethod === "cod" ? "confirmed" : "paid"
      }

      setOrderData(newOrderData)

      // Save order data to localStorage
      try {
        localStorage.setItem("currentOrder", JSON.stringify(newOrderData))
        console.log("Order data saved to localStorage:", newOrderData)
      } catch (storageError) {
        console.error("Error saving to localStorage:", storageError)
      }

      // Clear cart and delivery address
      clearCart()
      sessionStorage.removeItem("deliveryAddress")
      localStorage.removeItem("deliveryAddress")

      // Show redirecting state
      setShowRedirecting(true)
      setIsProcessing(false)

      // Get appropriate redirect steps
      const redirectSteps = getRedirectSteps(values.paymentMethod)

      // Animate through redirect steps
      let stepIndex = 0
      const stepInterval = setInterval(() => {
        setRedirectStep(stepIndex)
        stepIndex++
        
        if (stepIndex >= redirectSteps.length) {
          clearInterval(stepInterval)
          // Final redirect to order confirmation
          setTimeout(() => {
            router.push("/dashboard/order-confirmation")
          }, 1000)
        }
      }, 1000)

    } catch (error: unknown) {
      console.error("Payment processing error:", error)
      const errorMessage = paymentMethod === "cod" ? "Order placement failed" : "Payment failed"
      toast.error(errorMessage, {
        description: "Please try again or use a different payment method.",
      })
      setIsProcessing(false)
      setPaymentCompleted(false)
      setShowRedirecting(false)
    }
  }

  // Show loading state while checking for delivery address (but not after payment)
  if ((shouldRedirect || !deliveryAddress) && !paymentCompleted && !showRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Fix: Show redirecting state after successful payment - this should take priority
  if (showRedirecting && orderData) {
    const redirectSteps = getRedirectSteps(orderData.paymentMethod)
    const isCOD = orderData.paymentMethod === "cod"

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className={`rounded-full p-4 ${isCOD ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {isCOD ? (
                    <Truck className="h-16 w-16 text-blue-600" />
                  ) : (
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              </div>
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isCOD ? 'text-blue-600' : 'text-green-600'}`}>
              {isCOD ? 'Order in Progress!' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {isCOD ? 'Processing your order...' : 'Processing your order...'}
            </p>
          </div>

          {/* Order Info Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Order ID:</span>
                <Badge variant="secondary" className="font-mono text-sm">
                  {orderData.orderId}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className={`font-semibold text-lg ${isCOD ? 'text-blue-600' : 'text-green-600'}`}>
                  ₹{orderData.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Items:</span>
                <span className="font-medium">{orderData.items.length} items</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">
                  {orderData.paymentMethod === "cod" ? "Cash on Delivery" : orderData.paymentMethod}
                </span>
              </div>
              {isCOD && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Pay on Delivery
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {isCOD ? (
                    <Truck className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Package className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="text-sm font-medium">
                    {redirectSteps[redirectStep] || "Processing..."}
                  </span>
                </div>
                
                {/* Progress Dots */}
                <div className="flex justify-center space-x-3">
                  {redirectSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        index <= redirectStep 
                          ? `${isCOD ? 'bg-blue-500' : 'bg-green-500'} scale-110`
                          : index === redirectStep + 1 
                            ? "bg-blue-500 animate-pulse" 
                            : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps List */}
          <div className="space-y-2">
            {redirectSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index <= redirectStep 
                    ? `${isCOD ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200'}`
                    : "bg-gray-50 text-gray-400"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  index < redirectStep 
                    ? `${isCOD ? 'bg-blue-500' : 'bg-green-500'}`
                    : index === redirectStep 
                      ? "bg-blue-500 animate-pulse" 
                      : "bg-gray-300"
                }`} />
                <span className="text-sm font-medium">{step}</span>
                {index < redirectStep && (
                  <CheckCircle className={`h-4 w-4 ml-auto ${isCOD ? 'text-blue-500' : 'text-green-500'}`} />
                )}
                {index === redirectStep && (
                  <Loader2 className="h-4 w-4 text-blue-500 ml-auto animate-spin" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div className="text-center text-sm text-gray-500 bg-white/50 p-4 rounded-lg">
            <p className="font-medium">Please don&apos;t close this window.</p>
            <p>You&apos;ll be redirected automatically...</p>
            {isCOD && (
              <p className="text-xs mt-2 text-orange-600">
                You&apos;ll pay when your order is delivered.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/cart")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                            <RadioGroupItem value="card" id="card" />
                            <label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                              <CreditCard className="h-4 w-4" />
                              <span>Credit/Debit Card</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                            <RadioGroupItem value="upi" id="upi" />
                            <label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Wallet className="h-4 w-4" />
                              <span>UPI</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                            <RadioGroupItem value="netbanking" id="netbanking" />
                            <label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Building className="h-4 w-4" />
                              <span>Net Banking</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                            <RadioGroupItem value="cod" id="cod" />
                            <label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Truck className="h-4 w-4" />
                              <span>Cash on Delivery</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Credit/Debit Card Fields */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="cardholderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234 5678 9012 3456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}

                {/* UPI Field */}
                {paymentMethod === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FormField
                      control={form.control}
                      name="upiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID</FormLabel>
                          <FormControl>
                            <Input placeholder="yourname@paytm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* Net Banking Field */}
                {paymentMethod === "netbanking" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Bank</FormLabel>
                          <FormControl>
                            <Input placeholder="State Bank of India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}

                {/* COD Information */}
                {paymentMethod === "cod" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      You&apos;ll pay when your order is delivered to your doorstep. 
                      Please keep the exact amount ready for a smooth delivery experience.
                    </p>
                  </motion.div>
                )}

                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    paymentMethod === "cod" ? "Placing Order..." : "Processing Payment..."
                  ) : (
                    paymentMethod === "cod" ? `Place Order - ₹${total.toFixed(2)}` : `Pay ₹${total.toFixed(2)}`
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{deliveryAddress?.name}</p>
                <p className="text-sm text-muted-foreground">{deliveryAddress?.address}</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryAddress?.city}, {deliveryAddress?.state} - {deliveryAddress?.pincode}
                </p>
                <p className="text-sm text-muted-foreground">{deliveryAddress?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Payment Method:</span>
                    <span className="font-medium">Pay on Delivery</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

