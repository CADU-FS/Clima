const videoDisplay = document.querySelector('#bg-video');
const videoSrc = document.querySelector('#video-src');

let inputDisplay;
const locationDisplay = document.querySelector('#location');

const temperature = document.querySelector('#temperature');
const apparentTemperature = document.querySelector('#apparent-temperature');

const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.relative-humidity');
const precipitation = document.querySelector('.precipitation');
const pressure = document.querySelector('.pressure');

const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

function getInput() {
  inputDisplay = document.querySelector('#location-input').value;
  getGeocodingData(inputDisplay);
}

// Dados de retorno da requisição da API de Geocoding
function getGeocodingData(locationInput) {
  geocodingRequestHttp(
    `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&count=1&language=pt&format=json`
  )
  .then((data) => {
    setLocationTextInDOM(data.admin1, data.admin2, data.admin3, data.admin4, data.country);
    getWeatherForecastData(data.latitude, data.longitude);
  })
  .catch((err) => {
    console.log(err, err.data)
  });
}

// Requisição da API de Geocoding
function geocodingRequestHttp(url) {
  return fetch(url)
  .then((response) => {
    if(!response.ok) {
      return response.json().then((err) => {
        const error = new Error("Something went wrong!");
        error.data = err;
        throw error;
      });
    }

    return response.json();
  })
  .then((response) => {
    const locationInfo = {
      admin1: response.results[0].admin1,
      admin2: response.results[0].admin2,
      admin3: response.results[0].admin3,
      admin4: response.results[0].admin4,
      country: response.results[0].country,
      latitude: response.results[0].latitude,
      longitude: response.results[0].longitude
    };

    return locationInfo;
  });
}

function setLocationTextInDOM(admin1, admin2, admin3, admin4, country) {
  locationDisplay.textContent = '';
  if(admin4) {
    locationDisplay.textContent = `${admin4} - ${admin1}`;
  } else if(admin3) {
    locationDisplay.textContent = `${admin3} - ${admin1}`;
  } else if(admin2) {
    locationDisplay.textContent = `${admin2} - ${admin1}`;
  } else if(admin1) {
    locationDisplay.textContent = `${admin1} - ${country}`;
  } else if(country) {
    locationDisplay.textContent = `${country}`;
  } else {
    locationDisplay.textContent = 'Local não encontrado';
  }
}

// Dados de retorno da requisição da API de previsão do tempo
function getWeatherForecastData(latitude, longitude) {
  weatherForecastRequestHttp(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,precipitation,surface_pressure,weather_code&timezone=auto&forecast_days=8`
  )
  .then((data) => {
    const time = data[0];
    const currentInfo = data[1];
    const forecastInfo = data[2];
    
    setBackgroundVideo(currentInfo.isDay, currentInfo.weatherCode);
    setWeatherInfoInDOM(time, currentInfo, forecastInfo);
  })
  .catch((err) => {
    console.log(err, err.data);
  });
}

// Requisição da API de previsão do tempo
function weatherForecastRequestHttp(url) {
  return fetch(url)
  .then((response) => {
    if(!response.ok) {
      return response.json().then((err) => {
        const error = new Error('Something went worng!');
        error.data = err;
        throw error;
      })
    }

    return response.json();
  })
  .then((response) => {
    const time = new Date(response.current.time).getDay();
    const currentInfo = {
      isDay: response.current.is_day,
      weatherCode: response.current.weather_code,
      temperature: response.current.temperature_2m,
      apparentTemperature: response.current.apparent_temperature,
      windSpeed: response.current.wind_speed_10m,
      humidity: response.current.relative_humidity_2m,
      precipitation: response.current.precipitation,
      pressure: response.current.surface_pressure
    };
    const forecastInfo = {
      day: response.daily.time,
      maxTemperature: response.daily.temperature_2m_max,
      minTemperature: response.daily.temperature_2m_min,
      precipitation: response.daily.precipitation_probability_max,
    };

    return [time, currentInfo, forecastInfo];
  });
}

function setBackgroundVideo(isDay, weatherCode) {
  console.log(weatherCode);
  let newVideo = '';
  if(weatherCode >= 95) {
    newVideo = 'media/tempestade.mp4';
  } else if(weatherCode >= 51 && weatherCode <= 67 || weatherCode >= 80 && weatherCode <= 82) {
    newVideo = 'media/chuva.mp4';
  } else if(isDay) {
    newVideo = 'media/dia.mp4';
  } else {
    newVideo = 'media/noite.mp4';
  }

  if(!videoSrc.src.includes(newVideo)) {
    videoSrc.src = newVideo;
    videoDisplay.load();
  }
}

function setWeatherInfoInDOM(time, currentInfo, forecastInfo) {
  temperature.textContent = currentInfo.temperature;
  apparentTemperature.textContent = currentInfo.apparentTemperature;
  windSpeed.textContent = currentInfo.windSpeed;
  humidity.textContent = currentInfo.humidity;
  precipitation.textContent = currentInfo.precipitation;
  pressure.textContent = currentInfo.pressure;

  for(let i = 1; i < 9; i++) {
    document.querySelector(`.item-${i} > p`).textContent = 
      i < 3 ? document.querySelector(`.item-${i} > p`).textContent : days[(time + i - 1) % 7];
    document.querySelector(`.item-${i} .precipitation-chance`).textContent = Math.round(forecastInfo.precipitation[i - 1]);
    document.querySelector(`.item-${i} .max-temperature`).textContent = Math.round(forecastInfo.maxTemperature[i - 1]);
    document.querySelector(`.item-${i} .min-temperature`).textContent = Math.round(forecastInfo.minTemperature[i - 1]);
  }
}