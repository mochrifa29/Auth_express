import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import Otpcode from "../models/OtpCode.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_REFRESH, {
    expiresIn: "6d",
  });
};

const createResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: false,
  };

  res.cookie("jwt", token, cookieOption);
  user.password = undefined;

  res.status(statusCode).json({
    user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const role = (await await User.countDocuments()) === 0 ? "admin" : "user";
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });

  const otpData = await user.generateOtpCode();

  await sendEmail({
    to: user.email,
    subject: "Register Berhasil",
    html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Register</title>
        
        </head>
        <body>
          <div class="email-container">
            <h1> Selamat ${user.name} berhasil terdaftar</h1>
            <p> SIlahkan gunakan otp code dibawah untuk verifikasi akun, waktu expire otp code 5 menit dari sekarang </p>
            <p style="text-align:center; background-color:yellow; font-width:bold; font-size:30px;">${otpData.otpCode}</p>
          </div>
        </body>
        </html>

    `,
  });

  createResToken(user, 201, res);
});

export const generateOtp = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  const otpData = await currentUser.generateOtpCode();

  await sendEmail({
    to: currentUser.email,
    subject: "Berhasil Generate Ulang Otp Code",
    html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Register</title>
        
        </head>
        <body>
          <div class="email-container">
            <h1> Selamat ${currentUser.name} berhasil generate otp code baru</h1>
            <p>SIlahkan gunakan otp code dibawah untuk verifikasi akun</p>
            <p style="text-align:center; background-color:yellow; font-width:bold; font-size:30px;">${otpData.otpCode}</p>
            <strong style="font-size:12px;"> waktu expire otp code 5 menit dari sekarang </strong>
          </div>
        </body>
        </html>

    `,
  });

  res.status(200).json({
    message: "Generate otp berhasil,silahkan cek email anda",
  });
});

export const verifikasiUser = asyncHandler(async (req, res) => {
  //validasi
  if (!req.body.otp) {
    res.status(400);
    throw new Error("Otp harus diisi");
  }

  //jika otp tidak ditemukan
  const otp_code = await Otpcode.findOne({
    otpCode: req.body.otp,
    user: req.user._id,
  });

  if (!otp_code) {
    res.status(400);
    throw new Error("Otp yang dimasukan tidak ditemukan/salah");
  }

  //update nilai user
  const userData = await User.findById(req.user._id);

  await User.findOneAndUpdate(userData._id, {
    isVerified: true,
    emailVerifiedAt: Date.now(),
  });

  res.status(200).json({
    message: "Berhasil verifikasi akun",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(400);
    throw new Error("Inputan email dan password  harus diisi");
  }

  const userData = await User.findOne({
    email: req.body.email,
  });

  if (userData && (await userData.comparePassword(req.body.password))) {
    if (userData.isVerified == false) {
      res.status(400);
      throw new Error("Email belum terverifikasi");
    }
    createResToken(userData, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid User");
  }
});

export const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) {
    res.status(200).json({
      user,
    });
  } else {
    res.status(401);
    throw new Error("User Not Found");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", {
    httpOnly: true,
    expire: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Logout Berhasil",
  });
});
