import React from 'react';
import styles from './WeatherCard.module.css';

export default function WeatherCard({ weather, unit, theme }) {
  return (
    <div className={`${styles.card} ${theme === 'dark' ? styles.dark : ''}`}>
      <h2>{weather.name}</h2>
      <p>{weather.weather[0].main}</p>
      <p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={weather.weather[0].description}
          style={{ verticalAlign: 'middle', marginRight: '6px' }}
        />
        {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
      </p>
    </div>
  );
}
