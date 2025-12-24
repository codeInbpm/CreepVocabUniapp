"use strict";
const common_vendor = require("../common/vendor.js");
const store_user = require("../store/user.js");
const BASE_URL = "http://localhost:5687/api";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const userStore = store_user.useUserStore();
    if (!options.withoutToken && userStore.token) {
      options.header = {
        ...options.header,
        "Authorization": `Bearer ${userStore.token}`
      };
    }
    options.url = BASE_URL + options.url;
    common_vendor.index.request({
      ...options,
      success: async (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          userStore.logout();
          try {
            const { useWsStore } = await "../store/ws.js";
            useWsStore().disconnect();
          } catch (e) {
            console.error("Failed to disconnect WS", e);
          }
          common_vendor.index.showToast({ title: "请重新登录", icon: "none" });
          common_vendor.index.reLaunch({ url: "/pages/login/login" });
          reject(res);
        } else {
          common_vendor.index.showToast({ title: "请求失败", icon: "none" });
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        reject(err);
      }
    });
  });
};
exports.request = request;
