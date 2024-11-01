import React, { useState } from "react";
import './App.css'; // Unified CSS file for styling

const App = () => {
  const api = {
    key: "a04b88987f238dc69b0bd2c902d2998b",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [aqiData, setAQIData] = useState({});
  const [error, setError] = useState(null); // State for error handling

  const search = (evt) => {
    if (evt.key === "Enter") {
      // Fetch weather data
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.cod === "404") {
            // If city not found, display an error
            setError("City not found. Please enter a valid city name.");
            setWeather({});
            setAQIData({});
            return;
          }

          setError(null); // Clear any previous errors
          setWeather(result);

          const { lat, lon } = result.coord;

          // Fetch AQI data using the coordinates
          fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&appid=${api.key}`)
            .then((res) => res.json())
            .then((airData) => {
              setAQIData({
                city: result.name,
                country: result.sys.country,
                ...airData.list[0],
              });
              setQuery(""); // Clear the search box after results
            });
        })
        .catch(() => {
          setError("An error occurred. Please try again.");
        });
    }
  };

  const dateBuilder = (d) => {
    let months = [
      "January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const getAQIDescription = (aqi) => {
    switch (aqi) {
      case 1: return "Good";
      case 2: return "Fair";
      case 3: return "Moderate";
      case 4: return "Poor";
      case 5: return "Very Poor";
      default: return "Unknown";
    }
  };

  return (
    <div className="app-container">
      <div className="search-box">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={search}
        />
      </div>

      {/* Error Handling */}
      {error && <div className="error-alert">{error}</div>}

      {/* Weather Data */}
      {typeof weather.main !== "undefined" && (
        <div className="weather-section">
          <div className="location-block">
            <h1>The Weather Details is as Follows:</h1>
            <div className="location"><h2>For:</h2>{weather.name}, {weather.sys.country}</div>
          </div>
          <div className="date-block">
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="temp-block">
            <div className="temp">Current Temp: {Math.round(weather.main.temp)}°C</div>
            <div className="feels-like">Feels Like: {Math.round(weather.main.feels_like)}°C</div>
          </div>
          <div className="wind-block">
            <div>Wind Speed: {weather.wind.speed} m/s</div>
            {weather.wind.gust && <div>Wind Gust: {weather.wind.gust} m/s</div>}
            <div>Wind Direction: {weather.wind.deg}°</div>
          </div>
          <div className="humidity-block">
            <div>Humidity: {weather.main.humidity}%</div>
          </div>
        </div>
      )}

      {/* AQI Data */}
      {aqiData.main && (
        <div className="aqi-section">
          <div className="aqi-block">
            <h1>The air Quality of the Region is:</h1>
            <h3>Air Quality Index for {aqiData.city}, {aqiData.country}</h3>
            <div>AQI: {aqiData.main.aqi}</div>
            <div>Description: {getAQIDescription(aqiData.main.aqi)}</div>
          </div>
          <div className="pollutants-block">
            <h1>Other Details:</h1>
            <div>PM2.5: {aqiData.components.pm2_5} µg/m³</div>
            <div>PM10: {aqiData.components.pm10} µg/m³</div>
            <div>CO: {aqiData.components.co} µg/m³</div>
            <div>NO₂: {aqiData.components.no2} µg/m³</div>
            <div>O₃: {aqiData.components.o3} µg/m³</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
