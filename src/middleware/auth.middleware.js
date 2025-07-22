import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("JWT Verification Debug:", {
      hasCookies: !!req.cookies,
      hasAccessTokenCookie: !!req.cookies?.accessToken,
      hasAuthHeader: !!req.header("Authorization"),
      cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
      userAgent: req.get("User-Agent")
        ? req.get("User-Agent").substring(0, 50)
        : "unknown",
      url: req.url,
    });

    if (!token) {
      console.log("No token found, redirecting to login");
      return res.redirect("/auth/login?error=login_required");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.redirect("/auth/login?error=invalid_token");
    }

    // Check if user is still active
    if (user.status !== "active") {
      return res.redirect("/auth/login?error=user_inactive");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res.redirect("/auth/login?error=token_expired");
    }
    return res.redirect("/auth/login?error=invalid_token");
  }
});

export const requireRole = (roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login?error=login_required");
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    if (userRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).render("pages/error", {
      title: "Access Denied",
      statusCode: 403,
      error: "Access Denied",
      message: "You do not have permission to access this resource.",
    });
  });
};

export const requirePermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.redirect("/auth/login?error=login_required");
    }

    if (req.user.permissions && req.user.permissions.includes(permission)) {
      return next();
    }

    return res.status(403).render("pages/error", {
      title: "Access Denied",
      statusCode: 403,
      error: "Access Denied",
      message: "You do not have permission to perform this action.",
    });
  });
};

export const requireGuest = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (token) {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return res.redirect("/dashboard");
    } catch (error) {
      next();
    }
  } else {
    next();
  }
});
