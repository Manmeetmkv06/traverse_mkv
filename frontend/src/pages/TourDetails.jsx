

import React, { useRef, useState } from "react";
import '../styles/tour-details.css';
import { Container, Row, Col, Form, ListGroup, Button } from "reactstrap";
import { useParams } from "react-router-dom";
import tourData from '../assets/data/tours';
import calculateAvgRating from "../utils/avgRating";
import avatar from '../assets/images/avatar.jpg';
import Booking from "../components/Booking/Booking";
import Newsletter from "../shared/Newsletter";
import axios from "axios";

const TourDetails = () => {
  const { id } = useParams();
  const reviewmsgRef = useRef('');
  const [tourRating, setTourRating] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // Fetch tour data based on the ID from the URL
  const tour = tourData.find(tour => tour.id === id);

  // Destructure properties from the tour object
  const { photo, title, desc, price, address, reviews, city, distance, maxGroupSize, lat, lng } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const options = { day: "numeric", month: "long", year: "numeric" };

  // Fetch weather data handler
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=4bfe6196699ce5c8a9aed05e1f604b6c`);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const submitHandler = e => {
    e.preventDefault();
    const reviewText = reviewmsgRef.current.value;
    alert(`${reviewText} ${tourRating}`);
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <div className="tour_content">
                <img src={photo} alt={title} />
                <div className="tour_info">
                  <h2>{title}</h2>
                  <div className="d-flex align-items-center gap-5">
                    <span className="tour__rating d-flex align-items-center gap-1">
                      <i className="ri-star-fill" style={{ color: "var(--secondary-color)" }}></i>
                      {avgRating === 0 ? null : avgRating}
                      {totalRating === 0 ? ('Not rated') : (<span>({reviews?.length})</span>)}
                    </span>
                    <span>
                      <i className="ri-map-pin-user-fill"></i>{address}
                    </span>
                  </div>
                  <div className="tour__extra-details">
                    <span>
                      <i className="ri-map-pin-2-line"></i>{city}
                      <i className="ri-money-dollar-circle-fill"></i>$ {price} /per person
                      <i className="ri-map-pin-time-line"></i> {distance} KM
                      <i className="ri-group-line"></i>{maxGroupSize} People
                    </span>
                  </div>
                  <h5>Description</h5> 
                  <p>{desc}</p>
                </div>

                <div className="tour_reviews mt-4">
                  <h4>Reviews ({reviews?.length} reviews)</h4>
                  <Form onSubmit={submitHandler}>
                    <div className="d-flex align-items-center gap-3 mb-4 rating_group">
                      <span onClick={() => setTourRating(1)}>1<i className="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(2)}>2<i className="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(3)}>3<i className="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(4)}>4<i className="ri-star-s-fill"></i></span>
                      <span onClick={() => setTourRating(5)}>5<i className="ri-star-s-fill"></i></span>
                    </div>
                    <div className="review__input">
                      <input type="text" ref={reviewmsgRef} placeholder="Share your thoughts" required />
                      <button className="button btn primary__btn text-white" type="submit">Submit</button>
                    </div>
                  </Form>

                  <ListGroup className="user__reviews">
                    {reviews?.map(review => (
                      <div className="review__item" key={review.name}>
                        <img src={avatar} alt="avatar" />
                        <div className="w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <h5>Manmeet Kaur</h5>
                              <p>{new Date('09-03-2024').toLocaleDateString("en-US", options)}</p>
                            </div>
                            <span className="d-flex align-items-center">
                              5<i className="ri-star-fill"></i>
                            </span>
                          </div>
                          <h6>Amazing Tour</h6>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>

            <Col lg="4">
              <Booking tour={tour} avgRating={avgRating} />
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tour_map">
                <h5>Location</h5>
                <div style={{ width: '100%', height: '400px' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${lat},${lng}&hl=es;z=14&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center mt-3">
              <Button className="button btn primary__btn text-white" onClick={fetchWeatherData}>View Weather</Button>
              {weatherData && (
                <div className="weather-info mt-2">
                  <h6>Weather in {weatherData.name}</h6>
                  <p>{weatherData.weather[0].description}</p>
                  <p>Temperature: {Math.round(weatherData.main.temp - 273.15)} °C</p>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <Newsletter />
    </>
  );
};

export default TourDetails;
