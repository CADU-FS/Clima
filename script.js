const locationDisplay = document.querySelector('#location');
const inputDisplay = document.querySelector('#location-input');

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