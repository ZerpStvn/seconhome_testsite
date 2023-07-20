import { Types } from "../constants/staff-types";
import API from "../api/staff-api";

export function listAllStaff(params) {
  return async function(dispatch, getState) {
    try {
      await API.listAllStaff(params).then(
        (data) => {
          dispatch({
            type: Types.GET_STAFF_LIST,
            payload: {data:data.data,staffListLoading:false,meta:data.meta?data.meta:null},
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

export function getStaffById(id,params = {}) {
  return async function(dispatch, getState) {
    try {
      await API.getStaffById(id,params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_STAFF,
            payload: {data:data.data,editStaffLoading:false},
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

export function createStaff(formData) {
  return async function(dispatch, getState) {
    try {
      await API.createStaff(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_STAFF,
            payload: {message:"Staff Updated",success:true},
          });
        },
        (error) => {
          console.log(error.response);
        if(error.response && error.response.data && error.response.data.message) {
          dispatch({
            type: Types.ADD_STAFF,
            payload: {success: false, message: error.response.data.message},
          });
        }  
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_STAFF,
        payload: {message:"There is an error",success:false},
      });
    }
  };
  
}

export function updateStaff(id,formData) {
  return async function(dispatch, getState) {
    try {
      await API.updateStaff(id,formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_STAFF,
            payload: {message:"Staff Updated",success:true},
          });
        },
        (error) => {
          console.log(error.response);
        if(error.response && error.response.data && error.response.data.message) {
          dispatch({
            type: Types.EDIT_STAFF,
            payload: {success: false, message: error.response.data.message},
          });
        }  
        }
      );
    } catch (e) {
      
    }
  };
}

export function setStaffListLoading(value) {
  return async function(dispatch, getState) {
      dispatch({
        type: Types.STAFF_LIST_LOADING,
        payload:value,
      });
  };
}
