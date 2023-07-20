import { Types } from "../constants/invoice-types";
import API from "../api/invoice-api";

export function listAllInvoices(params) {
  return async function(dispatch, getState) {
    try {
      await API.listAllInvoices(params).then(
        (data) => {
          dispatch({
            type: Types.GET_INVOICE_LIST,
            payload: {data:data.data,invoiceListLoading:false,meta:data.meta?data.meta:null},
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) {

    }
  };
}

export function getInvoiceById(id,params = {}) {
  return async function(dispatch, getState) {
    try {
      await API.getInvoiceById(id,params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_INVOICE,
            payload: {data:data.data,editInvoiceLoading:false},
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) {
      
    }
  };
    
}

export function createInvoice(formData) {
  return async function(dispatch, getState) {
    try {
      await API.createInvoice(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_INVOICE,
            payload: {message:"Invoice Updated",success:true},
          });
        },
        (error) => {
          console.log(error.response);
        if(error.response && error.response.data && error.response.data.message) {
          dispatch({
            type: Types.ADD_INVOICE,
            payload: {success: false, message: error.response.data.message},
          });
        }  
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_INVOICE,
        payload: {message:"There is an error",success:false},
      });
    }
  };
  return async function(dispatch, getState) {
    try {
      dispatch({
        type: Types.ADD_INVOICE,
        payload: {},
      });
      window.location = window.location.origin;
    } catch (e) {}
  };
}

export function updateInvoice(id,formData) {
  return async function(dispatch, getState) {
    try {
      await API.updateInvoice(id,formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_INVOICE,
            payload: {message:"Invoice Updated",success:true},
          });
        },
        (error) => {
          console.log(error.response);
        if(error.response && error.response.data && error.response.data.message) {
          dispatch({
            type: Types.EDIT_INVOICE,
            payload: {success: false, message: error.response.data.message},
          });
        }  
        }
      );
    } catch (e) {
      
    }
  };
}


export function setInvoiceListLoading(value) {
  return async function(dispatch, getState) {
    dispatch({
      type: Types.INVOICE_LIST_LOADING,
      payload:value
    });
       
  };
}