import dashboard from "./dashboard";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  dashboard: dashboard,
});

export default rootReducer;
