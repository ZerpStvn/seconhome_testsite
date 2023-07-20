import { Types } from "../constants/resident-types";
import API from "../api/resident-api";

export function listAllResidents(params) {
  return async function(dispatch, getState) {
    try {
      await API.listAllResidents(params).then(
        (data) => {
          dispatch({
            type: Types.GET_RESIDENT_LIST,
            payload: {data:data.data,residentListLoading:false},
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

export function getResidentById(id,params = {}) {
  return async function(dispatch, getState) {
    try {
      await API.getResidentById(id,params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_RESIDENT,
            payload: {data:data.data,editResidentLoading:false},
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

export function createResident(formData) {
  return async function(dispatch, getState) {
    try {
      await API.createResident(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_RESIDENT,
            payload: {message:"Resident Updated",success:true},
          });
        },
        (error) => {
          console.log(error.response);
        if(error.response && error.response.data && error.response.data.message) {
          dispatch({
            type: Types.ADD_RESIDENT,
            payload: {success: false, message: error.response.data.message},
          });
        }  
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_RESIDENT,
        payload: {message:"There is an error",success:false},
      });
    }
  };
  return async function(dispatch, getState) {
    try {
      dispatch({
        type: Types.ADD_RESIDENT,
        payload: {},
      });
      window.location = window.location.origin;
    } catch (e) {}
  };
}

export function updateResident(id,formData) {
  return async function(dispatch, getState) {
    try {
      await API.updateResident(id,formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_RESIDENT,
            payload: {message:"Resident Updated",success:true},
          });
        },
        (error) => {
          console.log(error.response);
        if(error.response && error.response.data && error.response.data.message) {
          dispatch({
            type: Types.EDIT_RESIDENT,
            payload: {success: false, message: error.response.data.message},
          });
        }  
        }
      );
    } catch (e) {
      
    }
  };
}
