import React from 'react';
import styles from './ForecastCard.module.css';

export default function ForecastCard({ forecast, unit, theme }) {
  return (
    <div className={styles.container}>
      {forecast.map((day) => {
        const date = new Date(day.dt_txt);
        const dayLabel = date.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        const max = Math.round(day.main.temp_max);
        const min = Math.round(day.main.temp_min);
        const icon = day.weather[0].icon;
        const condition = day.weather[0].main;

        return (
          <div
            key={day.dt}
            className={`${styles.card} ${theme === 'dark' ? styles.dark : ''}`}
          >
            <p>{dayLabel}</p>
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={condition}
            />
            <p style={{ fontWeight: 'bold' }}>
              {max}° / {min}°{unit === 'metric' ? 'C' : 'F'}
            </p>
            <p style={{ fontSize: '12px' }}>{condition}</p>
          </div>
        );
      })}
    </div>
  );
}
