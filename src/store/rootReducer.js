import { combineReducers } from "redux";
import appState from "./appState/reducer";
import user from "./user/reducer";
import blogs from "./blog/reducer";

export default combineReducers({
  appState,
  user,
  blogs
});
