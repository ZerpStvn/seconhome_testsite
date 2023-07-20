import { Input } from "antd";
import React, { useState, useEffect } from "react";
import "../styles/autoComplete-search.css";

function AutoCompleteComponent({ onSearch }) {
  const [autoComplete, setAutoComplete] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState([]);
  const [countySuggestions, setCountySuggestions] = useState([]);
  const [isNumber, setIsNumber] = useState(false);
  const [zipcodeSuggestions, setZipcodeSuggestions] = useState([]);
  const [datavalue, setDataValue] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA6eaMRrfLzlYUe&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAutoCompleteView = (data) => {
    const trimmedData = data.trim();

    if (trimmedData !== "") {
      setAutoComplete(true);

      if (!isNaN(trimmedData)) {
        setIsNumber(true);
        fetchZipcode(trimmedData);
      } else {
        setIsNumber(false);
        fetchCity(trimmedData);
      }
      fetchNeighborhood(trimmedData);
      fetchCounty(trimmedData);
    } else {
      setAutoComplete(false);
      setCitySuggestions([]);
      setNeighborhoodSuggestions([]);
      setCountySuggestions([]);
      setZipcodeSuggestions([]);
    }
  };

  const fetchCity = (input) => {
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input: input,
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const simplifiedSuggestions = predictions.map((prediction) => {
            const cityName = prediction.structured_formatting.main_text;
            const state = prediction.structured_formatting.secondary_text.split(
              ","
            )[0];
            return {
              ...prediction,
              cityName: cityName,
              state: state,
            };
          });
          setCitySuggestions(simplifiedSuggestions);
        }
      }
    );
  };

  const fetchNeighborhood = (input) => {
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input: input,
        types: ["neighborhood"],
        componentRestrictions: { country: "us" },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const simplifiedSuggestions = predictions.map((prediction) => {
            const neighborhoodName = prediction.structured_formatting.main_text;
            const city = prediction.structured_formatting.secondary_text.split(
              ","
            )[0];
            const state = prediction.structured_formatting.secondary_text.split(
              ","
            )[1];
            return {
              ...prediction,
              neighborhoodName: neighborhoodName,
              state: state,
              city: city,
            };
          });
          setNeighborhoodSuggestions(simplifiedSuggestions);
        }
      }
    );
  };

  const fetchCounty = (input) => {
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input: input,
        types: ["administrative_area_level_2"],
        componentRestrictions: { country: "us" },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const simplifiedSuggestions = predictions.map((prediction) => {
            const countyName = prediction.structured_formatting.main_text;
            const state = prediction.structured_formatting.secondary_text.split(
              ","
            )[0];
            return { ...prediction, countyName: countyName, state: state };
          });
          setCountySuggestions(simplifiedSuggestions);
        }
      }
    );
  };

  const fetchZipcode = (input) => {
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      {
        input: input,
        types: ["postal_code"],
        componentRestrictions: { country: "us" },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const simplifiedSuggestions = predictions.map((prediction) => {
            const postalCode = prediction.structured_formatting.main_text;
            const city = prediction.structured_formatting.secondary_text.split(
              ","
            )[0];
            const state = prediction.structured_formatting.secondary_text
              .split(",")[1]
              .trim();

            return {
              ...prediction,
              postalCode: postalCode,
              state: state,
              city: city,
            };
          });
          setZipcodeSuggestions(simplifiedSuggestions);
        }
      }
    );
  };

  const handleOnSearch = (data) => {
    setDataValue(data);
    onSearch(data);
    setAutoComplete(false);
  };

  const handleInputChange = (data) => {
    setDataValue(data);

    if (data === "") {
      setAutoComplete(false);
      setCitySuggestions([]);
      setNeighborhoodSuggestions([]);
      setCountySuggestions([]);
      setZipcodeSuggestions([]);
    } else {
      handleAutoCompleteView(data);
    }
  };

  const { Search } = Input;
  return (
    <div className="wrapper">
      <Search
        placeholder="City, Zip, Neighborhood , Address"
        type="text"
        allowClear
        id="input_search"
        size="large"
        className="main_search"
        value={datavalue}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        onSearch={handleOnSearch}
      />
      {autoComplete && (
        <div className="auto_complete">
          <ul>
            <li>
              {isNumber ? (
                <section className="suggestion suggestion_zipcode">
                  <h2>ZIP CODES</h2>
                  {zipcodeSuggestions.map((suggestion) => (
                    <div
                      className="top_row"
                      key={suggestion.place_id}
                      onClick={() => handleOnSearch(suggestion.postalCode)}
                    >
                      <img src="/svg/location-dot-solid.svg" alt="" />
                      <div>
                        <p className="mainTitle">{suggestion.postalCode}</p>
                        <div className="colm_row">
                          <span>{suggestion.city},</span>
                          <span>{suggestion.state}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              ) : (
                <>
                  <section className="suggestion suggestion_City">
                    <h2>CITIES</h2>
                    {citySuggestions.map((suggestion) => (
                      <div
                        className="top_row"
                        key={suggestion.place_id}
                        onClick={() => handleOnSearch(suggestion.cityName)}
                      >
                        <img src="/svg/location-dot-solid.svg" alt="" />
                        <div>
                          <p className="mainTitle">{suggestion.cityName}</p>
                          <span>{suggestion.state}</span>
                        </div>
                      </div>
                    ))}
                  </section>
                  <section className="suggestion suggestion_neighborhood">
                    <h2>NEIGHBORHOODS</h2>
                    {neighborhoodSuggestions.map((suggestion) => (
                      <div
                        className="top_row"
                        key={suggestion.place_id}
                        onClick={() =>
                          handleOnSearch(suggestion.neighborhoodName)
                        }
                      >
                        <img src="/svg/location-crosshairs-solid.svg" alt="" />

                        <div>
                          <li className="mainTitle">
                            {suggestion.neighborhoodName}
                          </li>
                          <div className="colm_row">
                            <span>{suggestion.city},</span>
                            <span>{suggestion.state}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                  <section className="suggestion suggestion_county">
                    <h2>COUNTY</h2>
                    {countySuggestions.map((suggestion) => (
                      <div
                        className="top_row"
                        key={suggestion.place_id}
                        onClick={() => handleOnSearch(suggestion.countyName)}
                      >
                        <img src="/svg/map-regular.svg" alt="" />
                        <div>
                          <p className="mainTitle">{suggestion.countyName}</p>
                          <span>{suggestion.state}</span>
                        </div>
                      </div>
                    ))}
                  </section>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default AutoCompleteComponent;
