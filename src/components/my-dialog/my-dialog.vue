<template>
  <el-dialog
    :modal="false"
    :visible.sync="isShow"
    :width="width"
    :show-close="false"
    :close-on-click-modal="false"
    center
  >
    <div class="dialog_header">
      <span>{{tittle}}</span>
    </div>
    <span class="el-icon-close close_icon" @click="$parent.colseDialog"></span>

    <slot></slot>

    <span slot="footer" class="dialog-footer">
      <p class="line_footer"></p>
      <el-button @click="$parent.colseDialog">取 消</el-button>
      <el-button type="primary" @click="addsubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "",
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    switchStyle: {
      type: Boolean,
      default: true
    },
    tittle: {
      type: String,
      default: "标题"
    },
    width: {
      type: String,
      default: "35%"
    },
    height: {
      type: String,
      default: "1000px"
    },
    submit: {
      type: Function
    }
  },
  data() {
    return {
    };
  },

  components: {},

  computed: {},
  watch: {
    isShow: function(newVal) {
    }
  },
  beforeMount() {},

  mounted() {},

  methods: {
    addsubmit(){
      if(this.submit){
        this.submit()
      }
    }
  },

  watch: {}
};
</script>
<style lang='less' scoped>
.close_icon {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
}
.close_icon:hover {
  color: #5cb6ff;
}
.dialog_header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  text-align: left;
  border-bottom: 1px solid #f2f2f2;
}
.dialog_header span {
  margin-left: 27px;
  font-size: 16px;
  line-height: 45px;
}
.line_footer {
  position: absolute;
  left: 0;
  bottom: 76px;
  width: 100%;
  height: 1px;
  background-color: #f2f2f2;
  display: block;
}
.el-button--primary {
    color: #FFF;
    background-color: #f26204;
    border-color: #f26204;
}
.el-button--primary.is-active,
.el-button--primary:active {
  background: #f1a775;
  border-color: #f1a775;
  color: #fff;
}
.el-button:active {
    color: #f1a775;
    border-color: #f1a775;
    outline: 0;
}
</style>