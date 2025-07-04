"use client"

import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Award, 
  Users,  
  GraduationCap,
  Building,
  CheckCircle,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface Doctor {
  id: string
  name: string
  specialty: string
  image: string
  rating: number
  experience: number
  location: string
  availability: string
  consultationFee: number
  verified: boolean
  patients: number
  nextAvailable: string
  qualifications?: string[]
  languages?: string[]
  about?: string
  services?: string[]
  workingHours?: { [key: string]: string }
}

interface DoctorDetailsProps {
  doctor: Doctor | null
  open: boolean
  onClose: () => void
  onBookAppointment: (doctor: Doctor) => void
}

export function DoctorDetails({ doctor, open, onClose, onBookAppointment }: DoctorDetailsProps) {
  if (!doctor) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Doctor Info - Centered Layout */}
          <div className="text-center space-y-6">
            {/* Doctor Name and Title */}
            <div className="space-y-3">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                  Dr. {doctor.name}
                  {doctor.verified && (
                    <div className="bg-emerald-500 rounded-full p-2">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  )}
                </DialogTitle>
              </DialogHeader>
              <p className="text-2xl text-emerald-600 font-semibold">
                {doctor.specialty}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/70 rounded-xl p-4 text-center shadow-sm">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-auto mb-2" />
                <div className="font-bold text-xl text-gray-900">{doctor.rating}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="bg-white/70 rounded-xl p-4 text-center shadow-sm">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="font-bold text-xl text-gray-900">{doctor.experience}+</div>
                <div className="text-sm text-gray-600">Years Exp</div>
              </div>
              <div className="bg-white/70 rounded-xl p-4 text-center shadow-sm">
                <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="font-bold text-xl text-gray-900">{doctor.patients}+</div>
                <div className="text-sm text-gray-600">Patients</div>
              </div>
              <div className="bg-white/70 rounded-xl p-4 text-center shadow-sm">
                <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <div className="font-bold text-xl text-gray-900">₹{doctor.consultationFee}</div>
                <div className="text-sm text-gray-600">Consultation</div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/70 rounded-lg px-4 py-2 shadow-sm">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="font-medium text-gray-700">{doctor.location}</span>
              </div>
              <Badge 
                variant={doctor.availability === "Available" ? "default" : "secondary"}
                className="bg-white/70 text-emerald-700 border-emerald-200 px-4 py-2 font-semibold"
              >
                {doctor.availability}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Dr. {doctor.name}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {doctor.about || `Dr. ${doctor.name} is a highly experienced ${doctor.specialty} with over ${doctor.experience} years of practice. Known for providing compassionate care and using the latest medical techniques to ensure the best outcomes for patients.`}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {(doctor.languages || ['English', 'Hindi']).map((language) => (
                    <Badge key={language} variant="outline" className="border-emerald-200 text-emerald-700">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-800">Next Available Appointment</h4>
                </div>
                <p className="text-emerald-700 font-medium">{doctor.nextAvailable}</p>
              </div>
            </TabsContent>

            {/* Qualifications Tab */}
            <TabsContent value="qualifications" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Education & Certifications
                </h3>
                <div className="space-y-3">
                  {(doctor.qualifications || [
                    'MBBS - All India Institute of Medical Sciences (AIIMS)',
                    'MD in ' + doctor.specialty + ' - Post Graduate Institute',
                    'Fellowship in Advanced ' + doctor.specialty,
                    'Board Certified ' + doctor.specialty + ' Specialist'
                  ]).map((qualification, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{qualification}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  Services Offered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(doctor.services || [
                    'General Consultation',
                    'Health Checkups',
                    'Diagnostic Services',
                    'Treatment Planning',
                    'Follow-up Care',
                    'Emergency Consultation'
                  ]).map((service, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-blue-800 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Working Hours
                </h3>
                <div className="space-y-2">
                  {Object.entries(doctor.workingHours || {
                    'Monday': '9:00 AM - 6:00 PM',
                    'Tuesday': '9:00 AM - 6:00 PM',
                    'Wednesday': '9:00 AM - 6:00 PM',
                    'Thursday': '9:00 AM - 6:00 PM',
                    'Friday': '9:00 AM - 6:00 PM',
                    'Saturday': '9:00 AM - 2:00 PM',
                    'Sunday': 'Closed'
                  }).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{day}</span>
                      <span className={`font-medium ${hours === 'Closed' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <Button 
              variant="outline" 
              className="flex-1 border-emerald-200 hover:bg-emerald-50 text-emerald-700"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onBookAppointment(doctor)}
              disabled={doctor.availability !== "Available"}
            >
              Book Appointment - ₹{doctor.consultationFee}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}