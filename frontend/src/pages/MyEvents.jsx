import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CreditCard, MapPin } from "lucide-react";
import api from "../api";

export default function MyEvents() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => { api.get("/bookings/mine").then(r => setBookings(r.data.bookings)); }, []);

  return (
    <div className="page">
      <div className="page-title"><div><span className="mini-label">YOUR JOURNEY</span><h1>My Events</h1><p>Track your planned celebrations and payments.</p></div><Link className="primary-btn" to="/events">Book another</Link></div>
      {!bookings.length ? <div className="empty">No bookings yet. <Link to="/events">Explore events</Link></div> :
      <div className="booking-list">{bookings.map(b => (
        <article className="booking-row" key={b._id}>
          <img src={b.event.image} alt={b.event.title}/>
          <div className="booking-main"><span className="chip">{b.event.category}</span><h2>{b.event.title}</h2><p><CalendarDays size={15}/> {new Date(b.eventDate).toLocaleDateString()} &nbsp; <MapPin size={15}/> {b.event.city}</p><p><CreditCard size={15}/> Advance: ₹{b.advanceAmount.toLocaleString("en-IN")}</p></div>
          <div className="booking-status"><span className={`status ${b.paymentStatus}`}>{b.paymentStatus}</span><span className={`status ${b.bookingStatus}`}>{b.bookingStatus}</span>{b.paymentStatus !== "paid" && <Link className="primary-btn small" to={`/payment/${b._id}`}>Pay now</Link>}</div>
        </article>
      ))}</div>}
    </div>
  );
}
