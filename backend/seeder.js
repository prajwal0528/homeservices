const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Service = require("./models/Service");
const FAQ = require("./models/FAQ");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected for seeding...");
};

const services = [
  // ─── Cleaning Services ───
  {
    name: "House Cleaning (1 hr)",
    category: "Cleaning Services",
    subcategory: "House cleaning",
    description:
      "Professional house cleaning covering living areas, bedrooms and common spaces. Ideal for daily/weekly maintenance.",
    price: 99,
    originalPrice: 245,
    duration: "1 hour",
    rating: 4.8,
    totalReviews: 270000,
    isBestseller: true,
    tags: ["cleaning", "house", "daily", "instant"],
    features: [
      "Trained professionals",
      "Eco-friendly products",
      "Insured service",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop",
  },
  {
    name: "House Cleaning (1.5 hr)",
    category: "Cleaning Services",
    subcategory: "House cleaning",
    description:
      "Extended house cleaning session covering more areas thoroughly.",
    price: 147,
    originalPrice: 368,
    duration: "1.5 hours",
    rating: 4.8,
    totalReviews: 215000,
    isBestseller: true,
    tags: ["cleaning", "house"],
    features: ["Trained professionals", "Eco-friendly products"],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
  },
  {
    name: "House Cleaning (2 hr)",
    category: "Cleaning Services",
    subcategory: "House cleaning",
    description: "Comprehensive 2-hour house cleaning for larger homes.",
    price: 215,
    originalPrice: 450,
    duration: "2 hours",
    rating: 4.7,
    totalReviews: 180000,
    tags: ["cleaning", "house", "deep"],
    features: ["Trained professionals", "Eco-friendly products"],
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop",
  },
  {
    name: "Deep Cleaning (2BHK)",
    category: "Cleaning Services",
    subcategory: "Deep cleaning",
    description:
      "Complete deep cleaning of 2BHK flat. Scrubbing walls, tiles, fans, lights, inside kitchen appliances and more.",
    price: 1499,
    originalPrice: 2999,
    duration: "6-8 hours",
    rating: 4.9,
    totalReviews: 95000,
    isBestseller: true,
    tags: ["deep cleaning", "2bhk", "thorough"],
    features: [
      "Floor scrubbing",
      "Bathroom deep clean",
      "Kitchen deep clean",
      "Balcony cleaning",
    ],
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop",
  },
  {
    name: "Deep Cleaning (3BHK)",
    category: "Cleaning Services",
    subcategory: "Deep cleaning",
    description:
      "Complete deep cleaning of 3BHK flat including all rooms, kitchen, bathrooms.",
    price: 1999,
    originalPrice: 3999,
    duration: "8-10 hours",
    rating: 4.8,
    totalReviews: 72000,
    tags: ["deep cleaning", "3bhk"],
    features: [
      "Full home deep clean",
      "Appliance cleaning",
      "Bathroom disinfection",
    ],
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop",
  },
  {
    name: "Kitchen Deep Cleaning",
    category: "Cleaning Services",
    subcategory: "Kitchen & bathroom cleaning",
    description:
      "Expert kitchen cleaning — chimney, tiles, burner, countertops, sink, and cabinet exteriors.",
    price: 599,
    originalPrice: 999,
    duration: "2-3 hours",
    rating: 4.8,
    totalReviews: 120000,
    isBestseller: true,
    tags: ["kitchen", "cleaning", "deep"],
    features: [
      "Chimney cleaning",
      "Tile scrubbing",
      "Burner servicing",
      "Sink disinfection",
    ],
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
  },
  {
    name: "Bathroom Deep Cleaning",
    category: "Cleaning Services",
    subcategory: "Kitchen & bathroom cleaning",
    description:
      "Full bathroom disinfection and deep clean — tiles, toilet, basin, shower, mirrors.",
    price: 399,
    originalPrice: 699,
    duration: "1-2 hours",
    rating: 4.7,
    totalReviews: 98000,
    tags: ["bathroom", "cleaning", "disinfection"],
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop",
  },
  {
    name: "Sofa Cleaning",
    category: "Cleaning Services",
    subcategory: "Sofa & carpet cleaning",
    description:
      "Professional sofa shampooing and steam cleaning to remove stains, odors and allergens.",
    price: 599,
    originalPrice: 999,
    duration: "1-2 hours",
    rating: 4.8,
    totalReviews: 65000,
    tags: ["sofa", "upholstery", "carpet"],
    features: [
      "Shampoo cleaning",
      "Steam treatment",
      "Stain removal",
      "Deodorizing",
    ],
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop",
  },
  {
    name: "Carpet / Rug Cleaning",
    category: "Cleaning Services",
    subcategory: "Sofa & carpet cleaning",
    description:
      "Deep carpet cleaning using professional-grade shampooing and steam.",
    price: 499,
    originalPrice: 899,
    duration: "1-2 hours",
    rating: 4.7,
    totalReviews: 43000,
    tags: ["carpet", "rug", "cleaning"],
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&auto=format&fit=crop",
  },

  // ─── Repair & Maintenance ───
  {
    name: "Plumbing — Leak Fix",
    category: "Repair & Maintenance",
    subcategory: "Plumbing",
    description:
      "Fast leak repair for pipes, taps, showers, and cisterns. Experienced plumbers reach you quickly.",
    price: 199,
    originalPrice: 399,
    duration: "30-60 min",
    rating: 4.7,
    totalReviews: 55000,
    tags: ["plumbing", "leak", "repair"],
    features: ["Same-day service", "Genuine parts", "30-day warranty"],
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop",
  },
  {
    name: "Pipe Repair / Replacement",
    category: "Repair & Maintenance",
    subcategory: "Plumbing",
    description:
      "Pipe inspection, repair or full replacement by licensed plumbers.",
    price: 349,
    originalPrice: 599,
    duration: "1-2 hours",
    rating: 4.6,
    totalReviews: 38000,
    tags: ["plumbing", "pipe", "repair"],
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop",
  },
  {
    name: "Electrical Wiring Work",
    category: "Repair & Maintenance",
    subcategory: "Electrical work",
    description:
      "Safe and professional electrical wiring, switchboard repair, and installation by certified electricians.",
    price: 299,
    originalPrice: 599,
    duration: "1-2 hours",
    rating: 4.8,
    totalReviews: 48000,
    tags: ["electrical", "wiring", "repair"],
    features: ["Certified electrician", "Safety assured", "30-day warranty"],
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop",
  },
  {
    name: "Fan Repair / Installation",
    category: "Repair & Maintenance",
    subcategory: "Electrical work",
    description:
      "Ceiling fan repair, replacement or new installation by experts.",
    price: 199,
    originalPrice: 399,
    duration: "30-60 min",
    rating: 4.7,
    totalReviews: 62000,
    tags: ["fan", "electrical", "installation"],
    image:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop",
  },
  {
    name: "AC Service (Split)",
    category: "Repair & Maintenance",
    subcategory: "AC & refrigerator repair",
    description:
      "Split AC servicing — filter cleaning, coil cleaning, gas check, performance optimization.",
    price: 399,
    originalPrice: 699,
    duration: "1-2 hours",
    rating: 4.8,
    totalReviews: 110000,
    isBestseller: true,
    tags: ["ac", "air conditioner", "service", "repair"],
    features: [
      "Filter cleaning",
      "Coil cleaning",
      "Gas level check",
      "Performance test",
    ],
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&auto=format&fit=crop",
  },
  {
    name: "Refrigerator Repair",
    category: "Repair & Maintenance",
    subcategory: "AC & refrigerator repair",
    description:
      "All brands refrigerator diagnosis and repair — cooling issues, compressor, thermostat.",
    price: 299,
    originalPrice: 599,
    duration: "1-2 hours",
    rating: 4.6,
    totalReviews: 32000,
    tags: ["fridge", "refrigerator", "repair", "cooling"],
    image:
      "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop",
  },
  {
    name: "Washing Machine Repair",
    category: "Repair & Maintenance",
    subcategory: "Appliance servicing",
    description:
      "Front-load and top-load washing machine repair — drum, motor, electronics, drainage.",
    price: 349,
    originalPrice: 649,
    duration: "1-2 hours",
    rating: 4.7,
    totalReviews: 41000,
    tags: ["washing machine", "appliance", "repair"],
    image:
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop",
  },
  {
    name: "Microwave / Oven Repair",
    category: "Repair & Maintenance",
    subcategory: "Appliance servicing",
    description: "Microwave and OTG oven repair and servicing for all brands.",
    price: 249,
    originalPrice: 499,
    duration: "30-60 min",
    rating: 4.6,
    totalReviews: 21000,
    tags: ["microwave", "oven", "appliance", "repair"],
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop",
  },

  // ─── Home Improvement ───
  {
    name: "Wall Painting (1 Room)",
    category: "Home Improvement",
    subcategory: "Painting & polishing",
    description:
      "Professional wall painting for one room. Includes wall prep, primer and 2 coats of paint.",
    price: 1499,
    originalPrice: 2499,
    duration: "1-2 days",
    rating: 4.8,
    totalReviews: 28000,
    tags: ["painting", "wall", "room", "interior"],
    features: [
      "Wall preparation",
      "Primer coat",
      "2 finish coats",
      "Dust protection",
    ],
    image:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&auto=format&fit=crop",
  },
  {
    name: "Full Home Painting (2BHK)",
    category: "Home Improvement",
    subcategory: "Painting & polishing",
    description:
      "Complete interior painting for 2BHK — all rooms, kitchen, bathroom walls.",
    price: 8999,
    originalPrice: 14999,
    duration: "3-5 days",
    rating: 4.8,
    totalReviews: 18000,
    isBestseller: true,
    tags: ["painting", "home", "2bhk"],
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop",
  },
  {
    name: "Furniture Repair (Carpentry)",
    category: "Home Improvement",
    subcategory: "Carpentry",
    description:
      "Wardrobe, table, chair and general furniture repair, hinges, handles, polish.",
    price: 499,
    originalPrice: 899,
    duration: "1-2 hours",
    rating: 4.7,
    totalReviews: 15000,
    tags: ["carpentry", "furniture", "repair"],
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop",
  },
  {
    name: "Modular Kitchen Setup",
    category: "Home Improvement",
    subcategory: "Modular kitchen setup",
    description:
      "Professional modular kitchen assembly, installation and customization.",
    price: 4999,
    originalPrice: 8999,
    duration: "2-3 days",
    rating: 4.9,
    totalReviews: 8000,
    tags: ["kitchen", "modular", "installation"],
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
  },

  // ─── Outdoor Services ───
  {
    name: "Pest Control (1BHK)",
    category: "Outdoor Services",
    subcategory: "Pest control",
    description:
      "Complete pest control treatment — cockroaches, ants, spiders, mosquitoes. Safe for children and pets.",
    price: 799,
    originalPrice: 1499,
    duration: "2-3 hours",
    rating: 4.8,
    totalReviews: 52000,
    isBestseller: true,
    tags: ["pest control", "cockroach", "mosquito"],
    features: ["Child-safe chemicals", "90-day guarantee", "All pests covered"],
    image:
      "https://images.unsplash.com/photo-1632392683452-5d77ce8d8c29?w=600&auto=format&fit=crop",
  },
  {
    name: "Pest Control (2BHK)",
    category: "Outdoor Services",
    subcategory: "Pest control",
    description: "Full pest control for 2BHK flat — all rooms and kitchen.",
    price: 999,
    originalPrice: 1799,
    duration: "2-3 hours",
    rating: 4.8,
    totalReviews: 44000,
    tags: ["pest control", "2bhk"],
    image:
      "https://images.unsplash.com/photo-1626208884786-18b0d1dca5c7?w=600&auto=format&fit=crop",
  },
  {
    name: "Garden Maintenance",
    category: "Outdoor Services",
    subcategory: "Gardening & landscaping",
    description:
      "Professional garden care — pruning, weeding, watering, fertilizing, and landscape maintenance.",
    price: 599,
    originalPrice: 999,
    duration: "2-3 hours",
    rating: 4.7,
    totalReviews: 12000,
    tags: ["garden", "landscaping", "plants"],
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop",
  },
  {
    name: "Water Tank Cleaning",
    category: "Outdoor Services",
    subcategory: "Water tank cleaning",
    description:
      "Professional overhead and underground water tank cleaning and disinfection.",
    price: 799,
    originalPrice: 1299,
    duration: "2-4 hours",
    rating: 4.8,
    totalReviews: 22000,
    tags: ["water tank", "cleaning", "disinfection"],
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600&auto=format&fit=crop",
  },

  // ─── Personal & Care Services ───
  {
    name: "Babysitting (per day)",
    category: "Personal & Care Services",
    subcategory: "Babysitting",
    description:
      "Trusted and verified babysitter for infants and toddlers. Background-checked professionals.",
    price: 799,
    originalPrice: 1199,
    duration: "8 hours",
    rating: 4.9,
    totalReviews: 8500,
    tags: ["babysitting", "childcare", "nanny"],
    features: [
      "Background verified",
      "Child development trained",
      "First aid certified",
    ],
    image:
      "https://images.unsplash.com/photo-1587915598011-cc4ab9e2de17?w=600&auto=format&fit=crop",
  },
  {
    name: "Elder Care (per day)",
    category: "Personal & Care Services",
    subcategory: "Elder care",
    description:
      "Dedicated elder care assistant — medication, mobility support, companionship, meals.",
    price: 999,
    originalPrice: 1499,
    duration: "8 hours",
    rating: 4.9,
    totalReviews: 6200,
    tags: ["elder care", "senior", "nursing"],
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop",
  },
  {
    name: "Home Nursing",
    category: "Personal & Care Services",
    subcategory: "Home nursing",
    description:
      "Qualified nurse for post-surgery care, IV drip, wound dressing, and daily patient monitoring.",
    price: 1499,
    originalPrice: 2499,
    duration: "8 hours",
    rating: 4.9,
    totalReviews: 4800,
    tags: ["nurse", "nursing", "medical", "care"],
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop",
  },

  // ─── Convenience Services ───
  {
    name: "Home Chef (per meal)",
    category: "Convenience Services",
    subcategory: "Cooking services",
    description:
      "Personal home chef cooks fresh, hygienic meals at your home — breakfast, lunch or dinner.",
    price: 299,
    originalPrice: 499,
    duration: "1-2 hours",
    rating: 4.8,
    totalReviews: 19000,
    isBestseller: true,
    tags: ["chef", "cooking", "food", "meal"],
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
  },
  {
    name: "Home Chef (full day)",
    category: "Convenience Services",
    subcategory: "Cooking services",
    description:
      "Full-day home chef service for parties, events, or regular family cooking.",
    price: 999,
    originalPrice: 1799,
    duration: "8 hours",
    rating: 4.8,
    totalReviews: 9500,
    tags: ["chef", "cooking", "food", "party"],
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop",
  },
  {
    name: "Laundry & Ironing",
    category: "Convenience Services",
    subcategory: "Laundry & ironing",
    description:
      "Professional laundry and ironing service — clothes collected, cleaned, pressed and delivered.",
    price: 299,
    originalPrice: 499,
    duration: "Same-day/Next-day",
    rating: 4.7,
    totalReviews: 31000,
    tags: ["laundry", "ironing", "clothes", "wash"],
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop",
  },

  // ─── Smart Home & Tech ───
  {
    name: "CCTV Camera Installation",
    category: "Smart Home & Tech Services",
    subcategory: "CCTV installation",
    description:
      "Professional CCTV installation — 1 to 8 cameras, DVR setup, mobile app configuration.",
    price: 2999,
    originalPrice: 4999,
    duration: "3-5 hours",
    rating: 4.8,
    totalReviews: 14000,
    tags: ["cctv", "camera", "security", "installation"],
    features: [
      "Site survey included",
      "All brands supported",
      "Mobile app setup",
      "1-year warranty",
    ],
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
  },
  {
    name: "Wi-Fi Setup & Troubleshoot",
    category: "Smart Home & Tech Services",
    subcategory: "Wi-Fi setup",
    description:
      "Home Wi-Fi router setup, range extender installation, and network optimization.",
    price: 499,
    originalPrice: 899,
    duration: "1-2 hours",
    rating: 4.7,
    totalReviews: 18000,
    tags: ["wifi", "internet", "router", "network"],
    image:
      "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&auto=format&fit=crop",
  },
  {
    name: "Smart Home Automation",
    category: "Smart Home & Tech Services",
    subcategory: "Smart home automation",
    description:
      "Automate lights, fans, locks and appliances with smart switches and voice control setup.",
    price: 4999,
    originalPrice: 8999,
    duration: "1 day",
    rating: 4.9,
    totalReviews: 3200,
    tags: ["smart home", "automation", "alexa", "google home"],
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop",
  },

  // ─── Beauty Services ───
  {
    name: "Elysian Pina Colada Fruit Cleanup",
    category: "Personal & Care Services",
    subcategory: "Face care cleanups",
    description:
      "Instant glow with flavoured cleanup using natural ingredients. Deep cleanse, scrub, massage, mask.",
    price: 699,
    originalPrice: 999,
    duration: "45 min",
    rating: 4.8,
    totalReviews: 210000,
    isBestseller: true,
    tags: ["cleanup", "face", "beauty", "skin", "glow"],
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop",
  },
  {
    name: "Sara Fruit Cleanup",
    category: "Personal & Care Services",
    subcategory: "Face care cleanups",
    description:
      "Fruit-based face cleanup for brightening and nourishing skin. Professional at-home beauty.",
    price: 799,
    originalPrice: 1099,
    duration: "45 min",
    rating: 4.8,
    totalReviews: 192000,
    tags: ["cleanup", "face", "beauty", "skin"],
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format&fit=crop",
  },
  {
    name: "Men's Haircut at Home",
    category: "Personal & Care Services",
    subcategory: "Men's grooming",
    description:
      "Professional haircut at home — all styles. Includes wash and basic styling.",
    price: 199,
    originalPrice: 349,
    duration: "30-45 min",
    rating: 4.8,
    totalReviews: 88000,
    tags: ["haircut", "men", "grooming", "barber"],
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop",
  },
  {
    name: "Men's Shave & Trim",
    category: "Personal & Care Services",
    subcategory: "Men's grooming",
    description: "Expert clean shave and beard trim/styling at home.",
    price: 149,
    originalPrice: 249,
    duration: "20-30 min",
    rating: 4.7,
    totalReviews: 62000,
    tags: ["shave", "beard", "men", "grooming"],
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop",
  },
];

const faqs = [
  {
    question: "How quickly can a professional arrive?",
    answer:
      "For Insta Help services, professionals arrive within 10 minutes. For scheduled services, you can choose any available time slot.",
    category: "Booking",
    order: 1,
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept UPI (Google Pay, PhonePe, Paytm, Amazon Pay) and Cash on Delivery/after service. Online payments are processed securely.",
    category: "Payment",
    order: 2,
  },
  {
    question: "Are your professionals verified and trained?",
    answer:
      "Yes! All our service professionals undergo thorough background verification, skill testing, and training before onboarding.",
    category: "Safety",
    order: 3,
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes. You can cancel or reschedule any booking from your dashboard up to 1 hour before the scheduled time.",
    category: "Booking",
    order: 4,
  },
  {
    question: "Is there a service guarantee?",
    answer:
      "Absolutely. If you are not satisfied, we will redo the service for free or offer a full refund within 24 hours of service completion.",
    category: "Service Quality",
    order: 5,
  },
  {
    question: "Do I need to provide cleaning equipment?",
    answer:
      "No. Our professionals bring all necessary equipment and eco-friendly cleaning supplies. You don't need to provide anything.",
    category: "Service Quality",
    order: 6,
  },
  {
    question: "How can I track my booking status?",
    answer:
      "You can track your booking in real-time from your dashboard. You will also receive email notifications for every status update.",
    category: "Booking",
    order: 7,
  },
  {
    question: "What areas do you service?",
    answer:
      "We currently operate in major Indian cities including Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, Kolkata and more. Enter your pincode to check availability.",
    category: "General",
    order: 8,
  },
  {
    question: "How do I rate a completed service?",
    answer:
      'After your service is marked "Completed", you will see an option in your booking details to rate and write a review.',
    category: "Feedback",
    order: 9,
  },
  {
    question: "What if the professional doesn't show up?",
    answer:
      "In the rare event of a no-show, please contact us immediately. We'll either send a replacement within 30 minutes or fully refund your booking.",
    category: "Safety",
    order: 10,
  },
  {
    question: "Are deep cleaning chemicals safe for children and pets?",
    answer:
      "Yes. We use certified eco-friendly, non-toxic products safe for children, elderly, and pets. Our team takes precautions during and after service.",
    category: "Safety",
    order: 11,
  },
  {
    question: "How do multi-day packages work?",
    answer:
      "Multi-day packages allow you to book recurring services (daily, weekly, or custom). You save more with longer packages and get the same professional each visit.",
    category: "Booking",
    order: 12,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Service.deleteMany({});
    await FAQ.deleteMany({});
    console.log("🗑️  Cleared existing services and FAQs");

    // Insert services
    await Service.insertMany(services);
    console.log(`✅ Inserted ${services.length} services`);

    // Insert FAQs
    await FAQ.insertMany(faqs);
    console.log(`✅ Inserted ${faqs.length} FAQs`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("📌 Admin credentials: username=admin | password=admin@123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
