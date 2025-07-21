import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const loginPage = (req, res) => {
  const error = req.query.error;
  const success = req.query.success;

  res.render("pages/login", {
    title: "Login",
    pageCSS: "login",
    pageJS: "login",
    error,
    success,
  });
};

const registerPage = (req, res) => {
  const error = req.query.error;
  const success = req.query.success;

  res.render("pages/register", {
    title: "Register",
    pageCSS: "login",
    pageJS: "login",
    error,
    success,
  });
};

const forgotPasswordPage = (req, res) => {
  const error = req.query.error;
  const success = req.query.success;

  res.render("pages/forget-password", {
    title: "Forgot Password",
    pageCSS: "login",
    pageJS: "login",
    error,
    success,
  });
};

const resetPasswordPage = (req, res) => {
  const token = req.query.token;
  const error = req.query.error;

  res.render("pages/reset-password", {
    title: "Reset Password",
    token,
    error,
  });
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res.redirect("/auth/register?error=missing_fields");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res.redirect("/auth/register?error=user_already_exists");
  }

  let permissions = [];
  switch (role) {
    case "admin":
      permissions = [
        "dashboard",
        "students",
        "courses",
        "attendance",
        "grades",
        "reports",
        "admin",
      ];
      break;
    case "teacher":
      permissions = [
        "dashboard",
        "students",
        "courses",
        "attendance",
        "grades",
      ];
      break;
    case "staff":
      permissions = ["dashboard", "students"];
      break;
    case "student":
      permissions = ["dashboard"];
      break;
    default:
      permissions = ["dashboard"];
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "student",
    permissions,
    status: "active",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res.redirect("/auth/register?error=registration_failed");
  }

  res.redirect("/auth/login?success=registration_successful");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body;

  if (!email || !email.trim()) {
    return res.redirect("/auth/login?error=missing_email");
  }
  if (!password || !password.trim()) {
    return res.redirect("/auth/login?error=missing_password");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.redirect("/auth/login?error=invalid_credentials");
  }

  if (user.status !== "active") {
    return res.redirect("/auth/login?error=user_inactive");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.redirect("/auth/login?error=invalid_credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("/dashboard");
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .redirect("/auth/login?success=logged_out");
});

export {
  loginPage,
  registerPage,
  forgotPasswordPage,
  resetPasswordPage,
  registerUser,
  loginUser,
  logoutUser,
  generateAccessAndRefreshTokens,
};
