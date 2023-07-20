import * as R from "ramda";

export function fontSizeArray() {
  var sizeArray = [];
  for (var i = 1; i <= 40; i++) {
    sizeArray.push(i);
  }
  return sizeArray;
}

export function checkUserRole(userRoles) {
  if (R.includes({ name: "ROLE_ADMIN" }, userRoles)) {
    return "ROLE_ADMIN";
  } else if (R.includes({ name: "ROLE_PARTNER_DEVELOPMENT" }, userRoles)) {
    return "ROLE_PARTNER_DEVELOPMENT";
  } else if (R.includes({ name: "ROLE_PUBLISHER_OBSERVER" }, userRoles)) {
    return "ROLE_PUBLISHER_OBSERVER";
  } else if (R.includes({ name: "ROLE_ACCOUNT_OBSERVER" }, userRoles)) {
    return "ROLE_ACCOUNT_OBSERVER";
  } else if (R.includes({ name: "ROLE_ACCOUNT_MANAGER" }, userRoles)) {
    return "ROLE_ACCOUNT_MANAGER";
  } else if (R.includes({ name: "ROLE_ACCOUNT_MANAGER_LEAD" }, userRoles)) {
    return "ROLE_ACCOUNT_MANAGER_LEAD";
  } else if (R.includes({ name: "ROLE_TRACKING_LEAD" }, userRoles)) {
    return "ROLE_TRACKING_LEAD";
  } else if (R.includes({ name: "ROLE_PARTNER_DEVELOPMENT_LEAD" }, userRoles)) {
    return "ROLE_PARTNER_DEVELOPMENT_LEAD";
  } else if (R.includes({ name: "ROLE_OBSERVER" }, userRoles)) {
    return "ROLE_OBSERVER";
  } else {
    return "ROLE_ACCOUNT_MANAGER";
  }
}

export function checkTimezone(timezone) {
  if (timezone === "UTC") {
    return "UTC";
  } else if (timezone === "American_Los_Angeles") {
    return "American_Los_Angeles";
  } else if (timezone === "American_New_York") {
    return "American_New_York";
  } else {
    return "American_Chicago";
  }
}

export function checkRunningStatus(runningStatus) {
  if (runningStatus === "PENDING") {
    return "rgb(255, 213, 79)";
  } else if (runningStatus === "ACTIVE") {
    return "rgb(129, 199, 132)";
  } else if (runningStatus === "INACTIVE") {
    return "rgb(229, 115, 115)";
  } else {
    return "rgb(79, 195, 247)";
  }
}

export function getDayStartTime() {
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}

export function getDayEndTime() {
  var date = new Date();
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  return date;
}

export function setImagePath(imageResource) {
  return (
    "https://s3." +
    imageResource.region +
    ".amazonaws.com/" +
    imageResource.bucket +
    "/image-resources/" +
    imageResource.fileName
  );
}

export function setVideoPath(videoResource) {
  return (
    "https://s3." +
    videoResource.region +
    ".amazonaws.com/" +
    videoResource.bucket +
    "/video-resources/" +
    videoResource.fileName
  );
}
