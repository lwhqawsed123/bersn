<template>
  <div class="el_header">
    <div class="top_logo">
      <img src="../../../assets/img/index/logo.png" alt=""  class="logo">
      <span class="logo_line"></span>
      <img src="../../../assets/img/index/fenlei-2.png" alt class="logo_icon" />
    </div>
    <div class="top_right">
      <span class="national"></span>
      <span class="language">中文(简体)</span>
      <img src="../../../assets/img/index/三角形(2).png" alt="" class="choose_language">
      <!-- <img src="" alt=""> -->
      <span class="user_icon"></span>
      <span class="user_name">Chrissie</span>
      <img src="../../../assets/img/index/tuichu-2.png" alt="" class="logout" @click="loginOut">
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: [""],
  data() {
    return {};
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    loginOut() {
      window.localStorage.removeItem('token')
      this.$router.push("/login");
    },
  },

  watch: {}
};
</script>
<style lang='less' scoped>
@import "../../../assets/less/header/header.less";
</style>