import { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/, "Email invalid!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Password invalid, it should contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be atleast 8 characters long!",
    ],
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
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models.User || model("User", UserSchema);
export default User;