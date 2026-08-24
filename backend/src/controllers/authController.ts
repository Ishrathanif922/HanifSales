import { Response } from "express";
import { IAuthRequest } from "../types";
import User from "../models/User";
import { sendSuccess, sendError } from "../utils/response";
import { generateAccessToken, generateRefreshToken, setTokenCookies, verifyRefreshToken } from "../utils/tokens";
import crypto from "crypto";
import transporter from "../config/nodemailer";

export const register = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 409, "Email already registered");
      return;
    }

    const user = await User.create({ name, email, password, phone, role: role || "customer" });

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    setTokenCookies(res, accessToken, refreshToken);

    const userObj = user.toObject();
    delete (userObj as any).password;

    sendSuccess(res, 201, "Registration successful", { user: userObj, accessToken, refreshToken });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const login = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      sendError(res, 401, "Invalid email or password");
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 401, "Invalid email or password");
      return;
    }

    if (!user.isActive) {
      sendError(res, 403, "Account has been deactivated");
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    setTokenCookies(res, accessToken, refreshToken);

    const userObj = user.toObject();
    delete (userObj as any).password;

    sendSuccess(res, 200, "Login successful", { user: userObj, accessToken, refreshToken });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const logout = async (req: IAuthRequest, res: Response): Promise<void> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  sendSuccess(res, 200, "Logged out successfully");
};

export const getMe = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).populate("wishlist", "name slug price images avgRating");
    sendSuccess(res, 200, "User profile fetched", user);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateProfile = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { name, phone } },
      { new: true, runValidators: true }
    );
    sendSuccess(res, 200, "Profile updated", user);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const changePassword = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id).select("+password");

    if (!user || !user.password) {
      sendError(res, 404, "User not found");
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      sendError(res, 400, "Current password is incorrect");
      return;
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, "Password changed successfully");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const addAddress = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(req.body);
    await user.save();

    sendSuccess(res, 201, "Address added", user.addresses);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateAddress = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    const address = (user.addresses as any).id(req.params.id);
    if (!address) {
      sendError(res, 404, "Address not found");
      return;
    }

    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    sendSuccess(res, 200, "Address updated", user.addresses);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const deleteAddress = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    user.addresses = user.addresses.filter((addr) => addr._id?.toString() !== req.params.id);
    await user.save();

    sendSuccess(res, 200, "Address deleted", user.addresses);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const toggleWishlist = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    const index = user.wishlist.indexOf(productId as any);
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      sendSuccess(res, 200, "Removed from wishlist", { wishlist: user.wishlist });
    } else {
      user.wishlist.push(productId as any);
      await user.save();
      sendSuccess(res, 200, "Added to wishlist", { wishlist: user.wishlist });
    }
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getWallet = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select("wallet");
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }
    sendSuccess(res, 200, "Wallet fetched", user.wallet);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const addFunds = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      sendError(res, 400, "Invalid amount");
      return;
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    user.wallet.balance += amount;
    user.wallet.transactions.push({
      amount,
      type: "credit",
      description: "Funds added to wallet",
      createdAt: new Date(),
    } as any);
    await user.save();

    sendSuccess(res, 200, "Funds added", user.wallet);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const refreshToken = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.cookies;
    if (!token) {
      sendError(res, 401, "Refresh token not found");
      return;
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      sendError(res, 401, "Invalid refresh token");
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());
    setTokenCookies(res, accessToken, newRefreshToken);

    sendSuccess(res, 200, "Token refreshed", { accessToken, refreshToken: newRefreshToken });
  } catch (error: any) {
    sendError(res, 401, "Invalid refresh token");
  }
};

export const forgotPassword = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      sendError(res, 400, "Email is required");
      return;
    }

    let user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      user = await User.create({
        name: email.split("@")[0] || "User",
        email: email.trim().toLowerCase(),
        password: crypto.randomBytes(8).toString("hex"),
        role: "customer",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpire: resetTokenExpire,
    });

    const resetUrl = `https://hanif-sales.netlify.app/auth/reset-password?token=${resetToken}`;

    let emailSent = false;
    try {
      await transporter.sendMail({
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: user.email,
        subject: "Password Reset - Hanif Sales",
        html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Click here to reset</a></p><p>Link expires in 1 hour.</p>`,
      });
      emailSent = true;
    } catch (mailError) {
      console.log("==================================================");
      console.log("PASSWORD RESET URL:", resetUrl);
      console.log("==================================================");
    }

    sendSuccess(res, 200, "Reset link generated successfully", {
      resetUrl,
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const googleAuth = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.body.email || "google.user@hanifsales.com";
    const name = req.body.name || "Google User";

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId: "google_simulated_" + Date.now(),
        role: "customer",
        isVerified: true,
      });
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());
    setTokenCookies(res, accessToken, refreshToken);

    const userObj = user.toObject();
    delete (userObj as any).password;

    sendSuccess(res, 200, "Google login successful", { user: userObj, accessToken, refreshToken });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const resetPassword = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token) {
      sendError(res, 400, "Reset token is required");
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: token.trim(),
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      sendError(res, 400, "Invalid or expired reset token");
      return;
    }

    user.password = password;
    (user as any).resetPasswordToken = undefined;
    (user as any).resetPasswordExpire = undefined;
    await user.save();

    sendSuccess(res, 200, "Password reset successful");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
