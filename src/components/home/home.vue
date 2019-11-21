<template>
  <el-container class="home">
    <Header />
    
    <el-container class="content">
      <router-view></router-view>
    </el-container>

    <Footer />
  </el-container>
</template>

<script>
import Header from "./header/header";
import Footer from "./footer/footer";
export default {
  name: "",
  props: [""],
  data() {
    return {
    };
  },

  components: {
    Header,
    Footer
  },

  computed: {},

  beforeMount() {},
  created(){
    
  },
  mounted() {},

  methods: {
    
  },

  watch: {}
};
</script>
<style lang='less'>
@import "../../assets/less/home/home.less";
</style>