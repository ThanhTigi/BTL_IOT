import React from 'react';
import { WiThermometer, WiCloudy, WiSnow } from 'react-icons/wi';
import './weather.css';

function getWeatherInfo(temperature) {
  let weatherIcon, temperatureClass;

  if (temperature >= 35) {
    weatherIcon = <WiThermometer />;
    temperatureClass = 'temp-hot';
  } else if (temperature >= 20) {
    weatherIcon = <WiThermometer />;
    temperatureClass = 'temp-normal';
  } else {
    weatherIcon = <WiThermometer />;
    temperatureClass = 'temp-cold';
  }

  return { weatherIcon, temperatureClass };
}

const Temperature = (props) => {
  const temperature = parseInt(props.temperature);
  const { weatherIcon, temperatureClass } = getWeatherInfo(temperature);

  return (
    <div className={`weather-box ${temperatureClass}`}>
      <div className="weather-group">
        <div className='weather-icon'>{weatherIcon}</div>
        <div className='weather-info'>{temperature}°C</div>
      </div>
    </div>
  );
}

export default Temperature;
