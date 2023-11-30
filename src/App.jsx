import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const Country = ({ country, getWeatherData, weather }) => {
  let languagesValues = Object.values(country[0].languages);

  return (
    <>
      <h1>{country[0].name.common}</h1>
      <p>capital: {country[0].capital}</p>
      <p>area: {country[0].area} </p>

      <h3>languages:</h3>
      <ul>
        {languagesValues.map((x, index) => {
          return <li key={index}>{x}</li>;
        })}
      </ul>
      <img src={country[0].flags["png"]} width="220" />
      <Weather
        country={country}
        weather={weather}
        getWeatherData={getWeatherData}
      />
    </>
  );
};

const Weather = ({ country, weather, getWeatherData }) => {
  const apiKey = "9579c02081e7e4205ff7382ac3a9378f";
  console.log(import.meta.env.VITE_SOME_KEY);
  const lat = country[0].latlng[0];
  const lon = country[0].latlng[1];
  console.log(weather);
  // console.log(apiKey);
  console.log(lat);
  getWeatherData(lat, lon, apiKey);

  if (weather === null) {
    return <p>no weather</p>;
  }

  return (
    <>
      <h2>Weather in {country[0].name.common}</h2>
      <p>temperature: {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        width="120"
      />
      <p>wind: {weather.wind.speed} m/s</p>
    </>
  );
};

const Countries = ({ countries, setFilterString, weather, getWeatherData }) => {
  if (countries.length > 10) {
    console.log(countries.length);
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length <= 10 && countries.length > 1) {
    return (
      <ul>
        {countries.map((country, index) => {
          return (
            <>
              <li key={index}>
                {country.name.common}{" "}
                <button onClick={() => setFilterString(country.name.common)}>
                  show
                </button>
              </li>
            </>
          );
        })}
      </ul>
    );
  } else if (countries.length === 1) {
    return (
      <>
        <Country
          country={countries}
          weather={weather}
          getWeatherData={getWeatherData}
        />
      </>
    );
  } else {
    return <p>Type in the search box</p>;
  }
};

function App() {
  const [count, setCount] = useState(0);
  const [countries, setCountries] = useState(null);
  const [filterString, setFilterString] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response.data);
        setCountries(response.data);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `https://api.openweathermap.org/data/2.5/weather?lat=${20}&lon=${-12}&appid=9579c02081e7e4205ff7382ac3a9378f`
  //     )
  //     .then((response) => {
  //       setWeather(response.data);
  //     });
  // }, []);

  const getWeatherData = (lat, lon, apiKey) => {
    useEffect(() => {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        });
    }, []);
  };

  const handleChange = ({ target }) => {
    console.log(target.value);
    setFilterString(target.value);
  };

  const filteredCountries =
    filterString !== ""
      ? countries.filter((country) =>
          country.name.common.toLowerCase().includes(filterString.toLowerCase())
        )
      : [];

  if (!countries) {
    return <p>Loading countries</p>;
  }

  return (
    <>
      <label>find countries</label>
      <input
        name="filterCountry"
        value={filterString}
        onChange={handleChange}
      />
      <Countries
        countries={filteredCountries}
        setFilterString={setFilterString}
        weather={weather}
        getWeatherData={getWeatherData}
      />
    </>
  );
}

export default App;
