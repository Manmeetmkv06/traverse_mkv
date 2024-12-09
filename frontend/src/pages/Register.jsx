

//updated code hai bhai yeh vala .....
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, FormGroup, Row } from "reactstrap";
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import '../styles/login.css';

const Register = () => {
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP Verification
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message); // OTP sent successfully
        setStep(2); // Move to OTP verification step
      } else {
        alert(data.message); // Error from the backend
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...credentials, otp }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Registration successful
        navigate('/login'); // Navigate to the login page
      } else {
        alert(data.message); // Invalid OTP
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="Register Illustration" />
              </div>
              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="User Icon" />
                </div>
                <h2>{step === 1 ? "Register" : "Verify OTP"}</h2>
                {step === 1 && (
                  <Form onSubmit={handleRegister}>
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="User Name"
                        required
                        id="username"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        id="email"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        id="password"
                        onChange={handleChange}
                      />
                    </FormGroup>
                    <Button className="btn primary__btn">Send OTP</Button>
                  </Form>
                )}
                {step === 2 && (
                  <Form onSubmit={handleVerifyOtp}>
                    <FormGroup>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </FormGroup>
                    <Button className="btn primary__btn">Verify OTP</Button>
                  </Form>
                )}
                <p>
                  Already have an Account?
                  <Link to="/login"> Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
