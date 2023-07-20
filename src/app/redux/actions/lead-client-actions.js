import { Types } from "../constants/lead-client-types";
import API from "../api/lead-client-api";

export function listAllLeadClients(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllLeadClients(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_CLIENT_LIST,
            payload: { data: data.data, leadClientListLoading: false, meta: data.meta ? data.meta : null },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function listAllLikedLeadClients(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllLeadClients(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_CLIENT_LIKED_LIST,
            payload: { data: data.data, leadClientListLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function listAllTourLeadClients(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllLeadClients(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_CLIENT_TOUR_LIST,
            payload: { data: data.data, leadClientListLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function listAllAvailableRoomLeadClients(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllLeadClients(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_CLIENT_AVAILABLE_ROOM_LIST,
            payload: { data: data.data, leadClientListLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function getAllAvailableRoomLeadClientsList(params) {
  return async function (dispatch, getState) {
    try {
      await API.getRoomListing(params).then(
        (data) => {
          dispatch({
            type: Types.GET_LEAD_CLIENT_AVAILABLE_ROOM_LIST,
            payload: { data: data.data, leadClientListLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function getLeadClientById(id, params = {}) {
  return async function (dispatch, getState) {
    try {
      await API.getLeadClientById(id, params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_LEAD_CLIENT,
            payload: { data: data.data, editLeadClientLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function createLeadClient(formData) {
  return async function (dispatch, getState) {
    try {
      await API.createLeadClient(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_LEAD_CLIENT,
            payload: { message: "LeadClient Added", success: true, data: data.data },
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
              type: Types.ADD_LEAD_CLIENT,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_LEAD_CLIENT,
        payload: { message: "There is an error", success: false },
      });
    }
  };
  return async function (dispatch, getState) {
    try {
      dispatch({
        type: Types.ADD_LEAD_CLIENT,
        payload: {},
      });
      window.location = window.location.origin;
    } catch (e) { }
  };
}

export function createLeadClientMessage(formData) {
  return async function (dispatch, getState) {
    try {
      await API.createLeadClientMessage(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_LEAD_CLIENT_MESSAGE,
            payload: {
              message: "Lead Client Message submitted successfully..!!",
              success: true,
            },
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
              type: Types.ADD_LEAD_CLIENT,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) {
      dispatch({
        type: Types.ADD_LEAD_CLIENT,
        payload: { message: "There is an error", success: false },
      });
    }
  };
  return async function (dispatch, getState) {
    try {
      dispatch({
        type: Types.ADD_LEAD_CLIENT,
        payload: {},
      });
      window.location = window.location.origin;
    } catch (e) { }
  };
}

export function updateLeadClient(id, formData) {
  return async function (dispatch, getState) {
    try {
      console.log('id, formData => ', id, formData);
      await API.updateLeadClient(id, formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_LEAD_CLIENT,
            payload: { message: "LeadClient Updated", success: true },
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
              type: Types.EDIT_LEAD_CLIENT,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}

export function setLeadClientListLoading(value) {
  return async function (dispatch, getState) {
    dispatch({
      type: Types.LEAD_CLIENT_LIST_LOADING,
      payload: value,
    });
  };
}
