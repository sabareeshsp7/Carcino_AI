export interface Doctor {
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
  verified: true
  patients: number
  nextAvailable: string
  qualifications?: string[]
  languages?: string[]
  about?: string
  services?: string[]
  workingHours?: { [key: string]: string }
  availableToday?: boolean
  videoConsultation?: boolean
}

export const doctorsData: Doctor[] = [
  {
    id: "1",
    name: "Meera Iyer",
    specialty: "Dermatologist",
    specialization: ["akiec", "Actinic Keratoses"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    experience: 12,
    location: "Apollo Hospital, Chennai",
    availability: "Available",
    consultationFee: 1200,
    verified: true,
    patients: 1800,
    nextAvailable: "Today, 2:30 PM",
    availableToday: true,
    videoConsultation: true,
    about: "Dr. Meera Iyer is a leading dermatologist specializing in actinic keratoses and precancerous skin lesions. With over 12 years of experience, she has pioneered innovative treatment approaches for early-stage skin cancer detection.",
    qualifications: [
      "MBBS - Madras Medical College",
      "MD Dermatology - AIIMS Delhi",
      "Fellowship in Dermatopathology - Harvard Medical School",
      "Board Certified Dermatologist"
    ],
    languages: ["English", "Tamil", "Hindi"],
    services: [
      "Actinic Keratoses Treatment",
      "Skin Cancer Screening",
      "Photodynamic Therapy",
      "Cryotherapy",
      "Dermatoscopy",
      "Preventive Skin Care"
    ]
  },
  {
    id: "2",
    name: "Rohan Desai",
    specialty: "Dermatologist",
    specialization: ["akiec", "Solar Keratosis"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    experience: 10,
    location: "Fortis Hospital, Mumbai",
    availability: "Available",
    consultationFee: 1100,
    verified: true,
    patients: 1500,
    nextAvailable: "Today, 4:00 PM",
    availableToday: true,
    videoConsultation: true,
    about: "Dr. Rohan Desai specializes in treating solar keratosis and actinic damage. He focuses on comprehensive skin protection strategies and advanced laser therapies for precancerous lesions.",
    qualifications: [
      "MBBS - King Edward Memorial Hospital",
      "MD Dermatology - Seth GS Medical College",
      "Fellowship in Laser Dermatology",
      "Certified Dermatopathologist"
    ],
    languages: ["English", "Hindi", "Marathi", "Gujarati"],
    services: [
      "Solar Keratosis Treatment",
      "Laser Therapy",
      "Chemical Peels",
      "Sun Damage Repair",
      "Skin Rejuvenation",
      "Cancer Prevention Counseling"
    ]
  },
  {
    id: "3",
    name: "Shalini Verma",
    specialty: "Oncologist",
    specialization: ["bcc", "Basal Cell Carcinoma"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    experience: 15,
    location: "Tata Memorial Hospital, Mumbai",
    availability: "Available",
    consultationFee: 1500,
    verified: true,
    patients: 2200,
    nextAvailable: "Tomorrow, 10:00 AM",
    availableToday: false,
    videoConsultation: true,
    about: "Dr. Shalini Verma is a renowned oncologist specializing in basal cell carcinoma treatment. She has extensive experience in Mohs surgery and advanced oncological treatments for skin cancers.",
    qualifications: [
      "MBBS - AIIMS Delhi",
      "MD Oncology - Tata Memorial Hospital",
      "Fellowship in Surgical Oncology - Memorial Sloan Kettering",
      "Mohs Surgery Specialist"
    ],
    languages: ["English", "Hindi"],
    services: [
      "Basal Cell Carcinoma Treatment",
      "Mohs Surgery",
      "Radiation Therapy",
      "Chemotherapy",
      "Immunotherapy",
      "Oncological Consultations"
    ]
  },
  {
    id: "4",
    name: "Ayaan Kapoor",
    specialty: "Dermatological Surgeon",
    specialization: ["bcc", "carcinoma", "Skin Cancer Surgery"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    experience: 11,
    location: "Max Hospital, Delhi",
    availability: "Available",
    consultationFee: 1300,
    verified: true,
    patients: 1600,
    nextAvailable: "Today, 6:00 PM",
    availableToday: true,
    videoConsultation: false,
    about: "Dr. Ayaan Kapoor is a skilled dermatological surgeon specializing in basal cell carcinoma and various skin cancer surgeries. He combines precision surgery with cosmetic reconstruction techniques.",
    qualifications: [
      "MBBS - Maulana Azad Medical College",
      "MS Dermatological Surgery - AIIMS",
      "Fellowship in Reconstructive Surgery",
      "Advanced Microsurgery Training"
    ],
    languages: ["English", "Hindi", "Punjabi"],
    services: [
      "Skin Cancer Surgery",
      "Reconstructive Surgery",
      "Microsurgery",
      "Cosmetic Reconstruction",
      "Scar Revision",
      "Advanced Wound Care"
    ]
  },
  {
    id: "5",
    name: "Anjali Nair",
    specialty: "Dermatologist",
    specialization: ["bkl", "Benign Keratosis"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.6,
    experience: 9,
    location: "Manipal Hospital, Bangalore",
    availability: "Available",
    consultationFee: 900,
    verified: true,
    patients: 1300,
    nextAvailable: "Today, 3:30 PM",
    availableToday: true,
    videoConsultation: true,
    about: "Dr. Anjali Nair specializes in benign keratosis and non-malignant skin lesions. She focuses on accurate diagnosis and minimally invasive treatment approaches for various keratotic conditions.",
    qualifications: [
      "MBBS - Kasturba Medical College",
      "MD Dermatology - NIMHANS",
      "Fellowship in Dermatopathology",
      "Certified Dermatoscopy Expert"
    ],
    languages: ["English", "Hindi", "Malayalam", "Kannada"],
    services: [
      "Benign Keratosis Treatment",
      "Seborrheic Keratosis Removal",
      "Cryotherapy",
      "Electrocautery",
      "Dermatoscopy",
      "Skin Biopsy"
    ]
  },
  {
    id: "6",
    name: "Sunil Menon",
    specialty: "Dermatologist",
    specialization: ["bkl", "Keratotic Lesions"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.5,
    experience: 8,
    location: "KIMS Hospital, Kochi",
    availability: "Busy",
    consultationFee: 800,
    verified: true,
    patients: 1100,
    nextAvailable: "Next Monday, 11:00 AM",
    availableToday: false,
    videoConsultation: true,
    about: "Dr. Sunil Menon has expertise in treating various keratotic lesions and benign skin conditions. He employs both traditional and modern techniques for optimal patient outcomes.",
    qualifications: [
      "MBBS - Government Medical College, Kochi",
      "MD Dermatology - AIIMS Rishikesh",
      "Diploma in Dermatopathology",
      "Laser Therapy Certification"
    ],
    languages: ["English", "Malayalam", "Hindi"],
    services: [
      "Keratotic Lesion Treatment",
      "Laser Therapy",
      "Skin Tag Removal",
      "Wart Treatment",
      "Mole Assessment",
      "Cosmetic Dermatology"
    ]
  },
  {
    id: "7",
    name: "Ravi Nandakumar",
    specialty: "Dermatologist",
    specialization: ["df", "Dermatofibroma"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    experience: 13,
    location: "Apollo Hospital, Hyderabad",
    availability: "Available",
    consultationFee: 1000,
    verified: true,
    patients: 1700,
    nextAvailable: "Tomorrow, 9:30 AM",
    availableToday: false,
    videoConsultation: true,
    about: "Dr. Ravi Nandakumar specializes in dermatofibroma and fibrous skin lesions. He has extensive experience in differential diagnosis and surgical management of various skin nodules.",
    qualifications: [
      "MBBS - Osmania Medical College",
      "MD Dermatology - NIMS Hyderabad",
      "Fellowship in Surgical Dermatology",
      "Advanced Dermatopathology Training"
    ],
    languages: ["English", "Telugu", "Hindi"],
    services: [
      "Dermatofibroma Treatment",
      "Skin Nodule Removal",
      "Surgical Excision",
      "Histopathology",
      "Scar Management",
      "Cosmetic Procedures"
    ]
  },
  {
    id: "8",
    name: "Nisha Shetty",
    specialty: "Dermatologist",
    specialization: ["df", "Fibrous Lesions"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.6,
    experience: 7,
    location: "Fortis Hospital, Bangalore",
    availability: "Available",
    consultationFee: 850,
    verified: true,
    patients: 950,
    nextAvailable: "Today, 5:30 PM",
    availableToday: true,
    videoConsultation: false,
    about: "Dr. Nisha Shetty focuses on fibrous skin lesions and dermatofibroma management. She combines clinical expertise with patient-centered care for optimal treatment outcomes.",
    qualifications: [
      "MBBS - St. John's Medical College",
      "MD Dermatology - JIPMER",
      "Dermatosurgery Fellowship",
      "Aesthetic Dermatology Certification"
    ],
    languages: ["English", "Kannada", "Hindi", "Tulu"],
    services: [
      "Fibrous Lesion Treatment",
      "Minor Surgery",
      "Aesthetic Procedures",
      "Skin Cancer Screening",
      "Preventive Care",
      "Patient Education"
    ]
  },
  {
    id: "9",
    name: "Arvind Krishnan",
    specialty: "Melanoma Specialist",
    specialization: ["mel", "Melanoma"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
    experience: 16,
    location: "AIIMS, Delhi",
    availability: "Available",
    consultationFee: 1800,
    verified: true,
    patients: 2500,
    nextAvailable: "Tomorrow, 2:00 PM",
    availableToday: false,
    videoConsultation: true,
    about: "Dr. Arvind Krishnan is a leading melanoma specialist with international recognition. He has pioneered several treatment protocols for advanced melanoma and leads clinical research in immunotherapy.",
    qualifications: [
      "MBBS - AIIMS Delhi",
      "MD Dermatology - AIIMS Delhi",
      "Fellowship in Melanoma - MD Anderson Cancer Center",
      "PhD in Oncological Research"
    ],
    languages: ["English", "Hindi"],
    services: [
      "Melanoma Treatment",
      "Immunotherapy",
      "Targeted Therapy",
      "Clinical Trials",
      "Advanced Diagnostics",
      "Genetic Counseling"
    ]
  },
  {
    id: "10",
    name: "Reema Gupta",
    specialty: "Dermatologist",
    specialization: ["mel", "Pigmented Lesions"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    experience: 12,
    location: "Sir Ganga Ram Hospital, Delhi",
    availability: "Available",
    consultationFee: 1400,
    verified: true,
    patients: 1900,
    nextAvailable: "Today, 7:00 PM",
    availableToday: true,
    videoConsultation: true,
    about: "Dr. Reema Gupta specializes in melanoma and pigmented lesion analysis. She uses advanced dermoscopy and digital imaging for early melanoma detection and management.",
    qualifications: [
      "MBBS - Lady Hardinge Medical College",
      "MD Dermatology - AIIMS Delhi",
      "Fellowship in Pigmented Lesion Dermoscopy",
      "Digital Dermoscopy Certification"
    ],
    languages: ["English", "Hindi", "Punjabi"],
    services: [
      "Melanoma Screening",
      "Digital Dermoscopy",
      "Mole Mapping",
      "Pigmented Lesion Analysis",
      "Early Detection Programs",
      "Follow-up Care"
    ]
  },
  {
    id: "11",
    name: "Karthik Reddy",
    specialty: "Dermatologist",
    specialization: ["nv", "Melanocytic Nevi"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.6,
    experience: 9,
    location: "NIMS Hospital, Hyderabad",
    availability: "Available",
    consultationFee: 750,
    verified: true,
    patients: 1200,
    nextAvailable: "Today, 1:30 PM",
    availableToday: true,
    videoConsultation: false,
    about: "Dr. Karthik Reddy specializes in melanocytic nevi and mole management. He focuses on comprehensive mole assessment and preventive care for patients with multiple nevi.",
    qualifications: [
      "MBBS - Gandhi Medical College",
      "MD Dermatology - NIMS Hyderabad",
      "Fellowship in Dermoscopy",
      "Mole Assessment Specialist"
    ],
    languages: ["English", "Telugu", "Hindi"],
    services: [
      "Mole Assessment",
      "Nevi Removal",
      "Risk Assessment",
      "Preventive Monitoring",
      "Dermoscopy",
      "Patient Education"
    ]
  },
  {
    id: "12",
    name: "Sneha Sharma",
    specialty: "Dermatologist",
    specialization: ["nv", "Atypical Nevi"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    experience: 8,
    location: "Medanta Hospital, Gurgaon",
    availability: "Busy",
    consultationFee: 950,
    verified: true,
    patients: 1000,
    nextAvailable: "Next Tuesday, 3:00 PM",
    availableToday: false,
    videoConsultation: true,
    about: "Dr. Sneha Sharma has expertise in atypical nevi and dysplastic mole management. She provides comprehensive care for patients with familial atypical mole syndrome.",
    qualifications: [
      "MBBS - AIIMS Delhi",
      "MD Dermatology - PGIMER Chandigarh",
      "Fellowship in Atypical Nevi Management",
      "Genetic Dermatology Training"
    ],
    languages: ["English", "Hindi"],
    services: [
      "Atypical Nevi Management",
      "Familial Screening",
      "Genetic Counseling",
      "Dysplastic Mole Treatment",
      "Regular Monitoring",
      "Risk Stratification"
    ]
  },
  {
    id: "13",
    name: "Priya Mehta",
    specialty: "Dermatologist",
    specialization: ["vasc", "Vascular Lesions"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    experience: 11,
    location: "Jaslok Hospital, Mumbai",
    availability: "Available",
    consultationFee: 1100,
    verified: true,
    patients: 1500,
    nextAvailable: "Today, 4:30 PM",
    availableToday: true,
    videoConsultation: true,
    about: "Dr. Priya Mehta specializes in vascular skin lesions and hemangiomas. She uses advanced laser therapy and sclerotherapy for treating various vascular malformations.",
    qualifications: [
      "MBBS - Grant Medical College",
      "MD Dermatology - KEM Hospital",
      "Fellowship in Vascular Dermatology",
      "Laser Therapy Specialist"
    ],
    languages: ["English", "Hindi", "Marathi"],
    services: [
      "Vascular Lesion Treatment",
      "Hemangioma Management",
      "Laser Therapy",
      "Sclerotherapy",
      "Port Wine Stain Treatment",
      "Vascular Malformation Care"
    ]
  },
  {
    id: "14",
    name: "Rajiv Bhatia",
    specialty: "Vascular Surgeon",
    specialization: ["vasc", "Vascular Malformations"],
    image: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
    experience: 14,
    location: "Apollo Hospital, Delhi",
    availability: "Available",
    consultationFee: 1250,
    verified: true,
    patients: 1800,
    nextAvailable: "Tomorrow, 11:30 AM",
    availableToday: false,
    videoConsultation: false,
    about: "Dr. Rajiv Bhatia is a vascular surgeon specializing in complex vascular malformations and arteriovenous malformations. He performs advanced microsurgical procedures for vascular lesions.",
    qualifications: [
      "MBBS - AIIMS Delhi",
      "MS Vascular Surgery - AIIMS Delhi",
      "Fellowship in Microsurgery",
      "Advanced Vascular Malformation Training"
    ],
    languages: ["English", "Hindi"],
    services: [
      "Vascular Surgery",
      "Microsurgery",
      "AVM Treatment",
      "Complex Reconstruction",
      "Interventional Procedures",
      "Multidisciplinary Care"
    ]
  }
]