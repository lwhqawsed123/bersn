<template>
  <el-container class="mgt_container">
    <el-aside class="aside" width="224px">
      <Sidebar />
    </el-aside>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Sidebar from "../home/sidebar/sidebar";
export default {
  name: "",
  props: [""],
  data() {
    return {};
  },

  components: {
    Sidebar
  },

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {},

  watch: {}
};
</script>
<style lang='less' scoped>
@import "../../assets/less/mgt/mgt.less";
</style>