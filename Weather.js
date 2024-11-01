import React, { useState } from "react";
import './App.css'; // Use a unified CSS file for styling

const App = () => {
  const api = {
    key: "a04b88987f238dc69b0bd2c902d2998b",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [aqiData, setAQIData] = useState({});

  const search = (evt) => {
    if (evt.key === "Enter") {
      // Fetch weather data
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
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
              console.log("Weather Data:", result);
              console.log("AQI Data:", airData);
            });
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
      
      {/* Weather Data */}
      {typeof weather.main !== "undefined" && (
        <div className="weather-section">
          <div className="location">{weather.name}, {weather.sys.country}</div>
          <div className="date">{dateBuilder(new Date())}</div>
          <div className="temp-box">
            <div className="temp">Current Temp: {Math.round(weather.main.temp)}°C</div>
            <div className="feels-like">Feels Like: {Math.round(weather.main.feels_like)}°C</div>
          </div>
          <div className="weather-condition">
            <div>Condition: {weather.weather[0].main}</div>
            <div>Wind Speed: {weather.wind.speed} m/s</div>
            {weather.wind.gust && <div>Wind Gust: {weather.wind.gust} m/s</div>}
            <div>Wind Direction: {weather.wind.deg}°</div>
            <div>Humidity: {weather.main.humidity}%</div>
          </div>
        </div>
      )}

      {/* AQI Data */}
      {aqiData.main && (
        <div className="aqi-section">
          <h3>Air Quality Index for {aqiData.city}, {aqiData.country}</h3>
          <div className="aqi-box">
            <div>AQI: {aqiData.main.aqi}</div>
            <div>Description: {getAQIDescription(aqiData.main.aqi)}</div>
          </div>
          <div className="pollutants">
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
