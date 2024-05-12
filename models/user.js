import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/, "Email invalid!"],
  },
  username: {
    type: String,
    unique: [true, "Username already exists!"],
    required: [true, "Username is required!"],
    match: [
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "Username invalid, it should start with letters and contain only letters, numbers and underscores!",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  secret: {
    type: String,
    required: [true, "Secret is required!"],
  },
  firstName: {
    type: String,
    required: [true, "First name is required!"],
    match: [
      /^[a-zA-Z ]+$/,
      "First name invalid, it should contain only letters!",
    ],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required!"],
    match: [
      /^[a-zA-Z ]+$/,
      "Last name invalid, it should contain only letters!",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  resetCodeRequests: {
    type: Number,
    default: 0,
  }
  }
);

export const User = models.User || model("User", UserSchema);
export default User;