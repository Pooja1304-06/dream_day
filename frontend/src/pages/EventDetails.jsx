import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api";

function EventDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * The Events page sends the selected wedding type
   * through navigation state.
   *
   * Example:
   * Traditional
   * Destination
   * Muslim
   * Christian
   * Luxury
   */

  const selectedType =
    location.state?.selectedType || "Traditional";

  const selectedImage =
    location.state?.selectedImage || null;

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/events/${id}`);

        const data = response.data;

        setEvent(data.event || data);

      } catch (err) {
        console.error("Event details error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load event details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="details-loader"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error || !event) {
    return (
      <div className="event-details-error">

        <h1>Event not found</h1>

        <p>
          {error ||
            "The event you are looking for could not be found."}
        </p>

        <button
          onClick={() => navigate("/events")}
          className="details-back-btn"
        >
          ← Back to Events
        </button>

      </div>
    );
  }

  /*
   * Find the selected wedding type from
   * the event's option groups.
   */

  const selectedOption =
    event.optionGroups
      ?.flatMap((group) => group.options || [])
      ?.find(
        (option) =>
          option.name?.toLowerCase() ===
          selectedType.toLowerCase()
      );

  /*
   * Use the image passed from Events page if available.
   * Otherwise use the main event image.
   */

  const image =
    selectedImage ||
    selectedOption?.image ||
    event.image;

  /*
   * Selected wedding description.
   */

  const typeDescription =
    selectedOption?.description ||
    getWeddingDescription(selectedType);

  /*
   * Selected wedding price.
   * If the type has an extra price, add it to the event price.
   */

  const typeExtra =
    Number(selectedOption?.price || 0);

  const finalPrice =
    Number(event.price || 0) + typeExtra;

  return (
    <div className="original-event-details-page">

      {/* =================================================
          HERO IMAGE
          ================================================= */}

      <section className="original-details-hero">

        <img
          src={image}
          alt={selectedType}
          className="original-details-image"
        />

        <div className="original-details-overlay">

          <div className="original-details-hero-content">

            <span className="original-details-category">
              {event.category}
            </span>

            <h1>
              {selectedType} Wedding
            </h1>

            <p>
              {typeDescription}
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          DETAILS CONTENT
          ================================================= */}

      <main className="original-details-container">

        {/* LEFT SIDE */}

        <section className="original-details-main">

          <div className="original-details-label">
            YOUR CELEBRATION
          </div>

          <h2>
            {selectedType} Wedding
          </h2>

          <p className="original-details-description">
            {typeDescription}
          </p>


          {/* ================= EVENT INFO ================= */}

          <div className="original-info-grid">

            <div className="original-info-card">

              <div className="original-info-icon">
                📍
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {event.city || "Your preferred location"}
                </strong>
              </div>

            </div>


            <div className="original-info-card">

              <div className="original-info-icon">
                🏛️
              </div>

              <div>
                <span>Venue</span>

                <strong>
                  {event.venue ||
                    "Premium Event Venue"}
                </strong>
              </div>

            </div>


            <div className="original-info-card">

              <div className="original-info-icon">
                👥
              </div>

              <div>
                <span>Capacity</span>

                <strong>
                  Up to {event.capacity || 500} guests
                </strong>
              </div>

            </div>


            <div className="original-info-card">

              <div className="original-info-icon">
                💍
              </div>

              <div>
                <span>Wedding Style</span>

                <strong>
                  {selectedType}
                </strong>
              </div>

            </div>

          </div>


          {/* ================= FEATURES ================= */}

          <div className="original-features-section">

            <div className="original-details-label">
              WHAT'S INCLUDED
            </div>

            <h3>
              Everything for your special day
            </h3>

            <div className="original-features-grid">

              {(event.features || [
                "Beautiful wedding decorations",
                "Professional photography",
                "Premium catering",
                "Wedding music and entertainment",
                "Professional event coordination",
                "Complete wedding arrangements"
              ]).map((feature, index) => (

                <div
                  className="original-feature"
                  key={index}
                >
                  <span className="feature-check">
                    ✓
                  </span>

                  <span>
                    {feature}
                  </span>
                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =================================================
            RIGHT PRICE CARD
            ================================================= */}

        <aside className="original-details-sidebar">

          <div className="original-price-card">

            <div className="price-card-label">
              {selectedType.toUpperCase()} WEDDING
            </div>

            <h3>
              {selectedType} Wedding
            </h3>

            <p className="price-card-description">
              A beautifully planned celebration
              designed around your special day.
            </p>


            <div className="price-card-divider"></div>


            <div className="price-row">

              <span>
                Starting from
              </span>

              <strong>
                ₹{finalPrice.toLocaleString("en-IN")}
              </strong>

            </div>


            <button
              className="proceed-payment-btn"
              onClick={() =>
                navigate(`/booking/${event._id}`, {
                  state: {
                    selectedType,
                    selectedImage: image,
                    selectedOption
                  }
                })
              }
            >
              <span>
                Proceed to Payment
              </span>

              <span className="payment-arrow">
                →
              </span>
            </button>


            <button
              className="details-back-btn secondary"
              onClick={() =>
                navigate("/events")
              }
            >
              ← Back to Events
            </button>

          </div>

        </aside>

      </main>

    </div>
  );
}


/* =========================================================
   WEDDING TYPE DESCRIPTIONS
   ========================================================= */

function getWeddingDescription(type) {

  const descriptions = {

    Traditional:
      "Celebrate your wedding with timeless traditions, elegant decorations, beautiful rituals and a warm family atmosphere.",

    Destination:
      "Celebrate your special day at a beautiful destination with stunning surroundings, premium arrangements and unforgettable experiences.",

    Christian:
      "A graceful Christian wedding celebration featuring elegant arrangements, beautiful ceremonies, floral decorations and memorable moments.",

    Muslim:
      "A beautiful Muslim wedding celebration with traditional arrangements, elegant decorations, delicious catering and a meaningful atmosphere.",

    Luxury:
      "Experience a luxurious wedding celebration with premium décor, elegant venues, exceptional hospitality and sophisticated arrangements."
  };

  return (
    descriptions[type] ||
    "A beautiful wedding celebration carefully planned for your special day."
  );
}

export default EventDetails;