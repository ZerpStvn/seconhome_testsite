import { Types } from "../constants/home-types";
import API from "../api/home-api";

export function listAll(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAll(params).then(
        (data) => {
          dispatch({
            type: Types.GET_HOME_LIST,
            payload: {
              data: data.data,
              homeListLoading: false,
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

export function getById(id, params = {}) {
  return async function (dispatch, getState) {
    try {
      return await API.getById(id, params).then(
        (data) => {
          dispatch({
            type: Types.GET_EDIT_HOME,
            payload: { data: data.data, editHomeLoading: false },
          });
          return data.data;
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function createHome(formData) {
  return async function (dispatch, getState) {
    try {
      await API.createHome(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_HOME,
            payload: { message: "Home Added", success: true },
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
              type: Types.ADD_HOME,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}

export function updateHome(id, formData) {
  return async function (dispatch, getState) {
    try {
      await API.updateHome(id, formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_HOME,
            payload: { message: "Home Updated", success: true },
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
              type: Types.EDIT_HOME,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}

export function deleteHome(id) {
  return async function (dispatch, getState) {
    try {
      await API.deleteHome(id).then(
        (data) => {
          dispatch({
            type: Types.DELETE_HOME,
            payload: { message: "Home Deleted", success: true },
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
              type: Types.DELETE_HOME,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}
export async function cloneHome(id, data) {
  return await API.cloneHome(id, data);
}

export function setHomeListLoading(value) {
  return async function (dispatch, getState) {
    dispatch({
      type: Types.HOME_LIST_LOADING,
      payload: value,
    });
  };
}
