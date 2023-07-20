import { Types } from "../constants/lead-types";
const initialState = {
  leadList: [],
  leadListLoading: true,
  isAddLeadModalOpen: false,
  leadAdded: undefined,
  errorMessage: undefined,
  editLead: undefined,
  editLeadLoading: true,
  leadUpdated: false,
  leadListMeta: undefined
};

export default function leadReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_LEAD_LIST:
      return {
        ...initialState,
        leadList: action.payload.data,
        leadListLoading: action.payload.leadListLoading,
        leadListMeta: action.payload.meta,
      };
    case Types.GET_EDIT_LEAD:
      return {
        ...initialState,
        editLead: action.payload.data,
        editLeadLoading: action.payload.editLeadLoading,
      };
    case Types.OPEN_ADD_LEAD_MODAL:
      return {
        ...initialState,
        isAddLEADModalOpen: action.payload,
      };
    case Types.ADD_LEAD:
      return {
        ...initialState,
        leadAdded: action.payload.leadAdded,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
    case Types.EDIT_LEAD:
      return {
        ...initialState,
        leadUpdated: action.payload.success,
        leadMessage: action.payload.message,
        // leadListLoading: false
      };
    case Types.LEAD_LIST_LOADING:
      return {
        ...initialState,
        leadListLoading: action.payload,
      };
    default:
      return state;
  }
}
