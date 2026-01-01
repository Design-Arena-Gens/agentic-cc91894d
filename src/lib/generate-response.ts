const WHATSAPP_LINK = "https://wa.me/919760123456";
const CALL_LINK = "tel:+919760123456";

const containsAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword));

export const generateBotResponse = (rawInput: string): string => {
  const input = rawInput.trim();
  if (!input) {
    return "🥯 I'm right here and ready when you are! Tell me what you'd like to munch on today.";
  }

  const text = input.toLowerCase();

  if (
    containsAny(text, [
      "where is my order",
      "where's my order",
      "order status",
      "track my order",
      "order delayed",
      "delivery status",
      "where my order",
      "order update",
    ]) ||
    (text.includes("where") && text.includes("order"))
  ) {
    return `🥯 Thanks so much for checking in! May I grab your Order ID please? Once I have it, I'll confirm—our rider usually leaves at 11 AM or 5 PM. If it's urgent, click here to call us: [Call Oven Bakery](${CALL_LINK}).`;
  }

  if (
    containsAny(text, [
      "cold",
      "complaint",
      "bad",
      "stale",
      "soggy",
      "not hot",
      "refund",
      "replace",
    ]) &&
    text.includes("order")
  ) {
    return `🍪 I am so sorry to hear that your order arrived cold! We want every bite to be perfect for you. Please message us on WhatsApp immediately so we can send a fresh replacement or a refund: [WhatsApp Us](${WHATSAPP_LINK}).`;
  }

  if (containsAny(text, ["eggless", "egg-less", "egg free"])) {
    return "🎂 Yes indeed! All our pastries and cakes are 100% eggless and baked fresh each morning. Tell me what flavor you're craving and I'll line it up.";
  }

  if (containsAny(text, ["menu", "items", "what do you have", "options"])) {
    return "🎂 Here are today's bakery stars: Paneer Patty ₹30, Choco Lava Cake ₹60, and our Student Combo at ₹150. Orders above ₹300 enjoy free delivery and every treat is eggless. Shall I reserve something yummy for you?";
  }

  if (containsAny(text, ["delivery", "deliver", "drop", "ship"])) {
    return "🚚 We deliver from Gadwali Colony across Bhauwala, Manduwala, Sudhowala, Jhajra, and Pondha. Orders above ₹300 ride free, ₹150-₹299 is a ₹20 fee, and below ₹150 is ₹30. Would you like the 11 AM or the 5 PM slot?";
  }

  if (containsAny(text, ["payment", "pay", "upi", "cash"])) {
    return "💳 We happily take Cash on Delivery or UPI right at your doorstep. Just share your pick when we confirm. Ready for me to note down your order?";
  }

  if (
    containsAny(text, ["combo", "student combo", "cold coffee"]) ||
    (text.includes("suggest") && text.includes("combo"))
  ) {
    return "🥯 Our Student Combo at ₹150 pairs a Paneer Patty with a Cold Coffee—perfect for study fuel. Above ₹300 the delivery is on us. Want me to block one for you?";
  }

  if (
    containsAny(text, ["paneer patty", "patty", "puff"]) ||
    (text.includes("paneer") && text.includes("snack"))
  ) {
    return "🍪 Great choice! Would you like to make it a combo with a Cold Coffee for just ₹50 more? I can pack the Paneer Patty fresh for whichever delivery slot you prefer.";
  }

  if (containsAny(text, ["where are you", "location", "address"])) {
    return "🥯 We're baking away in Gadwali Colony, Bhauwala, surrounded by mountain breeze. Pick-up is welcome if you're nearby, otherwise I'll send it over. What can I prepare for you today?";
  }

  if (containsAny(text, ["thanks", "thank you", "great", "awesome"])) {
    return "🎂 You're most welcome! I'll be right here if you need anything else. Ready to add something sweet or savory to your cart?";
  }

  if (containsAny(text, ["slot", "time", "timing", "schedule"])) {
    return "⏰ Our delivery slots are 11:00 AM – 12:00 PM and 5:00 PM – 6:00 PM. Tell me which one suits you and I'll coordinate the bake.";
  }

  return `I am checking on that! Please message our main chef on WhatsApp here: [Chat on WhatsApp](${WHATSAPP_LINK}).`;
};
