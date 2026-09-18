export interface Room {
  id: string;
  name: string;
  tagline: string;
  category: "Deluxe" | "Premium" | "Family" | "Suite";
  capacity: number; // Max guests
  minGuests: number;
  bedType: string;
  sizeSqm: number;
  view: string;
  pricePerNight: number; // in INR
  currency: string;
  totalRooms: number;
  description: string;
  amenities: string[];
  highlights: string[];
  imageUrl: string;
}

export interface DiningVenue {
  name: string;
  type: string;
  hours: string;
  description: string;
  dressCode?: string;
  reservations: string;
  breakfastIncluded: boolean;
}

export interface Amenity {
  name: string;
  category: "Wellness" | "Leisure" | "Service" | "Connectivity";
  description: string;
  hours?: string;
  iconName: string;
}

export interface Policy {
  topic: string;
  title: string;
  summary: string;
  details: string[];
}

export interface HotelKnowledge {
  name: string;
  location: string;
  address: string;
  tagline: string;
  contact: {
    phone: string;
    email: string;
    receptionHours: string;
  };
  overview: string;
  checkIn: {
    standardTime: string;
    earlyCheckInPolicy: string;
    luggagePolicy: string;
  };
  checkOut: {
    standardTime: string;
    lateCheckOutPolicy: string;
    expressCheckout: string;
  };
  breakfast: {
    hours: string;
    location: string;
    buffetAndALaCarte: string;
    dietaryOptions: string[];
  };
  cancellation: {
    standardPolicy: string;
    flexibleCutoffHours: number;
    penaltyAfterCutoff: string;
    nonRefundableTerms: string;
  };
  rooms: Room[];
  dining: DiningVenue[];
  amenities: Amenity[];
  policies: Policy[];
  faq: { question: string; answer: string }[];
}

export const HOTEL_DATA: HotelKnowledge = {
  name: "The Gulmohar",
  location: "Bengaluru, Karnataka, India",
  address: "14 Lavelle Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560001, India",
  tagline: "Boutique Hotel & Guest Assistant",
  contact: {
    phone: "+91 80 4965 7700",
    email: "reservations@thegulmohar.in",
    receptionHours: "24 Hours (Front Desk & Guest Assistance)",
  },
  overview:
    "The Gulmohar is a contemporary boutique hotel located on Lavelle Road in central Bengaluru. Designed for both business travellers and leisure guests, the hotel offers clean modern design, thoughtful amenities, an open-air swimming pool, an all-day dining restaurant featuring South Indian, North Indian, and continental options, and round-the-clock guest support.",
  checkIn: {
    standardTime: "2:00 PM (14:00)",
    earlyCheckInPolicy:
      "Early check-in from 10:00 AM is accommodated based on room readiness. If your room is not ready yet, our front desk team will securely hold your luggage while you relax in our lounge or café.",
    luggagePolicy:
      "Complimentary secure luggage holding is available at the front desk before check-in and after check-out.",
  },
  checkOut: {
    standardTime: "11:00 AM",
    lateCheckOutPolicy:
      "Late check-out up to 2:00 PM is available upon request subject to room availability. Complimentary for Executive Suite bookings; for other room categories, late check-out beyond 2:00 PM incurs a half-day room charge.",
    expressCheckout:
      "Digital folio review and express checkout are supported directly via our front desk and guest assistant.",
  },
  breakfast: {
    hours: "7:00 AM to 10:30 AM daily",
    location: "The Gulmohar Restaurant (Ground Floor)",
    buffetAndALaCarte:
      "A daily breakfast buffet featuring made-to-order South Indian staples (crisp dosas, idlis, medu vadas, fresh sambar and chutneys, and South Indian filter coffee), North Indian breakfast favourites (stuffed parathas, poori bhaji), fresh seasonal fruits, eggs to order, and continental breads and pastries.",
    dietaryOptions: [
      "Extensive vegetarian selections",
      "Jain breakfast options upon prior notice",
      "Vegan and dairy-free alternatives (soy and almond milk)",
      "Gluten-sensitive breakfast items upon request",
    ],
  },
  cancellation: {
    standardPolicy:
      "Flexible reservations can be cancelled or modified free of charge up to 48 hours prior to 2:00 PM on your scheduled arrival date.",
    flexibleCutoffHours: 48,
    penaltyAfterCutoff:
      "Cancellations made within 48 hours of scheduled arrival incur a fee equal to the first night's room rate plus applicable taxes.",
    nonRefundableTerms:
      "Special promotional and advance purchase rates are non-refundable once confirmed, though stay dates may be rescheduled once with 7 days advance notice.",
  },
  rooms: [
    {
      id: "deluxe-king-room",
      name: "Deluxe King Room",
      tagline: "Understated comfort with city views",
      category: "Deluxe",
      capacity: 2,
      minGuests: 1,
      bedType: "King bed",
      sizeSqm: 30,
      view: "City view",
      pricePerNight: 6500,
      currency: "INR",
      totalRooms: 12,
      description:
        "A practical, modern room featuring a plush king bed, ergonomic work desk, high-speed Wi-Fi, walk-in rain shower, and double-glazed windows overlooking the Bengaluru cityscape.",
      amenities: [
        "City view",
        "High-speed Wi-Fi",
        "Ergonomic work desk",
        "Walk-in rain shower",
        "Tea & coffee maker",
        "43-inch Smart TV",
      ],
      highlights: ["King bed · Up to 2 adults", "City view · Wi-Fi · Breakfast available"],
      imageUrl: "/images/rooms/deluxe-king.jpg",
    },
    {
      id: "premium-king-room",
      name: "Premium King Room",
      tagline: "Spacious corner room with private balcony",
      category: "Premium",
      capacity: 2,
      minGuests: 1,
      bedType: "King bed",
      sizeSqm: 38,
      view: "Courtyard garden view",
      pricePerNight: 7800,
      currency: "INR",
      totalRooms: 10,
      description:
        "An expansive room with an attached sit-out balcony overlooking the courtyard garden. Includes daily buffet breakfast, premium organic bath amenities, espresso machine, and comfortable lounge seating.",
      amenities: [
        "Private balcony",
        "Breakfast included",
        "High-speed Wi-Fi",
        "Espresso machine",
        "Premium bath amenities",
        "50-inch Smart TV",
      ],
      highlights: ["King bed · Up to 2 adults", "Balcony · Breakfast included · Garden view"],
      imageUrl: "/images/rooms/premium-king.jpg",
    },
    {
      id: "family-room",
      name: "Family Room",
      tagline: "Generous layout designed for families and small groups",
      category: "Family",
      capacity: 3,
      minGuests: 1,
      bedType: "King bed + single bed",
      sizeSqm: 48,
      view: "City & courtyard view",
      pricePerNight: 9200,
      currency: "INR",
      totalRooms: 6,
      description:
        "Thoughtfully designed with one king bed and one dedicated single bed to comfortably accommodate up to 3 adults or a family with a child. Features extra living space, ample wardrobe storage, and a deep soaking bathtub.",
      amenities: [
        "King + single bed setup",
        "High-speed Wi-Fi",
        "Extra living space",
        "Bathtub & rain shower",
        "Large wardrobe storage",
        "Complimentary packaged water & fruit basket",
      ],
      highlights: ["King bed + single bed · Up to 3 adults", "Wi-Fi · Breakfast available · Extra space"],
      imageUrl: "/images/rooms/family-room.jpg",
    },
    {
      id: "executive-suite",
      name: "Executive Suite",
      tagline: "Refined living with separate lounge and business privileges",
      category: "Suite",
      capacity: 3,
      minGuests: 1,
      bedType: "King bed",
      sizeSqm: 62,
      view: "Panoramic Bengaluru skyline view",
      pricePerNight: 12500,
      currency: "INR",
      totalRooms: 4,
      description:
        "Our premier suite offering a separate living salon, executive work area, walk-in closet, luxury marble bathroom with soaking tub, and inclusive lounge privileges with evening high tea and refreshments. Can accommodate up to 3 adults with an extra rollaway bed on request.",
      amenities: [
        "Separate living salon",
        "Breakfast included",
        "High-speed Wi-Fi",
        "Executive lounge privileges",
        "Marble bathroom with soaking tub",
        "Airport transfer privileges",
      ],
      highlights: ["King bed · Up to 3 adults", "Executive lounge access · Breakfast included · Panoramic view"],
      imageUrl: "/images/rooms/executive-suite.jpg",
    },
  ],
  dining: [
    {
      name: "The Gulmohar Restaurant",
      type: "All-Day Dining & Regional Cuisine",
      hours: "Daily: 6:30 AM – 11:00 PM",
      description:
        "Our vibrant all-day dining restaurant features live cooking stations and an eclectic menu spanning authentic Karnataka and South Indian specialties, North Indian curries and tandoor grills, and continental favourites. Features both indoor air-conditioned seating and an open courtyard terrace.",
      dressCode: "Smart casual",
      reservations: "Walk-ins welcome; table reservations recommended for weekend dinners",
      breakfastIncluded: false,
    },
    {
      name: "Breakfast Buffet",
      type: "Morning Buffet & Live Counters",
      hours: "Daily: 7:00 AM – 10:30 AM",
      description:
        "Served in The Gulmohar Restaurant. A wholesome morning spread featuring freshly prepared dosas, idlis, vadas, parathas, eggs made to order, fresh juices, cut fruits, bakeries, and traditional South Indian filter coffee. Included with Premium King and Executive Suite bookings, and available for all other guests.",
      reservations: "Not required for hotel residents",
      breakfastIncluded: true,
    },
    {
      name: "In-Room Dining",
      type: "24/7 Room Service",
      hours: "24 Hours Daily",
      description:
        "Freshly prepared hot meals, light snacks, South and North Indian comfort dishes, late-night bites, and hot beverages delivered straight to your room at any hour.",
      reservations: "Order directly through the room phone or via the guest assistant",
      breakfastIncluded: false,
    },
  ],
  amenities: [
    {
      name: "Swimming Pool",
      category: "Wellness",
      description:
        "An open-air lap pool situated on the landscaped terrace level, surrounded by loungers and shaded cabanas. Fresh towels and poolside refreshments available.",
      hours: "Daily: 6:00 AM – 9:00 PM",
      iconName: "Waves",
    },
    {
      name: "Fitness Centre",
      category: "Wellness",
      description:
        "Equipped with modern treadmills, ellipticals, stationary bikes, multi-gym stations, free weights, and stretching mats.",
      hours: "Open 24 Hours for resident guests",
      iconName: "Sparkles",
    },
    {
      name: "High-Speed Wi-Fi",
      category: "Connectivity",
      description:
        "Complimentary high-speed fiber Wi-Fi (up to 300 Mbps) available throughout all guest rooms, conference areas, restaurant, and pool deck.",
      hours: "24 Hours",
      iconName: "Wifi",
    },
    {
      name: "On-Site Parking & Valet",
      category: "Service",
      description:
        "Secure on-site covered parking with complimentary valet service for all registered guests. Includes dedicated EV charging points.",
      hours: "24 Hours",
      iconName: "Car",
    },
    {
      name: "24/7 Front Desk & Concierge",
      category: "Service",
      description:
        "Around-the-clock front desk reception, wake-up calls, travel assistance, local recommendations, and luggage management.",
      hours: "24 Hours",
      iconName: "Clock",
    },
    {
      name: "Airport Transfers",
      category: "Service",
      description:
        "Chauffeur-driven sedan and SUV transfers to and from Kempegowda International Airport (BLR). Can be scheduled via front desk or guest assistant with advance notice.",
      hours: "Available 24 Hours on advance booking",
      iconName: "Car",
    },
    {
      name: "Laundry & Dry Cleaning",
      category: "Service",
      description:
        "Same-day express laundry, dry cleaning, and steam pressing services available daily.",
      hours: "Pickup by 10:00 AM for same-day return by 7:00 PM",
      iconName: "Check",
    },
    {
      name: "Business Lounge & Work Area",
      category: "Connectivity",
      description:
        "A quiet work hub with ergonomic seating, power ports, high-speed Wi-Fi, wireless printing facilities, and a private 6-seater meeting space.",
      hours: "Daily: 7:00 AM – 10:00 PM",
      iconName: "BookOpen",
    },
  ],
  policies: [
    {
      topic: "check-in-out",
      title: "Check-in & Check-out Policies",
      summary: "Check-in: 2:00 PM | Check-out: 11:00 AM",
      details: [
        "Standard check-in begins at 2:00 PM; check-out is by 11:00 AM.",
        "Early check-in from 10:00 AM is subject to room availability upon arrival.",
        "Complimentary secure luggage storage is provided if you arrive before your room is ready.",
        "Late check-out up to 2:00 PM may be arranged on request subject to availability.",
      ],
    },
    {
      topic: "id-requirements",
      title: "Government ID Requirements",
      summary: "Government-issued photo ID with address is mandatory for all guests at check-in.",
      details: [
        "In accordance with Government of India regulations, every adult guest must present a valid government-approved photo ID with address at check-in.",
        "Accepted IDs for Indian citizens: Aadhaar Card, Passport, Driving License, or Voter ID. Note: PAN card is NOT accepted as proof of address.",
        "Foreign nationals must present a valid original Passport along with a valid Indian Visa or OCI card.",
      ],
    },
    {
      topic: "cancellation",
      title: "Cancellation & Modifications",
      summary: "Free cancellation up to 48 hours before check-in on flexible bookings.",
      details: [
        "Cancel or reschedule without any fee up to 48 hours prior to 2:00 PM on your arrival date.",
        "Cancellations made within 48 hours of check-in will incur a charge equal to the first night's room tariff.",
        "No-shows are billed for the full stay amount.",
      ],
    },
    {
      topic: "children-extra-guests",
      title: "Children & Extra Guests",
      summary: "Children under 6 stay complimentary; extra beds available for eligible rooms.",
      details: [
        "Children up to 6 years of age stay complimentary when using existing bedding.",
        "For guests needing extra sleeping arrangements, an extra rollaway bed can be added in the Family Room or Executive Suite for ₹1,500 + taxes per night.",
        "Deluxe King and Premium King rooms accommodate a maximum of 2 adults.",
        "Family Room and Executive Suite accommodate up to 3 adults.",
      ],
    },
    {
      topic: "parking",
      title: "Parking & Vehicles",
      summary: "Complimentary secure on-site parking with valet service.",
      details: [
        "Complimentary covered parking is provided for all resident guests.",
        "24-hour valet parking service is available at the hotel porch.",
        "EV charging points are available on-site for electric vehicles.",
      ],
    },
    {
      topic: "smoking",
      title: "Non-Smoking Policy",
      summary: "The hotel is 100% smoke-free indoors.",
      details: [
        "Smoking and vaping are strictly prohibited in all guest rooms, corridors, and indoor areas.",
        "Designated outdoor smoking areas are available in the open courtyard.",
      ],
    },
  ],
  faq: [
    {
      question: "Is breakfast included?",
      answer:
        "Breakfast is included with the Premium King Room and Executive Suite. For Deluxe King Room and Family Room bookings, breakfast can be added at booking or enjoyed at our all-day dining buffet. Our breakfast buffet features South Indian, North Indian, and continental options.",
    },
    {
      question: "What time is check-in?",
      answer:
        "Check-in begins at 2:00 PM, and check-out is at 11:00 AM. If you arrive earlier, we will gladly store your luggage while your room is readied.",
    },
    {
      question: "Can I get early check-in?",
      answer:
        "Early check-in from 10:00 AM is available subject to room readiness upon arrival. If your room is not ready yet, our front desk team will safely store your luggage and you are welcome to relax in our lounge or courtyard café.",
    },
    {
      question: "Do you have a room for 3 adults?",
      answer:
        "Yes, our Family Room (which features a King bed and a separate single bed) and our Executive Suite can comfortably accommodate up to 3 adults.",
    },
    {
      question: "Is parking available?",
      answer:
        "Yes, we offer complimentary on-site parking with 24-hour valet service and EV charging points for all resident guests.",
    },
    {
      question: "Do you offer airport transfers?",
      answer:
        "Yes, we provide chauffeur-driven airport transfers to and from Kempegowda International Airport (BLR). Transfers can be arranged with the front desk or via this assistant prior to arrival.",
    },
    {
      question: "Is there a swimming pool?",
      answer:
        "Yes, we have an open-air swimming pool located on the terrace level, open daily from 6:00 AM to 9:00 PM.",
    },
    {
      question: "What is the cancellation policy?",
      answer:
        "Flexible reservations can be cancelled or modified free of charge up to 48 hours prior to 2:00 PM on your arrival date. Cancellations made within 48 hours incur a fee equal to the first night's room charge.",
    },
    {
      question: "Can I add an extra bed?",
      answer:
        "Yes, an extra rollaway bed can be arranged in the Family Room or Executive Suite for ₹1,500 + taxes per night. The Deluxe King and Premium King rooms have a maximum capacity of 2 adults.",
    },
    {
      question: "What amenities do you have?",
      answer:
        "The Gulmohar offers an open-air swimming pool, 24/7 fitness centre, high-speed Wi-Fi throughout, all-day dining restaurant, 24-hour room service, complimentary valet parking, business lounge, and airport transfer services.",
    },
  ],
};
