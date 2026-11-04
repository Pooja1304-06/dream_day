import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-column footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">✦</span>
            Dream Day
          </Link>

          <p>
            Creating unforgettable moments, beautiful celebrations,
            and memorable experiences — all in one place.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>

            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>

            <a href="#" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/about">About Us</Link>
          <Link to="/create-event">Plan Your Event</Link>
        </div>

        {/* Event Categories */}
        <div className="footer-column">
          <h3>Events</h3>

          <Link to="/events">Wedding</Link>
          <Link to="/events">Birthday</Link>
          <Link to="/events">Corporate</Link>
          <Link to="/events">Engagement</Link>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <div className="footer-contact">
            <MapPin size={17} />
            <span>Coimbatore, Tamil Nadu</span>
          </div>

          <div className="footer-contact">
            <Phone size={17} />
            <span>+91 98765 43210</span>
          </div>

          <div className="footer-contact">
            <Mail size={17} />
            <span>hello@dreamday.com</span>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Dream Day. All rights reserved.
        </p>

        <p className="footer-made">
          Made with <Heart size={14} fill="currentColor" /> for your special day
        </p>
      </div>
    </footer>
  );
}