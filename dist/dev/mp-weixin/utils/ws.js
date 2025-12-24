"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const common_vendor = require("../common/vendor.js");
const store_user = require("../store/user.js");
const WS_URL = "ws://localhost:5687/ws";
const _WebSocketClient = class _WebSocketClient {
  constructor() {
    __publicField(this, "socketTask", null);
    __publicField(this, "isConnected", false);
    __publicField(this, "reconnectAttempts", 0);
    __publicField(this, "maxReconnectAttempts", 5);
    __publicField(this, "heartbeatInterval", null);
    __publicField(this, "subscriptions", /* @__PURE__ */ new Map());
    // 新增 buffer 属性
    __publicField(this, "buffer", "");
  }
  static getInstance() {
    if (!_WebSocketClient.instance) {
      _WebSocketClient.instance = new _WebSocketClient();
    }
    return _WebSocketClient.instance;
  }
  connect() {
    if (this.isConnected)
      return;
    const userStore = store_user.useUserStore();
    const url = `${WS_URL}?access_token=${userStore.token}`;
    this.socketTask = common_vendor.index.connectSocket({
      url,
      success: () => console.log("WebSocket connecting..."),
      fail: (err) => console.error("WebSocket connection failed:", err)
    });
    this.socketTask.onOpen(() => {
      console.log("WebSocket Connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.sendStompFrame("CONNECT", {
        "accept-version": "1.2",
        "heart-beat": "10000,10000",
        "login": userStore.token
        // 或直接用 header 传 token
        // 或者直接用查询参数传 token（你已经在 url 里传了 access_token，这也够了）
      });
    });
    this.socketTask.onMessage((res) => {
      this.handleMessage(res.data);
    });
    this.socketTask.onClose(() => {
      console.log("WebSocket Closed");
      this.isConnected = false;
      this.stopHeartbeat();
      this.retryConnect();
    });
    this.socketTask.onError((err) => {
      console.error("WebSocket Error:", err);
      this.isConnected = false;
    });
  }
  sendStompFrame(command, headers = {}, body = "") {
    var _a;
    if (!this.isConnected)
      return;
    let frame = `${command}
`;
    for (const [key, value] of Object.entries(headers)) {
      frame += `${key}:${value}
`;
    }
    frame += "\n" + body + "\0";
    (_a = this.socketTask) == null ? void 0 : _a.send({
      data: frame,
      fail: (err) => console.error("Send failed:", err)
    });
  }
  handleMessage(data) {
    if (typeof data !== "string")
      return;
    if (!this.buffer)
      this.buffer = "";
    this.buffer += data;
    let index;
    while ((index = this.buffer.indexOf("\0")) !== -1) {
      const frame = this.buffer.substring(0, index);
      this.buffer = this.buffer.substring(index + 1);
      this.parseStompFrame(frame);
    }
  }
  parseStompFrame(frame) {
    if (!frame.trim())
      return;
    const lines = frame.split("\n");
    const command = lines[0].trim();
    if (command === "CONNECTED") {
      console.log("STOMP CONNECTED");
    } else if (command === "MESSAGE") {
      const headers = {};
      let bodyStartLine = 1;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") {
          bodyStartLine = i + 1;
          break;
        }
        const [k, v] = lines[i].split(":");
        if (k && v)
          headers[k.trim()] = v.trim();
      }
      const body = lines.slice(bodyStartLine).join("\n").trim();
      const dest = headers["destination"];
      if (dest) {
        const callback = this.subscriptions.get(dest);
        if (callback) {
          try {
            callback(JSON.parse(body));
          } catch {
            callback(body);
          }
        }
      }
    }
  }
  subscribe(destination, callback) {
    if (!this.isConnected)
      return;
    this.subscriptions.set(destination, callback);
    const id = "sub-" + Math.floor(Math.random() * 1e4);
    this.sendStompFrame("SUBSCRIBE", { id, destination });
  }
  send(destination, body) {
    if (!this.isConnected)
      return;
    this.sendStompFrame("SEND", { destination }, JSON.stringify(body));
  }
  close() {
    var _a;
    this.stopHeartbeat();
    (_a = this.socketTask) == null ? void 0 : _a.close({});
    this.isConnected = false;
    this.subscriptions.clear();
  }
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      var _a;
      (_a = this.socketTask) == null ? void 0 : _a.send({ data: "\n" });
    }, 2e4);
  }
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  retryConnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting attempt ${this.reconnectAttempts}...`);
        this.connect();
      }, 5e3);
    }
  }
};
// Singleton instance
__publicField(_WebSocketClient, "instance");
let WebSocketClient = _WebSocketClient;
const ws = WebSocketClient.getInstance();
exports.ws = ws;
