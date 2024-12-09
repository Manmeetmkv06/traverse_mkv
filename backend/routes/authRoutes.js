


//bhai updated code hai yehhh vala 
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const dataFilePath = path.join(__dirname, '../data.json');

// Helper function to read data
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFilePath));
  } catch (error) {
    throw new Error('Failed to read data');
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Failed to write data');
  }
};

// Temporary in-memory OTP store (for simplicity)
const otpStore = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mishikabansal603@gmail.com', // Replace with your email
    pass: 'mvvt pbhr zrgd mjfn', // Replace with your email's app-specific password
  },
});

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// Register route with OTP
router.post('/register', (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const data = readData();
    const existingUser = data.users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    otpStore[email] = otp;

    // Send OTP via email
    transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}`,
    }, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }
      console.log('OTP sent: ' + info.response);
      res.status(200).json({ message: 'OTP sent to email', otp }); // Remove `otp` in production
    });
  } catch (error) {
    next(error);
  }
});

// Verify OTP and complete registration
router.post('/verify-otp', (req, res, next) => {
  try {
    const { email, otp, username, password } = req.body;

    if (otpStore[email] === otp) {
      const data = readData();
      data.users.push({ username, email, password });
      writeData(data);

      // Remove OTP from store
      delete otpStore[email];

      res.status(201).json({ message: 'User registered successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    next(error);
  }
});

// Login route
router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = readData();
    const user = data.users.find((user) => user.email === email && user.password === password);

    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;









