import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import api from "../api";

export default function Booking() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const customization = location.state || {};

  const [event, setEvent] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(
    customization.selectedPackage || null
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    eventDate: "",
    guests: 100,
    notes: "",
    advancePercent: 25
  });

  useEffect(() => {
    async function loadEvent() {
      try {
        setError("");

        const { data } = await api.get(`/events/${eventId}`);
        const loadedEvent = data.event || data;

        setEvent(loadedEvent);

        // Select the package passed from the previous page.
        // Otherwise, automatically select the first available package.
        setSelectedPackage((current) => {
          if (current?.name) {
            const matchingPackage = loadedEvent.packages?.find(
              (pkg) => pkg.name === current.name
            );

            if (matchingPackage) {
              return matchingPackage;
            }
          }

          return loadedEvent.packages?.[0] || null;
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Event not found"
        );
      }
    }

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const selectedOptions = customization.selectedOptions || {};

  const selectedAddons = customization.selectedAddons || [];

  const selectedType = customization.selectedType || "";

  const optionExtra = event?.optionGroups?.reduce(
    (total, group) => {
      const selectedName = selectedOptions[group.name];

      const selected = group.options?.find(
        (option) => option.name === selectedName
      );

      return total + Number(selected?.price || 0);
    },
    0
  ) || 0;

  const addonTotal = selectedAddons.reduce(
    (total, addon) => total + Number(addon.price || 0),
    0
  );

  // Use the selected package price, or the event base price
  // when the event has no packages configured.
  const packagePrice = selectedPackage
    ? Number(selectedPackage.price)
    : Number(event?.price || 0);

  const totalAmount = packagePrice + optionExtra + addonTotal;

  const advance = Math.round(
    totalAmount * Number(form.advancePercent) / 100
  );

  async function submit(e) {
    e.preventDefault();

    if (submitting) return;

    if (event?.packages?.length > 0 && !selectedPackage) {
      setError("Please select a package.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const bookingData = {
        eventId,
        eventDate: form.eventDate,
        guests: Number(form.guests),
        notes: form.notes,
        advancePercent: Number(form.advancePercent),
        selectedOptions,
        selectedPackage: selectedPackage
          ? {
              name: selectedPackage.name,
              price: Number(selectedPackage.price)
            }
          : null,
        selectedAddons
      };

      const { data } = await api.post("/bookings", bookingData);

      navigate(`/payment/${data.booking._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!event) {
    return (
      <div className="page-center">
        {error || "Loading..."}
      </div>
    );
  }

  return (
    <div className="page narrow">
      <span className="mini-label">FINALIZE YOUR DREAM DAY</span>

      <h1>Confirm Event Details</h1>

      <div className="booking-summary">
        <img src={event.image} alt={event.title} />

        <div>
          <span className="chip">{event.category}</span>
          <h2>{event.title}</h2>
          <p>{event.venue}, {event.city}</p>
          <strong>
            ₹{totalAmount.toLocaleString("en-IN")}
          </strong>
        </div>
      </div>

      <div className="selection-summary">
        <h3>Your Selection</h3>

        {selectedType && (
          <div className="selection-row">
            <span>Wedding Style</span>
            <strong>{selectedType}</strong>
          </div>
        )}

        {Object.entries(selectedOptions).map(([key, value]) => (
          <div className="selection-row" key={key}>
            <span>{key}</span>
            <strong>{value}</strong>
          </div>
        ))}

        {event.packages?.length > 0 && (
          <label>
            Select Package

            <select
              value={selectedPackage?.name || ""}
              onChange={(e) => {
                const pkg = event.packages.find(
                  (item) => item.name === e.target.value
                );

                setSelectedPackage(pkg || null);
              }}
              required
            >
              <option value="">Choose a package</option>

              {event.packages.map((pkg) => (
                <option key={pkg.name} value={pkg.name}>
                  {pkg.name} — ₹
                  {Number(pkg.price).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </label>
        )}

        {selectedPackage && (
          <div className="selection-row">
            <span>Package</span>
            <strong>{selectedPackage.name}</strong>
          </div>
        )}

        {selectedAddons.length > 0 && (
          <div className="selected-addon-list">
            <span>Add-ons</span>

            {selectedAddons.map((addon) => (
              <div key={addon.name}>
                {addon.name}
                <strong>
                  +₹{Number(addon.price).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <form className="form-card" onSubmit={submit}>
        <label>
          Event Date

          <input
            required
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={form.eventDate}
            onChange={(e) =>
              setForm({ ...form, eventDate: e.target.value })
            }
          />
        </label>

        <label>
          Number of Guests

          <input
            required
            type="number"
            min="1"
            max={event.capacity || undefined}
            value={form.guests}
            onChange={(e) =>
              setForm({ ...form, guests: e.target.value })
            }
          />

          <small>
            Maximum capacity: {event.capacity || 100}
          </small>
        </label>

        <label>
          Advance Payment

          <select
            value={form.advancePercent}
            onChange={(e) =>
              setForm({
                ...form,
                advancePercent: Number(e.target.value)
              })
            }
          >
            <option value={25}>25% Advance</option>
            <option value={50}>50% Advance</option>
            <option value={75}>75% Advance</option>
            <option value={100}>Full Payment</option>
          </select>
        </label>

        <label>
          Share Your Requirements

          <textarea
            rows="6"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
            placeholder="Decoration theme, food preferences, stage setup, photography requirements..."
          />
        </label>

        <div className="booking-price-breakdown">
          <div>
            <span>Package</span>
            <strong>
              ₹{packagePrice.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Style customization</span>
            <strong>
              ₹{optionExtra.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Add-ons</span>
            <strong>
              ₹{addonTotal.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="grand-total">
            <span>Total Event Package</span>
            <strong>
              ₹{totalAmount.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="advance-box">
          <span>Pay now ({form.advancePercent}%)</span>
          <strong>₹{advance.toLocaleString("en-IN")}</strong>
        </div>

        {error && <div className="error">{error}</div>}

        <button
          className="primary-btn wide"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating Booking..." : "Continue to Payment"}
        </button>

        <Link
          to={`/events/${eventId}`}
          state={customization}
          className="center-link"
        >
          ← Modify Event
        </Link>
      </form>
    </div>
  );
}

