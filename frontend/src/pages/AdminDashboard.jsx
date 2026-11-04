import { useEffect, useState } from "react";
import { Users, CalendarDays, ClipboardList, IndianRupee, Plus } from "lucide-react";
import api from "../api";

const blankEvent = {
  title: "", category: "Wedding", description: "", city: "", venue: "", price: 50000,
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
  capacity: 100, features: ["Decoration", "Catering", "Photography"]
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(blankEvent);
  const [tab, setTab] = useState("overview");
  const [message, setMessage] = useState("");

  async function load() {
    const [s, u, b, e] = await Promise.all([
      api.get("/admin/stats"), api.get("/admin/users"), api.get("/admin/bookings"), api.get("/admin/events")
    ]);
    setStats(s.data.stats); setUsers(u.data.users); setBookings(b.data.bookings); setEvents(e.data.events);
  }
  useEffect(() => { load(); }, []);

  async function createEvent(e) {
    e.preventDefault();
    try {
      await api.post("/events", form);
      setMessage("Event created.");
      setForm(blankEvent);
      load();
    } catch (err) { setMessage(err.response?.data?.message || "Could not create event"); }
  }

  return (
    <div className="admin-page">
      <aside className="admin-side">
        <div className="brand"><span className="brand-icon">✦</span> Dream Day</div>
        <p>Admin Console</p>
        {["overview","users","events","bookings"].map(t => <button className={tab === t ? "admin-tab active" : "admin-tab"} key={t} onClick={() => setTab(t)}>{t}</button>)}
      </aside>
      <section className="admin-main">
        <div className="page-title"><div><span className="mini-label">ADMIN DASHBOARD</span><h1>Management Console</h1><p>See registered users, events, bookings and advance payments.</p></div></div>

        {tab === "overview" && <>
          <div className="stats-grid">
            <div className="stat-card"><Users/><span>Users</span><strong>{stats.users || 0}</strong></div>
            <div className="stat-card"><CalendarDays/><span>Events</span><strong>{stats.events || 0}</strong></div>
            <div className="stat-card"><ClipboardList/><span>Bookings</span><strong>{stats.bookings || 0}</strong></div>
            <div className="stat-card"><IndianRupee/><span>Advance revenue</span><strong>₹{(stats.revenue || 0).toLocaleString("en-IN")}</strong></div>
          </div>
          <div className="admin-card"><h2>Recent registrations</h2><UsersTable users={users.slice(0,6)}/></div>
        </>}

        {tab === "users" && <div className="admin-card"><h2>Registered users</h2><UsersTable users={users}/></div>}

        {tab === "events" && <div className="admin-two">
          <div className="admin-card"><h2>Add event</h2>{message && <div className="success">{message}</div>}
            <form className="form-card flat" onSubmit={createEvent}>
              {["title","description","city","venue","price","capacity","image"].map(field => <label key={field}>{field}<input required value={form[field]} onChange={e => setForm({...form,[field]:field==="price"||field==="capacity"?Number(e.target.value):e.target.value})}/></label>)}
              <label>category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{["Wedding","Birthday","Engagement","Baby Shower","Corporate","Graduation","Anniversary","Concert","Party"].map(x=><option key={x}>{x}</option>)}</select></label>
              <label>features (comma separated)<input value={form.features.join(", ")} onChange={e => setForm({...form,features:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></label>
              <button className="primary-btn"><Plus size={17}/> Create event</button>
            </form>
          </div>
          <div className="admin-card"><h2>Event catalogue</h2><div className="mini-list">{events.map(e => <div key={e._id}><img src={e.image} alt=""/><div><strong>{e.title}</strong><small>{e.category} · ₹{e.price.toLocaleString("en-IN")}</small></div></div>)}</div></div>
        </div>}

        {tab === "bookings" && <div className="admin-card"><h2>All bookings</h2><BookingsTable bookings={bookings}/></div>}
      </section>
    </div>
  );
}

function UsersTable({ users }) {
  return <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Verified</th><th>Joined</th></tr></thead><tbody>{users.map(u => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone || "-"}</td><td>{u.role}</td><td>{u.isVerified ? "Yes" : "No"}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>;
}

function BookingsTable({ bookings }) {
  return <div className="table-wrap"><table><thead><tr><th>Customer</th><th>Event</th><th>Date</th><th>Advance</th><th>Payment</th><th>Booking</th></tr></thead><tbody>{bookings.map(b => <tr key={b._id}><td>{b.user?.name}<small>{b.user?.email}</small></td><td>{b.event?.title}</td><td>{new Date(b.eventDate).toLocaleDateString()}</td><td>₹{b.advanceAmount.toLocaleString("en-IN")}</td><td><span className={`status ${b.paymentStatus}`}>{b.paymentStatus}</span></td><td><span className={`status ${b.bookingStatus}`}>{b.bookingStatus}</span></td></tr>)}</tbody></table></div>;
}
