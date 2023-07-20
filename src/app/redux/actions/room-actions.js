import { Types } from "../constants/room-types";
import API from "../api/room-api";

export function listAllRooms(params) {
  return async function (dispatch, getState) {
    try {
      await API.listAllRooms(params).then(
        (data) => {
          dispatch({
            type: Types.GET_ROOM_LIST,
            payload: {
              data: data.data,
              roomListLoading: false,
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

export function getRoomById(id, params = {}) {
  return async function (dispatch, getState) {
    try {
      await API.getRoomById(id, params).then(
        (data) => {
          console.log('data ====> ', data);
          dispatch({
            type: Types.GET_EDIT_ROOM,
            payload: { data: data.data, editRoomLoading: false },
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (e) { }
  };
}

export function createRoom(formData) {
  return async function (dispatch, getState) {
    try {
      await API.createRoom(formData).then(
        (data) => {
          dispatch({
            type: Types.ADD_ROOM,
            payload: { message: "Room Added", success: true },
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
              type: Types.ADD_ROOM,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}

export function updateRoom(id, formData) {
  return async function (dispatch, getState) {
    try {
      await API.updateRoom(id, formData).then(
        (data) => {
          dispatch({
            type: Types.EDIT_ROOM,
            payload: { message: "Room Updated", success: true },
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
              type: Types.EDIT_ROOM,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}
export function deleteRoom(id) {
  return async function (dispatch, getState) {
    try {
      await API.deleteRoom(id).then(
        (data) => {
          dispatch({
            type: Types.DELETE_ROOM,
            payload: { message: "Room Deleted", success: true },
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
              type: Types.DELETE_ROOM,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}

export function cloneRoom(id) {
  return async function (dispatch, getState) {
    try {
      await API.cloneRoom(id).then(
        (data) => {
          dispatch({
            type: Types.CLONE_ROOM,
            payload: { message: "Room Cloned", success: true },
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
              type: Types.CLONE_ROOM,
              payload: { success: false, message: error.response.data.message },
            });
          }
        }
      );
    } catch (e) { }
  };
}

export function setRoomListLoading(value) {
  return async function (dispatch, getState) {
    dispatch({
      type: Types.ROOM_LIST_LOADING,
      payload: value,
    });
  };
}
