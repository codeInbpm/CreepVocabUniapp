"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  const _easycom_wd_switch2 = common_vendor.resolveComponent("wd-switch");
  (_easycom_wd_icon2 + _easycom_wd_button2 + _easycom_wd_switch2)();
}
const _easycom_wd_icon = () => "../../node-modules/wot-design-uni/components/wd-icon/wd-icon.js";
const _easycom_wd_button = () => "../../node-modules/wot-design-uni/components/wd-button/wd-button.js";
const _easycom_wd_switch = () => "../../node-modules/wot-design-uni/components/wd-switch/wd-switch.js";
if (!Math) {
  (_easycom_wd_icon + _easycom_wd_button + _easycom_wd_switch)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "friend-match",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const settings = common_vendor.ref({
      bgm: true,
      pronunciation: true,
      autoAddToWordbook: true
    });
    const winRate = common_vendor.computed(() => {
      const total = userStore.userInfo.totalBattles || 0;
      const wins = userStore.userInfo.winCount || 0;
      if (total === 0)
        return 0;
      return Math.floor(wins / total * 100);
    });
    const goBack = () => common_vendor.index.navigateBack();
    const inviteFriend = () => {
      common_vendor.index.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: "http://uniapp.dcloud.io/",
        title: "来和我大战三百回合！",
        summary: "我正在天天斗单词等你，快来！",
        imageUrl: "/static/logo.png"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack),
        b: common_vendor.p({
          name: "arrow-left",
          size: "24px",
          color: "#333"
        }),
        c: common_vendor.p({
          name: "more",
          size: "24px",
          color: "#333"
        }),
        d: common_vendor.unref(userStore).userInfo.avatarUrl || "/static/logo.png",
        e: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname),
        f: common_vendor.t(common_vendor.unref(userStore).userInfo.wordPower || 999),
        g: common_vendor.t(winRate.value),
        h: common_assets._imports_0$1,
        i: common_vendor.p({
          name: "close-bold",
          size: "40px",
          color: "#fff"
        }),
        j: common_vendor.o(inviteFriend),
        k: common_vendor.p({
          type: "primary",
          round: true,
          block: true
        }),
        l: common_vendor.o(($event) => settings.value.bgm = $event),
        m: common_vendor.p({
          size: "20px",
          ["active-color"]: "#4D80F0",
          modelValue: settings.value.bgm
        }),
        n: common_vendor.o(($event) => settings.value.pronunciation = $event),
        o: common_vendor.p({
          size: "20px",
          ["active-color"]: "#4D80F0",
          modelValue: settings.value.pronunciation
        }),
        p: common_vendor.o(($event) => settings.value.autoAddToWordbook = $event),
        q: common_vendor.p({
          size: "20px",
          ["active-color"]: "#4D80F0",
          modelValue: settings.value.autoAddToWordbook
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f622fd14"]]);
wx.createPage(MiniProgramPage);
