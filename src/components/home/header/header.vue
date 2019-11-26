<template>
  <div class="el_header">
    <Menu @menu="getMenuStatus" />
    <div class="top_logo" >
      <img src="../../../assets/img/index/logo.png" alt class="logo" @click="toIndex" />
      <span class="logo_line"></span>
      <img src="../../../assets/img/index/fenlei-2.png" alt class="logo_icon" @click="openMenu" />
    </div>
    <div class="top_right">
      <el-dropdown @command="choose_Language">
        <span class="choose_Language">
          <span class="national"></span>
          <span class="language">{{language}}</span>
          <img src="../../../assets/img/index/三角形(2).png" alt class="choose_jiantou" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="中文(简体)">中文(简体)</el-dropdown-item>
          <el-dropdown-item command="English">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <img src="" alt=""> -->
      <span class="user_icon"></span>
      <span class="user_name">Chrissie</span>
      <img src="../../../assets/img/index/tuichu-2.png" alt class="logout" @click="loginOut" />
    </div>
  </div>
</template>

<script>
import Bus from "../../../utils/bus/bus";
import Menu from "../menu/menu";
export default {
  name: "",
  props: [""],
  data() {
    return {
      menuStatus: false,
      language: "中文(简体)"
    };
  },

  components: {
    Menu
  },

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    loginOut() {
      window.localStorage.removeItem("token");
      this.$router.push("/login");
    },
    openMenu() {
      if (this.$route.name == "index") {
        this.menuStatus = !this.menuStatus;
        Bus.$emit("openMenu", this.menuStatus);
      }
    },
    getMenuStatus(menuStatus) {
      this.menuStatus = menuStatus;
    },
    choose_Language(value) {
      this.language = value;
      // Bus.$emit("language", value);
      if(value&&value=='English'){
        localStorage.setItem('locale','zh')
      }else{
        localStorage.setItem('locale','en')
      }
    },
    toIndex(){
      this.$router.push('/index')
    }
  },

  watch: {
    $route(to,from){
      
      if(to.path!=='/index'){
        this.menuStatus=false
        Bus.$emit("openMenu", this.menuStatus);
      console.log(to);
        
      }
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../../assets/less/header/header.less";
</style>