
import express from "express";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const {
      eventType,
      city,
      budget,
      guests,
      theme,
      catering,
      eventDate,
    } = req.body;

    // Validate required fields
    if (!eventType || !city || budget == null || guests == null) {
      return res.status(400).json({
        success: false,
        message: "Please provide event type, city, budget, and guest count.",
      });
    }

    const budgetAmount = Number(budget);
    const guestCount = Number(guests);

    if (
      !Number.isFinite(budgetAmount) ||
      budgetAmount <= 0 ||
      !Number.isInteger(guestCount) ||
      guestCount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid budget and a positive whole guest count.",
      });
    }

    if (budgetAmount > 1000000000 || guestCount > 100000) {
      return res.status(400).json({
        success: false,
        message: "Please enter a realistic budget and guest count.",
      });
    }

    const type = String(eventType).trim();
    const location = String(city).trim();
    const selectedTheme = String(theme || "Elegant").trim();
    const food = String(catering || "Mixed").trim();

    if (!type || !location || location.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid event type and city.",
      });
    }

    // Budget allocation rules
    const allocations = [
      { name: "Venue and seating", percentage: 30 },
      { name: "Food and catering", percentage: 30 },
      { name: "Decoration and theme", percentage: 15 },
      { name: "Photography", percentage: 10 },
      { name: "Entertainment", percentage: 5 },
      { name: "Miscellaneous and emergency", percentage: 10 },
    ];

    const budgetBreakdown = allocations.map((item) => ({
      category: item.name,
      percentage: item.percentage,
      amount: Math.round((budgetAmount * item.percentage) / 100),
    }));

    // Event-specific recommendations
    const eventKey = type.toLowerCase();

    let decoration;
    let entertainment;
    let schedule;

    if (eventKey.includes("wedding") || eventKey.includes("marriage")) {
      decoration =
        "Use a decorated stage, floral arrangements, coordinated lighting, and a welcoming entrance.";
      entertainment =
        "Consider traditional music, a DJ, or cultural performances appropriate for the celebration.";
      schedule = [
        "Guest arrival and welcome",
        "Ceremony and rituals",
        "Photography session",
        "Catering and dining",
        "Family photographs and closing",
      ];
    } else if (
      eventKey.includes("birthday") ||
      eventKey.includes("party")
    ) {
      decoration =
        "Use a themed backdrop, balloons, table decorations, and suitable lighting.";
      entertainment =
        "Consider party games, music, a cake-cutting ceremony, and a photo corner.";
      schedule = [
        "Guest arrival",
        "Welcome activities",
        "Games and entertainment",
        "Cake-cutting ceremony",
        "Food and photographs",
      ];
    } else if (
      eventKey.includes("engagement")
    ) {
      decoration =
        "Plan an elegant stage, floral details, coordinated seating, and a photo backdrop.";
      entertainment =
        "Consider soft background music and a dedicated photography session.";
      schedule = [
        "Guest arrival",
        "Welcome and seating",
        "Engagement ceremony",
        "Photography",
        "Dining and farewell",
      ];
    } else {
      decoration =
        `Use a ${selectedTheme.toLowerCase()} theme with coordinated colors, simple centerpieces, and suitable lighting.`;
      entertainment =
        "Consider background music, interactive activities, and a dedicated photography area.";
      schedule = [
        "Guest arrival and registration",
        "Welcome and opening",
        "Main event activities",
        "Food and refreshments",
        "Photography and closing",
      ];
    }

    // Calculate food cost per guest
    const foodBudget = budgetAmount * 0.3;
    const foodPerGuest = Math.round(foodBudget / guestCount);

    const money = (amount) =>
      `₹${Math.round(amount).toLocaleString("en-IN")}`;

    const checklist = [
      "Confirm the event date and guest list.",
      "Compare venue options and confirm availability.",
      "Request written quotations from vendors.",
      "Finalize the decoration theme.",
      `Confirm the ${food.toLowerCase()} catering requirements.`,
      "Arrange photography and event equipment.",
      "Prepare a detailed event-day schedule.",
      "Keep some funds available for unexpected expenses.",
    ];

    const plan = `
YOUR PERSONALIZED ${type.toUpperCase()} PLAN
============================================

EVENT DETAILS
-------------
Event: ${type}
Location: ${location}
Date: ${eventDate || "Not decided"}
Expected guests: ${guestCount}
Theme: ${selectedTheme}
Catering preference: ${food}
Total budget: ${money(budgetAmount)}

1. EVENT CONCEPT
----------------
Plan a ${selectedTheme.toLowerCase()}-themed ${type.toLowerCase()} in ${location} for ${guestCount} guests.

Keep the venue, food, decoration, and entertainment within your total budget of ${money(budgetAmount)}.

2. BUDGET BREAKDOWN
-------------------
${budgetBreakdown
  .map(
    (item) =>
      `${item.category}: ${money(item.amount)} (${item.percentage}%)`
  )
  .join("\n")}

TOTAL: ${money(
      budgetBreakdown.reduce((sum, item) => sum + item.amount, 0)
    )}

3. VENUE SUGGESTIONS
--------------------
Look for venues in ${location} that can accommodate ${guestCount} guests.

Compare:
- Venue capacity and accessibility.
- Rental cost and included facilities.
- Parking and transport.
- Decoration restrictions.
- Catering policies.

Contact venues directly to confirm actual prices and availability.

4. DECORATION AND PHOTOGRAPHY
-----------------------------
${decoration}

Photography recommendations:
- Plan a main event photo session.
- Arrange group and family photographs.
- Compare photography packages before booking.

5. CATERING
-----------
Preference: ${food}
Suggested food budget: ${money(foodBudget)}
Approximate allocation per guest: ${money(foodPerGuest)}

Confirm the menu, dietary requirements, serving arrangements, and final price with your caterer.

6. ENTERTAINMENT
----------------
${entertainment}

7. EVENT-DAY SCHEDULE
---------------------
${schedule.map((item, index) => `${index + 1}. ${item}`).join("\n")}

8. PREPARATION CHECKLIST
------------------------
${checklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}

9. MONEY-SAVING TIPS
--------------------
- Compare at least three vendor quotations.
- Choose decorations that can be reused.
- Finalize the guest count before confirming catering.
- Prioritize essential expenses over optional extras.
- Keep the miscellaneous allocation for unexpected costs.

IMPORTANT
---------
This is a rule-based planning estimate, not a response generated by an AI model.
All costs are planning estimates, not verified vendor quotations.
Confirm venue availability, vendor prices, and service details before booking.
Adjust the allocations to suit your actual event requirements.
`;

    return res.status(200).json({
      success: true,
      plan,
      budgetBreakdown,
      totalBudget: budgetAmount,
      message: "Your event plan was generated successfully.",
    });
  } catch (error) {
    console.error("Planner error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate your event plan. Please try again.",
    });
  }
});

export default router;

