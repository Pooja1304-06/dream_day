# Dream Day – Smart Event Planner & Management (MERN)

A complete student-project starter for:
- React + Vite frontend
- Node.js + Express backend
- MongoDB Atlas
- JWT authentication in an HTTP-only cookie
- Email OTP for registration and every login
- Event catalogue and event details
- Event booking with advance-payment percentage
- Razorpay Checkout for cards + UPI (UPI apps such as Google Pay depend on the payment methods enabled for your Razorpay account)
- Razorpay Payment Link + QR display for QR payments
- Payment signature verification
- Razorpay webhook support
- Customer "My Events"
- Admin dashboard for users, events, bookings and payments

## 1. Software to install

1. Node.js LTS
2. VS Code
3. MongoDB Atlas account
4. A Gmail account (or another SMTP provider) for OTP emails
5. Razorpay account for Test Mode
6. Git (optional)

## 2. Project folders

dreamday-mern/
  frontend/
  backend/

## 3. Backend setup

Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env` and fill it.

Minimum values:
- MONGODB_URI
- JWT_SECRET
- FRONTEND_URL
- SMTP_USER
- SMTP_PASS
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD

For Gmail SMTP, use a Gmail App Password rather than your normal Gmail password.

Start:
```bash
npm run dev
```

The API runs on http://localhost:5000.

Create the admin account:
```bash
npm run seed:admin
```

## 4. Frontend setup

Open another terminal in `frontend`:

```bash
npm install
npm run dev
```

The frontend normally runs on http://localhost:5173.

## 5. MongoDB Atlas

Create a cluster -> Database Access -> create a database user.
Then Network Access -> add your development IP.
Copy the Node.js connection string into `MONGODB_URI`.

Example:
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/dreamday?retryWrites=true&w=majority

## 6. OTP flow

Register:
1. User enters name, email, phone, password.
2. Server hashes password.
3. Server generates a 6-digit OTP.
4. OTP is stored as a bcrypt hash with a 10-minute expiry.
5. Nodemailer sends the OTP.
6. User enters OTP.
7. Server verifies OTP.
8. Server signs a JWT.
9. JWT is placed in an HTTP-only cookie.
10. Protected pages can now access `/api/auth/me`.

Login uses the same OTP verification flow.

## 7. Razorpay flow

1. User creates a booking.
2. Server calculates the selected advance amount.
3. Server creates a Razorpay Order.
4. React opens Razorpay Checkout.
5. Customer can use available card/UPI methods.
6. React sends payment ID, order ID and signature to the server.
7. Server verifies the Razorpay signature with HMAC SHA-256.
8. Booking is marked paid/confirmed.
9. A separate QR option creates a Razorpay Payment Link and displays its URL as a QR code.
10. Configure a Razorpay webhook to update QR-payment bookings.

Do not put `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, SMTP passwords or webhook secrets in the React app.

## 8. Important payment note

Use Razorpay Test Mode while developing. Cards, UPI and specific UPI apps shown in Checkout depend on what Razorpay enables for the account. The QR route in this starter uses a Razorpay Payment Link and converts its short URL into a QR image in the browser.

## 9. Main pages

Customer:
- Home
- Events
- Event Details
- Create Event
- Booking
- Payment
- My Events
- Profile
- Login
- Register
- Verify OTP
- About

Admin:
- Admin Dashboard
- Users
- Events
- Bookings
- Payment status

## 10. Admin login

Use the ADMIN_EMAIL and ADMIN_PASSWORD from `.env`, run `npm run seed:admin`, then use the normal Login page. The admin also receives a login OTP before the admin dashboard opens.

## 11. Recommended demo

Create three events from the admin dashboard:
- Wedding Celebration – ₹80,000
- Birthday Party – ₹25,000
- Corporate Event – ₹60,000

Then register a normal user, verify the email OTP, book an event and test Razorpay Test Mode.
