import { Types } from "../constants/lead-contact-types";
import API from "../api/lead-contact-api";

export function listAllLeadContacts(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllLeadContacts(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_CONTACT_LIST,
            payload: { data: data.data, leadContactListLoading: false },
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

export function getLeadContactById(id, params = {}) {
  return async function (dispatch, getState) {
    try {
      await API.getLeadContactById(id, params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_LEAD_CONTACT,
            payload: { data: data.data, editLeadContactLoading: false },
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

export function createLeadContact(formData) {
  return async function (dispatch, getState) {
    try {
      await API.createLeadContact(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_LEAD_CONTACT,
            payload: { message: "LeadContact Updated", success: true },
          });
        },
        (error) => {
          console.log(error.response);
          if (error.response && error.response.data && error.response.data.message) {
            dispatch({
              type: Types.ADD_LEAD_CONTACT,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_LEAD_CONTACT,
        payload: { message: "There is an error", success: false },
      });
    }
  };
  return async function (dispatch, getState) {
    try {
      dispatch({
        type: Types.ADD_LEAD_CONTACT,
        payload: {},
      });
      window.location = window.location.origin;
    } catch (e) { }
  };
}

export function updateLeadContact(id, formData) {
  return async function (dispatch, getState) {
    try {
      await API.updateLeadContact(id, formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_LEAD_CONTACT,
            payload: { message: "LeadContact Updated", success: true },
          });
        },
        (error) => {
          console.log(error.response);
          if (error.response && error.response.data && error.response.data.message) {
            dispatch({
              type: Types.EDIT_LEAD_CONTACT,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) {

    }
  };
}
