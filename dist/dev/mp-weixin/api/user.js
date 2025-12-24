"use strict";
const utils_request = require("../utils/request.js");
function getUserProfile() {
  return utils_request.request({
    url: "/user/profile",
    method: "GET"
  });
}
exports.getUserProfile = getUserProfile;
