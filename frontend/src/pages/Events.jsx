import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const eventTypes = {
  Wedding: [
    {
      name: "Traditional Wedding",
      type: "Traditional",
      description:
        "A beautiful traditional Indian wedding with elegant rituals, decorations and celebrations.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Destination Wedding",
      type: "Destination",
      description:
        "Celebrate your special day at a beautiful destination with a memorable wedding experience.",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Christian Wedding",
      type: "Christian",
      description:
        "A graceful Christian wedding with church ceremony, elegant décor and reception.",
      image:
        "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Muslim Wedding",
      type: "Muslim",
      description:
        "A beautiful Nikah and wedding celebration with traditional elegance and décor.",
      image:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Luxury Wedding",
      type: "Luxury",
      description:
        "An extraordinary luxury wedding with premium décor, entertainment and hospitality.",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  Birthday: [
    {
      name: "Kids Birthday",
      type: "Kids",
      description:
        "A colorful and fun birthday celebration specially designed for kids.",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Adult Birthday",
      type: "Adult",
      description:
        "A stylish birthday celebration with music, food and entertainment.",
      image:
        "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Surprise Birthday",
      type: "Surprise",
      description:
        "Plan an unforgettable surprise birthday celebration.",
      image:
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Theme Birthday",
      type: "Theme",
      description:
        "Choose a unique theme and create a personalized birthday experience.",
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  Engagement: [
    {
      name: "Traditional Engagement",
      type: "Traditional",
      description:
        "A beautiful traditional engagement ceremony.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Garden Engagement",
      type: "Garden",
      description:
        "A romantic garden engagement surrounded by beautiful decorations.",
      image:
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Luxury Engagement",
      type: "Luxury",
      description:
        "A premium engagement celebration.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  "Baby Shower": [
    {
      name: "Traditional Baby Shower",
      type: "Traditional",
      description:
        "A warm traditional baby shower celebration.",
      image:
        "https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Floral Baby Shower",
      type: "Floral",
      description:
        "A beautiful floral-themed baby shower.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Royal Baby Shower",
      type: "Royal",
      description:
        "A luxurious royal-themed baby shower.",
      image:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  Corporate: [
    {
      name: "Conference",
      type: "Conference",
      description:
        "Professional conference planning with seating, AV and hospitality.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Seminar",
      type: "Seminar",
      description:
        "A professionally organized seminar.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Product Launch",
      type: "Product Launch",
      description:
        "Launch your product with an impressive professional event.",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Team Building",
      type: "Team Building",
      description:
        "Create memorable team-building experiences.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  Graduation: [
    {
      name: "College Graduation",
      type: "College Graduation",
      description:
        "Celebrate an important academic achievement.",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "School Graduation",
      type: "School Graduation",
      description:
        "A fun and memorable school graduation.",
      image:
        "https://images.unsplash.com/photo-1627556704302-624286467c65?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Grand Graduation Party",
      type: "Grand Party",
      description:
        "Celebrate graduation with a grand party.",
      image:
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  Anniversary: [
    {
      name: "Romantic Anniversary",
      type: "Romantic",
      description:
        "A romantic celebration designed for couples.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Silver Jubilee",
      type: "Silver Jubilee",
      description:
        "Celebrate 25 wonderful years together.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Golden Jubilee",
      type: "Golden Jubilee",
      description:
        "A grand celebration for 50 years together.",
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  Concert: [
    {
      name: "Music Concert",
      type: "Music Concert",
      description:
        "Organize a professional music concert.",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "DJ Night",
      type: "DJ Night",
      description:
        "A high-energy DJ night with lights and music.",
      image:
        "https://images.unsplash.com/photo-1571266028243-d220c9c3b7f4?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "College Fest",
      type: "College Fest",
      description:
        "An exciting college fest with entertainment.",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Festival",
      type: "Festival",
      description:
        "Create a large-scale festival experience.",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",
    },
  ],
};

function Events() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] =
    useState("Wedding");

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await api.get("/events");

        const data =
          response.data?.events ||
          response.data?.data ||
          response.data ||
          [];

        setEvents(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Failed to load events:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const backendEvent = events.find(
    (event) =>
      String(event.category || "").toLowerCase() ===
      selectedCategory.toLowerCase()
  );

  const currentTypes =
    eventTypes[selectedCategory] || [];

  const handleViewDetails = (type) => {
    if (!backendEvent?._id) {
      alert(
        `No ${selectedCategory} event found in the database.`
      );
      return;
    }

    navigate(`/events/${backendEvent._id}`, {
      state: {
        event: backendEvent,
        selectedType: type.type,
        category: selectedCategory,
      },
    });
  };

  return (
    <div className="events-page">

      <section className="events-header">

        <p className="events-small-title">
          DREAM DAY EVENTS
        </p>

        <h1>
          Find the perfect event
          <br />
          for your special day.
        </h1>

        <p className="events-description">
          Select an event category and then
          choose the exact celebration style
          you want.
        </p>

      </section>

      <div className="event-category-wrapper">

        <button
          className={
            selectedCategory === "All"
              ? "event-category active"
              : "event-category"
          }
          onClick={() =>
            setSelectedCategory("Wedding")
          }
        >
          All
        </button>

        {Object.keys(eventTypes).map(
          (category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "event-category active"
                  : "event-category"
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
          )
        )}

      </div>

      <section className="event-types-section">

        <div className="event-section-heading">

          <div>
            <p className="events-small-title">
              {selectedCategory.toUpperCase()}
            </p>

            <h2>
              Choose your{" "}
              {selectedCategory.toLowerCase()} type
            </h2>
          </div>

          <span>
            {currentTypes.length} options
          </span>

        </div>

        {loading ? (
          <div className="events-loading">
            Loading events...
          </div>
        ) : (
          <div className="event-types-grid">

            {currentTypes.map((type) => (
              <article
                key={type.type}
                className="event-type-card"
              >

                <div className="event-type-image-wrapper">

                  <img
                    src={type.image}
                    alt={type.name}
                    className="event-type-image"
                  />

                  <div className="event-type-badge">
                    {selectedCategory}
                  </div>

                </div>

                <div className="event-type-content">

                  <h3>{type.name}</h3>

                  <p>
                    {type.description}
                  </p>

                  <button
                    className="view-details-btn"
                    onClick={() =>
                      handleViewDetails(type)
                    }
                  >
                    View Details
                    <span>→</span>
                  </button>

                </div>

              </article>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Events;