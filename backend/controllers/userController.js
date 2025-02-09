const User = require("../models/user");

// User-registration
const handleUserRegistrationController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User with this email already exists",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        Username: newUser.username,
        Email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error during signup",
      error: error.message,
    });
  }
};

// Login-user
const handleUserLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (isPasswordValid) {
      const token = await user.generateAuthTokens();
      res.status(200).send({
        success: true,
        message: "Login successful",
        token,
        user: {
          Username: user.username,
          Email : user.email,
        },
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

module.exports = {
  handleUserRegistrationController,
  handleUserLoginController,
};
