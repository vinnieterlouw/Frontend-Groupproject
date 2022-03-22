import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch, useSelector } from "react-redux";
import { dataHomepage } from "../../store/home/actions";
import { useState } from "react";
import { selectHomeData } from "../../store/home/selector";
import { Slider } from "@mui/material";

export default function Homepage() {
  const homeData = useSelector(selectHomeData);
  console.log("this is selector", homeData);
  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });
  const [range, setRange] = useState(5000);
  const [type, setType] = useState("");
  console.log(type);
  //   const methods = usePlacesAutocomplete({
  //     // Provide the cache time in seconds, default is 24 hours
  //     cache: 24 * 60 * 60,
  //   });
  const ratingToStars = (rating) => {
    if (!rating) return "";
    let result = "";
    for (let i = 0; i < Math.round(rating); i++) {
      result = result + "⭐";
    }

    return result;
  };
  // ;}
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description })
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          console.log("📍 Coordinates: ", { lat, lng });
          // store to local state
          setLocation({ lat, lng });
        })
        .catch((error) => {
          console.log("😱 Error: ", error);
        });
    };

  const sumbitSearch = () => {
    const { lat, lng } = location;
    const radius = range;
    const placeType = type;
    dispatch(dataHomepage(lat, lng, radius, placeType));
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div>
      <div className="container h-screen flex align-center items-top flex-column">
        {/* <div className="absolute top-4 left-3 ">
            {" "}
            <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>{" "}
          </div>{" "} */}
        <div ref={ref}>
          <div className="flex align-center justify-center">
            <input
              type="text"
              className="h-14 w-96 mt-4 pl-10 pr-20 rounded-lg z-0 focus:shadow bg-gray-200 focus:outline-none"
              placeholder="Search anything..."
              value={value}
              onChange={handleInput}
              disabled={!ready}
            />
            <div className="flex align-center justify-center flex-column mr-5 ml-5">
              <div className="w-20">
                <Slider
                  defaultValue={5}
                  min={1}
                  max={30}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  onChange={(e) => setRange(e.target.value * 1000)}
                />
              </div>
              <div>Range in KM</div>
            </div>

            <div class="mb-3 xl:w-60 mt-4 ">
              <select
                class="form-select appearance-none
      block
      w-20
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
     
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label="Default select example"
                onChange={(e) => setType(e.target.value)}
              >
                <option selected>Type of place</option>
                <option value="Airport">Airport</option>
                <option value="Club">Club</option>
                <option value="Cafe">Cafe</option>
                <option value="Coffeeshop">Coffeeshop</option>
                <option value="Hospital">Hospital</option>
                <option value="Hotel">Hotel</option>
                <option value="Museum">Museum</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Supermarket">Supermarket</option>
                <option value="School">School</option>
              </select>
            </div>
            <button
              onClick={sumbitSearch}
              className="h-10 w-20 mt-4 text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-10"
            >
              Search
            </button>
          </div>
          <div className="flex align-center justify-center">
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
          </div>
        </div>
        <div>
          {homeData
            ? homeData.map((data) => {
                return (
                  <div className="flex justify-center m-5">
                    <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
                      {data.photos?.length ? (
                        data.photos.map((photos) => {
                          return (
                            <img
                              className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                              src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photos.photo_reference}&maxwidth=300&key=AIzaSyDGnhMSdxZWn2pTKvaimAKqZif3PqA7LwY`}
                              alt=""
                            />
                          );
                        })
                      ) : (
                        <img
                          className=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                          src="https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
                          alt=""
                        />
                      )}

                      <div className="p-6 flex flex-col justify-start">
                        <h5 className="text-gray-900 text-xl font-medium mb-2">
                          {data.name}
                        </h5>

                        <p className="text-gray-700 text-base mb-4">
                          Adress: {data.vicinity}
                        </p>
                        <div>
                          {data.rating && (
                            <p className="text-gray-600 text-xs">
                              {ratingToStars(data.rating)}({data.rating}/5) Out
                              of {data.user_ratings_total} users
                            </p>
                          )}
                          <p className="m-0">
                            {data.opening_hours?.open_now
                              ? "Open now!"
                              : "Closed..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
}
