<template>
  <div class="login_bg">
    <div class="login_box">
      <div class="logo"></div>
      <div class="title">智慧城市照明监控管理平台</div>
      <div class="uesr_info">
        <el-form ref="loginForm" :model="loginForm" :rules="rules" id="loginForm">
          <el-form-item label prop="account">
            <div class="user_label">
              <img src="../../assets/img/login/头像.png" alt class="user_label_icon" />
              <span class="user_label_line"></span>
              <el-input
                prefix-icon="icon"
                v-model="loginForm.account"
                class="user_name"
                placeholder="请输入账号"
                name="account"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label prop="loginpwd">
            <div class="user_label">
              <img src="../../assets/img/login/ziyuan.png" alt class="user_label_icon" />
              <span class="user_label_line"></span>
              <el-input
                v-model="loginForm.loginpwd"
                type="password"
                class="login_input user_password"
                placeholder="请输入密码"
                @keyup.enter.native="logonTo"
                name="loginpwd"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label prop="lang">
            <div class="user_label">
              <img src="../../assets/img/login/位图.png" alt class="user_label_icon nation" />
              <span class="user_label_line"></span>
              <el-select
                v-model="loginForm.lang"
                name="lang"
                placeholder="语言"
                popper-class="language"
              >
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
            <el-button type="primary" @click="logonTo" class="login_button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "../../assets/img/login/头像.png";
import { http_login } from "../../api/http/login.js";
import http from "../../utils/request";
import axios from "axios";
import md5 from "js-md5";
export default {
  name: "",
  props: [""],
  data() {
    return {
      loginForm: {
        account: "",
        loginpwd: "",
        lang: window.localStorage.getItem("lang") || "ZH_CN"
      },
      languageList: [
        { value: "ZH_CN", label: "中文 (简体)" },
        { value: "English", label: "English" }
      ],
      icon: icon,
      rules: {
        account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        loginpwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        lang: [{ required: true, message: "请选择语言", trigger: "blur" }]
      }
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    logonTo() {
      this.$refs["loginForm"].validate(async valid => {
        if (valid) {
          let from = new FormData();
          from.append("account", this.loginForm.account);
          from.append("loginpwd", md5(this.loginForm.loginpwd));
          let res = await http_login({ data: from });

          if (res.data.success) {
            window.localStorage.setItem("token", res.data.content.token);
            window.localStorage.setItem("lang", this.loginForm.lang);
            this.$router.push("/");
          } else {
            this.$message.error(res.data.msgCode);
          }
          // console.log(this.$refs.loginForm);
          // this.loginForm.loginpwd=md5(this.loginForm.loginpwd)
          // let from=new FormData(document.getElementById('loginForm'))
        } else {
          return false;
        }
      });
    }
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../assets/less/login/login.less";
.el-select {
  width: 100%;
}
.user_label .el-input__inner {
  border: none;
  padding-left: 10px;
}
.uesr_info .el-form-item__error {
  color: #f26204;
}
</style>