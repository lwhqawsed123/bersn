<template>
  <div class="brand_box">
    <div class="table_box">
      <div class="table_header">
        <span class="table_header_left">
          <span class="table_header_left_line"></span>
          <span class="table_title">{{schedule_title}}</span>
        </span>
      </div>
      <div class="search_box">
        <span>计划名称：</span>
        <el-input
          class="search_input"
          clearable
          v-model="scheduleForm.scheduleName"
          placeholder="请输入"
        ></el-input>
      </div>
      <div class="echarts_box"></div>
      <div class="add_schedule_box">
        <button class="add_button" @click="openAddschedule">+ 添加调光</button>
      </div>
      <el-table
        :data="scheduleSeedArray"
        style="width: 100%"
        class="table_content"
        :header-cell-style="{background:'#f1f1f1',color:'#666666'}"
      >
        <el-table-column label="时间">
          <template
            slot-scope="scope"
          >{{scope.row.abbr}} {{scope.row.actionHour}}:{{scope.row.actionMinute}}</template>
        </el-table-column>
        <el-table-column label="调光值">
          <template slot-scope="scope">{{scope.row.dimmingValue+'%'}}</template>
        </el-table-column>

        <el-table-column label="操作" width="116">
          <template slot-scope="scope">
            <img
              class="edit"
              src="../../../../assets/img/mgt/bianji.png"
              style="cursor: pointer;"
              alt
              @click="openAddschedule(scope.row)"
            />
            <img
              class="delete"
              src="../../../../assets/img/mgt/删除.png"
              style="margin-left:15px;cursor: pointer;"
              alt
              @click="deleteschedule(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <Mydialog
        :isShow="scheduleSeedisShow"
        :tittle="scheduleSeed_title"
        :width="'680px'"
        :submit="scheduleSeedSubmit"
      >
        <div class="SeedForm_box">
          <el-form ref="scheduleSeedForm" :rules="scheduleSeedRules" :model="scheduleSeedForm">

            <el-form-item prop="time">
              <div class="AM_PM_BOX">
                <div class="AM_PM_left">
                  <span v-if="scheduleSeedForm.abbr=='AM'?true:false" class="AM_PM_text">{{scheduleSeedForm.abbr}}</span>
                  <span v-if="scheduleSeedForm.abbr=='PM'?true:false" class="AM_PM_text">{{scheduleSeedForm.abbr}}</span>
                  <div class="AM_PM_change">
                    <div @click="change_sign_up" class="AM_PM_add AM_PM_sign el-icon-caret-top" :class="scheduleSeedForm.abbr=='AM'?'AM_PM_add AM_PM_sign el-icon-caret-top sign_disabled':'AM_PM_add AM_PM_sign el-icon-caret-top'"></div>
                    <div @click="change_sign_down" class="AM_PM_sub AM_PM_sign el-icon-caret-bottom" :class="scheduleSeedForm.abbr=='PM'?'AM_PM_sub AM_PM_sign el-icon-caret-bottom sign_disabled':'AM_PM_sub AM_PM_sign el-icon-caret-bottom'"></div>
                  </div>
                </div>
                <el-time-picker
                  v-model="scheduleSeedForm.time"
                  :editable="false"
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="pickerOptions"
                  placeholder="任意时间点"
                ></el-time-picker>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="seed_light_controller">
          <span class="seed_light_controller_status">状态：</span>
          <el-switch
            v-model="scheduleSeedForm.lightStatus"
            @change="lightChange"
            active-color="#F26204"
            inactive-color="#dddddd"
            class="seed_my_switch"
          ></el-switch>
          <img
            v-if="scheduleSeedForm.lightStatus"
            src="../../../../assets/img/index/tishi.png"
            alt
            class="seed_light_controller_icon"
          />
          <img
            v-if="!scheduleSeedForm.lightStatus"
            src="../../../../assets/img/index/tishi-1.png"
            alt
            class="seed_light_controller_icon"
          />
          <span>调光值：</span>
          <div class="seed_intensity_control">
            <el-slider
              class="seed_my_intensity_control"
              v-model="scheduleSeedForm.intensityControl"
              :max="100"
              @change="lightMove"
            ></el-slider>
          </div>
          <div class="seed_intensity_inputnumber">
            <el-input-number
              v-model="scheduleSeedForm.intensityControl"
              controls-position="right"
              :min="0"
              :max="100"
              @change="lightMove"
            ></el-input-number>
          </div>
          <span>%</span>
        </div>
      </Mydialog>
    </div>
  </div>
</template>

<script>
import Mydialog from "../../../my-dialog/my-dialog";
import {
  get_schedule_byid,
  get_scheduleSeed_byid
} from "../../../../api/http/scheduleDetail";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      scheduleId: "",
      schedule_title: "添加调光计划", 
      scheduleForm: {},
      scheduleSeedisShow: false, 
      scheduleSeedForm: {
        abbr:"AM",
        time: "",
        lightStatus: true,
        intensityControl: 15
      },
      scheduleSeed_title: "添加调光", 
      scheduleSeedSubmit: function() {}, 
      scheduleSeedArray: [], 
      
      scheduleSeedTotal: 0, 
      currentPage: 1,
      sizes: [10, 20, 30, 40],
      size: 10,
      pickerOptions: {
        selectableRange: "00:00:00 - 12:00:00",
        format: "HH:mm"
      },
      scheduleSeedRules: {
        time: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        time2: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        time3: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      
      scheduleSeedForm:{
        abbr:"AM",
        time:''
      }
    };
  },

  components: {
    Mydialog
  },

  computed: {},

  beforeMount() {},

  mounted() {
    let scheduleId = this.$route.params.scheduleId;
    if (scheduleId) {
      this.schedule_title = "修改调光计划";
      this.scheduleId = +scheduleId;
      sessionStorage.setItem("scheduleId", scheduleId);
      this.getScheduleById();
    } else {
      scheduleId = sessionStorage.getItem("scheduleId");
      if (scheduleId) {
        this.schedule_title = "修改调光计划";
        this.scheduleId = +scheduleId;
        this.getScheduleById();
      }
    }
  },

  methods: {
    async getScheduleById() {
      let data = {
        id: this.scheduleId
      };
      let res = await get_schedule_byid({ data });
      if (res && res.data.success) {
        this.scheduleForm = res.data.content;
        let data = {
          id: this.scheduleId,
          pageNo: this.currentPage,
          pageSize: this.size
        };
        get_scheduleSeed_byid({ data }).then(res => {
          if (res) {
            res.data.rows.forEach(item => {
              if (item.actionHour < 10) {
                item.actionHour = "0" + item.actionHour;
              }
              if (item.actionMinute < 10) {
                item.actionMinute = "0" + item.actionMinute;
              }
            });
            this.scheduleSeedArray = res.data.rows;
          } else {
            this.$message.error("服务器未响应");
          }
        });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    
    lightChange(val) {
      if (val) {
        this.scheduleSeedForm.intensityControl = 100;
      } else {
        this.scheduleSeedForm.intensityControl = 0;
      }
    },
    
    lightMove(val) {
      if (val == 0) {
        this.scheduleSeedForm.lightStatus = false;
      } else {
        this.scheduleSeedForm.lightStatus = true;
      }
    },
    
    openAddschedule() {
      this.schedule_title = "新增集中器";
      this.scheduleSeedSubmit = this.addscheduleSeed;
      this.scheduleSeedisShow = true;
    },
    
    addscheduleSeed() {
      this.$refs["scheduleSeedForm"].validate(async valid => {
        if (valid) {
          let data = this.scheduleSeedForm;
          let res = await add_schedule({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllschedule();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    
    async openeditschedule(row) {
      this.schedule_title = "修改";
      this.scheduleSubmit = this.addscheduleSeed;
      let data = {
        id: row.scheduleId
      };

      let res = await get_schedule_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.scheduleSeedForm = res.data.content;
        this.scheduleisShow = true;
      }
    },
    change_sign_up(){
      if(this.scheduleSeedForm.abbr=='AM'){
        return 
      }else{
        this.scheduleSeedForm.abbr='AM'
      }
    },
    change_sign_down(){
      if(this.scheduleSeedForm.abbr=='PM'){

        return
      }else{
        this.scheduleSeedForm.abbr='PM'
      }
      
    },
    deleteschedule(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.scheduleId };
          let res = await delete_schedule({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllschedule();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    colseDialog() {
      this.scheduleSeedisShow = false;
    }
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../../../assets/less/table/table.less";
@import "../../../../assets/less/concent/concent.less";
@import "../../../../assets/less/mgt/scheduleSeed/scheduleSeed.less";
</style>