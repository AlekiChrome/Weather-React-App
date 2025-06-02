import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './WeatherMap.module.css';

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
  const [opacity, setOpacity] = useState(0.6);
  const [baseLayer, setBaseLayer] = useState('light');

  const layers = {
    Clouds: 'clouds_new',
    Rain: 'precipitation_new',
    Temperature: 'temp_new',
    Wind: 'wind_new',
    Pressure: 'pressure_new',
  };

  const baseLayers = {
    light: {
      name: 'Light',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
    dark: {
      name: 'Dark',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CartoDB',
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri',
    },
  };

  const weatherIcon = L.icon({
    iconUrl: `https://openweathermap.org/img/wn/${icon}@2x.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <div className={styles.wrapper}>
      {/* Base Layer Toggle */}
      <div className={styles.baseMapToggle}>
        {Object.entries(baseLayers).map(([key, { name }]) => (
          <button
            key={key}
            onClick={() => setBaseLayer(key)}
            className={`${styles.toggleButton} ${
              baseLayer === key ? styles.active : ''
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Weather Radar Layer Toggle */}
      <div className={styles.toggleBar}>
        {Object.entries(layers).map(([name, value]) => (
          <button
            key={value}
            onClick={() => setLayer(value)}
            className={`${styles.toggleButton} ${
              layer === value ? styles.active : ''
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Opacity Slider */}
      <div className={styles.opacityControl}>
        <label>
          Radar Opacity: {Math.round(opacity * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
          />
        </label>
      </div>

      {/* Map */}
      <MapContainer
        center={coords}
        zoom={6}
        style={{ height: '460px', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Base Layer */}
        <TileLayer
          url={baseLayers[baseLayer].url}
          attribution={baseLayers[baseLayer].attribution}
        />

        {/* Weather Radar Layer */}
        <TileLayer
          key={layer}
          url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`}
          opacity={opacity}
          attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
        />

        {/* Weather Marker */}
        <Marker position={coords} icon={weatherIcon}>
          <Popup>
            <strong>{city}</strong>
            <br />
            {condition}
          </Popup>
        </Marker>

        {/* Sync map to coordinates */}
        <MapSync coords={coords} />
      </MapContainer>
    </div>
  );
}
