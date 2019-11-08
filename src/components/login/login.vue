<template>
  <div class="login_bg">
    <div class="login_box">
      <div class="logo"></div>
      <div class="title">智慧城市照明监控管理平台</div>
      <div class="uesr_info">
        <el-form ref="form" :model="loginForm">
          <el-form-item label>
            <div class="user_label">
              <img src="../../assets/img/login/头像.png" alt class="user_label_icon" />
              <span class="user_label_line"></span>
              <el-input prefix-icon="icon" v-model="loginForm.username" class="user_name"></el-input>
              <!-- <input v-model="loginForm.username" class="login_input" placeholder="请输入账号" /> -->
            </div>
          </el-form-item>
          <el-form-item label>
            <div class="user_label">
              <img src="../../assets/img/login/ziyuan.png" alt class="user_label_icon" />
              <span class="user_label_line"></span>
              <input v-model="loginForm.password" class="login_input user_password" placeholder="请输入密码" />
            </div>
          </el-form-item>
          <el-form-item label>
            <div class="user_label">
              <img src="../../assets/img/login/位图.png" alt class="user_label_icon nation" />
              <span class="user_label_line"></span>
              <el-select v-model="loginForm.languageValue" placeholder="语言" popper-class="language">
                <el-option
                  v-for="item in languageList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="login_button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "../../assets/img/login/头像.png";
export default {
  name: "",
  props: [""],
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        languageValue: "Chinese"
      },
      languageList: [
        { value: "Chinese", label: "中文 (简体)" },
        { value: "English", label: "English" }
      ],
      icon: icon
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    onSubmit() {}
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../assets/less/login/login.less";
.el-select{
  width: 100%;
}
.user_label .el-input__inner{
  border: none;
  padding-left: 10px;
}
// .login_bg {
//     width: 100%;
//     height: 100%;
//     background-image: url('../../assets/img/login/bg.png');
//     display: flex;
//     justify-content: center;
//     align-items: center;

//     .login_box {
//         width: 610px;
//         height: 600px;
//         // width: 38.125rem;
//         // height: 37.5rem;
//         // background: rgba(12, 18, 34, 0.5);
//         background-color: #fff;

//         .logo {
//             width: 250px;
//             height: 88px;
//             background-image: url('../../assets/img/login/logo.png');

//         }

//         .title {}
//     }
// }
</style>