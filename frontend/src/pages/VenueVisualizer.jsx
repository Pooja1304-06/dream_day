import { useEffect, useRef, useState } from "react";
import {
Sparkles,
Heart,
Palette,
Wallet,
Flower2,
Lightbulb,
Check,
ArrowRight,
RotateCcw,
Bookmark,
WandSparkles,
Leaf,
CalendarDays,
Image as ImageIcon
} from "lucide-react";

import "./VenueVisualizer.css";

const themes = {
"Royal Purple": {
colors: ["#6C3A8C", "#C8A2C8", "#F4EAF7"],
description: "A luxurious celebration with elegant purple tones.",
decorations: [
"Purple floral stage decoration",
"Crystal chandelier arrangements",
"White rose centrepieces",
"Warm fairy-light backdrop"
],
flowers: "Purple orchids, white roses and lavender flowers",
lighting: "Warm golden lighting with purple accent lights",
image:
"https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85"
},

"Elegant White": {
colors: ["#FFFFFF", "#E8DED0", "#C7B8A4"],
description: "A timeless celebration with soft neutral colours.",
decorations: [
"White floral stage",
"Elegant draped backdrop",
"White rose centrepieces",
"Minimalist table decoration"
],
flowers: "White roses, lilies and baby's breath",
lighting: "Soft warm-white ambient lighting",
image:
"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
},

"Garden Romance": {
colors: ["#79966B", "#F4D9D0", "#FFF8EE"],
description: "A dreamy garden celebration surrounded by nature.",
decorations: [
"Greenery-covered backdrop",
"Hanging floral arrangements",
"Rustic wooden tables",
"Outdoor fairy lights"
],
flowers: "Pink roses, white flowers and fresh greenery",
lighting: "Warm string lights and soft garden lanterns",
image:
"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85"
},

"Modern Blue": {
colors: ["#243B64", "#7895C7", "#F3F5FA"],
description: "A contemporary event with sophisticated blue accents.",
decorations: [
"Blue and silver stage",
"Modern geometric centrepieces",
"Blue floral arrangements",
"Contemporary LED backdrop"
],
flowers: "White roses with blue decorative accents",
lighting: "Cool-white lighting with blue highlights",
image:
"https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85"
}
};

const eventOptions = {
Wedding: {
icon: "💍",
label: "Wedding Celebration"
},
Birthday: {
icon: "🎂",
label: "Birthday Celebration"
},
Engagement: {
icon: "💖",
label: "Engagement Celebration"
},
"Corporate Event": {
icon: "🥂",
label: "Corporate Gathering"
}
};

const budgetCategories = [
{ name: "Stage decoration", percentage: 30, color: "#8266e8" },
{ name: "Flowers", percentage: 20, color: "#c084fc" },
{ name: "Lighting", percentage: 15, color: "#f0a5c8" },
{ name: "Tables and seating", percentage: 15, color: "#76b7b2" },
{ name: "Backdrop and props", percentage: 10, color: "#f4bd70" },
{ name: "Contingency", percentage: 10, color: "#a1a1aa" }
];

function Reveal({ children, delay = 0, className = "" }) {
const ref = useRef(null);
const [visible, setVisible] = useState(false);

useEffect(() => {
const element = ref.current;


if (!element) return;

if (!("IntersectionObserver" in window)) {
  setVisible(true);
  return;
}

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setVisible(true);
      observer.unobserve(element);
    }
  },
  {
    threshold: 0.08,
    rootMargin: "0px 0px -25px 0px"
  }
);

observer.observe(element);

return () => observer.disconnect();


}, []);

return (
<div
ref={ref}
className={`venue-reveal ${visible ? "is-visible" : ""} ${className}`}
style={{ "--reveal-delay": `${delay}ms` }}
>
{children} </div>
);
}

function makePlan(eventType, theme, venue, budget, guests) {
const selectedTheme = themes[theme];

return {
eventType,
theme,
venue,
budget,
guests,
...selectedTheme,
allocations: budgetCategories.map((item) => ({
...item,
amount: Math.round((budget * item.percentage) / 100)
}))
};
}

export default function VenueVisualizer() {
const [eventType, setEventType] = useState("Wedding");
const [theme, setTheme] = useState("Royal Purple");
const [venue, setVenue] = useState("Indoor");
const [budget, setBudget] = useState(50000);
const [guests, setGuests] = useState(100);
const [plan, setPlan] = useState(null);
const [saved, setSaved] = useState(false);
const [showMoodboard, setShowMoodboard] = useState(false);
const [moodboards, setMoodboards] = useState(() => {
try {
return JSON.parse(
localStorage.getItem("dreamdayMoodboards") || "[]"
);
} catch {
return [];
}
});

const money = (amount) =>
`₹${Number(amount).toLocaleString("en-IN")}`;

function generatePlan(event = eventType, selectedTheme = theme) {
setEventType(event);
setTheme(selectedTheme);
setPlan(makePlan(event, selectedTheme, venue, budget, guests));
setSaved(false);
setShowMoodboard(false);
}

function resetPlan() {
setEventType("Wedding");
setTheme("Royal Purple");
setVenue("Indoor");
setBudget(50000);
setGuests(100);
setPlan(null);
setSaved(false);
setShowMoodboard(false);
}

function saveMoodboard() {
if (!plan) return;


const newItem = {
  ...plan,
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  savedAt: new Date().toISOString()
};

const updated = [newItem, ...moodboards];

try {
  localStorage.setItem(
    "dreamdayMoodboards",
    JSON.stringify(updated)
  );

  setMoodboards(updated);
  setSaved(true);
} catch {
  alert("Unable to save. Your browser storage may be full.");
}
```

}

function removeMoodboard(id) {
const updated = moodboards.filter((item) => item.id !== id);

```
try {
  localStorage.setItem(
    "dreamdayMoodboards",
    JSON.stringify(updated)
  );

  setMoodboards(updated);
} catch {
  alert("Unable to update your moodboard.");
}


}

return ( <main className="venue-studio">
{/* Hero */} <section className="venue-hero"> <div className="venue-hero-glow venue-glow-one" /> <div className="venue-hero-glow venue-glow-two" />


    <Reveal className="venue-hero-content">
      <div className="venue-hero-badge">
        <Sparkles size={15} />
        YOUR PERSONAL EVENT DESIGN STUDIO
      </div>

      <h1>
        Imagine it.
        <br />
        <span>We'll help you design it.</span>
      </h1>

      <p>
        Turn your celebration ideas into a beautiful event concept.
        Explore themes, discover decoration ideas, and plan your budget
        in one creative space.
      </p>

      <div className="venue-hero-stats">
        <div>
          <strong>04</strong>
          <span>Signature themes</span>
        </div>

        <div className="venue-stat-divider" />

        <div>
          <strong>100%</strong>
          <span>Customisable</span>
        </div>

        <div className="venue-stat-divider" />

        <div>
          <strong>₹0</strong>
          <span>AI API required</span>
        </div>
      </div>
    </Reveal>
  </section>

  {/* Theme selector */}
  <Reveal className="venue-section-wrap">
    <section className="venue-theme-section">
      <div className="venue-section-heading">
        <div>
          <span className="venue-eyebrow">
            FIND YOUR AESTHETIC
          </span>

          <h2>Choose your dream theme</h2>

          <p>
            Start with a style that reflects your celebration.
          </p>
        </div>

        <Palette size={30} className="venue-heading-icon" />
      </div>

      <div className="venue-theme-grid">
        {Object.entries(themes).map(([name, item], index) => (
          <button
            type="button"
            key={name}
            className={`venue-theme-card ${
              theme === name ? "selected" : ""
            }`}
            onClick={() => {
              setTheme(name);
              setPlan(null);
              setSaved(false);
            }}
            style={{ "--card-index": index }}
          >
            <div className="venue-theme-image">
              <img src={item.image} alt={`${name} venue inspiration`} />

              {theme === name && (
                <span className="venue-theme-selected">
                  <Check size={16} />
                </span>
              )}

              <span className="venue-theme-overlay" />
            </div>

            <div className="venue-theme-content">
              <h3>{name}</h3>
              <p>{item.description}</p>

              <div className="venue-theme-colors">
                {item.colors.map((color) => (
                  <span
                    key={color}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  </Reveal>

  {/* Main planner */}
  <Reveal className="venue-section-wrap">
    <section className="venue-planner-section">
      <div className="venue-section-heading">
        <div>
          <span className="venue-eyebrow">
            MAKE IT YOURS
          </span>

          <h2>Customise your celebration</h2>

          <p>
            Adjust the details and create your personalised design.
          </p>
        </div>

        <WandSparkles
          size={30}
          className="venue-heading-icon"
        />
      </div>

      <div className="venue-planner-grid">
        <div className="venue-form-card">
          <div className="venue-card-title">
            <div className="venue-icon-box">
              <Palette size={21} />
            </div>

            <div>
              <h3>Your event details</h3>
              <p>Choose your preferences below.</p>
            </div>
          </div>

          <label htmlFor="venue-event">Event type</label>

          <select
            id="venue-event"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            {Object.keys(eventOptions).map((item) => (
              <option key={item} value={item}>
                {eventOptions[item].icon} {item}
              </option>
            ))}
          </select>

          <label htmlFor="venue-theme">Colour theme</label>

          <select
            id="venue-theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {Object.keys(themes).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label htmlFor="venue-type">Venue type</label>

          <select
            id="venue-type"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          >
            <option>Indoor</option>
            <option>Outdoor</option>
            <option>Garden</option>
            <option>Beach</option>
          </select>

          <label htmlFor="venue-guests">Expected guests</label>

          <input
            id="venue-guests"
            className="venue-number-input"
            type="number"
            min="1"
            max="10000"
            value={guests}
            onChange={(e) =>
              setGuests(
                Math.max(
                  1,
                  Math.min(10000, Number(e.target.value) || 1)
                )
              )
            }
          />

          <div className="venue-budget-label">
            <label htmlFor="venue-budget">
              Decoration budget
            </label>

            <strong>{money(budget)}</strong>
          </div>

          <input
            id="venue-budget"
            className="venue-range"
            type="range"
            min="10000"
            max="200000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />

          <div className="venue-range-labels">
            <span>₹10,000</span>
            <span>₹2,00,000</span>
          </div>

          <button
            type="button"
            className="venue-primary-button"
            onClick={() => generatePlan()}
          >
            <Sparkles size={18} />
            Generate My Dream Venue
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="venue-reset-button"
            onClick={resetPlan}
          >
            <RotateCcw size={15} />
            Reset preferences
          </button>

          <div className="venue-free-note">
            <Check size={15} />
            No AI API or paid service required
          </div>
        </div>

        {/* Preview */}
        <div className="venue-preview-card">
          {!plan ? (
            <div className="venue-empty-state">
              <div className="venue-empty-art">
                <span className="venue-empty-sparkle sparkle-a">
                  ✦
                </span>

                <span className="venue-empty-sparkle sparkle-b">
                  ✧
                </span>

                <div className="venue-empty-circle">
                  <Flower2 size={53} strokeWidth={1.2} />
                </div>
              </div>

              <span className="venue-eyebrow">
                YOUR CREATIVE CANVAS
              </span>

              <h3>Your dream begins here</h3>

              <p>
                Select your theme, adjust your budget, and create
                a unique concept for your special day.
              </p>

              <div className="venue-empty-tags">
                <span>✦ Themes</span>
                <span>✦ Colours</span>
                <span>✦ Budget</span>
              </div>
            </div>
          ) : (
            <div className="venue-generated-result" key={`${plan.eventType}-${plan.theme}-${plan.venue}-${plan.budget}-${plan.guests}`}>
              <div className="venue-result-image">
                <img src={plan.image} alt={`${plan.theme} event inspiration`} />

                <div className="venue-result-image-shade" />

                <div className="venue-result-image-label">
                  <span>
                    {eventOptions[plan.eventType].icon}{" "}
                    {plan.eventType}
                  </span>

                  <span>{plan.venue} Venue</span>
                </div>

                <div className="venue-result-image-title">
                  <span>YOUR DESIGN CONCEPT</span>
                  <h3>{plan.theme}</h3>
                </div>
              </div>

              <div className="venue-result-body">
                <p className="venue-result-description">
                  {plan.description}
                </p>

                <div className="venue-result-info-grid">
                  <div>
                    <CalendarDays size={17} />
                    <span>Event type</span>
                    <strong>{plan.eventType}</strong>
                  </div>

                  <div>
                    <Heart size={17} />
                    <span>Guests</span>
                    <strong>{plan.guests} people</strong>
                  </div>

                  <div>
                    <Wallet size={17} />
                    <span>Budget</span>
                    <strong>{money(plan.budget)}</strong>
                  </div>
                </div>

                <h4>
                  <Palette size={18} />
                  Your colour palette
                </h4>

                <div className="venue-large-palette">
                  {plan.colors.map((color) => (
                    <div className="venue-palette-swatch" key={color}>
                      <span style={{ backgroundColor: color }} />
                      <small>{color}</small>
                    </div>
                  ))}
                </div>

                <h4>
                  <Flower2 size={18} />
                  Decoration inspiration
                </h4>

                <div className="venue-decoration-list">
                  {plan.decorations.map((item, index) => (
                    <div key={item} className="venue-decoration-item">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{item}</p>
                      <Check size={16} />
                    </div>
                  ))}
                </div>

                <div className="venue-idea-box">
                  <div className="venue-idea-icon">
                    <Flower2 size={22} />
                  </div>

                  <div>
                    <strong>Floral inspiration</strong>
                    <p>{plan.flowers}</p>
                  </div>
                </div>

                <div className="venue-idea-box">
                  <div className="venue-idea-icon">
                    <Lightbulb size={22} />
                  </div>

                  <div>
                    <strong>Lighting concept</strong>
                    <p>{plan.lighting}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`venue-primary-button venue-save-button ${
                    saved ? "is-saved" : ""
                  }`}
                  onClick={saveMoodboard}
                >
                  {saved ? <Check size={18} /> : <Bookmark size={18} />}

                  {saved
                    ? "Saved to My Moodboard"
                    : "Save to My Moodboard"}

                  <Heart size={17} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  </Reveal>

  {/* Budget breakdown */}
  {plan && (
    <Reveal className="venue-section-wrap">
      <section className="venue-budget-section">
        <div className="venue-section-heading">
          <div>
            <span className="venue-eyebrow">
              PLAN SMARTER
            </span>

            <h2>Your budget, beautifully organised</h2>

            <p>
              An illustrative allocation of your decoration budget.
            </p>
          </div>

          <Wallet size={30} className="venue-heading-icon" />
        </div>

        <div className="venue-budget-dashboard">
          <div className="venue-budget-overview">
            <span>Total planned budget</span>

            <h3>{money(plan.budget)}</h3>

            <p>
              {plan.guests} expected guests
            </p>

            <div className="venue-budget-note">
              <Leaf size={17} />
              Keep a contingency for unexpected costs.
            </div>
          </div>

          <div className="venue-budget-breakdown">
            {plan.allocations.map((item, index) => (
              <div
                className="venue-budget-row"
                key={item.name}
                style={{ "--bar-delay": `${index * 100}ms` }}
              >
                <div className="venue-budget-row-heading">
                  <span>
                    <i style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>

                  <strong>{money(item.amount)}</strong>
                </div>

                <div className="venue-budget-track">
                  <div
                    className="venue-budget-fill"
                    style={{
                      "--bar-width": `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>

                <small>{item.percentage}% of your budget</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  )}

  {/* Moodboard */}
  <Reveal className="venue-section-wrap">
    <section className="venue-moodboard-section">
      <div className="venue-section-heading">
        <div>
          <span className="venue-eyebrow">
            YOUR PERSONAL COLLECTION
          </span>

          <h2>My inspiration moodboard</h2>

          <p>
            Keep your favourite concepts together for future reference.
          </p>
        </div>

        <Heart size={30} className="venue-heading-icon" />
      </div>

      <div className="venue-moodboard-toolbar">
        <div>
          <Bookmark size={18} />
          <span>
            {moodboards.length} saved{" "}
            {moodboards.length === 1 ? "concept" : "concepts"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowMoodboard(!showMoodboard)}
        >
          {showMoodboard ? "Hide collection" : "View collection"}
          <ArrowRight
            size={16}
            className={showMoodboard ? "arrow-rotated" : ""}
          />
        </button>
      </div>

      {showMoodboard && (
        <div className="venue-saved-grid">
          {moodboards.length === 0 ? (
            <div className="venue-saved-empty">
              <ImageIcon size={35} />

              <h3>Your moodboard is waiting</h3>

              <p>
                Generate a design concept and save it to see it here.
              </p>
            </div>
          ) : (
            moodboards.map((item) => (
              <article
                className="venue-saved-card"
                key={item.id}
              >
                <img src={item.image} alt={item.theme} />

                <div className="venue-saved-card-content">
                  <span>{item.eventType}</span>

                  <h3>{item.theme}</h3>

                  <p>
                    {item.venue} · {money(item.budget)}
                  </p>

                  <div className="venue-saved-colors">
                    {item.colors.map((color) => (
                      <span
                        key={color}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <div className="venue-saved-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEventType(item.eventType);
                        setTheme(item.theme);
                        setVenue(item.venue);
                        setBudget(item.budget);
                        setGuests(item.guests);
                        setPlan(makePlan(
                          item.eventType,
                          item.theme,
                          item.venue,
                          item.budget,
                          item.guests
                        ));
                        setSaved(true);
                        setShowMoodboard(false);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth"
                        });
                      }}
                    >
                      Reopen
                    </button>

                    <button
                      type="button"
                      className="venue-delete-button"
                      onClick={() => removeMoodboard(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  </Reveal>

  {/* Footer banner */}
  <Reveal className="venue-section-wrap">
    <section className="venue-bottom-banner">
      <div className="venue-banner-icon">
        <Sparkles size={30} />
      </div>

      <div>
        <span>YOUR DAY. YOUR STYLE.</span>

        <h2>Every beautiful celebration starts with an idea.</h2>

        <p>
          Explore different possibilities until you find the one
          that feels right for you.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          resetPlan();
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        }}
      >
        Start again <ArrowRight size={17} />
      </button>
    </section>
  </Reveal>
</main>


);
}
