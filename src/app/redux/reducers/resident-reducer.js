import { Types } from "../constants/resident-types";
const initialState = {
  residentList: [],
  residentListLoading:true,
  isAddResidentModalOpen: false,
  residentAdded: undefined,
  errorMessage: undefined,
  editResident: undefined,
  editResidentLoading:true,
  residentUpdated:false
};

export default function residentReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_RESIDENT_LIST:
      return {
        ...initialState,
        residentList: action.payload.data,
        residentListLoading:action.payload.residentListLoading
      };
    case Types.GET_EDIT_RESIDENT:
      return {
        ...initialState,
        editResident: action.payload.data,
        editResidentLoading:action.payload.editResidentLoading,
      };
    case Types.OPEN_ADD_RESIDENT_MODAL:
      return {
        ...state,
        isAddRESIDENTModalOpen: action.payload,
      };
    case Types.ADD_RESIDENT:
      return {
        ...state,
        residentAdded: action.payload.residentAdded,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
      case Types.EDIT_RESIDENT:
      return {
        ...initialState,
        residentUpdated: action.payload.success,
        residentMessage:action.payload.message
        
      };
    default:
      return state;
  }
}
