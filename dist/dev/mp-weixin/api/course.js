"use strict";
const utils_request = require("../utils/request.js");
function getCourseList() {
  return utils_request.request({
    url: "/course/list",
    method: "POST"
  });
}
function selectCourse(courseId) {
  return utils_request.request({
    url: "/course/select",
    method: "POST",
    data: { courseId }
  });
}
exports.getCourseList = getCourseList;
exports.selectCourse = selectCourse;
