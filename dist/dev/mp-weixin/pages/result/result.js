"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  _easycom_wd_button2();
}
const _easycom_wd_button = () => "../../node-modules/wot-design-uni/components/wd-button/wd-button.js";
if (!Math) {
  _easycom_wd_button();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "result",
  setup(__props) {
    const restart = () => {
      common_vendor.index.redirectTo({ url: "/pages/match/match" });
    };
    const goHome = () => {
      common_vendor.index.reLaunch({ url: "/pages/home/home" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(restart),
        b: common_vendor.p({
          type: "primary"
        }),
        c: common_vendor.o(goHome)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d38065ce"]]);
wx.createPage(MiniProgramPage);
