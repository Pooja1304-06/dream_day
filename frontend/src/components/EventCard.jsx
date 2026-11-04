import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <img src={event.image} alt={event.title} />
      <div className="event-card-body">
        <div className="chip">{event.category}</div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-meta">
          <span><MapPin size={15} /> {event.city}</span>
          <span><Users size={15} /> {event.capacity} guests</span>
        </div>
        <div className="card-footer">
          <strong>₹{event.price.toLocaleString("en-IN")}</strong>
          <Link className="primary-btn small" to={`/events/${event._id}`}>View details</Link>
        </div>
      </div>
    </article>
  );
}
