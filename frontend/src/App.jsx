import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import MyEvents from "./pages/MyEvents";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import About from "./pages/About";
import Footer from "./components/Footer";
import AIPlanner from "./pages/AIPlanner";
import GiftRegistry from "./pages/GiftRegistry";
import VenueVisualizer from "./pages/VenueVisualizer";
import VendorHub from "./pages/VendorHub";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import LoginSelection from "./admin/LoginSelection";






export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/booking/:eventId" element={<Booking />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/login" element={<LoginSelection />} />
          <Route path="/user-login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/gift-registry" element={<GiftRegistry />} />
          <Route
  path="/venue-visualizer"
  element={<VenueVisualizer />}

/>
          <Route path="/vendor-hub" element={<VendorHub />} />
         <Route path="/admin/login" element={<AdminLogin />} />

<Route element={<AdminRoute />}>
  <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
  />
</Route>


          
          

          

          <Route element={<ProtectedRoute />}>
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<div className="page-center"><h1>404</h1><p>Page not found.</p></div>} />
        </Routes>
      </main>
       <Footer />
    </>
  );
}
