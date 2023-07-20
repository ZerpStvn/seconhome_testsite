import { Types } from "../constants/auth-types";
const initialState = {
  currentUserData: {},
  isLoggedIn: false,
  token: "",
};
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case Types.CURRENT_LOGGED_IN_USER:
      return {
        ...state,
        currentUserData: action.payload.user,
        token: action.payload.token,
        isLoggedIn : action.payload.isLoggedIn
      };
    case Types.VALIDATE_USER:
      return {
        ...state,
        currentUserData: action.payload.user,
        token: action.payload.token,
      };
    case Types.LOGIN_SUCCESS:
      return { ...state, isLoggedIn: action.payload };
    case Types.LOGIN_FAIL:
      return {
        ...state,
        currentUserData: {},
        token: "",
        isLoggedIn: false,
      };
    case Types.LOG_OUT:
      return {
        ...state,
        currentUserData: initialState.userData,
        token: initialState.token,
        isLoggedIn: false,
      };
    default:
      return state;
  }
}
