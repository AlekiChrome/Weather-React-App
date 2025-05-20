import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard/WeatherCard';
import ForecastCard from './components/ForecastCard/ForecastCard';
import WeatherMap from './components/WeatherMap/WeatherMap';
import styles from './App.module.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');
  const [coords, setCoords] = useState([20, 0]);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
      setCity(savedCity);
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearLastSearch = () => {
    localStorage.removeItem('lastCity');
    setCity('');
    setWeather(null);
    setForecast([]);
  };

  const getWeatherData = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      localStorage.setItem('lastCity', city);

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
      );
      if (!weatherRes.ok) throw new Error('City not found');
      const weatherData = await weatherRes.json();
      setWeather(weatherData);
      setCoords([weatherData.coord.lat, weatherData.coord.lon]);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
      );
      if (!forecastRes.ok) throw new Error('Forecast not found');
      const forecastData = await forecastRes.json();

      const daily = forecastData.list
        .filter((item) => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);
      setForecast(daily);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <h1>Weather App</h1>
      <input
        className={styles.input}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <div>
        <button className={styles.button} onClick={getWeatherData}>
          Get Weather
        </button>
        <button className={styles.button} onClick={toggleUnit}>
          Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}
        </button>
        <button className={styles.button} onClick={clearLastSearch}>
          Clear Last Search
        </button>
        <button className={styles.button} onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && <WeatherCard weather={weather} unit={unit} theme={theme} />}
      {forecast.length > 0 && <ForecastCard forecast={forecast} unit={unit} theme={theme} />}
      {weather && (
        <WeatherMap
          coords={coords}
          city={weather.name}
          condition={weather.weather[0].main}
          icon={weather.weather[0].icon}
        />
      )}
    </div>
  );
}

export default App;
