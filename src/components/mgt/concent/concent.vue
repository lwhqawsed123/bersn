<template>
  <div class="brand_box">
    <Table
      :table_title="'集中器管理'"
      :tableData="concentArray"
      :columnArray="[
      {prop:'concentName',label:'集中器名称'},
      {prop:'regionName',label:'区域'},
      {prop:'roadName',label:'道路'},
      {prop:'addressField',label:'集中器地址'},
      {prop:'simcard',label:'SIM卡号'},
      {prop:'lng',label:'经度'},
      {prop:'lat',label:'纬度'},
      {prop:'address',label:'地址'},
      {prop:'remark',label:'备注'}
      ]"
      :size="10"
      :sizes="[10,20,30,40]"
      :_edit="openeditconcent"
      :pageChange="getAllconcent"
      :total="concentTotal"
      :openAdd="openAddconcent"
      :workState="true"
    >
      <div class="search_box">
        <span>集中器编号：</span>
        <el-input
          class="search_input"
          clearable
          v-model="search.concentCode"
          placeholder="全部"
          @keyup.enter.native="getAllconcent"
          @clear="getAllconcent"
        ></el-input>
        <span class="search_road">道路：</span>
        <el-select
          v-model="search.roadOptValue"
          clearable
          placeholder="全部"
          popper-class="myselect search_select"
          class="search_input"
          @change="getAllconcent"
        >
          <el-option-group v-for="group in roadOptions" :key="group.id" :label="group.optText">
            <el-option :label="group.optText" :value="group.optValue"></el-option>
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.optText"
              :value="item.optValue"
            ></el-option>
          </el-option-group>
        </el-select>
        <span class="search_road">工作状态：</span>
        <el-select
          v-model="search.workState"
          clearable
          placeholder="全部"
          class="search_input"
          @change="getAllconcent"
        >
          <el-option
            v-for="item in workStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            placeholder="全部"
          ></el-option>
        </el-select>
        <button class="search_button" @click="getAllconcent">搜索</button>
      </div>
    </Table>
    <Mydialog
      :isShow="concentisShow"
      :tittle="concent_title"
      :width="'600px'"
      :submit="concentSubmit"
    >
      <div class="form_box">
        <el-form
          ref="concentForm"
          :rules="concentRules"
          :model="concentForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="集中器名称" prop="concentName">
            <el-input
              v-model="concentForm.concentName"
              maxlength="100"
              @input="e => concentForm.concentName = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="道路" prop="roadId">
            <el-select v-model="concentForm.roadId" placeholder="请选择" popper-class="myselect">
              <el-option-group v-for="group in roadOptions" :key="group.id" :label="group.optText">
                <el-option
                  :key="group.id"
                  :label="group.optText"
                  :value="group.id"
                ></el-option>
                <el-option
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.optText"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="集中器地址" prop="addressField">
            <el-input
              v-model="concentForm.addressField"
              maxlength="9"
              @input="e => concentForm.addressField = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号" prop="simcard">
            <el-input
              v-model="concentForm.simcard"
              maxlength="30"
              @input="e => concentForm.simcard = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item required>
            <el-col :span="11">
              <el-form-item label="经度" prop="lng">
                <el-input v-model="concentForm.lng"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item label="纬度" prop="lat">
                <el-input v-model="concentForm.lat"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="concentForm.address"
              maxlength="100"
              @input="e => concentForm.address = addressReg(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="concentForm.remark"
              maxlength="200"
              @input="e => concentForm.remark = validSe(e)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
  </div>
</template>

<script>
import Table from "../../home/table2/table";
import Mydialog from "../../my-dialog/my-dialog";
import {
  add_concent,
  get_all_concent,
  get_concent_byid,
  delete_concent,
  get_select_road
} from "../../../api/http/concent";
export default {
  name: "",
  props: [""],

  data() {
    var checkLng = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      if (!longrg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    var checkLat = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (!latreg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    return {
      requiredMsg: "不能为空",
      concentisShow: false, 
      concentForm: {
        concentName: "",
        addressField: "",
        simcard: "",
        lng: "",
        lat: "",
        address: "",
        remark: ""
      },
      concent_title: "", 
      concentSubmit: function() {}, 
      concentArray: [], 
      concentTotal: 0, 
      concentRules: {
        concentName: [{ required: true, message: "不能为空", trigger: "blur" }],
        roadId: [{ required: true, message: "不能为空", trigger: "change" }],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        simcard: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        lng: [{ validator: checkLng, trigger: "blur" }],
        lat: [{ validator: checkLat, trigger: "blur" }]
      },
      roadOptions: [], 
      workStateOptions: [
        {
          value: "NORMAL",
          label: "正常"
        },
        {
          value: "ALARM",
          label: "警告"
        },
        {
          value: "OFFLINE",
          label: "离线"
        }
      ],
      search: {
        concentCode: "",
        roadOptValue: "",
        workState: ""
      }
    };
  },

  components: {
    Table,
    Mydialog
  },

  computed: {},

  beforeMount() {},

  mounted() {
    this.getAllconcent();
    this.getAllSelect();
  },

  methods: {
    async getAllconcent(val, currentPage = 1, size = 10) {
      let data = {
        pageNo: currentPage,
        pageSize: size,
        "concent.optValue": this.search.roadOptValue,
        "concent.addressField": this.search.concentCode,
        "concent.workState": this.search.workState
      };
      let res = await get_all_concent({ data });
      if (res) {
        this.concentTotal = res.data.total;
        this.concentArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    
    openAddconcent() {
      this.concent_title = "新增集中器";
      this.concentSubmit = this.addconcent;
      this.getAllSelect();
      this.concentisShow = true;
    },
    
    addconcent() {
      this.$refs["concentForm"].validate(async valid => {
        if (valid) {
          let data = this.concentForm;
          let res = await add_concent({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllconcent();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    
    openeditconcent(row) {
      sessionStorage.setItem("concentId",row.concentId)
      this.$router.push({
        name: "detail",
        params: { addressField: row.concentId }
      });
    },

    
    colseDialog() {
      this.$refs["concentForm"].resetFields();
      this.concentisShow = false;
    },
    
    async getAllSelect() {
      let res = await get_select_road();
      if (res) {
        this.roadOptions = res.data.content;
        this.roadOptions.shift();
        this.roadOptions = this.remmoveEmpty(this.roadOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    
    remmoveEmpty(arr) {
      arr.forEach(item => {
        if (item.children) {
          if (item.children.length === 0) {
            delete item.children;
          } else {
            this.remmoveEmpty(item.children);
          }
        }
      });
      return arr;
    }
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../../assets/less/concent/concent.less";
</style>