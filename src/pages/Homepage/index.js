import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch, useSelector } from "react-redux";
import { dataHomepage } from "../../store/home/actions";
import { useState } from "react";
import { selectHomeData } from "../../store/home/selector";

export default function Homepage() {
  const homeData = useSelector(selectHomeData);
  console.log("this is selector", homeData);
  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });
  //   const methods = usePlacesAutocomplete({
  //     // Provide the cache time in seconds, default is 24 hours
  //     cache: 24 * 60 * 60,
  //   });

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
    dispatch(dataHomepage(lat, lng));
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
      <div class="container h-screen flex align-center items-top flex-column">
        {/* <div class="absolute top-4 left-3 ">
            {" "}
            <i class="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>{" "}
          </div>{" "} */}
        <div ref={ref}>
          <input
            type="text"
            class="h-14 w-96 mt-4 pl-10 pr-20 rounded-lg z-0 focus:shadow bg-gray-200 focus:outline-none"
            placeholder="Search anything..."
            value={value}
            onChange={handleInput}
            disabled={!ready}
          />
          <button
            onClick={sumbitSearch}
            class="h-10 w-20 mt-4 text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-10"
          >
            Search
          </button>
          <div>{status === "OK" && <ul>{renderSuggestions()}</ul>}</div>
        </div>
        <div>
          {homeData
            ? homeData.map((data) => {
                return (
                  <div class="flex justify-center m-5">
                    <div class="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
                      {data.photos?.length ? (
                        data.photos.map((photos) => {
                          console.log(
                            "this is the photoref",
                            photos.photo_reference
                          );
                          return (
                            <img
                              class=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                              src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photos.photo_reference}&maxwidth=300&key=AIzaSyDGnhMSdxZWn2pTKvaimAKqZif3PqA7LwY`}
                              alt=""
                            />
                          );
                        })
                      ) : (
                        <img
                          class=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                          src="https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
                          alt=""
                        />
                      )}

                      <div class="p-6 flex flex-col justify-start">
                        <h5 class="text-gray-900 text-xl font-medium mb-2">
                          {data.name}
                        </h5>
                        <p class="text-gray-700 text-base mb-4">
                          This is a wider card with supporting text below as a
                          natural lead-in to additional content. This content is
                          a little bit longer.
                        </p>
                        <p class="text-gray-600 text-xs">
                          Last updated 3 mins ago
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            : "Start Searching!"}
        </div>
      </div>
    </div>
  );
}
