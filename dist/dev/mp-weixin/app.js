"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_user = require("./store/user.js");
const api_user = require("./api/user.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/home/home.js";
  "./pages/battle/battle.js";
  "./pages/match/match.js";
  "./pages/result/result.js";
  "./pages/profile/profile.js";
  "./pages/wordbook/wordbook.js";
  "./pages/wrongbook/wrongbook.js";
  "./pages/rank/rank.js";
  "./pages/battle/friend-match.js";
  "./pages/study/study.js";
  "./pages/community/community.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      console.log("App Launch");
      const userStore = store_user.useUserStore();
      if (userStore.token) {
        api_user.getUserProfile().then((res) => {
          console.log("Synced User Profile:", res);
          userStore.saveUserInfo(res);
          if (!res.phone) {
            common_vendor.index.reLaunch({ url: "/pages/login/bind-phone" });
          }
        }).catch((err) => {
          console.error("Sync Profile Failed:", err);
        });
      }
    });
    common_vendor.onShow(() => {
      console.log("App Show");
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
