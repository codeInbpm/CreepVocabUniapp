"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_user = require("../../store/user.js");
const api_user = require("../../api/user.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_popup2 = common_vendor.resolveComponent("wd-popup");
  (_easycom_wd_icon2 + _easycom_wd_popup2)();
}
const _easycom_wd_icon = () => "../../node-modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_popup = () => "../../node-modules/wot-design-uni/components/wd-popup/wd-popup.js";
if (!Math) {
  (_easycom_wd_icon + _easycom_wd_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "home",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const showHintPopup = common_vendor.ref(false);
    common_vendor.onShow(() => {
      if (userStore.token && (!userStore.userInfo || !userStore.userInfo.nickname)) {
        api_user.getUserProfile().then((res) => {
          userStore.saveUserInfo(res);
        }).catch((err) => {
          console.error("刷新用户信息失败", err);
        });
      }
    });
    const openHintPopup = () => {
      showHintPopup.value = true;
    };
    const handleWatchAd = () => {
      common_vendor.index.showLoading({ title: "视频加载中..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "观看完整",
          content: "是否领取奖励？",
          success: (res) => {
            if (res.confirm) {
              api_user.rewardHintCards().then((newCount) => {
                common_vendor.index.showToast({ title: "获得20张提示卡！", icon: "success" });
                const info = { ...userStore.userInfo };
                info.hintCards = newCount;
                userStore.saveUserInfo(info);
                showHintPopup.value = false;
              });
            }
          }
        });
      }, 1e3);
    };
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
        j: common_vendor.t(common_vendor.unref(userStore).userInfo.hintCards || 0),
        k: common_vendor.o(openHintPopup),
        l: common_vendor.p({
          name: "read",
          size: "28px",
          color: "#333"
        }),
        m: common_vendor.o(toWordBook),
        n: common_vendor.p({
          name: "filter",
          size: "32px",
          color: "#fff"
        }),
        o: common_vendor.o(toMatch),
        p: common_vendor.p({
          name: "user-group",
          size: "32px",
          color: "#fff"
        }),
        q: common_vendor.o(toFriendMatch),
        r: common_assets._imports_0$1,
        s: common_vendor.o(toChallenge),
        t: common_vendor.p({
          name: "notebook",
          size: "40px",
          color: "#F4A261"
        }),
        v: common_vendor.o(toWrongBook),
        w: common_vendor.p({
          name: "chart",
          size: "16px",
          color: "#4D80F0"
        }),
        x: common_vendor.o(toRank),
        y: common_vendor.p({
          name: "chat",
          size: "16px",
          color: "#4D80F0"
        }),
        z: common_vendor.p({
          name: "money-circle",
          size: "16px",
          color: "#FF6B6B"
        }),
        A: common_assets._imports_0$1,
        B: common_vendor.o(handleWatchAd),
        C: common_vendor.p({
          name: "close-circle",
          size: "32px",
          color: "#fff"
        }),
        D: common_vendor.o(($event) => showHintPopup.value = false),
        E: common_vendor.o(($event) => showHintPopup.value = $event),
        F: common_vendor.p({
          position: "center",
          ["custom-style"]: "border-radius: 24rpx; width: 600rpx;",
          modelValue: showHintPopup.value
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0cd09a48"]]);
wx.createPage(MiniProgramPage);
