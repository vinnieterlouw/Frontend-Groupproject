import { combineReducers } from "redux";
import appState from "./appState/reducer";
import user from "./user/reducer";
import blogs from "./blog/reducer";
import home from "./home/reducer";
import blogsSliceReducer from "./blogs/reducer";

export default combineReducers({
  appState,
  user,
  blogs,
  home,
  blogsSliceReducer,
});
