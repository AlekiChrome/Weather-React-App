import React from 'react';
import Skycons from 'react-skycons';
import styles from './WeatherCard.module.css';
import mapToSkycon from '../../utils/mapWeatherToSkycon';

export default function WeatherCard({ weather, unit, theme }) {
  const skyconType = mapToSkycon(weather.weather[0].icon);

  return (
    <div className={`${styles.card} ${theme === 'dark' ? styles.dark : ''}`}>
      <h2>{weather.name}</h2>
      <p>{weather.weather[0].main}</p>
      <div className={styles.iconRow}>
        <Skycons
          color={theme === 'dark' ? 'white' : 'black'}
          type={skyconType}
          animate={true}
          size={64}
        />
        <p style={{ fontSize: '1.5rem', marginLeft: '12px' }}>
          {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </p>
      </div>
    </div>
  );
}
