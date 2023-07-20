import { Types } from "./../constants/user-types";
import userApi from "../api/user-api";

// Load all users
export const loadUsers = (params) => async (dispatch) => {
  try {
    await userApi.loadAllUsers(params).then(
      (data) => {
        dispatch(setUserList(data));
      },
      (error) => {
        console.log(error);
      }
    );
  } catch (err) { }
};

// Add new user
export const addUser = (userData) => async (dispatch) => {
  try {
    await userApi.addUser(userData).then(
      (data) => {
        if (data && data.message && data.message === "User added successfully!") {
          dispatch(setAddUser(data));
        }
      },
      (error) => {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message)
          dispatch({
            type: Types.ADD_USER,
            payload: { success: false, message: error.response.data.message },
          });
      }
    );
  } catch (err) { }
};

// Update existing user
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    await userApi.updateUser(id, userData).then(
      (data) => {
        dispatch(setUpdateUser(data));

      },
      (error) => {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message)
          dispatch({
            type: Types.UPDATE_USER,
            payload: { success: false, message: error.response.data.message },
          });
      }
    );
  } catch (err) { }
};

// Load user by UserId
export const loadUserById = (id) => async (dispatch) => {
  try {
    await userApi.loadUserById(id).then(
      (data) => {
        dispatch(setEditUser(data));
      },
      (error) => {
        console.log(error);
      }
    );
  } catch (err) { }
};

// Load Current LoggedIn User
export const loadCurrentLoggedInUser = (params = []) => async (dispatch) => {
  try {
    await userApi.loadCurrentLoggedInUser(params).then(
      (data) => {
        dispatch(setLoggedInUser(data.data));
      },
      (error) => {
        console.log(error);
      }
    );
  } catch (err) { }
};

// To open add new user Modal
export const openNewUserModal = () => async (dispatch) => {
  dispatch({
    type: Types.OPEN_ADD_USER_MODAL,
    payload: true,
  });
};

// To close add new user Modal
export const closeNewUserModal = () => async (dispatch) => {
  dispatch({
    type: Types.OPEN_ADD_USER_MODAL,
    payload: false,
  });
};

export const openAssignPublisherModal = () => async (dispatch) => {
  dispatch({
    type: Types.OPEN_ASSIGN_PUBLISHER_MODAL,
    payload: true,
  });
};

export const closeAssignPublisherModal = () => async (dispatch) => {
  console.log("inside  closeAssignPublisherModal ");
  dispatch({
    type: Types.OPEN_ASSIGN_PUBLISHER_MODAL,
    payload: false,
  });
};

export const openAssignAccountModal = () => async (dispatch) => {
  dispatch({
    type: Types.OPEN_ASSIGN_ACCOUNT_MODAL,
    payload: true,
  });
};

export const closeAssignAccountModal = () => async (dispatch) => {
  dispatch({
    type: Types.OPEN_ASSIGN_ACCOUNT_MODAL,
    payload: false,
  });
};

const setUserList = (users) => {
  return {
    type: Types.GET_USER_LIST,
    payload: users.data,
  };
};

const setAddUser = (data) => {
  return {
    type: Types.ADD_USER,
    payload: { success: true, message: data.message },
  };
};

const setUpdateUser = (data) => {
  return {
    type: Types.UPDATE_USER,
    payload: { success: true, message: data.message },
  };
};

const setEditUser = (user) => {
  return {
    type: Types.GET_EDIT_USER,
    payload: user,
  };
};

const setLoggedInUser = (user) => {
  return {
    type: Types.GET_LOGGED_IN_USER,
    payload: user,
  };
};
