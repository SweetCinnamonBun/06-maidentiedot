import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const Country = ({ country }) => {
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
    </>
  );
};

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    console.log(countries.length);
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length <= 10 && countries.length > 1) {
    return (
      <ul>
        {countries.map((country, index) => {
          return <li key={index}>{country.name.common}</li>;
        })}
      </ul>
    );
  } else if (countries.length === 1) {
    return (
      <>
        <Country country={countries} />
        <p>last one</p>
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

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        console.log(response.data);
        setCountries(response.data);
      });
  }, []);

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
      <Countries countries={filteredCountries} />
    </>
  );
}

export default App;
