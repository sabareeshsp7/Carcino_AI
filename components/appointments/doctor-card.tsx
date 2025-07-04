"use client"

import { Star, MapPin, Clock, Calendar, Award, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
  availableToday?: boolean
  videoConsultation?: boolean
}

interface DoctorCardProps {
  doctor: Doctor
  onViewDetails: (doctor: Doctor) => void
  onBookAppointment: (doctor: Doctor) => void
  layout?: "grid" | "row"
}

export function DoctorCard({ doctor, onViewDetails, onBookAppointment, layout = "grid" }: DoctorCardProps) {
  if (layout === "row") {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:border-emerald-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Doctor Info */}
            <div className="flex-1 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Doctor Details */}
                <div className="flex-1 space-y-3">
                  {/* Name and Verification */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xl text-gray-900">
                          Dr. {doctor.name}
                        </h3>
                        {doctor.verified && (
                          <div className="bg-emerald-500 rounded-full p-1">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-emerald-600 font-semibold text-base">
                        {doctor.specialty}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.specialization.slice(0, 2).map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-base px-3 py-1">
                      ₹{doctor.consultationFee}
                    </Badge>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-gray-700">
                        {doctor.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{doctor.experience}+ years</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{doctor.patients}+ patients</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{doctor.location}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={doctor.availability === "Available" ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        doctor.availability === "Available" 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {doctor.availability}
                    </Badge>
                    {doctor.availableToday && (
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                        Available Today
                      </Badge>
                    )}
                    {doctor.videoConsultation && (
                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                        <Video className="w-3 h-3 mr-1" />
                        Video Call
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Appointment Info & Actions */}
            <div className="lg:w-80 bg-gradient-to-br from-emerald-50 to-blue-50 p-6 space-y-4">
              {/* Next Available */}
              <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">Next Available</span>
                </div>
                <p className="text-emerald-700 font-bold">{doctor.nextAvailable}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium h-10"
                  onClick={() => onViewDetails(doctor)}
                >
                  View Full Profile
                </Button>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 font-medium h-10"
                  onClick={() => onBookAppointment(doctor)}
                  disabled={doctor.availability !== "Available"}
                >
                  Book Appointment
                </Button>
              </div>

              {/* Quick Info */}
              <div className="text-center text-xs text-gray-600 bg-white/50 rounded-lg p-2">
                Instant confirmation • Secure booking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid layout (original) - also removed distance
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-emerald-200 overflow-hidden h-full">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header Section with Doctor Info */}
        <div className="relative p-5 bg-gradient-to-br from-emerald-50 to-blue-50">
          {/* Doctor Name and Specialty */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-bold text-xl text-gray-900 leading-tight">
                Dr. {doctor.name}
              </h3>
              {doctor.verified && (
                <div className="bg-emerald-500 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-emerald-600 font-semibold text-base">
              {doctor.specialty}
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {doctor.specialization.slice(0, 2).map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                  {spec}
                </Badge>
              ))}
            </div>
            <Badge variant="secondary" className="bg-white/80 text-emerald-700 border-emerald-200 font-semibold">
              ₹{doctor.consultationFee}
            </Badge>
          </div>

          {/* Rating and Experience */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">
                {doctor.rating} Rating
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">{doctor.experience}+ Years</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          {/* Location and Patients */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600 justify-center">
              <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-center leading-relaxed">{doctor.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 justify-center">
              <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium">{doctor.patients}+ patients treated</span>
            </div>
          </div>

          {/* Next Available */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-blue-800 text-center">
                Next: {doctor.nextAvailable}
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge 
              variant={doctor.availability === "Available" ? "default" : "secondary"}
              className={cn(
                "text-sm font-semibold px-4 py-1",
                doctor.availability === "Available" 
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                  : "bg-gray-100 text-gray-600"
              )}
            >
              {doctor.availability}
            </Badge>
            {doctor.availableToday && (
              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                Today
              </Badge>
            )}
            {doctor.videoConsultation && (
              <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
                <Video className="w-3 h-3 mr-1" />
                Video
              </Badge>
            )}
          </div>

          {/* Action Buttons - Push to bottom */}
          <div className="flex gap-3 pt-3 mt-auto">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium h-9"
              onClick={() => onViewDetails(doctor)}
            >
              View Details
            </Button>
            <Button 
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 font-medium h-9"
              onClick={() => onBookAppointment(doctor)}
              disabled={doctor.availability !== "Available"}
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}