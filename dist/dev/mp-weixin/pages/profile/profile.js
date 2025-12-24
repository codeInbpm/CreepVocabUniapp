"use strict";
const common_vendor = require("../../common/vendor.js");
const store_user = require("../../store/user.js");
if (!Array) {
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  _easycom_wd_button2();
}
const _easycom_wd_button = () => "../../node-modules/wot-design-uni/components/wd-button/wd-button.js";
if (!Math) {
  _easycom_wd_button();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "profile",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const handleLogout = () => {
      userStore.logout();
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleLogout),
        b: common_vendor.p({
          type: "error"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-04d37cba"]]);
wx.createPage(MiniProgramPage);
