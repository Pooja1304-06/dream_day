
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import "./Home.css";

const hero =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=85";

const categories = [
  [
    "Wedding",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
  ],
  [
    "Birthday",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=700&q=80",
  ],
  [
    "Corporate",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=80",
  ],
  [
    "Engagement",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
  ],
];

function Reveal({ children, className = "", delay = 0 }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`home-reveal ${visible ? "home-reveal-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="dream-home">
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(20,22,43,.78), rgba(20,22,43,.28)), url(${hero})`,
        }}
      >
        <div className="hero-content home-hero-content">
          <span className="eyebrow">
            <Sparkles size={15} />
            THE ULTIMATE EVENT EXPERIENCE
          </span>

          <h1>
            Plan your perfect
            <br />
            <span>Dream Day</span>
          </h1>

          <p>
            From intimate celebrations to grand occasions, discover venues,
            packages and experiences designed around your event.
          </p>

          <div className="hero-actions">
            <Link className="primary-btn" to="/events">
              Explore Events <ArrowRight size={17} />
            </Link>

            <Link className="ghost-btn" to="/create-event">
              Start Planning
            </Link>
          </div>
        </div>

        <div className="hero-search home-search-animate">
          <div>
            <label>Event type</label>
            <input placeholder="Wedding, Birthday..." />
          </div>

          <div>
            <label>Event date</label>
            <input type="date" />
          </div>

          <div>
            <label>City</label>
            <input placeholder="Chennai, Bengaluru..." />
          </div>

          <div>
            <label>Guests</label>
            <input type="number" min="1" placeholder="100" />
          </div>

          <Link className="search-btn" to="/events">
            Search
          </Link>
        </div>
      </section>

      {/* EVENT CATEGORIES */}
      <section className="section home-category-section">
        <Reveal>
          <div className="section-heading">
            <div>
              <span className="mini-label">CELEBRATE YOUR WAY</span>
              <h2>Find the perfect event</h2>
            </div>

            <Link to="/events" className="text-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="category-grid">
          {categories.map(([name, image], index) => (
            <Reveal key={name} delay={index * 120}>
              <Link
                to={`/events?category=${name}`}
                className="category-card home-animated-card"
              >
                <img src={image} alt={name} loading="lazy" />

                <div>
                  <h3>{name}</h3>
                  <span>Explore experiences</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="feature-band home-feature-section">
        {[
          {
            icon: CalendarDays,
            title: "Plan everything",
            description:
              "Dates, guests, budget and bookings in one place.",
          },
          {
            icon: Heart,
            title: "Personalized",
            description:
              "Build an event around your theme and style.",
          },
          {
            icon: ShieldCheck,
            title: "Secure booking",
            description:
              "OTP login and verified payment flow.",
          },
        ].map(({ icon: Icon, title, description }, index) => (
          <Reveal key={title} delay={index * 140}>
            <div className="feature home-feature-card">
              <Icon size={30} />

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </main>
  );
}

