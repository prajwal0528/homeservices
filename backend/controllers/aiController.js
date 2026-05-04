const axios = require("axios");

const WEBUI_BASE_URL =
  process.env.WEBUI_BASE_URL || "https://chat.ivislabs.in/api";
const API_KEY = process.env.API_KEY || "sk-44371278273c49fc97847b5e5166bca1";
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "llama3.2-vision:latest";

// helper — shared axios call to your LLM endpoint
const callLLM = async ({
  system,
  messages,
  max_tokens = 500,
  temperature = 0.4,
}) => {
  const payload = {
    model: DEFAULT_MODEL,
    messages: system
      ? [{ role: "system", content: system }, ...messages]
      : messages,
    max_tokens,
    temperature,
  };

  const response = await axios.post(
    `${WEBUI_BASE_URL}/chat/completions`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0].message.content.trim();
};

// @desc    AI Service Recommendation
// @route   POST /api/ai/recommend
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const { userPreferences, searchHistory, previousBookings } = req.body;
    const userName = req.user?.name || "User";

    const prompt = `You are a home services recommendation AI. Based on this user data, provide personalized service recommendations.

User: ${userName}
Preferences: ${userPreferences || "Not specified"}
Search history: ${searchHistory?.join(", ") || "None"}
Previous bookings: ${previousBookings?.join(", ") || "None"}

Available service categories:
1. Cleaning Services (House cleaning, Deep cleaning, Kitchen cleaning, Sofa cleaning)
2. Repair & Maintenance (Plumbing, Electrical, AC repair, Appliance servicing)
3. Home Improvement (Painting, Carpentry, Interior design, Modular kitchen)
4. Outdoor Services (Gardening, Pest control, Water tank cleaning)
5. Personal & Care Services (Babysitting, Elder care, Home nursing)
6. Convenience Services (Cooking/home chef, Laundry, Grocery delivery)
7. Smart Home & Tech Services (CCTV, Wi-Fi setup, Smart home automation)

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "recommendations": [
    {
      "category": "Category Name",
      "service": "Specific Service Name",
      "reason": "Why this is recommended for the user",
      "priority": "high/medium/low",
      "estimatedPrice": "₹XXX - ₹XXX"
    }
  ],
  "personalizedMessage": "A friendly personalized message for the user",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const rawText = await callLLM({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    let result;
    try {
      result = JSON.parse(rawText.trim());
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error("Could not parse AI response");
    }

    res.json({ success: true, ...result });
  } catch (error) {
    console.error(
      "AI recommendation error:",
      error.response?.data || error.message,
    );
    res.json({
      success: true,
      recommendations: [
        {
          category: "Cleaning Services",
          service: "House Cleaning",
          reason: "Most popular service among users",
          priority: "high",
          estimatedPrice: "₹99 - ₹299",
        },
        {
          category: "Repair & Maintenance",
          service: "AC Service",
          reason: "Seasonal maintenance is important",
          priority: "medium",
          estimatedPrice: "₹299 - ₹599",
        },
        {
          category: "Smart Home & Tech Services",
          service: "Wi-Fi Setup",
          reason: "Improve your home connectivity",
          priority: "low",
          estimatedPrice: "₹499 - ₹999",
        },
      ],
      personalizedMessage: `Welcome ${req.user?.name || "there"}! Here are some services we think you'd love.`,
      tips: [
        "Book early morning slots for best availability",
        "Bundle services for extra savings",
        "Check our Super Saver Packs for discounts",
      ],
    });
  }
};

// @desc    AI Chat Assistant
// @route   POST /api/ai/chat
// @access  Public
exports.chatAssistant = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const systemPrompt = `You are HomeBot, a friendly and helpful AI assistant for HomeServices - a home services booking platform in India.

You help users with:
- Finding the right home services (cleaning, repair, beauty, grooming, etc.)
- Explaining service details and pricing
- Booking guidance
- Payment information (UPI, Cash on Delivery)
- Troubleshooting common home issues
- Recommending service packages

Services available:
🏠 Cleaning: House cleaning (₹99-₹399), Deep cleaning (₹999-₹2999), Kitchen cleaning (₹299-₹599)
🔧 Repair: Plumbing (₹199-₹599), Electrical (₹299-₹799), AC service (₹299-₹699)
🎨 Home Improvement: Painting (varies by room), Carpentry (₹499+)
🌿 Outdoor: Pest control (₹799-₹1999), Gardening (₹399+)
💅 Beauty: Face cleanup (₹699+), Hair services (₹299+)
✂️ Grooming: Men's haircut (₹199+), Shave (₹149+)
🍳 Convenience: Home chef (₹599/day), Laundry (₹299+)
📱 Tech: CCTV (₹2999+), Wi-Fi setup (₹499+)

Payment: UPI (Google Pay, PhonePe, Paytm, Amazon Pay) or Cash on Delivery
Booking: Select date/time slot, usually arrives within 10 minutes for instant booking.

Keep responses concise, helpful, and friendly. Use emojis occasionally. Always encourage booking when relevant.`;

    const messages = [
      ...conversationHistory.slice(-10),
      { role: "user", content: message.trim() },
    ];

    const reply = await callLLM({
      system: systemPrompt,
      messages,
      max_tokens: 500,
    });

    res.json({ success: true, reply, role: "assistant" });
  } catch (error) {
    console.error("AI chat error:", error.response?.data || error.message);
    res.json({
      success: true,
      reply:
        "Hi! I'm HomeBot 🤖 I'm having a little trouble connecting right now, but I'm here to help! You can browse our services above or call our support for immediate assistance.",
      role: "assistant",
    });
  }
};

// @desc    AI Smart Search / Filtering
// @route   POST /api/ai/smart-search
// @access  Public
exports.smartSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const prompt = `Given this user query for a home services app: "${query.trim()}"

Identify the most relevant service category and keywords.

Respond ONLY with JSON (no markdown, no extra text):
{
  "category": "most relevant category or null",
  "keywords": ["keyword1", "keyword2"],
  "intent": "what the user wants",
  "suggestedServices": ["service1", "service2", "service3"]
}

Categories: Cleaning Services, Repair & Maintenance, Home Improvement, Outdoor Services, Personal & Care Services, Convenience Services, Smart Home & Tech Services`;

    const rawText = await callLLM({
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    let result;
    try {
      result = JSON.parse(rawText.trim());
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      result = match
        ? JSON.parse(match[0])
        : { keywords: [query], category: null, suggestedServices: [] };
    }

    res.json({ success: true, ...result });
  } catch (error) {
    console.error(
      "AI smart search error:",
      error.response?.data || error.message,
    );
    res.json({
      success: true,
      keywords: [req.body.query],
      category: null,
      intent: "unknown",
      suggestedServices: [],
    });
  }
};
