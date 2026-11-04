import jwt from "jsonwebtoken";

export function requireAdminSession(req, res, next) {
  try {
    const token = req.cookies?.admin_token;

    if (!token) {
      return res.status(401).json({
        message: "Admin login required"
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Admin authentication is not configured"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access denied"
      });
    }

    req.admin = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin session"
    });
  }
}