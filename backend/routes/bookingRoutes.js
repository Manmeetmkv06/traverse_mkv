
////updated code
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Path to the data file
const dataFilePath = path.join(__dirname, "../data.json");

// Helper function to read data
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFilePath));
  } catch (error) {
    throw new Error("Failed to read data");
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Failed to write data");
  }
};

// Set up nodemailer transporter with Gmail (using app-specific password for Gmail)
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mishikabansal603@gmail.com', // Your Gmail address
      pass: 'mvvt pbhr zrgd mjfn',  // Your Gmail app-specific password
    },
    tls: {
      rejectUnauthorized: false, // Optional: if you encounter SSL/TLS issues
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('Error during transporter verification:', error);
    } else {
      console.log('Server is ready to send emails.');
    }
  });

} catch (error) {
  console.error('Failed to create nodemailer transporter:', error);
}

// Booking route (Booking a tour)
router.post("/", (req, res, next) => {
  try {
    const booking = req.body;
    // Generate booking ID (if it's not already present)
    if (!booking.bookingId) {
      booking.bookingId = Date.now().toString(); // Unique ID based on timestamp
    }

    const data = readData();
    data.bookings.push(booking);
    writeData(data);
    
    // Send confirmation email
    const mailOptions = {
      from: 'mishikabansal603@gmail.com', // Your Gmail address
      to: booking.email,         // Send to the user's email
      subject: 'Tour Booking Confirmation',
      text: `Dear ${booking.fullName},\n\nYour booking has been successfully confirmed for the tour on ${booking.bookAt}.\n\nBooking ID: ${booking.bookingId}\nGuests: ${booking.guestSize}\n\nThank you for booking with us! We look forward to serving you.\n\nBest regards,\nThe Tour Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: "Error sending confirmation email." });
      }
      console.log('Confirmation email sent: ' + info.response);
    });

    res.status(201).json({ message: "Booking successful", bookingId: booking.bookingId });
  } catch (error) {
    next(error);
  }
});

// Cancel booking route
router.delete("/cancel", (req, res, next) => {
  try {
    const data = readData();
    const bookings = data.bookings;

    // Find the last booking based on fullname from the existing booking data
    const lastBookingIndex = [...bookings].reverse().findIndex(
      (booking) => booking.fullname === bookings[bookings.length - 1].fullname
    );

    // Check if the booking exists
    if (lastBookingIndex === -1) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Calculate the correct index of the last matching booking
    const actualIndex = bookings.length - 1 - lastBookingIndex;

    // Remove the booking
    const canceledBooking = bookings.splice(actualIndex, 1)[0];

    // Save the updated data back to the file
    writeData(data);

    // Send email notification
    const mailOptions = {
      from: 'mishikabansal603@gmail.com',  // Replace with your email
      to: canceledBooking.email,  // Send to the user's email
      subject: 'Booking Cancelled',
      text: `The following booking has been canceled:
      Full Name: ${canceledBooking.fullname}
      Email: ${canceledBooking.email}
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email." });
      }
      console.log('Email sent: ' + info.response);
    });

    res.status(200).json({ message: "Booking canceled successfully and notification sent." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
