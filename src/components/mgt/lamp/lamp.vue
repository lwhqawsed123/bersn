<template>
  <div class="brand_box">
    <Table
      :table_title="'光源管理'"
      :tableData="lampArray"
      :columnArray="[
      {prop:'termUid',label:'控制器编号'},
      {prop:'lampId',label:'光源id'},
      {prop:'poleCode',label:'灯杆编号'},
      {prop:'roadName',label:'道路'},
      {prop:'addressField',label:'集中器地址'},
      {prop:'categoryName',label:'照明类型'},
      {prop:'luminName',label:'照明分组'},
      {prop:'lightModel',label:'光源型号'},
      ]"
      :workState="true"
      :_edit="openeditlamp"
      :size="10"
      :sizes="[10,20,30,40]"
      :pageChange="getAlllamp"
      :total="lampTotal"
      :openAdd="openAddlamp"
      :_delete="deletelamp"
      :tiaoshi="true"
      :_tiaoshi="openTiaoshi"
    >
      <div class="search_box">
        <span>光源编号：</span>
        <el-input
          class="search_input"
          clearable
          v-model="search.lampCode"
          placeholder="全部"
          @keyup.enter.native="getAlllamp"
          @clear="getAlllamp"
        ></el-input>
        <span class="search_road">道路：</span>
        <el-select
          v-model="search.roadOptValue"
          clearable
          placeholder="全部"
          popper-class="myselect search_select"
          class="search_input"
          @change="getAlllamp"
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
        <span class="search_road">照明分组：</span>
        <el-select
          v-model="search.luminOptValue"
          clearable
          placeholder="全部"
          popper-class="myselect search_select"
          class="search_input"
          @change="getAlllamp"
        >
          <el-option-group
            v-for="group in luminGroupOptions"
            :key="group.id"
            :label="group.optText"
          >
            <el-option :label="group.optText" :value="group.optValue"></el-option>
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.optText"
              :value="item.optValue"
            ></el-option>
          </el-option-group>
        </el-select>
        <span class="search_workStates">集中器编号：</span>
        <el-input
          class="search_input"
          clearable
          v-model="search.concentCode"
          placeholder="全部"
          @keyup.enter.native="getAlllamp"
          @clear="getAlllamp"
        ></el-input>
        <span class="search_workStates">工作状态：</span>
        <el-select
          v-model="search.workState"
          clearable
          placeholder="全部"
          class="search_input"
          @change="getAlllamp"
        >
          <el-option
            v-for="item in workStateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            placeholder="全部"
          ></el-option>
        </el-select>
        <button class="search_button" @click="getAlllamp">搜索</button>
      </div>
    </Table>
    <!-- 集中器弹出框 -->
    <Mydialog :isShow="lampisShow" :tittle="lamp_title" :width="'600px'" :submit="lampSubmit">
      <div class="form_box">
        <el-form
          ref="lamp_Form"
          :rules="lampRules"
          :model="lampForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="控制器编号" prop="termUid">
            <el-input
              v-model="lampForm.termUid"
              maxlength="100"
              @input="e => lampForm.termUid = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="集中器" prop="concentId">
            <el-select v-model="lampForm.concentId" placeholder="请选择" popper-class="myselect">
              <el-option
                v-for="item in concentOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="灯杆" prop="poleId">
            <el-select v-model="lampForm.poleId" placeholder="请选择" popper-class="myselect">
              <el-option
                v-for="item in poleOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="照明分组" prop="luminId">
            <el-select v-model="lampForm.luminId" placeholder="请选择" popper-class="myselect">
              <el-option-group
                v-for="group in luminGroupOptions"
                :key="group.id"
                :label="group.optText"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.optText"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="光源类型" prop="lightId">
            <el-select v-model="lampForm.lightId" placeholder="请选择" popper-class="myselect">
              <el-option
                v-for="item in lightOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电源类型" prop="annexId">
            <el-select v-model="lampForm.annexId" placeholder="请选择" popper-class="myselect">
              <el-option
                v-for="item in annexOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
             <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="lampForm.remark"
              maxlength="200"
              @input="e => lampForm.remark = validSe(e)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
    <!-- 调光弹框 -->
    <el-dialog
      :modal="false"
      :visible.sync="controlisShow"
      width="866px"
      :show-close="false"
      :close-on-click-modal="false"
      center
      custom-class="control_dialog"
    >
      <div class="dialog_header">
        <span class="dialog_header_title">调光</span>
        <div class="dialog_header_right">
          <span class="el-icon-refresh dialog_header_refresh" @click="openTiaoshi(thisLmapId)"></span>
          <span class="dialog_header_time">2019-09-04 10:15:55</span>
          <span class="el-icon-close close_icon" @click="colseDialog"></span>
        </div>
      </div>
      <!-- 弹框内表格 -->
      <el-table
        :data="lampControl"
        style="width: 100%"
        class="table_content"
        :header-cell-style="{background:'#f1f1f1',color:'#666666'}"
      >
        <el-table-column
          v-for="item in ControlcolumnArray"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <!-- 光源调节 -->
      <div class="light_controller">
        <span class="light_controller_status">状态：</span>
        <el-switch
          v-model="lightController.lightStatus"
          @change="lightChange"
          active-color="#F26204"
          inactive-color="#dddddd"
        ></el-switch>
        <img
          v-if="lightController.lightStatus"
          src="../../../assets/img/index/tishi.png"
          alt
          class="light_controller_icon"
        />
        <img
          v-if="!lightController.lightStatus"
          src="../../../assets/img/index/tishi-1.png"
          alt
          class="light_controller_icon"
        />
        <span>调光值：</span>
        <div class="intensity_control">
          <el-slider
            class="my_intensity_control"
            v-model="lightController.intensityControl"
            :max="100"
          ></el-slider>
        </div>
        <div class="intensity_inputnumber">
          <el-input-number
            v-model="lightController.intensityControl"
            controls-position="right"
            :min="0"
            :max="100"
          ></el-input-number>
        </div>
        <span>%</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <p class="line_footer"></p>
        <el-button @click="colseDialog">取 消</el-button>
        <el-button type="primary" @click="lamp_control">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from "../../home/table/table";
import Mydialog from "../../my-dialog/my-dialog";
import { Loading, Switch } from "element-ui";
import {
  add_lamp,
  get_all_lamp,
  get_lamp_byid,
  delete_lamp,
  get_select_road,
  get_select_luminGroup,
  get_select_concent,
  get_select_pole,
  get_select_light,
  get_select_annex,
  get_monitor_cmd_lamp_byid,
  set_groupLamp_byid,
  open_groupLamp_byid,
  close_groupLamp_byid,
  set_singleLamp_byid
} from "../../../api/http/lamp";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      // ===========光源===========
      lampisShow: false, // 新增弹框
      lampForm: {
        termUid: "",
        concentId: "",
        poleId: "",
        luminId: "",
        lightId: "",
        annexId: "",
        remark: ""
      },
      lamp_title: "", // 标题
      lampSubmit: function() {}, // 提交的默认函数
      lampArray: [], // 列表
      lampTotal: 0, // 总数
      lampRules: {
        termUid: [{ required: true, message: "不能为空", trigger: "blur" }],
        concentId: [{ required: true, message: "不能为空", trigger: "change" }],
        poleId: [{ required: true, message: "不能为空", trigger: "change" }],
        luminId: [{ required: true, message: "不能为空", trigger: "change" }],
        lightId: [{ required: true, message: "不能为空", trigger: "change" }],
        annexId: [{ required: true, message: "不能为空", trigger: "change" }]
      },
      roadOptions: [], // 道路下拉列表
      luminGroupOptions: [], // 照明分组列表
      concentOptions: [], // 集中器下拉列表
      poleOptions: [], // 灯杆列表
      lightOptions: [], // 光源类型列表
      annexOptions: [], // 电源类型列表
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
        termUid: "",
        lampCode: "",
        roadOptValue: "",
        concentCode: "",
        luminOptValue: "",
        workState: ""
      },
      // =====光源调试======
      controlisShow: false,
      lampControl: [],
      lampLuminance: {},
      thisLmapId: {},
      ControlcolumnArray: [
        { prop: "termUid", label: "调光值" },
        { prop: "poleCode", label: "温度" },
        { prop: "roadName", label: "电压" },
        { prop: "concentName", label: "电流" },
        { prop: "categoryName", label: "功率" },
        { prop: "luminName", label: "功率因数" },
        { prop: "lightModel", label: "亮灯时长" },
        { prop: "lightModel-1", label: "累计电量" }
      ],
      lightController: {
        lightStatus: true,
        intensityControl: 15
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
    this.getAlllamp();
    this.getAllSelect();
  },

  methods: {
    // ============光源==================
    // 获取所有光源数据
    async getAlllamp(val, currentPage = 1, size = 10) {
      let data = {};
      if (this.search.termUid) {
        data = {
          pageNo: currentPage,
          pageSize: size,
          "lamp.termUid": this.search.termUid,
          "lamp.workState": this.search.workState,
          "lamp.concentCode": this.search.concentCode,
          roadOptValue: this.search.roadOptValue,
          luminOptValue: this.search.luminOptValue
        };
      } else {
        data = {
          pageNo: currentPage,
          pageSize: size,
          "lamp.workState": this.search.workState,
          "lamp.concentCode": this.search.concentCode,
          roadOptValue: this.search.roadOptValue,
          luminOptValue: this.search.luminOptValue
        };
      }

      let res = await get_all_lamp({ data });
      console.log(res);
      
      if (res) {
        this.lampTotal = res.data.total;
        this.lampArray = res.data.rows;
      } else {
        // this.$message.error("服务器未响应");
      }
    },
    // 打开新增弹框
    openAddlamp() {
      this.lamp_title = "光源添加";
      this.getConcentSelect();
      this.getPoleSelect();
      this.getLuminGroupSelect();
      this.getLightSelect();
      this.getAnnexSelect();
      this.lampSubmit = this.addlamp;
      this.lampisShow = true;
    },
    // 新增光源
    addlamp() {
      this.$refs["lamp_Form"].validate(async valid => {
        if (valid) {
          let data = this.lampForm;
          let res = await add_lamp({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAlllamp();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改光源弹框
    async openeditlamp(row) {
      this.lamp_title = "光源修改";
      this.lampSubmit = this.addlamp;
      let data = {
        id: row.lampId
      };
      let res = await get_lamp_byid({ data });
      if (res.data.success) {
        this.getConcentSelect();
        this.getPoleSelect();
        this.getLuminGroupSelect();
        this.getLightSelect();
        this.getAnnexSelect();

        this.lampForm = res.data.content;
        this.lampisShow = true;
      }
    },

    // 删除光源
    deletelamp(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.lampId };
          let res = await delete_lamp({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAlllamp();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    // ==========光源调节================
    // 打开调试弹框
    async openTiaoshi(row) {
      this.thisLmapId.lampId = row.lampId;
      this.thisLmapId.concentId = row.concentId;
      let data = {
        lampId: row.lampId
      };

      let loadingInstance = Loading.service();
      let res = await get_monitor_cmd_lamp_byid({ data });
      if (res.data.ackState == "SUCCESS") {
        this.$message.success(res.data.ackState);
        loadingInstance.close();
        this.controlisShow = true;
      } else {
        this.$message.error(res.data.msgCode);
        loadingInstance.close();
        this.controlisShow = true;
      }
    },
    // 提交亮度调试
    lamp_control() {
      // lightController: {
      //   lightStatus: true,
      //   intensityControl: 15
      // }
      this.$confirm("确认提交?", "提示", {
        confirmButtonText: "保存",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let loadingInstance = Loading.service();
          if (!this.lightController.intensityControl) {
            let data = {
              lampId: this.thisLmapId.lampId
            };
            let res = await close_groupLamp_byid({ data });
            if (res.data.ackState == "SUCCESS") {
              this.$message.success(this.setAckState(res.data.ackState));
              loadingInstance.close();
              this.colseDialog()
            } else {
              this.$message.error(this.setAckState(res.data.ackState));
              loadingInstance.close();
            }
          } else if(this.lightController.intensityControl&&this.lightController.intensityControl==100){
            let data = {
              lampId: this.thisLmapId.lampId
            };
            let res = await open_groupLamp_byid({ data });
            if (res.data.ackState == "SUCCESS") {
              this.$message.success(this.setAckState(res.data.ackState));
              loadingInstance.close();
              this.colseDialog()
            } else {
              this.$message.error(this.setAckState(res.data.ackState));
              loadingInstance.close();
            }
          }else {
            // let data = {
            //   conId: this.thisLmapId.concentId,
            //   lampId: this.thisLmapId.lampId,
            //   dimming: this.lightController.intensityControl
            // };
             let data = {
              lampId: this.thisLmapId.lampId,
              dimming: this.lightController.intensityControl
            };
            let res = await set_singleLamp_byid({ data });
            if (res.data.ackState == "SUCCESS") {
              this.$message.success(this.setAckState(res.data.ackState));
              loadingInstance.close();
              this.colseDialog()
            } else {
              this.$message.error(this.setAckState(res.data.ackState));
              loadingInstance.close();
            }
          }
        })
        .catch(() => {});
    },
    // 光源调节开关
    lightChange(val) {
      if (val) {
        this.lightController.intensityControl = 100;
      } else {
        this.lightController.intensityControl = 0;
      }
    },
    // 关闭窗口
    colseDialog() {
      if (this.lampisShow) {
        this.$refs["lamp_Form"].resetFields();
        this.lampisShow = false;
      }
      if (this.controlisShow) {
        this.controlisShow = false;
        // this.lampControl = [];
        // this.lampLuminance = {};
        // this.thisLmapId = {};
      }
    },
    // 获取下拉列表
    async getAllSelect() {
      let res = await get_select_road();
      if (res) {
        this.roadOptions = res.data.content;
        this.roadOptions.shift();
        this.roadOptions = this.remmoveEmpty(this.roadOptions);
        get_select_luminGroup().then(res => {
          if (res.data.success) {
            this.luminGroupOptions = res.data.content;
            this.luminGroupOptions.shift();
            this.luminGroupOptions = this.remmoveEmpty(this.luminGroupOptions);
          }
        });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 获取集中器下拉框
    async getConcentSelect() {
      let res = await get_select_concent();
      if (res) {
        this.concentOptions = res.data.content;
        this.concentOptions = this.remmoveEmpty(this.concentOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 获取灯杆下拉框
    async getPoleSelect() {
      let res = await get_select_pole();
      if (res) {
        this.poleOptions = res.data.content;
        this.poleOptions = this.remmoveEmpty(this.poleOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 获取照明分组下拉框
    async getLuminGroupSelect() {
      let res = await get_select_luminGroup();
      if (res) {
        this.luminGroupOptions = res.data.content;
        this.luminGroupOptions.shift();
        this.luminGroupOptions = this.remmoveEmpty(this.luminGroupOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 获取光源类型下拉框
    async getLightSelect() {
      let res = await get_select_light();
      if (res) {
        this.lightOptions = res.data.content;
        this.lightOptions = this.remmoveEmpty(this.lightOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 获取电源类型下拉框
    async getAnnexSelect() {
      let res = await get_select_annex();
      if (res) {
        this.annexOptions = res.data.content;
        this.annexOptions = this.remmoveEmpty(this.annexOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 删除数组中为空的children
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
    },
    // 反馈硬件状态
    setAckState(state){
      let str=''
      switch(state){
        case 'DISCONNECTED':str='终端未连接';
        break;
        case 'SUCCESS':str='操作成功';
        break;
        case 'FAILURE':str='操作失败';
        break;
        case 'TIME_OUT':str='终端执行超时';
        break;
        case 'ERROR':str='服务器内部错误';
        break;
        case 'BUSY':str='终端忙';
        break;
        default: str='内部错误'
      }
      return str
    }
  },

  watch: {}
};
</script>
<style lang='less'>
@import "../../../assets/less/concent/concent.less";
@import "../../../assets/less/mgt/lamp/lamp.less";
</style>