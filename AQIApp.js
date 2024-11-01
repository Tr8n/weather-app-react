import React, { useState } from "react";
import './aqi.css';

const AQIApp = () => {
  const api = {
    key: "a04b88987f238dc69b0bd2c902d2998b",
    base: "https://api.openweathermap.org/data/2.5/",
  };
  const [query, setQuery] = useState("");
  const [aqiData, setAQIData] = useState({});

  const search = (evt) => {
    if (evt.key === "Enter") {
      // Fetch latitude and longitude of the city from weather API
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          const { lat, lon } = result.coord;
          // Fetch AQI data using the latitude and longitude
          fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&appid=${api.key}`)
            .then((res) => res.json())
            .then((airData) => {
              setAQIData({
                city: result.name,
                country: result.sys.country,
                ...airData.list[0],
              });
              setQuery("");
              console.log(airData);
            });
        });
    }
  };

  const getBackgroundClass = () => {
    if (aqiData.main) {
      const aqi = aqiData.main.aqi;

      switch (aqi) {
        case 1:
          return 'good';
        case 2:
          return 'fair';
        case 3:
          return 'moderate';
        case 4:
          return 'poor';
        case 5:
          return 'very-poor';
        default:
          return 'default-air';
      }
    }
    return 'default-air';
  };

  const aqiDescription = (aqi) => {
    switch (aqi) {
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Moderate";
      case 4:
        return "Poor";
      case 5:
        return "Very Poor";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={`aqi-app ${getBackgroundClass()}`}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter city name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={search}
          />
        </div>
        {aqiData.main && (
          <div className="aqi-content">
            <div className="location">
              {aqiData.city}, {aqiData.country}
            </div>
            <div className="aqi-box">
              <div className="aqi">Air Quality Index: {aqiData.main.aqi}</div>
              <div className="aqi-desc">{aqiDescription(aqiData.main.aqi)}</div>
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
      </main>
    </div>
  );
};

export default AQIApp;
