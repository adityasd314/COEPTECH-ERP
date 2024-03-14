const User = require("../../model/UserSchema");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, "secret", { expiresIn: "3d" });
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ ...user._doc, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const {
    email,
    name,
    age,
    gender,
    role,
    field,
    collegeName,
    degree,
    year,
    password,
  } = req.body;

  try {
    const user = await User.signup(
      email,
      name,
      age,
      gender,
      role,
      field,
      collegeName,
      degree,
      year,
      password
    );

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ ...user._doc, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser };
