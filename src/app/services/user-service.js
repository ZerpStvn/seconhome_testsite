const setUserData = (user) => {
  return new Promise((resolve) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const setAccessToken = (access_token) => {
  return new Promise((resolve) => {
    if (access_token) {
      localStorage.setItem("access_token", access_token);
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const setRefreshToken = (token) => {
  return new Promise((resolve) => {
    if (token) {
      localStorage.setItem("refresh_token", token);
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
const setTokenExpiryTime = (time) => {
  return new Promise((resolve) => {
    if (time) {
      localStorage.setItem("token_expires", time);
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const isUserLoggedIn = (user) => {
  if ("user" in localStorage && "access_token" in localStorage) {
    const user = JSON.parse(localStorage.getItem("user"));
    const authToken = localStorage.getItem("access_token");
    if (user && authToken !== "") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const getLoggedInUser = (user) => {
  if ("user" in localStorage && "access_token" in localStorage) {
    const user = JSON.parse(localStorage.getItem("user"));
    return user;
  } else {
    return false;
  }
};
const setAdminUser = (user) => {
  return new Promise((resolve) => {
    if (user) {
      console.log(user, 'user');
      localStorage.setItem("admin_user", JSON.stringify(user));
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
const getAdminUser = () => {
  if ("admin_user" in localStorage) {
    const user = JSON.parse(localStorage.getItem("admin_user"));
    return user;
  } else {
    return false;
  }
};

const signOut = () => {
  return new Promise((resolve) => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin_user");
    resolve(true);
  });
};

export default {
  setUserData,
  isUserLoggedIn,
  signOut,
  setAccessToken,
  setRefreshToken,
  setTokenExpiryTime,
  getLoggedInUser,
  setAdminUser,
  getAdminUser
};
