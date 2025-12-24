"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  _easycom_wd_icon2();
}
const _easycom_wd_icon = () => "../../node-modules/wot-design-uni/components/wd-icon/wd-icon.js";
if (!Math) {
  _easycom_wd_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "home",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const toMatch = () => common_vendor.index.navigateTo({ url: "/pages/match/match" });
    const toFriendMatch = () => common_vendor.index.navigateTo({ url: "/pages/battle/friend-match" });
    const toWordBook = () => common_vendor.index.navigateTo({ url: "/pages/wordbook/wordbook" });
    const toWrongBook = () => common_vendor.index.navigateTo({ url: "/pages/wrongbook/wrongbook" });
    const toChallenge = () => common_vendor.index.showToast({ title: "挑战模式开发中", icon: "none" });
    const toRank = () => common_vendor.index.navigateTo({ url: "/pages/rank/rank" });
    const toProfile = () => common_vendor.index.switchTab({ url: "/pages/profile/profile" });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(userStore).userInfo.avatarUrl || "/static/logo.png",
        b: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname || "未登录"),
        c: common_vendor.p({
          name: "chart-bar",
          size: "14px",
          color: "#F4A261"
        }),
        d: common_vendor.t(common_vendor.unref(userStore).userInfo.wordPower || 0),
        e: common_vendor.t(common_vendor.unref(userStore).userInfo.totalBattles || 0),
        f: common_vendor.t(common_vendor.unref(userStore).userInfo.winCount || 0),
        g: common_vendor.p({
          name: "loading",
          size: "24px",
          color: "#F4A261"
        }),
        h: common_vendor.o(toProfile),
        i: common_vendor.p({
          name: "tips",
          size: "28px",
          color: "#333"
        }),
        j: common_vendor.p({
          name: "read",
          size: "28px",
          color: "#333"
        }),
        k: common_vendor.o(toWordBook),
        l: common_vendor.p({
          name: "filter",
          size: "32px",
          color: "#fff"
        }),
        m: common_vendor.o(toMatch),
        n: common_vendor.p({
          name: "user-group",
          size: "32px",
          color: "#fff"
        }),
        o: common_vendor.o(toFriendMatch),
        p: common_assets._imports_0$1,
        q: common_vendor.o(toChallenge),
        r: common_vendor.p({
          name: "notebook",
          size: "40px",
          color: "#F4A261"
        }),
        s: common_vendor.o(toWrongBook),
        t: common_vendor.p({
          name: "chart",
          size: "16px",
          color: "#4D80F0"
        }),
        v: common_vendor.o(toRank),
        w: common_vendor.p({
          name: "chat",
          size: "16px",
          color: "#4D80F0"
        }),
        x: common_vendor.p({
          name: "money-circle",
          size: "16px",
          color: "#FF6B6B"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0cd09a48"]]);
wx.createPage(MiniProgramPage);
