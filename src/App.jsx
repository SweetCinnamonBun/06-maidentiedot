import { useState, useEffect } from "react";
import axios from "axios";
const api_key = "9579c02081e7e4205ff7382ac3a9378f";

import "./App.css";

const Country = ({ country, getWeatherData, weather }) => {
  let languagesValues = Object.values(country[0].languages);

  return (
    <div className="country">
      <div className="upper-container">
        <img src={country[0].flags["png"]} width="220" />
      </div>
      <div className="lower-container">
        <h1 className="name">{country[0].name.common}</h1>
        <p className="capital">capital: {country[0].capital}</p>
        <p className="area">area: {country[0].area} </p>

        <h3 className="languages">languages:</h3>
        <ul className="languages-ul">
          {languagesValues.map((x, index) => {
            return <li key={index}>{x}</li>;
          })}
        </ul>

        <Weather
          country={country}
          weather={weather}
          getWeatherData={getWeatherData}
        />
      </div>
    </div>
  );
};

const Weather = ({ country, weather, getWeatherData }) => {
  const lat = country[0].latlng[0];
  const lon = country[0].latlng[1];

  getWeatherData(lat, lon, api_key);

  if (weather === null) {
    return <p>no weather</p>;
  }

  return (
    <>
      <h2 className="weather">Weather in {country[0].name.common}</h2>
      <p className="temperature">temperature: {weather.main.temp} Celsius</p>
      <div className="weather-img">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          width="120"
        />
      </div>
      <p className="wind">wind: {weather.wind.speed} m/s</p>
    </>
  );
};

const Countries = ({ countries, setFilterString, weather, getWeatherData }) => {
  // user requires to be specific with the search, otherwise it returns an error message.
  if (countries.length > 10) {
    console.log(countries.length);
    return (
      <p className="too-many-matches">
        Too many matches, specify another filter
      </p>
    );
  } else if (countries.length <= 10 && countries.length > 1) {
    return (
      <ul className="filter-country">
        {countries.map((country, index) => {
          return (
            <>
              <li key={index} className="filter-country-li">
                {country.name.common}{" "}
                <button
                  onClick={() => {
                    setFilterString(country.name.common);
                  }}
                  className="filter-btn"
                >
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
    return <p className="type-in-search">Type in the search box</p>;
  }
};

function App() {
  const [countries, setCountries] = useState(null);
  const [filterString, setFilterString] = useState("");
  const [weather, setWeather] = useState(null);

  // gets the weather data and stores it on the variable "countries".
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response.data);
        setCountries(response.data);
      });
  }, []);

  // function to get the weather data using the latitude, longitude and the api key.
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

  // Gets the input of the user and sets the input as the filter string to get the certain weather data
  const handleChange = ({ target }) => {
    console.log(target.value);
    setFilterString(target.value);
  };

  // gets the filtered result of the countries, based on the filter string that was provided
  const filteredCountries =
    filterString !== ""
      ? countries.filter((country) =>
          country.name.common.toLowerCase().includes(filterString.toLowerCase())
        )
      : [];

  // runs if the weather data has not yet been loaded
  if (!countries) {
    return <p>Loading countries</p>;
  }

  return (
    <>
      <div className="search-box">
        <label>Country Data</label>
        <input
          name="filterCountry"
          value={filterString}
          onChange={handleChange}
        />
      </div>
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
