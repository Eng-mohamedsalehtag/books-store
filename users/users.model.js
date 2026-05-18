import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});
const User = mongoose.model("User", userSchema);
export default User;
