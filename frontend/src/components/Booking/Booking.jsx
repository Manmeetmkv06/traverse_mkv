
//////updated hai ...............
import React, { useState } from "react";
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const Booking = ({ tour, avgRating }) => {
  const { price, reviews } = tour;
  const [credentials, setCredentials] = useState({
    fullName: '', // Ensure this matches the backend field `fullname`
    phone: '',
    guestSize: 1,
    bookAt: '',
    email: '',  // Send email for cancellation
  });

  const navigate = useNavigate();
  const serviceFee = 10;
  const totalAmount = Number(price) * Number(credentials.guestSize) + Number(serviceFee);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Booking handler
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        alert("Booking successful!");
        navigate("/thank-you");
      } else {
        alert('Booking failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/cancel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: credentials.fullName, // Ensure fullName matches the backend field `fullname`
          email: credentials.email,  // Email is required for sending notifications
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Booking canceled and cancellation email sent!');
        navigate("/thank-you");
      } else {
        alert(result.message || 'Cancellation failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="booking">
      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>${price}<span>/per person</span></h3>
        <span className="tour__rating d-flex align-items-center">
          <i className="ri-star-fill"></i>
          {avgRating === 0 ? null : avgRating}({reviews?.length})
        </span>
      </div>
      {/* Booking form */}
      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleClick}>
          <FormGroup>
            <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="email" placeholder="Email" id="email" required onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <input type="number" placeholder="Phone" id="phone" required onChange={handleChange} />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input type="date" id="bookAt" required onChange={handleChange} />
            <input type="number" placeholder="Guest" id="guestSize" required onChange={handleChange} />
          </FormGroup>
        </Form>
      </div>
      {/* Booking bottom */}
      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">${price} <i className="ri-close-line">1 person</i></h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Service Charge</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${totalAmount}</span>
          </ListGroupItem>
        </ListGroup>
        <Button className="btn primary__btn w-100 mt-4" onClick={handleClick}>Book Now</Button>
        {/* Cancel Button */}
        <Button className="btn secondary__btn w-100 mt-4" onClick={handleCancelBooking}>Cancel Booking</Button>
      </div>
    </div>
  );
};

export default Booking;
