import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import api from "../api";

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [qr, setQr] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(
    Boolean(window.Razorpay)
  );
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Load booking details
  useEffect(() => {
    async function loadBooking() {
      try {
        setError("");

        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data.booking);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load booking"
        );
      }
    }

    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  // Load Razorpay Checkout
  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      setError("Could not load Razorpay. Please refresh the page.");
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle successful payment verification
  async function verifyPayment(response) {
    try {
      const { data } = await api.post("/payments/verify", {
        bookingId,
        ...response
      });

      setPaymentSuccess(true);
      setQr(null);

      // Reload booking details to get the updated status
      const updatedBooking = await api.get(`/bookings/${bookingId}`);
      setBooking(updatedBooking.data.booking);

      return data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Payment verification failed. Please contact support if money was deducted."
      );
      throw err;
    }
  }

  // Pay using Razorpay Checkout
  async function payWithRazorpay() {
    try {
      setError("");
      setBusy(true);

      if (!scriptLoaded || !window.Razorpay) {
        setError("Razorpay is still loading. Please try again.");
        setBusy(false);
        return;
      }

      const { data } = await api.post("/payments/create-order", {
        bookingId
      });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Dream Day",
        description: "Event booking advance",
        order_id: data.orderId,

        prefill: {
          name: booking?.user?.name || "",
          email: booking?.user?.email || ""
        },

        theme: {
          color: "#4f46e5"
        },

        handler: async function (response) {
          try {
            await verifyPayment(response);
          } catch {
            // Error is displayed by verifyPayment().
          } finally {
            setBusy(false);
          }
        },

        modal: {
          ondismiss: () => setBusy(false)
        }
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", function (response) {
        setError(
          response.error?.description || "Payment failed. Please try again."
        );
        setBusy(false);
      });

      checkout.open();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not start payment"
      );
      setBusy(false);
    }
  }

  // Generate a Razorpay QR code
  async function createQr() {
    try {
      setError("");
      setQr(null);
      setBusy(true);

      const { data } = await api.post("/payments/create-qr", {
        bookingId
      });

      setQr(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not create QR code"
      );
    } finally {
      setBusy(false);
    }
  }

  // Check QR payment status
  useEffect(() => {
    if (!qr || paymentSuccess) return;

    let cancelled = false;

    async function checkQrStatus() {
      try {
        const { data } = await api.get(
          `/payments/qr-status/${bookingId}`
        );

        if (cancelled) return;

        if (
          data.paymentStatus === "paid" ||
          data.booking?.paymentStatus === "paid"
        ) {
          setPaymentSuccess(true);
          setQr(null);

          const updatedBooking = await api.get(
            `/bookings/${bookingId}`
          );

          if (!cancelled) {
            setBooking(updatedBooking.data.booking);
          }
        }
      } catch (err) {
        // Keep the QR visible if a status check temporarily fails.
        console.error(
          "Could not check QR payment status:",
          err.response?.data?.message || err.message
        );
      }
    }

    checkQrStatus();

    const intervalId = setInterval(checkQrStatus, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [qr, bookingId, paymentSuccess]);

  if (!booking) {
    return (
      <div className="page-center">
        {error || "Loading payment..."}
      </div>
    );
  }

  // Payment success screen
  if (paymentSuccess) {
    return (
      <div className="page narrow">
        <div className="payment-card success-card">
          <CheckCircle size={64} color="#16a34a" />

          <h1>Payment Successful!</h1>

          <p>
            Your advance payment has been verified successfully.
          </p>

          <div className="payment-total">
            <span>Amount Paid</span>
            <strong>
              ₹
              {Number(booking.advanceAmount || 0).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>

          <div className="payment-total">
            <span>Booking Status</span>
            <strong>
              {booking.bookingStatus === "confirmed"
                ? "Confirmed"
                : "Payment Verified"}
            </strong>
          </div>

          <button
            className="primary-btn wide"
            onClick={() => navigate("/my-events")}
          >
            View My Bookings
          </button>

          <button
            className="outline-btn wide"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <span className="mini-label">SECURE PAYMENT</span>

      <h1>Pay Your Advance</h1>

      <div className="payment-card">
        <div className="payment-event">
          {booking.event?.image && (
            <img
              src={booking.event.image}
              alt={booking.event.title || "Event"}
            />
          )}

          <div>
            <h2>{booking.event?.title || "Event Booking"}</h2>

            <p>
              {booking.eventDate
                ? new Date(booking.eventDate).toLocaleDateString()
                : "Date not available"}
            </p>
          </div>
        </div>

        <div className="payment-total">
          <span>Advance ({booking.advancePercent}%)</span>

          <strong>
            ₹
            {Number(booking.advanceAmount || 0).toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <button
          className="primary-btn wide"
          onClick={payWithRazorpay}
          disabled={busy || !scriptLoaded}
        >
          <CreditCard size={18} />

          {busy
            ? "Please wait..."
            : !scriptLoaded
              ? "Loading Payment..."
              : "Pay with Card / UPI"}
        </button>

        <button
          className="outline-btn wide"
          onClick={createQr}
          disabled={busy}
        >
          <QrCode size={18} />

          {busy ? "Please wait..." : "Generate QR Payment"}
        </button>

        <div className="secure-note">
          <ShieldCheck size={18} />

          Payments are processed by Razorpay. Dream Day never
          stores your card details.
        </div>

        {qr && (
          <div className="qr-panel">
            <h3>Scan to Pay</h3>

            {qr.qrImageUrl ? (
              <img
                src={qr.qrImageUrl}
                alt="Razorpay payment QR code"
              />
            ) : qr.qrDataUrl ? (
              <img
                src={qr.qrDataUrl}
                alt="Payment QR code"
              />
            ) : (
              <p>
                The QR image is unavailable. Use the payment link
                below if one was provided.
              </p>
            )}

            <p>
              Amount: ₹
              {Number(
                qr.amount ??
                  qr.paymentAmount ??
                  booking.advanceAmount
              ).toLocaleString("en-IN")}
            </p>

            {(qr.paymentUrl || qr.paymentLinkUrl) && (
              <a
                href={qr.paymentUrl || qr.paymentLinkUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Payment Link <ExternalLink size={14} />
              </a>
            )}

            <small>
              This page checks the payment status automatically.
              Your booking should be confirmed only after the
              backend verifies the payment.
            </small>
          </div>
        )}

        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}