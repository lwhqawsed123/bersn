<template>
  <el-drawer
    :visible.sync="drawer"
    direction="ltr"
    :before-close="handleClose"
    append-to-body
    size="20"
    :modal="false"
    :show-close="false"
    custom-class="menu_style"
  >
    <div class="menu_box">
      <Sidebar />
    </div>
  </el-drawer>
</template>

<script>
import Bus from "../../../utils/bus/bus";
import Sidebar from '../sidebar/sidebar'
export default {
  name: "",
  props: [""],
  data() {
    return {
      drawer: false
    };
  },

  components: {
    Sidebar
  },

  computed: {},

  beforeMount() {},
  created() {
    Bus.$on("openMenu", menuStatus => {
      this.drawer = menuStatus;
    });
  },
  mounted() {
  },

  methods: {
    handleClose() {
      this.drawer = false;
      this.$emit("menu", this.drawer);
    },

    hidePanel(el) {}
  },

  watch: {}
};
</script>
<style lang="less" scoped>
@import "../../../assets/less/menu/menu.less";
</style>