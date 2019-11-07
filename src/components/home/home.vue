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
      pointList: [
        {
          id: 1,
          x: 114.025,
          y: 22.546,
          children: [
            {
              id: 2,
              x: 114.02913220534451,
              y: 22.555979925649353,
              name: "坐标1"
            },
            {
              id: 3,
              x: 114.02668881435818,
              y: 22.545365799135364,
              name: "坐标2"
            },
            {
              id: 4,
              x: 114.03250983406092,
              y: 22.545833105103622,
              name: "坐标3"
            },
            {
              id: 5,
              x: 114.04321763573631,
              y: 22.550239054111323,
              name: "坐标4"
            }
          ]
        }
      ]
    };
  },

  components: {
    Header,
    Footer
  },

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    initMap(){

    }
  },

  watch: {}
};
</script>
<style lang='less'>
@import "../../assets/less/home/home.less";
</style>