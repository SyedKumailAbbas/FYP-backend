const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs")


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please provide email and password.",
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = jwt.sign(
      { role: foundUser.role, name: foundUser.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({ msg: "User logged in", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};
const dashboard = (req, res) => {
  res.status(200).json({
    name: req.user.name,
    role: req.user.role,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "Please provide all required fields." });
  }

  try {
    const foundUserByEmail = await User.findOne({ email });
    if (foundUserByEmail) {
      return res.status(400).json({ msg: "Email already in use." });
    }

    const foundUserByUsername = await User.findOne({ username });
    if (foundUserByUsername) {
      return res.status(400).json({ msg: "Username already in use." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await user.save();
    return res.status(201).json({ msg: "User registered successfully.", user });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};
module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
};
