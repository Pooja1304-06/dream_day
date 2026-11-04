import React from "react";

function About() {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <div className="about-label">
            ABOUT DREAM DAY
          </div>

          <h1>
            We turn your
            <span> special moments </span>
            into memories.
          </h1>

          <p>
            Dream Day is a full-stack event planning and management
            application that brings event discovery, planning,
            booking, OTP-secured authentication and online advance
            payment into one place.
          </p>

          <div className="about-hero-buttons">

           

          </div>

        </div>


        <div className="about-hero-image-wrapper">

          <div className="about-image-glow"></div>

          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85"
            alt="Beautiful wedding celebration"
            className="about-hero-image"
          />

          <div className="about-floating-card">

            <div className="floating-icon">
              ★
            </div>

            <div>
              <strong>
                Loved by our customers
              </strong>

              <span>
                Creating unforgettable moments
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= RATING ================= */}

      <section className="about-rating-section">

        <div className="rating-main">

          <div className="rating-number">
            4.9
          </div>

          <div className="rating-stars">
            ★ ★ ★ ★ ★
          </div>

          <p>
            Average customer rating
          </p>

        </div>


        <div className="rating-divider"></div>


        <div className="rating-stat">
          <strong>500+</strong>
          <span>Events planned</span>
        </div>

        <div className="rating-stat">
          <strong>98%</strong>
          <span>Happy customers</span>
        </div>

        <div className="rating-stat">
          <strong>8+</strong>
          <span>Event categories</span>
        </div>

      </section>


      {/* ================= WHY DREAM DAY ================= */}

      <section className="about-intro">

        <div className="about-section-label">
          WHY DREAM DAY
        </div>

        <h2>
          Everything you need for
          <span> your perfect celebration.</span>
        </h2>

        <p>
          From discovering your ideal event to booking your
          celebration and completing your advance payment,
          Dream Day makes the entire experience simple,
          secure and beautiful.
        </p>

      </section>

      {/* ================= CUSTOMER REVIEWS ================= */}

      <section className="reviews-section">

        <div className="reviews-heading">

          <div className="about-section-label">
            CUSTOMER LOVE
          </div>

          <h2>
            What our customers say
          </h2>

          <p>
            Every celebration tells a story.
            Here are some of the experiences our
            customers love about Dream Day.
          </p>

        </div>


        <div className="reviews-grid">

          {/* REVIEW 1 */}

          <div className="review-card">

            <div className="review-top">

              <div className="review-avatar">
                A
              </div>

              <div>
                <h3>
                  Ananya
                </h3>

                <span>
                  Wedding celebration
                </span>
              </div>

              <div className="review-stars">
                ★★★★★
              </div>

            </div>

            <p>
              “Dream Day made planning our wedding
              so much easier. Everything was beautifully
              organized and the booking process was
              really simple.”
            </p>

            <div className="review-event">
              💍 Traditional Wedding
            </div>

          </div>


          {/* REVIEW 2 */}

          <div className="review-card">

            <div className="review-top">

              <div className="review-avatar">
                R
              </div>

              <div>
                <h3>
                  Rahul
                </h3>

                <span>
                  Birthday celebration
                </span>
              </div>

              <div className="review-stars">
                ★★★★★
              </div>

            </div>

            <p>
              “I loved how easy it was to choose an
              event and plan everything in one place.
              The experience felt modern and smooth.”
            </p>

            <div className="review-event">
              🎂 Birthday Celebration
            </div>

          </div>


          {/* REVIEW 3 */}

          <div className="review-card">

            <div className="review-top">

              <div className="review-avatar">
                P
              </div>

              <div>
                <h3>
                  Priya
                </h3>

                <span>
                  Engagement celebration
                </span>
              </div>

              <div className="review-stars">
                ★★★★★
              </div>

            </div>

            <p>
              “The event details, booking and payment
              flow were very convenient. Dream Day
              helped us create a beautiful celebration.”
            </p>

            <div className="review-event">
              💐 Engagement
            </div>

          </div>

        </div>

      </section>


      {/* ================= EVENT CATEGORIES ================= */}

      <section className="about-categories">

        <div className="about-section-label">
          CELEBRATE ANYTHING
        </div>

        <h2>
          One platform.
          <span> Every celebration.</span>
        </h2>

        <p>
          Choose the celebration that matters to you
          and let Dream Day help you plan it.
        </p>


        

      </section>


      {/* ================= CTA ================= */}

      <section className="about-cta">

        <div>

          <div className="about-section-label light">
            START PLANNING
          </div>

          <h2>
            Your special day
            <br />
            deserves a Dream Day.
          </h2>

          <p>
            Discover beautiful events and start planning
            your perfect celebration today.
          </p>

        </div>


        <button
          className="about-cta-btn"
          onClick={() => {
            window.location.href = "/events";
          }}
        >
          Explore Events
          <span>→</span>
        </button>

      </section>

    </div>
  );
}

export default About;