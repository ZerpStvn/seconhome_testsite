import { Types } from "../constants/home-types";
const initialState = {
  homeList: [],
  homeListLoading: true,
  isAddHomeModalOpen: false,
  homeAdded: undefined,
  errorMessage: undefined,
  editHome: undefined,
  editHomeLoading: true,
  homeUpdated: false,
  homeListMeta: undefined
};

export default function homeReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_HOME_LIST:
      return {
        ...initialState,
        homeList: action.payload.data,
        homeListLoading: action.payload.homeListLoading,
        homeListMeta: action.payload.meta
      };
    case Types.GET_EDIT_HOME:
      return {
        ...initialState,
        editHome: action.payload.data,
        editHomeLoading: action.payload.editHomeLoading,
      };
    case Types.OPEN_ADD_HOME_MODAL:
      return {
        ...state,
        isAddHOMEModalOpen: action.payload,
      };
    case Types.ADD_HOME:
      return {
        ...state,
        homeAdded: action.payload.success,
        homeMessage: action.payload.message
      };
    case Types.EDIT_HOME:
      return {
        ...initialState,
        homeUpdated: action.payload.success,
        homeMessage: action.payload.message

      };
    case Types.HOME_LIST_LOADING:
      return {
        ...initialState,
        homeListLoading: action.payload

      };
    case Types.DELETE_HOME:
      return {
        ...initialState,
      };
    case 'RESET':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
