import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import styles from './WeatherMap.module.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapSync({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 6);
  }, [coords, map]);
  return null;
}

export default function WeatherMap({ coords, city, condition, icon }) {
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const [layer, setLayer] = useState('clouds_new');

  const layers = {
    Clouds: 'clouds_new',
    Rain: 'precipitation_new',
    Temperature: 'temp_new',
    Wind: 'wind_new',
    Pressure: 'pressure_new',
  };

  const weatherIcon = L.icon({
    iconUrl: `https://openweathermap.org/img/wn/${icon}.png`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  return (
    <div style={{ height: '460px', marginTop: '30px' }}>
      <div className={styles.toggleBar}>
        {Object.entries(layers).map(([name, value]) => (
          <button
            key={value}
            onClick={() => setLayer(value)}
            className={`${styles.toggleButton} ${layer === value ? styles.active : ''}`}
          >
            {name}
          </button>
        ))}
      </div>

      <MapContainer center={coords} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`}
          attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
        />
        <Marker position={coords} icon={weatherIcon}>
          <Popup>
            {city} <br /> {condition}
          </Popup>
        </Marker>
        <MapSync coords={coords} />
      </MapContainer>
    </div>
  );
}
