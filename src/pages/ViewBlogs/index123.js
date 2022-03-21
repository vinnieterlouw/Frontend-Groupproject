import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useDispatch } from "react-redux";
import { dataHomepage } from "../../store/home/actions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllBlogsWithUserName } from "../../store/blogs/selectors";
import { fetchAllBlogsWithUserName } from "../../store/blogs/actions";
import { selectHomeData } from "../../store/home/selector";
import { NavLink } from "react-router-dom";


import React from "react";
import { Slider } from "@mui/material";

export default function ViewBlogs() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllBlogsWithUserName);
  }, [dispatch]);

  const blogs = useSelector(selectAllBlogsWithUserName);
  console.log("selector blogs", blogs);

  //search bar //
  const homeData = useSelector(selectHomeData);
  console.log("this is selector", homeData);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });
  const [range, setRange] = useState("");
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
          <div className="flex align-center justify-center mt-10">
            <input
              type="text"
              className="h-14 w-96 mt-4 pl-10 pr-20 rounded-lg z-0 focus:shadow bg-gray-200 focus:outline-none"
              placeholder="Search anything..."
              value={value}
              onChange={handleInput}
              disabled={!ready}
            />
            <div className="flex align-center justify-center flex-column mr-5 ml-5 mt-4">
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
      w-40
      px-3
      py-1.5
      mt-1
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
                <option value="Restaurant">Restaurant</option>
                <option value="Hospital">Hospital</option>
                <option value="Hotel">Hotel</option>
                <option value="Museum">Museum</option>
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
        <div className="flex flex-row justify-between flex-wrap mt-10 rounded">
          {blogs.map((blog) => {
            return (
              <div className="flex m-3">
                <div className="flex flex-col w-96 h-96 max-w-7xl rounded-lg bg-white shadow-lg">
                  <img
                    className=" w-full h-96 md:h-44 object-cover md:w-full rounded-t-lg md:rounded-none md:rounded-l-lg"
                    src={blog.mainImageUrl}
                    alt=""
                  />
                  <div className="p-6 flex flex-col justify-start">
                    <h5 className="text-gray-900 text-xl font-medium mb-2">
                      {blog.title}
                    </h5>
                    <p className="text-gray-700 text-sm mb-2">
                      <b>By:</b> {blog.user.name}
                    </p>
                    <p className="text-gray-700 text-base mb-10">
                      <b>Location:</b> {blog.location}
                    </p>
                    <NavLink to={`/blogs/${blog.id}`}>
                      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        View
                      </button>
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
