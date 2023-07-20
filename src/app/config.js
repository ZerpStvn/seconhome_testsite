module.exports = {
  API: "https://api.secondhomeseniors.com",
  // MainUrl: "https://secondhomeseniors.com",
  MainUrl: "http://localhost:3000/",
  BaseUrl: "http://localhost/wordpress/",
  userRoleTypes: {
    "696a87de-4059-4bcf-9929-072a8f1d83e9": {
      url: "dashboard/admin",
      name: "admin",
    },
    "8091cbf7-fafb-4255-b1be-42a2e1a6d436": {
      url: "dashboard/owner",
      name: "home-owner",
    },
    "eed0ea0e-d137-42b3-8cef-3e53c9038aa8": {
      url: "dashboard/all-communities",
      name: "client",
    },
  },
  userId: {
    admin: "696a87de-4059-4bcf-9929-072a8f1d83e9",
    home_owner: "8091cbf7-fafb-4255-b1be-42a2e1a6d436",
    client: "eed0ea0e-d137-42b3-8cef-3e53c9038aa8",
    lead_client: "3040a803-23ea-4cab-82db-4f56377a8881",
  },
  token: {
    expire: 3600,
  },
  googleMapsAPIkey: "AIzaSyA6eaMRrfLzlYUe-H1sL6D9tkVXjS6O7BQ",
};
