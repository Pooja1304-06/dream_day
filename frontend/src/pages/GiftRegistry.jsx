import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import "./GiftRegistry.css";

export default function GiftRegistry() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) {
      setError("Please select an event to view its gift registry.");
      setLoading(false);
      return;
    }

    async function loadGifts() {
      try {
        const response = await api.get(`/gifts/${eventId}`);
        setGifts(response.data);
      } catch {
        setError("Unable to load gifts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadGifts();
  }, [eventId]);

  if (loading) {
    return <p className="registry-message">Loading gifts...</p>;
  }

  if (error) {
    return <p className="registry-message">{error}</p>;
  }

  return (
    <main className="gift-registry">
      <header className="registry-header">
        <span className="registry-eyebrow">MAKE THEIR DAY SPECIAL</span>
        <h1>Smart Gift Registry 🎁</h1>
        <p>
          Discover thoughtful gifts and choose something special
          for this celebration.
        </p>
      </header>

      <div className="registry-summary">
        <div>
          <strong>{gifts.length}</strong>
          <span>Total Gifts</span>
        </div>

        <div>
          <strong>
            {gifts.filter((gift) => gift.status === "Available").length}
          </strong>
          <span>Available</span>
        </div>

        <div>
          <strong>
            {gifts.filter((gift) => gift.status !== "Available").length}
          </strong>
          <span>Unavailable</span>
        </div>
      </div>

      {gifts.length === 0 ? (
        <div className="registry-empty">
          <span>🎁</span>
          <h2>No gifts added yet</h2>
          <p>Check back later to discover gifts for this event.</p>
        </div>
      ) : (
        <div className="gift-grid">
          {gifts.map((gift) => (
            <article className="gift-card" key={gift._id}>
              <div className="gift-image">
                {gift.image ? (
                  <img src={gift.image} alt={gift.name} />
                ) : (
                  <span>🎁</span>
                )}

                <span
                  className={`gift-status ${
                    gift.status === "Available"
                      ? "status-available"
                      : "status-unavailable"
                  }`}
                >
                  {gift.status}
                </span>
              </div>

              <div className="gift-details">
                <h2>{gift.name}</h2>
                <p>{gift.description || "A thoughtful gift for a special day."}</p>

                <div className="gift-footer">
                  <strong>₹{Number(gift.price).toLocaleString("en-IN")}</strong>

                  <button
                    type="button"
                    disabled={gift.status !== "Available"}
                    onClick={() =>
                      alert("Gift reservation will be enabled in the next step.")
                    }
                  >
                    {gift.status === "Available" ? "Reserve Gift" : "Unavailable"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}