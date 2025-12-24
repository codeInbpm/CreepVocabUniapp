"use strict";
const common_vendor = require("../../common/vendor.js");
const api_course = require("../../api/course.js");
if (!Array) {
  const _easycom_wd_icon2 = common_vendor.resolveComponent("wd-icon");
  _easycom_wd_icon2();
}
const _easycom_wd_icon = () => "../../node-modules/wot-design-uni/components/wd-icon/wd-icon.js";
if (!Math) {
  _easycom_wd_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "study",
  setup(__props) {
    const books = common_vendor.ref([]);
    const loadCourses = async () => {
      try {
        const res = await api_course.getCourseList();
        books.value = res.data.map((item) => ({
          id: item.id,
          title: item.title,
          tag: item.subTitle,
          // Map subTitle to tag
          color: item.coverColor || "linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)"
        }));
      } catch (e) {
        console.error("Failed to load courses", e);
      }
    };
    common_vendor.onMounted(() => {
      loadCourses();
    });
    const selectBook = async (book) => {
      try {
        await api_course.selectCourse(book.id);
        common_vendor.index.showToast({ title: "已选择: " + book.title, icon: "success" });
      } catch (e) {
        common_vendor.index.showToast({ title: "选择失败", icon: "none" });
      }
    };
    const addBook = () => {
      common_vendor.index.showToast({ title: "去书城添加", icon: "none" });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(books.value, (book, index, i0) => {
          return {
            a: "5ef3c231-0-" + i0,
            b: common_vendor.t(book.title),
            c: common_vendor.t(book.tag),
            d: index,
            e: book.color,
            f: common_vendor.o(($event) => selectBook(book), index)
          };
        }),
        b: common_vendor.p({
          name: "close",
          size: "16px",
          color: "#fff"
        }),
        c: common_vendor.p({
          name: "add",
          size: "40px",
          color: "#fff"
        }),
        d: common_vendor.o(addBook)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5ef3c231"]]);
wx.createPage(MiniProgramPage);
