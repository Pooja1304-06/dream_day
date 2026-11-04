import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Store,
  CreditCard,
  Package,
  MessageSquare,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  IndianRupee,
  ClipboardList,
  Sparkles,
  RefreshCw
} from "lucide-react";

import "./AdminDashboard.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {

  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    paidBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    revenue: 0
  });

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Bookings", icon: CalendarDays },
    { name: "Users", icon: Users },
    { name: "Vendors", icon: Store },
    { name: "Events", icon: Package },
    { name: "Payments", icon: CreditCard },
    { name: "Enquiries", icon: MessageSquare },
    { name: "Reviews", icon: Star },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings }
  ];

  // FETCH DASHBOARD DATA

  const fetchDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const [statsResponse, bookingResponse] =
        await Promise.all([

          fetch(`${API}/admin/stats`, {
            credentials: "include"
          }),

          fetch(`${API}/admin/bookings`, {
            credentials: "include"
          })

        ]);

      if (
        statsResponse.status === 401 ||
        statsResponse.status === 403 ||
        bookingResponse.status === 401 ||
        bookingResponse.status === 403
      ) {
        navigate("/admin/login");
        return;
      }

      if (!statsResponse.ok || !bookingResponse.ok) {
        throw new Error("Could not load dashboard information");
      }

      const statsData = await statsResponse.json();
      const bookingData = await bookingResponse.json();

      setStats(statsData.stats || {});
      setBookings(bookingData.bookings || []);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // LOGOUT

  const handleLogout = async () => {

    try {

      await fetch(`${API}/admin/auth/logout`, {
        method: "POST",
        credentials: "include"
      });

    } finally {

      sessionStorage.removeItem("adminName");
      navigate("/admin/login");

    }

  };

  // UPDATE BOOKING STATUS

  const updateBooking = async (id, bookingStatus) => {

    const confirmed = window.confirm(
      `Are you sure you want to ${bookingStatus} this booking?`
    );

    if (!confirmed) return;

    try {

      const response = await fetch(
        `${API}/admin/bookings/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json"
          },

          credentials: "include",

          body: JSON.stringify({
            bookingStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      await fetchDashboard();

      alert("Booking status updated successfully!");

    } catch (error) {

      alert(error.message);

    }

  };

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);

  };

  const formatDate = (date) => {

    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN");

  };

  const filteredBookings = bookings.filter((booking) => {

    const customer = booking.user?.name || "";
    const event = booking.event?.title || "";

    return (
      customer.toLowerCase().includes(search.toLowerCase()) ||
      event.toLowerCase().includes(search.toLowerCase()) ||
      booking._id.toLowerCase().includes(search.toLowerCase())
    );

  });

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: CalendarDays
    },
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: ClipboardList
    },
    {
      title: "Verified Advance Revenue",
      value: formatCurrency(stats.revenue),
      icon: IndianRupee
    }
  ];

  return (

    <div className="admin-dashboard">

      {/* MOBILE MENU */}

      <button
        className="admin-mobile-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* SIDEBAR */}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="admin-sidebar-brand">

          <img
    src="/img1.jpeg"
    alt=""
    className="brand-logo"
  />

          <div>
            <h2>Dream Day</h2>
            <span>ADMIN PANEL</span>
          </div>

        </div>

        <div className="admin-sidebar-section">
          MAIN MENU
        </div>

        <nav className="admin-sidebar-nav">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.name}
                className={`admin-menu-item ${
                  activeMenu === item.name ? "active" : ""
                }`}
                onClick={() => {

                  setActiveMenu(item.name);
                  setSidebarOpen(false);

                }}
              >

                <Icon size={19} />

                <span>{item.name}</span>

              </button>

            );

          })}

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-profile">

            <div className="admin-avatar">A</div>

            <div>
              <h4>Administrator</h4>
              <span>Super Admin</span>
            </div>

          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="admin-main-content">

        <header className="admin-topbar">

          <div>

            <h1>
              {activeMenu === "Dashboard"
                ? "Dashboard Overview"
                : activeMenu}
            </h1>

            <p>
              Welcome back! Here's what's happening with Dream Day.
            </p>

          </div>

          <div className="admin-topbar-actions">

            <div className="admin-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <button
              className="admin-notification-button"
              onClick={fetchDashboard}
              title="Refresh dashboard"
            >
              <RefreshCw size={19} />
            </button>

            <div className="admin-topbar-avatar">
              A
            </div>

          </div>

        </header>

        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}

        {loading ? (

          <div className="admin-panel">
            Loading dashboard information...
          </div>

        ) : (

          <>

            {/* STATISTICS */}

            <section className="admin-stats-grid">

              {statCards.map((stat, index) => {

                const Icon = stat.icon;

                return (

                  <div className="admin-stat-card" key={index}>

                    <div className="admin-stat-top">

                      <div className="admin-stat-icon">
                        <Icon size={23} />
                      </div>

                      <TrendingUp size={17} color="#16a34a" />

                    </div>

                    <h3>{stat.value}</h3>

                    <p>{stat.title}</p>

                  </div>

                );

              })}

            </section>

            {/* ADDITIONAL STATISTICS */}

            <section className="admin-content-grid">

              <div className="admin-panel">

                <h2>Booking Summary</h2>

                <div className="admin-quick-item">
                  <div className="quick-icon purple">
                    <CalendarDays size={20} />
                  </div>

                  <div>
                    <h4>Confirmed Bookings</h4>
                    <span>{stats.confirmedBookings}</span>
                  </div>
                </div>

                <div className="admin-quick-item">
                  <div className="quick-icon pink">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h4>Paid Bookings</h4>
                    <span>{stats.paidBookings}</span>
                  </div>
                </div>

                <div className="admin-quick-item">
                  <div className="quick-icon orange">
                    <Package size={20} />
                  </div>

                  <div>
                    <h4>Total Events</h4>
                    <span>{stats.events}</span>
                  </div>
                </div>

              </div>

              <div className="admin-panel">

                <h2>Platform Overview</h2>

                <p>
                  Your Dream Day platform statistics are
                  updated from MongoDB.
                </p>

                <div className="admin-quick-item">
                  <div className="quick-icon purple">
                    <Users size={20} />
                  </div>

                  <div>
                    <h4>Registered Customers</h4>
                    <span>{stats.users} users</span>
                  </div>
                </div>

                <div className="admin-quick-item">
                  <div className="quick-icon orange">
                    <ClipboardList size={20} />
                  </div>

                  <div>
                    <h4>All Bookings</h4>
                    <span>{stats.bookings} bookings</span>
                  </div>
                </div>

              </div>

            </section>

            {/* BOOKINGS TABLE */}

            <section className="admin-panel admin-bookings-panel">

              <div className="admin-panel-heading">

                <div>

                  <h2>Customer Bookings</h2>

                  <p>
                    All event bookings received from customers
                  </p>

                </div>

                <button
                  className="admin-view-all"
                  onClick={fetchDashboard}
                >
                  Refresh
                </button>

              </div>

              <div className="admin-table-wrapper">

                <table className="admin-booking-table">

                  <thead>

                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Event</th>
                      <th>Event Date</th>
                      <th>Guests</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredBookings.length === 0 ? (

                      <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>
                          No bookings found.
                        </td>
                      </tr>

                    ) : (

                      filteredBookings.map((booking) => (

                        <tr key={booking._id}>

                          <td className="admin-booking-id">
                            {booking._id.slice(-7).toUpperCase()}
                          </td>

                          <td>
                            <strong>{booking.user?.name || "Unknown"}</strong>
                            <br />
                            {booking.user?.email || ""}
                          </td>

                          <td>
                            {booking.event?.title || "Event unavailable"}
                          </td>

                          <td>
                            {formatDate(booking.eventDate)}
                          </td>

                          <td>
                            {booking.guests}
                          </td>

                          <td>
                            {formatCurrency(booking.totalAmount)}
                          </td>

                          <td>
                            <span className={`admin-status ${
                              booking.paymentStatus === "paid"
                                ? "confirmed"
                                : "pending"
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </td>

                          <td>
                            <span className={`admin-status ${
                              booking.bookingStatus === "confirmed"
                                ? "confirmed"
                                : booking.bookingStatus === "cancelled"
                                ? "cancelled"
                                : "pending"
                            }`}>
                              {booking.bookingStatus}
                            </span>
                          </td>

                          <td>

                            {booking.bookingStatus !== "confirmed" && (
                              <button
                                className="admin-view-all"
                                onClick={() => updateBooking(
                                  booking._id,
                                  "confirmed"
                                )}
                              >
                                Confirm
                              </button>
                            )}

                            {booking.bookingStatus !== "cancelled" && (
                              <button
                                className="admin-view-all"
                                style={{
                                  marginTop: "5px",
                                  background: "#fff1f2",
                                  color: "#be123c"
                                }}
                                onClick={() => updateBooking(
                                  booking._id,
                                  "cancelled"
                                )}
                              >
                                Cancel
                              </button>
                            )}

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </section>

          </>

        )}

        <footer className="admin-dashboard-footer">
          © 2026 Dream Day Admin Dashboard
        </footer>

      </main>

    </div>

  );

};

export default AdminDashboard;