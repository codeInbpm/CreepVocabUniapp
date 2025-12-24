"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    token: common_vendor.index.getStorageSync("token") || "",
    userInfo: common_vendor.index.getStorageSync("userInfo") || {}
  }),
  actions: {
    // Actions matching the request
    saveToken(token) {
      this.setToken(token);
    },
    saveUserInfo(info) {
      if (info.avatar && !info.avatarUrl) {
        info.avatarUrl = info.avatar;
      }
      this.setUserInfo(info);
    },
    loginSuccess(token, userInfo) {
      this.saveToken(token);
      this.saveUserInfo(userInfo);
    },
    setToken(token) {
      this.token = token;
      common_vendor.index.setStorageSync("token", token);
    },
    setUserInfo(info) {
      this.userInfo = info;
      common_vendor.index.setStorageSync("userInfo", info);
    },
    logout() {
      this.token = "";
      this.userInfo = {};
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("userInfo");
    }
  }
});
exports.useUserStore = useUserStore;
