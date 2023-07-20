import { Types } from "../constants/lead-contact-types";
const initialState = {
  leadContactList: [],
  leadContactListLoading: true,
  isAddLeadContactModalOpen: false,
  leadContactAdded: undefined,
  errorMessage: undefined,
  editLeadContact: undefined,
  editLeadContactLoading: true,
  leadContactUpdated: false
};

export default function leadContactReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_LEAD_CONTACT_LIST:
      return {
        ...initialState,
        leadContactList: action.payload.data,
        leadContactListLoading: action.payload.leadContactListLoading
      };
    case Types.GET_EDIT_LEAD_CONTACT:
      return {
        ...initialState,
        editLeadContact: action.payload.data,
        editLeadContactLoading: action.payload.editLeadContactLoading,
      };
    case Types.ADD_LEAD_CONTACT:
      return {
        ...initialState,
        leadContactAdded: action.payload.leadContactAdded,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
    case Types.EDIT_LEAD_CONTACT:
      return {
        ...initialState,
        leadContactUpdated: action.payload.success,
        leadContactMessage: action.payload.message

      };
    default:
      return state;
  }
}
