import { useState } from "react";
import api from "../api";
import "./AIPlanner.css";

const initialForm = {
  eventType: "Engagement",
  city: "",
  budget: "150000",
  guests: "150",
  theme: "Traditional",
  catering: "Vegetarian",
  eventDate: "",
};

export default function AIPlanner() {
  const [form, setForm] = useState(initialForm);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    setError("");
    setPlan(null);

    const budget = Number(form.budget);
    const guests = Number(form.guests);

    if (!form.city.trim()) {
      setError("Please enter your event city.");
      return;
    }
    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Please enter a valid budget.");
      return;
    }
    if (!Number.isInteger(guests) || guests < 1) {
      setError("Please enter a valid number of guests.");
      return;
    }
    if (form.eventDate) {
      const selectedDate = new Date(`${form.eventDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setError("Please select today or a future date.");
        return;
      }
    }

    setLoading(true);
    try {
      const response = await api.post("/ai-planner/generate", {
        eventType: form.eventType,
        city: form.city.trim(),
        budget,
        guests,
        theme: form.theme,
        catering: form.catering,
        eventDate: form.eventDate,
      });

      if (!response.data?.success || !response.data?.plan) {
        throw new Error(response.data?.message || "The AI did not return a plan.");
      }

      setPlan({
        ...form,
        city: form.city.trim(),
        budget,
        guests,
        aiText: response.data.plan,
      });
    } catch (err) {
      console.error("AI Planner request failed:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to generate your plan. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setPlan(null);
    setError("");
    setLoading(false);
  };

  return (
    <main className="ai-planner-page">
      <div className="ai-planner-container">
        {/* Page Heading */}
        <header className="ai-planner-heading">
          <p className="ai-planner-label">
            DREAM DAY ULTIMATE
          </p>

          <h1>AI Event Planner ✨</h1>

          <p>
            Plan your perfect celebration with a personalized
            budget, theme, and preparation checklist.
          </p>
        </header>

        <div className="ai-planner-grid">
          {/* Event Requirements Form */}
          <section className="ai-planner-card">
            <h2>Your Event Requirements</h2>

            <form
              onSubmit={generatePlan}
              className="ai-planner-form"
            >
              <div className="ai-planner-field">
                <label htmlFor="eventType">
                  Event Type
                </label>

                <select
                  id="eventType"
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                >
                  <option>Wedding</option>
                  <option>Engagement</option>
                  <option>Birthday</option>
                  <option>Baby Shower</option>
                  <option>Corporate</option>
                  <option>Anniversary</option>
                  <option>Graduation</option>
                  <option>Party</option>
                </select>
              </div>

              <div className="ai-planner-field">
                <label htmlFor="city">
                  Event City
                </label>

                <input
                  id="city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Coimbatore"
                  required
                />
              </div>

              <div className="ai-planner-field">
                <label htmlFor="budget">
                  Total Budget (₹)
                </label>

                <input
                  id="budget"
                  type="number"
                  name="budget"
                  min="1"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ai-planner-field">
                <label htmlFor="guests">
                  Number of Guests
                </label>

                <input
                  id="guests"
                  type="number"
                  name="guests"
                  min="1"
                  step="1"
                  value={form.guests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ai-planner-field">
                <label htmlFor="theme">
                  Preferred Theme
                </label>

                <select
                  id="theme"
                  name="theme"
                  value={form.theme}
                  onChange={handleChange}
                >
                  <option>Traditional</option>
                  <option>Modern</option>
                  <option>Minimalist</option>
                  <option>Luxury</option>
                  <option>Floral</option>
                  <option>Outdoor</option>
                </select>
              </div>

              <div className="ai-planner-field">
                <label htmlFor="catering">
                  Catering Preference
                </label>

                <select
                  id="catering"
                  name="catering"
                  value={form.catering}
                  onChange={handleChange}
                >
                  <option>Vegetarian</option>
                  <option>Non-Vegetarian</option>
                  <option>Both</option>
                  <option>Not Decided</option>
                </select>
              </div>

              <div className="ai-planner-field">
                <label htmlFor="eventDate">
                  Event Date (Optional)
                </label>

                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  min={new Date().toLocaleDateString("en-CA")}
                />
              </div>

              {error && (
                <p className="ai-planner-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="ai-planner-button"
                disabled={loading}
              >
                {loading ? "✨ Generating your plan..." : "✨ Generate My Event Plan"}
              </button>

              <button
                type="button"
                className="ai-planner-reset-button"
                onClick={handleReset}
              >
                Reset Form
              </button>
            </form>
          </section>

          {/* Generated Plan */}
          <section className="ai-planner-card">
            {!plan ? (
              <div className="ai-planner-empty">
                {loading && <p role="status">✨ Dream Day AI is preparing your personalized plan...</p>}
                <div className="ai-planner-empty-icon">
                  ✨
                </div>

                <h2>Your Plan Will Appear Here</h2>

                <p>
                  Enter your requirements and Dream Day AI will
                  create a personalized event plan for your celebration.
                </p>

                <div className="ai-planner-feature-list">
                  <p>💰 Personalized budget breakdown</p>
                  <p>🎨 Theme-based planning suggestions</p>
                  <p>📋 Event preparation checklist</p>
                </div>
              </div>
            ) : (
              <div className="ai-planner-results">
                <div className="ai-planner-result-heading">
                  <p className="ai-planner-label">
                    YOUR CELEBRATION BLUEPRINT
                  </p>

                  <h2>Your Event Plan</h2>

                  <p>
                    Your personalized plan has been generated by Dream Day AI.
                    Review the suggestions below.
                  </p>
                </div>

                <div className="ai-planner-summary">
                  <p className="ai-planner-summary-label">Event Details</p>
                  <p>🎉 Event: {plan.eventType}</p>
                  <p>📍 Location: {plan.city}</p>
                  <p>💰 Budget: ₹{Number(plan.budget).toLocaleString("en-IN")}</p>
                  <p>👥 Guests: {plan.guests}</p>
                  <p>🎨 Theme: {plan.theme}</p>
                  <p>🍽️ Catering: {plan.catering}</p>
                  {plan.eventDate && <p>📅 Date: {plan.eventDate}</p>}
                </div>

                <h3 className="ai-planner-section-title">
                  ✨ Your AI-Generated Event Plan
                </h3>

                <div className="ai-planner-result">
                  {plan.aiText}
                </div>

                <div className="ai-planner-note">
                  <strong>Important:</strong> These are AI-generated planning
                  suggestions, not confirmed vendor quotations or live availability.
                  Verify prices and bookings directly with vendors.
                </div>

                <button
                  type="button"
                  className="ai-planner-button ai-planner-new-plan"
                  onClick={handleReset}
                >
                  Create Another Plan
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

