// Import required modules
const mongoose = require("mongoose"); // Mongoose is a library that helps us interact with MongoDB
const config = require("config"); // Config is a library that helps us manage configuration settings
const jwt = require("jsonwebtoken"); // Jsonwebtoken is a library that helps us generate and verify JSON web tokens
const Joi = require("joi"); // Joi is a library that helps us validate user input
const bcrypt = require("bcrypt"); // Bcrypt is a library that helps us hash passwords

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
      validate: {
        validator: function (v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    isAdmin: {
      type: Boolean,
      default: false, // isAdmin is set to false by default
    },
  },
  { timestamps: true }
);

// Add a pre-save hook to the user schema that hashes the password before saving
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Add a method to the user schema that compares a password to the hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add a method to the user schema that generates a JSON web token
userSchema.methods.generateAuthToken = function () {
  // Generate a token that includes the user's ID, username, and email
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    config.get("appPrivateKey")
  );
  return token;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
