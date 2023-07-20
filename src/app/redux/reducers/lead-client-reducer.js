import { Types } from "../constants/lead-client-types";
const initialState = {
  leadClientList: [],
  leadClientLikedList: [],
  leadClientTourList: [],
  leadClientAvailableRoomList: [],
  leadClientListLoading: true,
  isAddLeadClientModalOpen: false,
  leadClientAdded: false,
  newLeadClient: {},
  errorMessage: undefined,
  editLeadClient: undefined,
  editLeadClientLoading: true,
  leadClientUpdated: false,
  leadClientMessageAdded: false,
  leadClientMeta: null,
};

export default function leadClientReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_LEAD_CLIENT_LIST:
      return {
        ...initialState,
        leadClientList: action.payload.data,
        leadClientListLoading: action.payload.leadClientListLoading,
        leadClientMeta: action.payload.meta,
      };
    case Types.GET_LEAD_CLIENT_LIKED_LIST:
      return {
        ...initialState,
        leadClientLikedList: action.payload.data,
        leadClientListLoading: action.payload.leadClientListLoading,
      };
    case Types.GET_LEAD_CLIENT_TOUR_LIST:
      return {
        ...initialState,
        leadClientTourList: action.payload.data,
        leadClientListLoading: action.payload.leadClientListLoading,
      };
    case Types.GET_LEAD_CLIENT_AVAILABLE_ROOM_LIST:
      return {
        ...initialState,
        leadClientAvailableRoomList: action.payload.data,
        leadClientListLoading: action.payload.leadClientListLoading,
      };
    case Types.GET_EDIT_LEAD_CLIENT:
      return {
        ...initialState,
        editLeadClient: action.payload.data,
        editLeadClientLoading: action.payload.editLeadClientLoading,
      };
    case Types.ADD_LEAD_CLIENT:
      return {
        ...state,
        leadClientAdded: action.payload.leadClientAdded,
        newLeadClient: action.payload.data,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
    case Types.EDIT_LEAD_CLIENT:
      return {
        ...initialState,
        leadClientUpdated: action.payload.success,
        leadClientMessage: action.payload.message,
      };
    case Types.ADD_LEAD_CLIENT_MESSAGE:
      return {
        ...state,
        leadClientMessageAdded: action.payload.success,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
    case Types.LEAD_CLIENT_LIST_LOADING:
      return {
        ...initialState,
        leadClientListLoading: action.payload,
      };
    case 'RESET':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
