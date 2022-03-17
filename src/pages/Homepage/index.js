import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

export default function Homepage() {
  const methods = usePlacesAutocomplete({
    // Provide the cache time in seconds, default is 24 hours
    cache: 24 * 60 * 60,
  });

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
        })
        .catch((error) => {
          console.log("😱 Error: ", error);
        });
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
    <div class="bg-gray-200">
      <div class="container h-screen flex align-center items-top flex-column">
        {/* <div class="absolute top-4 left-3 ">
            {" "}
            <i class="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>{" "}
          </div>{" "} */}
        <div ref={ref}>
          <input
            type="text"
            class="h-14 w-96 mt-4 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none"
            placeholder="Search anything..."
            value={value}
            onChange={handleInput}
            disabled={!ready}
          />
          <button class="h-10 w-20 mt-4 text-white rounded-lg bg-blue-500 hover:bg-blue-600 ml-10">
            Search
          </button>
          <div>{status === "OK" && <ul>{renderSuggestions()}</ul>}</div>
        </div>
      </div>
    </div>
  );
}
