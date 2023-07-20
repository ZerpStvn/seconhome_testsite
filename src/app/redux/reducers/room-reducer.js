import { Types } from "../constants/room-types";
const initialState = {
  roomList: [],
  roomListLoading: true,
  isAddRoomModalOpen: false,
  roomAdded: undefined,
  errorMessage: undefined,
  editRoom: undefined,
  editRoomLoading: true,
  roomUpdated: false,
  roomCloned: false,
  roomListMeta: undefined
};

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_ROOM_LIST:
      return {
        ...initialState,
        roomList: action.payload.data,
        roomListLoading: action.payload.roomListLoading,
        roomListMeta: action.payload.meta
      };
    case Types.GET_EDIT_ROOM:
      return {
        ...initialState,
        editRoom: action.payload.data,
        editRoomLoading: action.payload.editRoomLoading,
      };
    case Types.OPEN_ADD_ROOM_MODAL:
      return {
        ...state,
        isAddROOMModalOpen: action.payload,
      };
    case Types.ADD_ROOM:
      return {
        ...initialState,
        roomAdded: action.payload.success,
        roomMessage: action.payload.message
      };
    case Types.EDIT_ROOM:
      return {
        ...initialState,
        roomUpdated: action.payload.success,
        roomMessage: action.payload.message

      };
    case Types.CLONE_ROOM:
      return {
        ...initialState,
        roomCloned: action.payload.success,
        roomMessage: action.payload.message

      };
    case Types.DELETE_ROOM:
      return {
        ...initialState,
      };
    case Types.ROOM_LIST_LOADING:
      return {
        ...initialState,
        roomListLoading: action.payload

      };
    case "RESET":
      return {
        ...initialState,

      };
    default:
      return state;
  }
}
