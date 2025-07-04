"use client"

import { useState } from "react"
import {  User, CreditCard, X, CheckCircle, CalendarDays, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useMedicalHistory } from "@/contexts/MedicalHistoryContext"

interface Doctor {
  id: string
  name: string
  specialty: string
  specialization: string[]
  image: string
  rating: number
  experience: number
  location: string
  availability: string
  consultationFee: number
  verified: boolean
  patients: number
  nextAvailable: string
}

interface BookingModalProps {
  doctor: Doctor | null
  open: boolean
  onClose: () => void
  onSuccess: (appointmentData: unknown) => void
}

export function BookingModal({ doctor, open, onClose, onSuccess }: BookingModalProps) {
  const { addHistory } = useMedicalHistory()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationType: "in-person",
    symptoms: "",
    previousConsultation: "no",
    paymentMethod: "online"
  })

  if (!doctor) return null

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleBooking = async () => {
    const appointmentData = {
      id: Math.random().toString(36).substring(2, 9),
      doctor: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        location: doctor.location,
        consultationFee: doctor.consultationFee
      },
      patient: {
        name: formData.patientName,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email
      },
      appointment: {
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        consultationType: formData.consultationType,
        symptoms: formData.symptoms,
        totalFee: doctor.consultationFee + 50,
        paymentMethod: formData.paymentMethod
      }
    }

    try {
      // Save to medical history with detailed information
      await addHistory({
        type: "Appointment",
        data: `Appointment booked with Dr. ${doctor.name} (${doctor.specialty}) on ${formData.appointmentDate} at ${formData.appointmentTime}. Type: ${formData.consultationType}. Symptoms: ${formData.symptoms || 'General consultation'}. Total Fee: ₹${doctor.consultationFee + 50}`,
        details: {
          doctor: {
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            location: doctor.location,
            consultationFee: doctor.consultationFee
          },
          patient: {
            name: formData.patientName,
            age: formData.age,
            gender: formData.gender,
            phone: formData.phone,
            email: formData.email
          },
          appointment: {
            date: formData.appointmentDate,
            time: formData.appointmentTime,
            consultationType: formData.consultationType,
            symptoms: formData.symptoms,
            totalFee: doctor.consultationFee + 50,
            paymentMethod: formData.paymentMethod
          }
        }
      })

      // Show success message
      toast.success("Appointment booked successfully!", {
        description: `Your appointment with Dr. ${doctor.name} has been confirmed and saved to your medical history.`
      })

      // Close modal and show success page
      onClose()
      onSuccess(appointmentData)
      
      // Reset form
      setStep(1)
      setFormData({
        patientName: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        appointmentDate: "",
        appointmentTime: "",
        consultationType: "in-person",
        symptoms: "",
        previousConsultation: "no",
        paymentMethod: "online"
      })
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast.error("Failed to book appointment. Please try again.")
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name *</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    className="border-gray-200 focus:border-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    placeholder="Enter age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="border-gray-200 focus:border-emerald-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-emerald-300">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="border-gray-200 focus:border-emerald-300"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="Enter email address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="border-gray-200 focus:border-emerald-300"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Type</h3>
              <RadioGroup value={formData.consultationType} onValueChange={(value) => handleInputChange("consultationType", value)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:border-emerald-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="in-person" id="in-person" />
                        <Label htmlFor="in-person" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-emerald-600" />
                            <div>
                              <div className="font-medium">In-Person Visit</div>
                              <div className="text-sm text-gray-500">Visit doctor&apos;s clinic</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-emerald-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="video" />
                        <Label htmlFor="video" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-emerald-600 rounded flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-medium">Video Consultation</div>
                              <div className="text-sm text-gray-500">Online video call</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                Select Date & Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Preferred Date *</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                    className="border-gray-200 focus:border-emerald-300"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Time Slots *</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={formData.appointmentTime === time ? "default" : "outline"}
                        size="sm"
                        className={`text-xs ${
                          formData.appointmentTime === time 
                            ? "bg-emerald-600 hover:bg-emerald-700" 
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                        onClick={() => handleInputChange("appointmentTime", time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe your symptoms or reason for consultation..."
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange("symptoms", e.target.value)}
                    className="border-gray-200 focus:border-emerald-300 min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Previous Consultation with this doctor?</Label>
                  <RadioGroup value={formData.previousConsultation} onValueChange={(value) => handleInputChange("previousConsultation", value)}>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="prev-yes" />
                        <Label htmlFor="prev-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="prev-no" />
                        <Label htmlFor="prev-no">No</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <RadioGroup value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                <div className="space-y-3">
                  <Card className="cursor-pointer hover:border-emerald-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                            <div>
                              <div className="font-medium">Pay Online</div>
                              <div className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-emerald-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="clinic" id="clinic" />
                        <Label htmlFor="clinic" className="cursor-pointer flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <div>
                              <div className="font-medium">Pay at Clinic</div>
                              <div className="text-sm text-gray-500">Pay during your visit</div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="font-medium">₹{doctor.consultationFee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Platform Fee</span>
                    <span className="font-medium">₹50</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-emerald-700">₹{doctor.consultationFee + 50}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Book Appointment
            </DialogTitle>
          </DialogHeader>

          {/* Doctor Info */}
          <div className="text-center mt-4 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-bold text-xl text-gray-900">Dr. {doctor.name}</h3>
              {doctor.verified && (
                <div className="bg-emerald-500 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-emerald-600 font-semibold text-lg">{doctor.specialty}</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <Badge variant="secondary" className="bg-white/60 text-emerald-700">
                ₹{doctor.consultationFee}
              </Badge>
              <span className="text-sm text-gray-600">{doctor.location}</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-400 border-2 border-gray-200"
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        step > stepNumber ? "bg-emerald-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span className={step >= 1 ? "text-emerald-600 font-medium" : ""}>Patient Info</span>
            <span className={step >= 2 ? "text-emerald-600 font-medium" : ""}>Date & Time</span>
            <span className={step >= 3 ? "text-emerald-600 font-medium" : ""}>Payment</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : handlePrevious}
            className="border-gray-200 hover:bg-gray-100"
          >
            {step === 1 ? "Cancel" : "Previous"}
          </Button>
          <div className="text-sm text-gray-500">
            Step {step} of 3
          </div>
          <Button
            onClick={step === 3 ? handleBooking : handleNext}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={
              (step === 1 && (!formData.patientName || !formData.age || !formData.gender || !formData.phone)) ||
              (step === 2 && (!formData.appointmentDate || !formData.appointmentTime))
            }
          >
            {step === 3 ? "Confirm Appointment" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}