"use strict";
const utils_request = require("../utils/request.js");
function getUserProfile() {
  return utils_request.request({
    url: "/user/profile",
    method: "GET"
  });
}
function rewardHintCards() {
  return utils_request.request({
    url: "/user/reward/hint",
    method: "POST"
  });
}
exports.getUserProfile = getUserProfile;
exports.rewardHintCards = rewardHintCards;
