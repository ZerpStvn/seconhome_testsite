import { Types } from "../constants/user-types";
import Config from "../../config";
const initialState = {
  userList: [],
  isAddUserModalOpen: false,
  editUserData: undefined,
  currentLoggedInUser: undefined,
  userRole: undefined,
  userAdded: undefined,
  userUpdated: undefined,
  isAssignAccountModalOpen: false,
  isAssignPublisherModalOpen: false,
};
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_USER_LIST:
      return {
        ...state,
        userList: action.payload,
      };
    case Types.GET_EDIT_USER:
      return {
        ...state,
        editUserData: action.payload,
      };
    case Types.GET_LOGGED_IN_USER:
      return {
        ...state,
        currentLoggedInUser: action.payload,
        userRole: Config.userRoleTypes[action.payload.role].name
      };
    case Types.OPEN_ADD_USER_MODAL:
      return {
        ...state,
        isAddUserModalOpen: action.payload,
      };
    case Types.OPEN_ASSIGN_ACCOUNT_MODAL:
      return {
        ...state,
        isAssignAccountModalOpen: action.payload,
      };
    case Types.OPEN_ASSIGN_PUBLISHER_MODAL:
      return {
        ...state,
        isAssignPublisherModalOpen: action.payload,
      };
    case Types.ADD_USER:
      return {
        ...state,
        userAdded: action.payload,
      };
    case Types.UPDATE_USER:
      return {
        ...state,
        userUpdated: action.payload,
      };
    default:
      return state;
  }
}
