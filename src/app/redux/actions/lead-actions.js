import { Types } from "../constants/lead-types";
import API from "../api/lead-api";

export function listAllLeads(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllLeads(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_LIST,
            payload: {
              data: data.data,
              leadListLoading: false,
              meta: data.meta ? data.meta : null,
            },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function getLeadById(id, params = {}) {
  return async function (dispatch, getState) {
    try {
      await API.getLeadById(id, params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_LEAD,
            payload: { data: data.data, editLeadLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function createLead(formData) {
  return async function (dispatch, getState) {
    try {
      await API.createLead(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_LEAD,
            payload: { message: "Lead Updated", success: true },
          });
        },
        (error) => {
          console.log(error.response);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            dispatch({
              type: Types.ADD_LEAD,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_LEAD,
        payload: { message: "There is an error", success: false },
      });
    }
  };
  return async function (dispatch, getState) {
    try {
      dispatch({
        type: Types.ADD_LEAD,
        payload: {},
      });
      window.location = window.location.origin;
    } catch (e) { }
  };
}

export function updateLead(id, formData, onSuccess, onError) {
  return async function (dispatch, getState) {
    try {
      await API.updateLead(id, formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_LEAD,
            payload: { message: "Lead Updated", success: true },
          });
          return "czxzcz"
        },
        (error) => {
          console.log(error.response);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            dispatch({
              type: Types.EDIT_LEAD,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}
export function setLeadListLoading(value) {
  return async function (dispatch, getState) {
    dispatch({
      type: Types.LEAD_LIST_LOADING,
      payload: value,
    });
  };
}
