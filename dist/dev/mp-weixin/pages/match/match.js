"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const store_ws = require("../../store/ws.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "match",
  setup(__props) {
    const statusText = common_vendor.ref("正在寻找对手...");
    const wsStore = store_ws.useWsStore();
    const isMatching = common_vendor.ref(true);
    const startMatch = async () => {
      try {
        if (!wsStore.isConnected) {
          wsStore.connect();
        }
        await utils_request.request({
          url: "/battle/room/match/join",
          method: "POST",
          data: { mode: "random" }
        });
      } catch (e) {
        statusText.value = "匹配失败，请重试";
        isMatching.value = false;
      }
    };
    common_vendor.onMounted(() => {
      wsStore.connect();
      startMatch();
      setTimeout(async () => {
        try {
          const res = await utils_request.request({
            url: "/battle/room/create?type=random&aiMode=true",
            method: "POST"
          });
          statusText.value = "匹配成功！";
          setTimeout(() => {
            common_vendor.index.redirectTo({ url: `/pages/battle/battle?roomId=${res.id}` });
          }, 1e3);
        } catch (e) {
          statusText.value = "创建对战失败";
        }
      }, 2e3);
    });
    const cancelMatch = () => {
      isMatching.value = false;
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(statusText.value),
        b: common_vendor.o(cancelMatch)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-51dcac06"]]);
wx.createPage(MiniProgramPage);
