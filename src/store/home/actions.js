import axios from "axios";

export const getHomeData = (homeData) => ({
  type: "home/getHomeData",
  payload: homeData,
});

export const dataHomepage = (lat, lng) => {
  return async (dispatch, getState) => {
    try {
      const response =
        await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json
            ?keyword=cruise
            &location=${lat}%2C${lng}
            &radius=100
            &type=restaurant
            &key=AIzaSyDGnhMSdxZWn2pTKvaimAKqZif3PqA7LwY`);
      console.log(response);
      dispatch(getHomeData(response));
    } catch (error) {
      console.log(error);
    }
  };
};
