import "dotenv/config";
import mongoose from "mongoose";
import Event from "./models/Event.js";
import { connectDB } from "./config/db.js";

const events = [

  // =====================================================
  // WEDDING
  // =====================================================

  {
    title: "Dream Wedding Celebration",
    category: "Wedding",
    description:
      "Create your perfect wedding with personalized themes, packages, decorations, photography and catering.",
    city: "Chennai",
    venue: "The Grand Courtyard",
    price: 50000,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    capacity: 500,

    features: [
      "Professional Event Planning",
      "Wedding Decoration",
      "Photography",
      "Catering",
      "Music & Entertainment"
    ],

    optionGroups: [
      {
        name: "weddingType",
        label: "Choose Your Wedding Style",
        options: [
          {
            name: "Traditional Wedding",
            description: "Classic Indian wedding with traditional decorations and rituals.",
            price: 0
          },
          {
            name: "Destination Wedding",
            description: "A beautiful destination wedding experience.",
            price: 20000
          },
          {
            name: "Christian Wedding",
            description: "Elegant church-style Christian wedding.",
            price: 10000
          },
          {
            name: "Muslim Wedding",
            description: "Traditional Nikah and elegant wedding setup.",
            price: 10000
          },
          {
            name: "Luxury Wedding",
            description: "Premium luxury wedding experience.",
            price: 40000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Classic",
        price: 50000,
        description: "Perfect for a beautiful traditional wedding.",
        includes: [
          "Wedding Decoration",
          "Professional Photography",
          "Wedding Cake",
          "Basic Catering",
          "DJ & Music",
          "Guest Seating"
        ]
      },
      {
        name: "Premium",
        price: 80000,
        description: "A complete premium wedding experience.",
        includes: [
          "Premium Decoration",
          "Photography & Videography",
          "Premium Wedding Cake",
          "Full Catering",
          "DJ & Live Music",
          "Stage Setup",
          "Guest Seating"
        ]
      },
      {
        name: "Royal",
        price: 150000,
        description: "A luxury wedding designed for unforgettable celebrations.",
        includes: [
          "Luxury Decoration",
          "Cinematic Photography",
          "Premium Wedding Cake",
          "Premium Catering",
          "Live Band",
          "Stage & Lighting",
          "Drone Photography",
          "Wedding Coordinator"
        ]
      }
    ],

    addons: [
      {
        name: "Drone Photography",
        description: "Aerial wedding photography.",
        price: 5000
      },
      {
        name: "Premium Decoration",
        description: "Upgrade to premium floral decoration.",
        price: 10000
      },
      {
        name: "Live Band",
        description: "Professional live music performance.",
        price: 8000
      },
      {
        name: "Luxury Car",
        description: "Luxury wedding arrival vehicle.",
        price: 7000
      }
    ],

    active: true
  },

  // =====================================================
  // BIRTHDAY
  // =====================================================

  {
    title: "Luxury Birthday Celebration",
    category: "Birthday",
    description:
      "Celebrate your birthday with customized themes, cakes, decorations, food and entertainment.",
    city: "Coimbatore",
    venue: "Dream Celebration Hall",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    capacity: 200,

    features: [
      "Birthday Decoration",
      "Custom Cake",
      "Food",
      "Photography",
      "Music"
    ],

    optionGroups: [
      {
        name: "birthdayType",
        label: "Choose Birthday Style",
        options: [
          {
            name: "Kids Birthday",
            description: "Colorful birthday party for children.",
            price: 0
          },
          {
            name: "Adult Birthday",
            description: "Elegant birthday celebration.",
            price: 3000
          },
          {
            name: "Surprise Birthday",
            description: "Special surprise birthday arrangement.",
            price: 5000
          },
          {
            name: "Theme Birthday",
            description: "Customized movie, cartoon or personal theme.",
            price: 7000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Basic",
        price: 15000,
        description: "Simple and beautiful birthday celebration.",
        includes: [
          "Balloon Decoration",
          "Birthday Cake",
          "Basic Food",
          "Music",
          "Photography"
        ]
      },
      {
        name: "Premium",
        price: 25000,
        description: "A complete premium birthday package.",
        includes: [
          "Theme Decoration",
          "Premium Cake",
          "Catering",
          "Photography",
          "DJ",
          "Party Games"
        ]
      },
      {
        name: "Ultimate",
        price: 40000,
        description: "Everything you need for a grand birthday.",
        includes: [
          "Luxury Decoration",
          "Custom Designer Cake",
          "Premium Catering",
          "Professional Photography",
          "DJ",
          "Live Entertainment",
          "Return Gifts"
        ]
      }
    ],

    addons: [
      {
        name: "Magic Show",
        description: "Professional magician.",
        price: 5000
      },
      {
        name: "DJ",
        description: "Professional DJ.",
        price: 4000
      },
      {
        name: "Return Gifts",
        description: "Customized return gifts.",
        price: 3000
      },
      {
        name: "Character Theme",
        description: "Popular cartoon/movie character setup.",
        price: 5000
      }
    ],

    active: true
  },

  // =====================================================
  // ENGAGEMENT
  // =====================================================

  {
    title: "Elegant Engagement Evening",
    category: "Engagement",
    description:
      "Celebrate your engagement with elegant decorations, photography, food and entertainment.",
    city: "Chennai",
    venue: "Green Garden Resort",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    capacity: 250,

    features: [
      "Engagement Decoration",
      "Photography",
      "Catering",
      "Music",
      "Stage Setup"
    ],

    optionGroups: [
      {
        name: "engagementType",
        label: "Choose Engagement Style",
        options: [
          {
            name: "Traditional",
            description: "Traditional engagement ceremony.",
            price: 0
          },
          {
            name: "Garden",
            description: "Beautiful outdoor engagement.",
            price: 5000
          },
          {
            name: "Luxury",
            description: "Premium engagement experience.",
            price: 15000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Classic",
        price: 30000,
        includes: [
          "Decoration",
          "Photography",
          "Catering",
          "Music"
        ]
      },
      {
        name: "Premium",
        price: 50000,
        includes: [
          "Premium Decoration",
          "Photography & Video",
          "Premium Catering",
          "DJ",
          "Stage Setup"
        ]
      },
      {
        name: "Royal",
        price: 75000,
        includes: [
          "Luxury Decoration",
          "Cinematic Photography",
          "Premium Catering",
          "Live Music",
          "Stage & Lighting",
          "Drone Photography"
        ]
      }
    ],

    addons: [
      {
        name: "Drone Photography",
        price: 5000
      },
      {
        name: "Live Music",
        price: 7000
      },
      {
        name: "Premium Flowers",
        price: 5000
      }
    ],

    active: true
  },

  // =====================================================
  // BABY SHOWER
  // =====================================================

  {
    title: "Beautiful Baby Shower",
    category: "Baby Shower",
    description:
      "A beautiful baby shower celebration with customized themes, food, games and decorations.",
    city: "Bangalore",
    venue: "Blossom Banquet Hall",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
    capacity: 150,

    features: [
      "Theme Decoration",
      "Baby Shower Cake",
      "Catering",
      "Games",
      "Photography"
    ],

    optionGroups: [
      {
        name: "babyShowerType",
        label: "Choose Baby Shower Style",
        options: [
          {
            name: "Traditional",
            description: "Traditional baby shower ceremony.",
            price: 0
          },
          {
            name: "Floral",
            description: "Beautiful floral themed celebration.",
            price: 5000
          },
          {
            name: "Royal",
            description: "Premium royal baby shower.",
            price: 10000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Classic",
        price: 20000,
        includes: [
          "Decoration",
          "Cake",
          "Catering",
          "Games",
          "Photography"
        ]
      },
      {
        name: "Premium",
        price: 35000,
        includes: [
          "Premium Decoration",
          "Designer Cake",
          "Premium Catering",
          "Photography",
          "Games",
          "Return Gifts"
        ]
      },
      {
        name: "Royal",
        price: 50000,
        includes: [
          "Luxury Decoration",
          "Designer Cake",
          "Premium Catering",
          "Professional Photography",
          "Entertainment",
          "Return Gifts"
        ]
      }
    ],

    addons: [
      {
        name: "Return Gifts",
        price: 3000
      },
      {
        name: "Professional Photographer",
        price: 5000
      },
      {
        name: "Premium Floral Setup",
        price: 7000
      }
    ],

    active: true
  },

  // =====================================================
  // CORPORATE
  // =====================================================

  {
    title: "Modern Corporate Summit",
    category: "Corporate",
    description:
      "Professional corporate event management for conferences, seminars, launches and business meetings.",
    city: "Bangalore",
    venue: "Business Convention Center",
    price: 40000,
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    capacity: 500,

    features: [
      "Stage Setup",
      "Projector",
      "Professional Audio",
      "Seating",
      "Catering"
    ],

    optionGroups: [
      {
        name: "corporateType",
        label: "Choose Corporate Event",
        options: [
          {
            name: "Conference",
            price: 0
          },
          {
            name: "Seminar",
            price: 5000
          },
          {
            name: "Product Launch",
            price: 15000
          },
          {
            name: "Team Building",
            price: 10000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Business",
        price: 40000,
        includes: [
          "Stage",
          "Projector",
          "Sound System",
          "Seating",
          "Basic Catering"
        ]
      },
      {
        name: "Professional",
        price: 75000,
        includes: [
          "Premium Stage",
          "LED Screen",
          "Professional Sound",
          "Premium Catering",
          "Registration Desk",
          "Photography"
        ]
      },
      {
        name: "Enterprise",
        price: 120000,
        includes: [
          "Luxury Stage",
          "LED Wall",
          "Professional Audio",
          "Premium Catering",
          "Photography & Video",
          "Event Staff",
          "Live Streaming"
        ]
      }
    ],

    addons: [
      {
        name: "Live Streaming",
        price: 10000
      },
      {
        name: "Professional Photography",
        price: 8000
      },
      {
        name: "LED Wall",
        price: 15000
      }
    ],

    active: true
  },

  // =====================================================
  // GRADUATION
  // =====================================================

  {
    title: "Grand Graduation Party",
    category: "Graduation",
    description:
      "Celebrate your graduation with stage decoration, music, food and photography.",
    city: "Coimbatore",
    venue: "Celebration Arena",
    price: 20000,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
    capacity: 300,

    features: [
      "Stage Decoration",
      "Photography",
      "Food",
      "Music",
      "Graduation Setup"
    ],

    optionGroups: [
      {
        name: "graduationType",
        label: "Choose Graduation Style",
        options: [
          {
            name: "College Graduation",
            price: 0
          },
          {
            name: "School Graduation",
            price: 3000
          },
          {
            name: "Grand Party",
            price: 8000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Classic",
        price: 20000,
        includes: [
          "Stage",
          "Decoration",
          "Food",
          "Photography"
        ]
      },
      {
        name: "Premium",
        price: 35000,
        includes: [
          "Premium Stage",
          "Decoration",
          "Catering",
          "Photography",
          "DJ"
        ]
      },
      {
        name: "Ultimate",
        price: 50000,
        includes: [
          "Luxury Stage",
          "LED Screen",
          "Premium Catering",
          "Professional Photography",
          "DJ",
          "Entertainment"
        ]
      }
    ],

    addons: [
      {
        name: "DJ",
        price: 5000
      },
      {
        name: "LED Screen",
        price: 7000
      }
    ],

    active: true
  },

  // =====================================================
  // ANNIVERSARY
  // =====================================================

  {
    title: "Romantic Anniversary Night",
    category: "Anniversary",
    description:
      "Celebrate your special anniversary with a romantic and memorable experience.",
    city: "Chennai",
    venue: "Moonlight Garden",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    capacity: 100,

    features: [
      "Romantic Decoration",
      "Dinner",
      "Photography",
      "Flowers",
      "Music"
    ],

    optionGroups: [
      {
        name: "anniversaryType",
        label: "Choose Anniversary Style",
        options: [
          {
            name: "Romantic",
            price: 0
          },
          {
            name: "Silver Jubilee",
            price: 5000
          },
          {
            name: "Golden Jubilee",
            price: 10000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Romantic",
        price: 25000,
        includes: [
          "Candlelight Decoration",
          "Dinner",
          "Flowers",
          "Photography"
        ]
      },
      {
        name: "Premium",
        price: 40000,
        includes: [
          "Premium Decoration",
          "Premium Dinner",
          "Photography",
          "Live Music",
          "Flowers"
        ]
      },
      {
        name: "Luxury",
        price: 60000,
        includes: [
          "Luxury Decoration",
          "Premium Dinner",
          "Cinematic Photography",
          "Live Music",
          "Luxury Flowers",
          "Private Setup"
        ]
      }
    ],

    addons: [
      {
        name: "Live Music",
        price: 5000
      },
      {
        name: "Premium Flowers",
        price: 3000
      },
      {
        name: "Candlelight Dinner",
        price: 5000
      }
    ],

    active: true
  },

  // =====================================================
  // CONCERT
  // =====================================================

  {
    title: "Dream Music Concert",
    category: "Concert",
    description:
      "A complete concert package with stage, sound, lighting, security and professional event management.",
    city: "Bangalore",
    venue: "Open Air Arena",
    price: 100000,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    capacity: 1500,

    features: [
      "Large Stage",
      "Professional Sound",
      "Lighting",
      "Security",
      "Event Management"
    ],

    optionGroups: [
      {
        name: "concertType",
        label: "Choose Concert Type",
        options: [
          {
            name: "Music Concert",
            price: 0
          },
          {
            name: "DJ Night",
            price: 20000
          },
          {
            name: "College Fest",
            price: 15000
          },
          {
            name: "Festival",
            price: 30000
          }
        ]
      }
    ],

    packages: [
      {
        name: "Standard",
        price: 100000,
        includes: [
          "Stage",
          "Sound System",
          "Basic Lighting",
          "Security"
        ]
      },
      {
        name: "Premium",
        price: 175000,
        includes: [
          "Large Stage",
          "Professional Sound",
          "Premium Lighting",
          "Security",
          "DJ",
          "Event Staff"
        ]
      },
      {
        name: "Mega",
        price: 250000,
        includes: [
          "Large Stage",
          "Premium Sound",
          "Laser Lighting",
          "Security",
          "Live Band",
          "Professional Event Management",
          "Live Streaming"
        ]
      }
    ],

    addons: [
      {
        name: "Live Band",
        price: 25000
      },
      {
        name: "Laser Lighting",
        price: 15000
      },
      {
        name: "Live Streaming",
        price: 10000
      }
    ],

    active: true
  }

];

const seedEvents = async () => {
  try {
    await connectDB();

    await Event.deleteMany({});

    await Event.insertMany(events);

    console.log(
      `✅ ${events.length} customized Dream Day events inserted successfully.`
    );

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding events:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedEvents();