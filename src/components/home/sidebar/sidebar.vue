<template>
   <div class="menuBox">
      <div class="menu_shouye">
        <span class="iconfont icon-caidan- iconfont_color iconfont_caidan"></span>
        <span>首页</span>
      </div>
      <div class="menu_content">
        <el-menu class="el-menu-vertical-demo" active-text-color="#F26204" router>
          <div class="asset_title">
            <span class="iconfont icon-ziyuan iconfont_color iconfont_asset"></span>
            <span class="menu_title">资产管理</span>
          </div>
          <el-submenu index='1'>
            <template slot="title">照明设施属性管理</template>
            <el-menu-item index="/mgt/brand">品牌型号管理</el-menu-item>
            <el-menu-item index="1-2">区域道路管理</el-menu-item>
            <el-menu-item index="1-3">照明区域管理</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">照明设施管理</template>
            <el-menu-item index="2-1">集中器管理</el-menu-item>
            <el-menu-item index="2-2">灯杆管理</el-menu-item>
            <el-menu-item index="2-3">光源管理</el-menu-item>
          </el-submenu>
          <div class="asset_title">
            <span class="iconfont icon-jiankongmianban-mianxing iconfont_color iconfont_asset"></span>
            <span class="menu_title">运行监控</span>
          </div>
          <el-submenu index="3">
            <template slot="title">定时任务</template>
            <el-menu-item index="3-1">调光任务</el-menu-item>
            <el-menu-item index="3-2">调光计划</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">实时监控</template>
            <el-menu-item index="4-1">集中器及光源监控日志</el-menu-item>
          </el-submenu>
          <div class="asset_title">
            <span class="iconfont icon-tongji iconfont_color iconfont_asset"></span>
            <span class="menu_title">统计分析</span>
          </div>
          <el-menu-item index="5">事件统计</el-menu-item>
          <el-menu-item index="6">亮灯统计</el-menu-item>
          <div class="asset_title">
            <span class="iconfont icon-shezhi iconfont_color iconfont_asset"></span>
            <span class="menu_title">系统设置</span>
          </div>
          <el-submenu index="7">
            <template slot="title">用户权限</template>
            <el-menu-item index="7-1">用户管理</el-menu-item>
            <el-menu-item index="7-2">角色管理</el-menu-item>
            <el-menu-item index="7-3">用户日志</el-menu-item>
          </el-submenu>
          <el-menu-item index="7-5">基本设置</el-menu-item>
          <el-menu-item index="7-6">系统升级</el-menu-item>
        </el-menu>
      </div>
    </div>
</template>

<script>

  export default {
    name:'',
    props:[''],
    data () {
      return {

      };
    },

    components: {},

    computed: {},

    beforeMount() {},

    mounted() {},

    methods: {},

    watch: {}

  }

</script>
<style lang='less' scoped>
@import "../../../assets/less/menu/sidebar.less";
</style>