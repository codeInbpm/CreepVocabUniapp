"use strict";
const common_vendor = require("../../common/vendor.js");
const store_ws = require("../../store/ws.js");
const store_user = require("../../store/user.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "battle",
  setup(__props) {
    const wsStore = store_ws.useWsStore();
    const userStore = store_user.useUserStore();
    const roomId = common_vendor.ref("");
    common_vendor.ref(1);
    common_vendor.ref(10);
    common_vendor.ref(10 * 1e3);
    common_vendor.ref({
      word: "Example",
      options: ["示例", "测试", "代码", "程序"]
    });
    common_vendor.ref(0);
    common_vendor.ref(0);
    common_vendor.ref(-1);
    common_vendor.ref(false);
    common_vendor.onLoad((options) => {
      if (options.roomId) {
        roomId.value = options.roomId;
        joinBattle();
      } else {
        common_vendor.index.showToast({ title: "房间号错误", icon: "none" });
        setTimeout(() => common_vendor.index.navigateBack(), 1500);
      }
    });
    const joinBattle = () => {
      var _a;
      if (!wsStore.isConnected) {
        wsStore.connect();
      }
      wsStore.subscribeRoom(roomId.value, (msg) => {
        console.log("Battle Message:", msg);
        handleMessage(msg);
      });
      wsStore.sendMessage("/app/battle.action", {
        type: "ready",
        roomId: roomId.value,
        payload: { userId: (_a = userStore.userInfo) == null ? void 0 : _a.id }
        // simplified
      });
    };
    const handleMessage = (msg) => {
      var _a;
      if (msg.type === "answer") {
        if (msg.payload.userId !== ((_a = userStore.userInfo) == null ? void 0 : _a.id)) {
          common_vendor.index.showToast({ title: "对方已作答", icon: "none" });
        }
      }
    };
    common_vendor.onUnmounted(() => {
      if (roomId.value) {
        wsStore.sendMessage("/app/battle.action", {
          type: "leave",
          roomId: roomId.value,
          payload: {}
        });
      }
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1ff1a1ca"]]);
wx.createPage(MiniProgramPage);
