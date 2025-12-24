"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_user = require("../../store/user.js");
const utils_request = require("../../utils/request.js");
if (!Array) {
  const _easycom_wd_button2 = common_vendor.resolveComponent("wd-button");
  _easycom_wd_button2();
}
const _easycom_wd_button = () => "../../node-modules/wot-design-uni/components/wd-button/wd-button.js";
if (!Math) {
  _easycom_wd_button();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const userStore = store_user.useUserStore();
    const isLoggingIn = common_vendor.ref(false);
    const handleWxLogin = () => {
      if (isLoggingIn.value)
        return;
      isLoggingIn.value = true;
      common_vendor.index.showLoading({ title: "登录中..." });
      common_vendor.index.login({
        provider: "weixin",
        success: (loginRes) => {
          utils_request.request({
            url: "/auth/wx-login",
            method: "POST",
            withoutToken: true,
            data: {
              code: loginRes.code
            }
          }).then((res) => {
            common_vendor.index.hideLoading();
            console.log("Login Success:", res);
            const loginData = res.data;
            if (loginData && loginData.token) {
              const { token, userInfo } = loginData;
              userStore.saveToken(token);
              userStore.saveUserInfo(userInfo);
              if (userInfo.needBindPhone) {
                common_vendor.index.showToast({ title: "请绑定手机号", icon: "none" });
                setTimeout(() => {
                  common_vendor.index.navigateTo({ url: "/pages/login/bind-phone" });
                }, 1e3);
              } else {
                const msg = userInfo.isNewUser ? "欢迎新用户！" : "欢迎回来！";
                common_vendor.index.showToast({ title: msg, icon: "success" });
                setTimeout(() => {
                  common_vendor.index.switchTab({ url: "/pages/home/home" });
                }, 1e3);
              }
            } else {
              console.error("Login Data Error:", res);
              common_vendor.index.showToast({ title: "登录返回数据异常", icon: "none" });
              isLoggingIn.value = false;
            }
          }).catch((err) => {
            common_vendor.index.hideLoading();
            isLoggingIn.value = false;
            console.error("Login Failed:", err);
            common_vendor.index.showToast({ title: "登录失败: " + (err.msg || "网络错误"), icon: "none" });
          });
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          isLoggingIn.value = false;
          console.error("uni.login failed:", err);
          common_vendor.index.showToast({ title: "微信登录失败", icon: "none" });
        }
      });
    };
    const handleGuestLogin = () => {
      common_vendor.index.switchTab({ url: "/pages/home/home" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(handleWxLogin),
        c: common_vendor.p({
          type: "primary",
          size: "large",
          ["custom-class"]: "login-btn wx-btn",
          loading: isLoggingIn.value
        }),
        d: common_vendor.o(handleGuestLogin),
        e: common_vendor.p({
          type: "info",
          plain: true,
          size: "large",
          ["custom-class"]: "login-btn guest-btn"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cdfe2409"]]);
wx.createPage(MiniProgramPage);
