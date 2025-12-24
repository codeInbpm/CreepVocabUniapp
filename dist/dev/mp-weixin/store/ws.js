"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("../common/vendor.js");
const utils_ws = require("../utils/ws.js");
const useWsStore = common_vendor.defineStore("ws", {
  state: () => ({
    isConnected: false,
    currentRoomId: ""
  }),
  actions: {
    connect() {
      utils_ws.ws.connect();
      this.isConnected = true;
    },
    disconnect() {
      utils_ws.ws.close();
      this.isConnected = false;
      this.currentRoomId = "";
    },
    subscribeRoom(roomId, callback) {
      this.currentRoomId = roomId;
      utils_ws.ws.subscribe(`/topic/room/${roomId}`, callback);
    },
    sendMessage(destination, body) {
      utils_ws.ws.send(destination, body);
    }
  }
});
exports.useWsStore = useWsStore;
