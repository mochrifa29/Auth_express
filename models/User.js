import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Username Harus Diisi"],
    minlength: [3, "Username minimal 3 karakter"],
  },
  email: {
    type: String,
    required: [true, "Email Harus Diisi"],
    validate: {
      validator: validator.isEmail,
      message: "Inputan harus berformat Email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password Harus Diisi"],
    minlength: [6, "Password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerifiedAt: {
    type: Date,
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
