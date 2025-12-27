import client from "../lib/redis.js";
import User from "../models/user.models.js";
import generateToken from "../utils/generateToken.js";
import setCookies from "../utils/setCookies.js";
import jwt from "jsonwebtoken";
import storeRefreshToken from "../utils/storeRefreshToken.js";
import crypto from "crypto";
import {
  validateEmail,
  sendVerificationEmail,
  sendNewUserNotification,
  sendWelcomeEmail,
} from "../utils/emailVerification.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const emailCheck = await validateEmail(email);
    if (!emailCheck.isValid) {
      return res
        .status(400)
        .json({ message: emailCheck.reason || "Invalid email" });
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = new User({
      name,
      email,
      password,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await user.save();

    // Send emails safely
    let verificationSent = false;
    try {
      verificationSent = await sendVerificationEmail(
        email,
        emailVerificationToken
      );
    } catch (err) {
      console.error("Verification email failed:", err);
    }

    sendNewUserNotification(user).catch((err) =>
      console.error("Admin notification failed:", err)
    );
    sendWelcomeEmail(user).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan || null,
        businessName: user.businessName || null,
        isEmailVerified: user.isEmailVerified,
      },
      message: "User created successfully. Check email for verification.",
      verificationEmailSent: verificationSent,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup" });
  }
};

export const login = async (req, res) => {
  const { email, password, rememberMe = false } = req.body;
  console.log(email, password, rememberMe);
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // console.log("login controller is working");

    // ✅ ADDED: Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
      });
    }
    console.log("login controllers works");
    // Check password
    const isMatched = await user.checkPassword(password);
    if (!isMatched) {
      return res.status(401).json({ message: "password is incorrect" });
    }
    const { accessToken, refreshToken } = generateToken(user._id);
    // Store refresh token
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken, rememberMe);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified, // ✅ ADDED
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ ADDED: Email verification endpoint (this is the controller function)

// Verify email endpoint
export const verifyEmail = async (req, res) => {
  try {
    let { token } = req.query;
    if (!token)
      return res
        .status(400)
        .json({ message: "Verification token is required" });

    token = token.trim();

    // Atomic find-and-update
    const user = await User.findOneAndUpdate(
      {
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
      },
      {
        $set: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new verification email.",
      });
    }

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("💥 Verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ ADDED: Resend verification email endpoint
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      emailVerificationToken
    );

    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(200).json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  console.log(req.cookies.refreshToken);
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await client.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send("logout successfulyy");
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

//This will re-create the access-token

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // 1. Verify refresh token signature & expiry
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 2. Check Redis (single source of truth)
    const storedToken = await client.get(`refresh_token:${decoded.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or revoked refresh token",
      });
    }

    // 3. Issue new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // 4. Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (error) {
    console.error("Refresh token error:", error.message);

    // Clear cookies on failure
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(401).json({
      success: false,
      message: "Session expired, please login again",
    });
  }
};

// /me answers one question ask by frontend:
// “Who is the currently authenticated user?”
// You’re thinking:

// “protect already decodes the token and attaches the user, so it already knows who I am. Why do I need /me?”

// Correct:

// protect knows who you are

// But it cannot speak to the frontend

// Middleware never returns data.
// It only allows or blocks a request.
export const me = async (req, res) => {
  console.log(
    "🔐 Me endpoint executed - User from middleware:",
    req.user?.email
  );

  try {
    // ✅ SIMPLIFY - user is already attached by protect middleware
    if (!req.user) {
      console.log("❌ No user in request");
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // ✅ Return user data from protect middleware
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isEmailVerified: req.user.isEmailVerified,
        role: req.user.role,
        phoneNumber: req.user.phoneNumber,
        plan: req.user.plan || "free",
        businessName: req.user.businessName || req.user.name + "'s Business",
        profileImage: req.user.profileImage || null,
        subscriptionId: req.user.subscriptionId,
        subscriptionStatus: req.user.subscriptionStatus,
      },
    });
  } catch (err) {
    console.error("❌ Me endpoint error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// 🔥 IMMEDIATE DEBUG: Check all tokens
export const debugTokens = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "email isEmailVerified emailVerificationToken emailVerificationExpires"
    );

    const result = users.map((user) => ({
      email: user.email,
      isVerified: user.isEmailVerified,
      hasToken: !!user.emailVerificationToken,
      token: user.emailVerificationToken,
      expires: user.emailVerificationExpires,
      isExpired: user.emailVerificationExpires
        ? user.emailVerificationExpires < new Date()
        : null,
    }));

    console.log("🔍 ALL USERS:", result);
    res.json({ users: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
