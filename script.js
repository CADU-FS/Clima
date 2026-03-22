const locationDisplay = document.querySelector('#location');
let inputDisplay;

const temperature = document.querySelector('#temperature');
const apparentTemperature = document.querySelector('#apparent-temperature');

const windSpeed = document.querySelector('.wind-speed');
const humidity = document.querySelector('.relative-humidity');
const precipitation = document.querySelector('.precipitation');
const pressure = document.querySelector('.pressure');

const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const item1 = {
  name: document.querySelector('.item-1 > p'),
  precipitationChance: document.querySelector('.item-1 .precipitation-chance'),
  maxTemperature: document.querySelector('.item-1 .max-temperature'),
  minTemperature: document.querySelector('.item-1 .min-temperature')
}

function getInput() {
  inputDisplay = document.querySelector('#location-input').value;
  getGeocodingData(inputDisplay);
}

// Dados de retorno da requisição
function getGeocodingData(locationInput) {
  geocodingRequestHttp(
    `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&count=1&language=pt&format=json`
  )
  .then((data) => {
    console.log(data);
    setLocationTextInDOM(data);
  })
  .catch((err) => {
    console.log(err, err.data)
  });
}

// Requisições da API de Geocoding
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
      latitude: response.results[0].latitude,
      longitude: response.results[0].longitude
    };

    return locationInfo;
  });
}

function setLocationTextInDOM() {

}