import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const types = ["Wedding", "Birthday", "Engagement", "Baby Shower", "Corporate", "Graduation", "Anniversary", "Concert", "Party"];

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "Wedding", guests: 100, budget: 50000, city: "", date: "", indoor: "Indoor", theme: "Elegant"
  });

  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function submit(e) {
    e.preventDefault();
    if (!user) return navigate("/login");
    sessionStorage.setItem("dreamdayPlan", JSON.stringify(form));
    navigate("/events");
  }

  return (
    <div className="page narrow">
      <span className="mini-label">SMART EVENT PLANNER</span>
      <h1>Build your event</h1>
      <p className="lead">Tell us what your Dream Day looks like. You can refine the package before booking.</p>
      <form className="form-card" onSubmit={submit}>
        <label>Event type<select name="type" value={form.type} onChange={update}>{types.map(t => <option key={t}>{t}</option>)}</select></label>
        <div className="two-col">
          <label>Guests<input name="guests" type="number" min="1" value={form.guests} onChange={update}/></label>
          <label>Budget (₹)<input name="budget" type="number" min="1000" value={form.budget} onChange={update}/></label>
        </div>
        <div className="two-col">
          <label>City<input name="city" placeholder="Chennai" value={form.city} onChange={update}/></label>
          <label>Preferred date<input name="date" type="date" value={form.date} onChange={update}/></label>
        </div>
        <div className="two-col">
          <label>Venue style<select name="indoor" value={form.indoor} onChange={update}><option>Indoor</option><option>Outdoor</option><option>Either</option></select></label>
          <label>Theme<select name="theme" value={form.theme} onChange={update}><option>Elegant</option><option>Minimal</option><option>Royal</option><option>Modern</option><option>Floral</option></select></label>
        </div>
        <button className="primary-btn wide">Find my event</button>
      </form>
    </div>
  );
}
