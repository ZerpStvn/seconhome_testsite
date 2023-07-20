import { Types } from "../constants/invoice-types";
const initialState = {
  invoiceList: [],
  invoiceListLoading:true,
  isAddInvoiceModalOpen: false,
  invoiceAdded: undefined,
  errorMessage: undefined,
  editInvoice: undefined,
  editInvoiceLoading:true,
  invoiceUpdated:false,
  invoiceListMeta:undefined
};

export default function invoiceReducer(state = initialState, action) {
  switch (action.type) {
    case Types.GET_INVOICE_LIST:
      return {
        ...initialState,
        invoiceList: action.payload.data,
        invoiceListLoading:action.payload.invoiceListLoading,
        invoiceListMeta:action.payload.meta,
      };
    case Types.GET_EDIT_INVOICE:
      return {
        ...initialState,
        editInvoice: action.payload.data,
        editInvoiceLoading:action.payload.editInvoiceLoading,
      };
    case Types.OPEN_ADD_INVOICE_MODAL:
      return {
        ...initialState,
        isAddINVOICEModalOpen: action.payload,
      };
    case Types.ADD_INVOICE:
      return {
        ...initialState,
        invoiceAdded: action.payload.invoiceAdded,
        errorMessage: action.payload.errorMessage
          ? action.payload.errorMessage
          : initialState.errorMessage,
      };
      case Types.EDIT_INVOICE:
      return {
        ...initialState,
        invoiceUpdated: action.payload.success,
        invoiceMessage:action.payload.message
        
      };
      case Types.INVOICE_LIST_LOADING:
      return {
        ...initialState,
        invoiceListLoading:action.payload
        
      };
    default:
      return state;
  }
}
