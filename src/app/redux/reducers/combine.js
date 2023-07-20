import { combineReducers } from "redux";
import authReducer from "./auth-reducer";
import userReducer from "./user-reducer";
import homeReducer from "./home-reducer";
import roomReducer from "./room-reducer";
import staffReducer from "./staff-reducer";
import leadReducer from "./lead-reducer";
import leadClientReducer from "./lead-client-reducer";
import leadContactReducer from "./lead-contact-reducer";
import residentReducer from "./resident-reducer";
import invoiceReducer from "./invoice-reducer";

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  home: homeReducer,
  room: roomReducer,
  staff: staffReducer,
  lead: leadReducer,
  leadClient: leadClientReducer,
  resident: residentReducer,
  invoice: invoiceReducer,
  leadContact: leadContactReducer,
});
export default reducers;
