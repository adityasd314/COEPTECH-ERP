const User = require("../../model/UserSchema");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const compareHash = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createToken = (_id) => {
  return jwt.sign({ _id }, "secret", { expiresIn: "3d" });
};

const loginWithToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = jwt.verify(token, "secret");

    const userEmail = decodedToken.user.email;

    const user = await User.findOne({ email: userEmail });
  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};


const loginUser = async (req, res) => {
  
  const { email, password } = req.body;

  console.log(">> Email & Password", email, password);

  if (!email || !password) {
    res.status(400).json({ error: 'All fields must be filled' });
    return;
  }

  
  try {
    
    const user = await User.login(email, password);

    console.log(">>", user);
    
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

module.exports = { loginUser, loginWithToken };
