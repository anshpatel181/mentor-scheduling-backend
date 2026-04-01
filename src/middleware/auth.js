import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) throw new Error("JWT_SECRET is required");
// Must match Mentorque platform JWT_SECRET (used for sso-token and admin/mentor JWTs)


function roleFromDecoded(decoded) {
  if (decoded.role === "USER" || decoded.role === "MENTOR" || decoded.role === "ADMIN") {
    return decoded.role;
  }
  return decoded.isAdmin ? "ADMIN" : "MENTOR";
}

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res
        .status(403)
        .json({
          error: "Insufficient permissions",
          message: `This action requires one of: ${roles.join(", ")}. Your role: ${req.userRole || "none"}.`,
        });
    }
    next();
  };
}