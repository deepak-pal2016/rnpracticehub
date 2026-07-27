/* eslint-disable no-unused-vars */
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginUser = async (req, res) => {
  try {
    const { email, password, fcmtoken } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const cleanPassword = password.trim();
    const isMatch = await bcrypt.compare(cleanPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (fcmtoken) {
      user.fcmtoken = fcmtoken;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    });

    user.token = token;
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.age;

    userData.token = token;

    return res.status(200).json({
      success: true,
      message: 'Login Successfully..',
      data: userData,
    });
  } catch (error) {
    console.log('ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, mobile, fcmtoken, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }
    const existinguser = await User.findOne({ email });

    if (existinguser) {
      return res.status(400).json({
        success: false,
        message: 'user already exits.',
      });
    }

    const existinmobile = await User.findOne({ mobile });
    if (existinmobile) {
      return res.status(400).json({
        success: false,
        message: 'user mobile already exits.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      mobile,
      fcmtoken,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    userResponse.token = token;

    if (user) {
      res.status(200).json({
        success: true,
        message: 'User created successfully',
        data: userResponse,
      });
    }
  } catch (error) {
    console.log('Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const getUser = async (req, res) => {
  const { _id } = req.body;
  try {
    const users = await User.find({ _id: { $ne: _id } });
    if (users.length > 0) {
      res.status(200).json({
        status: true,
        message: 'User list found..',
        data: users,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'User not found',
        data: [],
      });
    }
  } catch (error) {
    console.log('Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
const logout = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await User.findByIdAndUpdate(userId, {
      token: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successfully',
    });

  } catch (error) {
    console.log('Logout error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadimage = async (req, res) => {
  try { 
    const { userId } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image selected.."
      });
    }
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required.."
      });
    }


    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: imageUrl
      },
      {
        new: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      url: imageUrl,
      fileName: req.file.filename,
      type: "image",
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
module.exports = { addUser, getUser, loginUser, logout,uploadimage };
