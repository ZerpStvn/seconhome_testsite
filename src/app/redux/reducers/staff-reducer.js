import { Types } from "../constants/staff-types";
const initialState = {
  staffList: [],
  staffListLoading:true,
  isAddStaffModalOpen: false,
  staffAdded: undefined,
  errorMessage: undefined,
  editStaff: undefined,
  editStaffLoading:true,
  staffUpdated:false,
  staffListMeta:undefined
};

export default function staffReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_STAFF_LIST:
      return {
        ...initialState,
        staffList: action.payload.data,
        staffListLoading:action.payload.staffListLoading,
        staffListMeta:action.payload.meta,
      };
    case Types.GET_EDIT_STAFF:
      return {
        ...initialState,
        editStaff: action.payload.data,
        editStaffLoading:action.payload.editStaffLoading,
      };
    case Types.OPEN_ADD_STAFF_MODAL:
      return {
        ...state,
        isAddSTAFFModalOpen: action.payload,
      };
    case Types.ADD_STAFF:
      return {
        ...state,
        staffAdded: action.payload.staffAdded,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
      case Types.EDIT_STAFF:
      return {
        ...initialState,
        staffUpdated: action.payload.success,
        staffMessage:action.payload.message
        
      };
      case Types.STAFF_LIST_LOADING:
      return {
        ...initialState,
        staffListLoading: action.payload        
      };
    default:
      return state;
  }
}
