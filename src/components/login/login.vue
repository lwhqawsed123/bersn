<template>
  <div class="login_bg">
    <div class="login_box">
      <div class="logo"></div>
      <div class="title">{{$t("login.title")}}</div>
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
                :placeholder="$t('login.account')"
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
                :placeholder="$t('login.password')"
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
                @change="changeLanguage"
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
            <el-button type="primary" @click="logonTo" class="login_button">{{$t("login.login")}}</el-button>
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
        lang: window.localStorage.getItem("locale") || "zh"
      },
      languageList: [
        { value: "zh", label: "中文 (简体)" },
        { value: "en", label: "English" }
      ],
      icon: icon
    };
  },

  components: {},

  computed: {
    rules() {
      const rules = {
        account: [
          {
            required: true,
            message: this.$t("login.enterUsername"),
            trigger: "blur"
          }
        ],
        loginpwd: [
          {
            required: true,
            message: this.$t("login.enterPassword"),
            trigger: "blur"
          }
        ],
        lang: [
          {
            required: true,
            message: this.$t("login.chooseLanguage"),
            trigger: "blur"
          }
        ]
      };
      return rules;
    }
  },

  beforeMount() {},

  mounted() {
    // this.setFormRules()
  },

  methods: {
    logonTo() {
      this.$refs["loginForm"].validate(async valid => {
        if (valid) {
          this.loginForm.loginpwd = md5(this.loginForm.loginpwd);
          let from = new FormData();
          from.append("account", this.loginForm.account);
          from.append("loginpwd", this.loginForm.loginpwd);
          let res = await http_login({ data: from });

          if (res.data.success) {
            window.localStorage.setItem("token", res.data.content.token);
            window.localStorage.setItem("lang", this.loginForm.lang);
            let fromUrl = sessionStorage.getItem("fromUrl");
            if (fromUrl) {
              this.$router.push(fromUrl);
            } else {
              this.$router.push("/");
            }
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 切换语言
    changeLanguage(val) {
      localStorage.setItem("locale", val);
      this.$i18n.locale = val;
    },
    // 设置rules
    setFormRules() {
      this.rules = {
        account: [
          {
            required: true,
            message: `${this.$t("login.enterUsername")}`,
            trigger: "blur"
          }
        ],
        loginpwd: [
          {
            required: true,
            message: `${this.$t("login.enterPassword")}`,
            trigger: "blur"
          }
        ],
        lang: [
          {
            required: true,
            message: this.$t("login.chooseLanguage"),
            trigger: "blur"
          }
        ]
      };
    }
  },

  watch: {
    //监听语言切换
    // "$i18n.locale": function() {
    //   this.setFormRules();
    // }
  }
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