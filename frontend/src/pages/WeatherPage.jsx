

import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WeatherPage = () => {
  const { id } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };

  // Fetch weather data handler
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${id.lat}&lon=${id.lng}&appid=4bfe6196699ce5c8a9aed05e1f604b6c`);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <section>
      <Container className="weather-page-container ">
        <Row>
          <Col lg="12" className="text-center mt-3">
            <Button color="primary" onClick={fetchWeatherData} className="weather-button">View Weather</Button>
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
  );
};

export default WeatherPage;
