import React from 'react';
import styles from './ForecastCard.module.css';
import Skycons from 'react-skycons';
import mapToSkycon from '../../utils/mapWeatherToSkycon';

export default function ForecastCard({ forecast, unit, theme }) {
  return (
    <div className={styles.container}>
      {forecast.map((day, index) => {
        const date = new Date(day.dt_txt);
        const skyconType = mapToSkycon(day.weather[0].icon);

        return (
          <div key={index} className={`${styles.card} ${theme === 'dark' ? styles.dark : ''}`}>
            <h3>{date.toLocaleDateString(undefined, { weekday: 'short' })}</h3>
            <Skycons
              color={theme === 'dark' ? 'white' : 'black'}
              type={skyconType}
              animate={true}
              size={48}
            />
            <p>{day.weather[0].main}</p>
            <p>
              {Math.round(day.main.temp_max)}° / {Math.round(day.main.temp_min)}°
              {unit === 'metric' ? 'C' : 'F'}
            </p>
          </div>
        );
      })}
    </div>
  );
}

