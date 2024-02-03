import { DateTime } from "luxon";

const API_KEY = "1fa9ff4126d95b8db54f3897a208e91c";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed, deg },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
    deg

  };
};

const formatForecastWeather = (data) => {
    let { timezone, daily } = data;
  
    if (daily && Array.isArray(daily)) {
      daily = daily.slice(1, 6).map((d) => {
        return {
          title: formatToLocalTime(d.dt, timezone, "ccc"),
          temp: d.temp.day,
          icon: d.weather[0].icon
        };
      });
    } else {
      daily = [];
    }
  
    return { timezone, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData('onecall', {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};


function findDirection(degree) {
  console.log(degree);
  if ((degree > 337.5 && degree < 360) || (degree > 22.5 && degree < 22.5)) {
    return "North";
  } else if (degree > 22.5 && degree < 67.5){
    return "North East";
  } else if (degree > 67.5 && degree < 112.5){
    return "East";
  } else if (degree > 122.5 && degree < 157.5){
    return "South East";
  } else if (degree > 157.5 && degree < 202.5){
    return "South";
  } else if (degree > 202.5 && degree < 247.5){
    return "South West";
  } else if (degree > 247.5 && degree < 292.5){
    return "West";
  } else if (degree > 292.5 && degree < 337.5){
    return "North West";
  }  
}
  

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, iconUrlFromCode, findDirection  };