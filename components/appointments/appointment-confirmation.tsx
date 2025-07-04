"use client"

import { useState } from "react"
import { Calendar, Clock, Download, CheckCircle, User, Phone, Mail, MapPin, CreditCard, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import jsPDF from 'jspdf'

interface AppointmentConfirmationProps {
  appointmentData: any
  open: boolean
  onClose: () => void
}

export function AppointmentConfirmation({ appointmentData, open, onClose }: AppointmentConfirmationProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!appointmentData) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const addToCalendar = () => {
    const startDate = new Date(`${appointmentData.appointment.date} ${appointmentData.appointment.time}`)
    const endDate = new Date(startDate.getTime() + 30 * 60000) // Add 30 minutes

    const event = {
      title: `Appointment with Dr. ${appointmentData.doctor.name}`,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: `${appointmentData.appointment.consultationType} consultation with Dr. ${appointmentData.doctor.name} (${appointmentData.doctor.specialty}). Symptoms: ${appointmentData.appointment.symptoms || 'General consultation'}`,
      location: appointmentData.appointment.consultationType === 'in-person' ? appointmentData.doctor.location : 'Video Call'
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
    
    window.open(calendarUrl, '_blank')
  }

  const downloadPDF = () => {
    setIsDownloading(true)
    
    try {
      const doc = new jsPDF()
      
      // Header
      doc.setFontSize(20)
      doc.setTextColor(16, 185, 129) // emerald-500
      doc.text('DermaSense AI', 20, 20)
      
      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text('Appointment Confirmation', 20, 35)
      
      // Appointment ID
      doc.setFontSize(12)
      doc.text(`Appointment ID: ${appointmentData.id}`, 20, 50)
      doc.text(`Booking Date: ${new Date().toLocaleDateString()}`, 20, 60)
      
      // Doctor Information
      doc.setFontSize(14)
      doc.text('Doctor Information:', 20, 80)
      doc.setFontSize(12)
      doc.text(`Name: Dr. ${appointmentData.doctor.name}`, 25, 95)
      doc.text(`Specialty: ${appointmentData.doctor.specialty}`, 25, 105)
      doc.text(`Location: ${appointmentData.doctor.location}`, 25, 115)
      
      // Patient Information
      doc.setFontSize(14)
      doc.text('Patient Information:', 20, 135)
      doc.setFontSize(12)
      doc.text(`Name: ${appointmentData.patient.name}`, 25, 150)
      doc.text(`Age: ${appointmentData.patient.age}`, 25, 160)
      doc.text(`Gender: ${appointmentData.patient.gender}`, 25, 170)
      doc.text(`Phone: ${appointmentData.patient.phone}`, 25, 180)
      if (appointmentData.patient.email) {
        doc.text(`Email: ${appointmentData.patient.email}`, 25, 190)
      }
      
      // Appointment Details
      doc.setFontSize(14)
      doc.text('Appointment Details:', 20, 210)
      doc.setFontSize(12)
      doc.text(`Date: ${formatDate(appointmentData.appointment.date)}`, 25, 225)
      doc.text(`Time: ${appointmentData.appointment.time}`, 25, 235)
      doc.text(`Type: ${appointmentData.appointment.consultationType}`, 25, 245)
      if (appointmentData.appointment.symptoms) {
        doc.text(`Symptoms: ${appointmentData.appointment.symptoms}`, 25, 255)
      }
      
      // Payment Information
      doc.setFontSize(14)
      doc.text('Payment Information:', 20, 275)
      doc.setFontSize(12)
      doc.text(`Consultation Fee: ₹${appointmentData.doctor.consultationFee}`, 25, 290)
      doc.text(`Platform Fee: ₹50`, 25, 300)
      doc.text(`Total Amount: ₹${appointmentData.appointment.totalFee}`, 25, 310)
      doc.text(`Payment Method: ${appointmentData.appointment.paymentMethod}`, 25, 320)
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text('Thank you for choosing DermaSense AI for your healthcare needs.', 20, 350)
      doc.text('For any queries, please contact our support team.', 20, 360)
      
      doc.save(`appointment-${appointmentData.id}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
            <CheckCircle className="w-8 h-8" />
            Appointment Confirmed!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-emerald-800">
                  Your appointment has been successfully booked!
                </h3>
                <p className="text-sm text-emerald-600">
                  Confirmation details have been saved to your medical history.
                </p>
              </div>
            </div>
          </div>

          {/* Appointment ID */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Appointment ID</span>
                <Badge variant="secondary" className="font-mono">
                  {appointmentData.id}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Doctor Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">Dr. {appointmentData.doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Specialty</span>
                <span className="font-medium">{appointmentData.doctor.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{appointmentData.doctor.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{formatDate(appointmentData.appointment.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{appointmentData.appointment.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <Badge variant={appointmentData.appointment.consultationType === 'video' ? 'default' : 'secondary'}>
                  {appointmentData.appointment.consultationType === 'video' ? 'Video Call' : 'In-Person'}
                </Badge>
              </div>
              {appointmentData.appointment.symptoms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Symptoms</span>
                  <span className="font-medium text-right max-w-[200px]">
                    {appointmentData.appointment.symptoms}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name</span>
                <span className="font-medium">{appointmentData.patient.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age</span>
                <span className="font-medium">{appointmentData.patient.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{appointmentData.patient.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Fee</span>
                <span className="font-medium">₹{appointmentData.doctor.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium">₹50</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-emerald-600">₹{appointmentData.appointment.totalFee}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={addToCalendar}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}