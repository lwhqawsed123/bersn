<template>
  <div class="index_content">
    <div v-if="language" v-loading="map_loading" class="bd_map" id="bd_map"></div>
    <div v-if="!language" v-loading="map_loading" class="gg_map" id="gg_map"></div>
    <div class="selectCard">
      <!-- 道路 -->
      <!-- <el-cascader
        v-model="selected.road"
        :options="districtOptions"
        :props="{value:'optValue',label:'optText', expandTrigger: 'hover',checkStrictly: true }"
        @change="roadChange"
        class="select123"
      ></el-cascader>-->
      <el-select
        v-model="selected.road"
        clearable
        placeholder="全部"
        popper-class="myselect search_select"
        class="search_input"
        @clear="roadChange"
        @change="roadChange"
      >
        <el-option-group v-for="group in districtOptions" :key="group.id" :label="group.optText">
          <el-option :label="group.optText" :value="group.optValue"></el-option>
          <el-option
            v-for="item in group.children"
            :key="item.id"
            :label="item.optText"
            :value="item.optValue"
          ></el-option>
        </el-option-group>
      </el-select>

      <span class="select_interval"></span>
      <!-- 照明分组 -->
      <!-- <el-cascader
        v-model="selected.luminGroup"
        :options="luminGroupOptions"
        :props="{ value:'optValue',label:'optText', expandTrigger: 'hover',checkStrictly: true  }"
      ></el-cascader>-->
      <el-select
        v-model="selected.luminGroup"
        clearable
        placeholder="全部"
        popper-class="myselect search_select"
        class="search_input"
        @clear="LuminGroupChange"
        @change="LuminGroupChange"
      >
        <el-option-group v-for="group in luminGroupOptions" :key="group.id" :label="group.optText">
          <el-option :label="group.optText" :value="group.optValue"></el-option>
          <el-option
            v-for="item in group.children"
            :key="item.id"
            :label="item.optText"
            :value="item.optValue"
          ></el-option>
        </el-option-group>
      </el-select>
      <span class="select_interval"></span>
      <div>
        <el-input v-model="selected.ctrCode" clearable placeholder="控制器编号" @clear="mapSearch"></el-input>
      </div>
      <button @click="mapSearch" class="search_button">
        <img src="../../assets/img/index/el-icon-search.png" alt />
      </button>
    </div>
    <div class="box-card">
      <el-card class="echarts_box" :body-style="{ padding: '0px' }">
        <span class="box_title_red"></span>
        <div class="echarts_box_title">
          <span class="echarts_box_title_name">集中器信息</span>
          <div>
            <span
              v-if="!edit_status&&currentRow"
              class="echarts_box_title_edit"
              @click="openEdit"
            >编辑</span>
            <span v-if="!currentRow" class="echarts_box_title_Notedit">编辑</span>
            <span v-if="edit_status" class="echarts_box_title_edit1">
              <span @click="editConcentrator">保存</span>
              <span>/</span>
              <span @click="cancelEditAll">取消</span>
            </span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <!-- table -->
        <el-table
          :data="ctrCodeTableList"
          width="100%"
          :header-cell-style="{'background-color':'#F0F0F0'}"
          height="230"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column label="集中器" width prop="addressField">
            <template slot-scope="scope">
              <span
                class="concentrator_code_icon"
                :style="scope.row.workState?'background:#33C360':'background:#FF1921'"
              ></span>
              <span
                style="cursor: pointer;"
                @click="searchController(scope.row)"
              >{{scope.row.addressField}}</span>
            </template>
          </el-table-column>
          <el-table-column type="expand" width="15">
            <template slot-scope="scope">
              <div v-for="item in scope.row.poleList" :key="item.poleId" class="controller_inside">
                <div class="lamp_post_list">
                  <span class="lamp_post_list_text">灯杆</span>
                  <span class>
                    <span
                      class="lamp_post_list_code"
                      @click="checkLampByCode(item)"
                    >{{item.poleCode}}</span>
                    <span
                      v-if="edit_status&&!item.lng&&!item.lat&&scope.row==currentRow"
                      class="controller_biaoji"
                      @click="addNewLamp(item.poleId)"
                    >标记</span>
                  </span>
                </div>
                <div
                  v-for="item2 in item.lampList"
                  :key="item2.lampId"
                  class="inside_ligth illuminant_list"
                >
                  <span
                    class="concentrator_code_icon"
                    :style="item2.workState?'background:#33C360':'background:#FF1921'"
                  ></span>
                  <span>{{item2.termUid}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="控制器编号" width align="right">
            <template slot-scope="scope">
              <span
                v-if="edit_status&&!scope.row.lng&&!scope.row.lat&&scope.row==currentRow"
                class="controller_biaoji"
                @click="addConcentrator(scope.row.concentId)"
              >标记</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- card two -->
      <el-card class="echarts_box" :body-style="{ padding: '0px' }">
        <span class="box_title_red"></span>
        <div class="echarts_box_title">
          <span class="echarts_box_title_name">光源监控</span>
          <div>
            <span class="echarts_box_title_edit">管理</span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <div class="echarts_content" id="light_source"></div>
        <!-- table -->
      </el-card>
      <!-- card three -->
      <el-card class="echarts_box" :body-style="{ padding: '0px' }">
        <span class="box_title_red"></span>
        <div class="echarts_box_title">
          <span class="echarts_box_title_name">集中器监控</span>
          <div>
            <span class="echarts_box_title_edit">管理</span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <!-- table -->
        <div class="echarts_content" id="concentrator_echarts"></div>
      </el-card>
      <!-- card four -->
      <el-card class="echarts_box" :body-style="{ padding: '0px' }">
        <span class="box_title_red"></span>
        <div class="echarts_box_title">
          <span class="echarts_box_title_name">近7天事件统计</span>
          <div>
            <span class="echarts_box_title_edit">管理</span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <!-- table -->
        <div class="echarts_content echarts_four" id="alarmStatistics_echarts"></div>
      </el-card>
      <!-- card five -->
      <el-card class="echarts_box" :body-style="{ padding: '0px' }">
        <span class="box_title_red"></span>
        <div class="echarts_box_title">
          <span class="echarts_box_title_name">近7天亮灯率统计</span>
          <div>
            <span class="echarts_box_title_edit">管理</span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <!-- table -->
        <div class="echarts_content echarts_four" id="lightRateStatistics_echarts"></div>
      </el-card>
    </div>
    <!-- 灯源Dialog -->
    <el-dialog
      class="dialog_card first_card concentrator_dialogVisible"
      :visible.sync="linght_Dialog_card"
      width="866px"
      :modal="false"
      v-loading="lamp_loading"
      ref="single_lamp"
    >
      <div class="clearfix dialog_card_header">
        <div class="header_left">
          <img
            v-if="linght_Dialog_item_obj.ackState=='SUCCESS'"
            src="../../assets/img/index/tishi(3).png"
            alt
            class="header_left_icon"
          />
          <img
            v-if="linght_Dialog_item_obj.ackState!='SUCCESS'"
            src="../../assets/img/index/tishi(1).png"
            alt
            class="header_left_icon"
          />
          <span class="header_left_span_Num">{{linght_Dialog_item_obj.ccuid}}</span>
          <span
            v-if="linght_Dialog_item_obj.ackState!='SUCCESS'"
            class="header_left_span_warning"
          >警告</span>
          <span
            v-if="linght_Dialog_item_obj.ackState=='SUCCESS'"
            class="header_left_span_success"
          >正常</span>
          <!-- <img
            src="../../assets/img/index/tishi(3).png"
            alt
            class="header_left_icon header_left_icon_warning"
          />-->
          <!-- <span class="header_left_span_success">正常</span> -->
        </div>
        <div class="header_right">
          <img
            src="../../assets/img/index/shuaxin.png"
            alt
            class="refresh_icon"
            @click="get_linght_by_id(single_linght_lampId)"
          />
          <span class="header_right_time">2019-09-04 10:15:55</span>
        </div>
      </div>
      <!-- 弹框表格1 -->
      <el-table
        :data="linght_Dialog_item"
        style="width: 100%"
        header-cell-class-name="table_header_color"
      >
        <el-table-column prop="date" label="调光值"></el-table-column>
        <el-table-column prop="name" label="温度"></el-table-column>
        <el-table-column prop="address" label="电压"></el-table-column>
        <el-table-column prop="address" label="电流"></el-table-column>
        <el-table-column prop="address" label="功率"></el-table-column>
        <el-table-column prop="address" label="功率因数"></el-table-column>
        <el-table-column prop="address" label="亮灯时常"></el-table-column>
        <el-table-column prop="address" label="累计电量"></el-table-column>
      </el-table>
      <!-- 弹框表格2 -->
      <el-table
        :data="linght_Dialog_item"
        style="width: 100%"
        header-cell-class-name="table_header_color"
      >
        <el-table-column prop="date" label="灯杆"></el-table-column>
        <el-table-column prop="name" label="区域"></el-table-column>
        <el-table-column prop="address" label="道路"></el-table-column>
        <el-table-column prop="address" label="照明类型"></el-table-column>
        <el-table-column prop="address" label="集中器"></el-table-column>
        <el-table-column prop="address" label="经度"></el-table-column>
        <el-table-column prop="address" label="纬度"></el-table-column>
      </el-table>
      <!-- 弹框表格3 -->
      <el-table
        :data="linght_Dialog_item"
        style="width: 100%"
        header-cell-class-name="table_header_color"
      >
        <el-table-column prop="date" label="光源类型"></el-table-column>
        <el-table-column prop="name" label="电源型号"></el-table-column>
        <el-table-column prop="address" label="标称功率"></el-table-column>
      </el-table>
      <!-- 光源调节 -->
      <div class="light_controller">
        <span class="light_controller_status">状态：</span>
        <el-switch
          v-model="lightController.lightStatus"
          active-color="#F26204"
          inactive-color="#dddddd"
        ></el-switch>
        <img src="../../assets/img/index/tishi.png" alt class="light_controller_icon" />
        <span>调光值：</span>
        <div class="intensity_control">
          <el-slider v-model="lightController.intensityControl" :max="100"></el-slider>
        </div>
        <div class="intensity_inputnumber">
          <el-input-number
            v-model="lightController.intensityControl"
            controls-position="right"
            @change="lightChange"
            :min="0"
            :max="100"
          ></el-input-number>
        </div>
        <span>%</span>
      </div>
      <!-- 按钮 -->
      <div class="button_bottom_box">
        <button class="button_bottom bottom_cancel" @click="linght_Dialog_card=false">取消</button>
        <button class="button_bottom bottom_submit" @click="set_light_by_id()">确认</button>
      </div>
    </el-dialog>
    <!-- 集中器Dialog2 -->
    <el-dialog
      :visible.sync="concentrator_dialogVisible"
      width="554px"
      :modal="false"
      class="concentrator_dialogVisible"
    >
      <!-- 集中器 -->
      <div class="dialog_card concentrator_card">
        <div class="clearfix dialog_card_header">
          <div class="header_left">
            <img src="../../assets/img/index/集中器.png" alt class="header_left_icon" />
            <span class="header_left_span_Num">{{concentrator_dialog_item.addressField}}</span>
            <span v-if="concentrator_dialog_item.workState" class="header_left_span_success">正常</span>
            <span v-if="!concentrator_dialog_item.workState" class="header_left_span_error">警告</span>
          </div>
          <div class="header_right">
            <img
              src="../../assets/img/index/shuaxin.png"
              alt
              class="refresh_icon"
              @click="getconcentratorbyid(concentrator_dialog_item.concentId)"
            />
            <span class="header_right_time">{{concentrator_dialog_item.createTime}}</span>
          </div>
        </div>
        <!-- 弹框表格1 -->
        <el-table
          :data="concentrator_dialog_array"
          style="width: 100%"
          header-cell-class-name="table_header_color"
        >
          <el-table-column prop="regionName" label="区域"></el-table-column>
          <el-table-column prop="roadName" label="道路"></el-table-column>
          <el-table-column prop="addressField" label="集中器编号"></el-table-column>
          <el-table-column prop="simcard" label="SIM卡号"></el-table-column>
        </el-table>
        <!-- 弹框表格2 -->
        <el-table
          :data="concentrator_dialog_array"
          style="width: 100%"
          header-cell-class-name="table_header_color"
        >
          <el-table-column prop="lng" label="纬度"></el-table-column>
          <el-table-column prop="lat" label="经度"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>

        <!-- 按钮 -->
        <div class="button_bottom_box">
          <button class="button_bottom bottom_submit" @click="concentrator_dialogVisible=false">关闭</button>
          <!-- <el-button  type="primary" @click="dialogVisible = false">关 闭</el-button> -->
        </div>
      </div>
    </el-dialog>
    <!-- ============路灯============== -->
    <el-dialog
      class="concentrator_dialogVisible dialog_card street_lamp_card"
      :visible.sync="street_lamp_Dialog_card"
      width="554px"
      :modal="false"
    >
      <div class="clearfix dialog_card_header">
        <div class="header_left"></div>
        <div class="header_right">
          <img
            src="../../assets/img/index/shuaxin.png"
            alt
            class="refresh_icon"
            @click="get_lamp_by_id(lamp_Marker_dialog_item.poleId)"
          />
          <span class="header_right_time">{{lamp_Marker_dialog_item.createTime}}</span>
        </div>
      </div>
      <!-- 弹框表格1 -->
      <el-table
        :data="lamp_Marker_dialog_item.lampList"
        style="width: 100%"
        height="220"
        header-cell-class-name="table_header_color"
      >
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.workState==3" class="street_lamp_color_red">警告</span>
            <span v-if="scope.row.workState==1" class="street_lamp_color_green">正常</span>
            <span v-if="scope.row.workState==2" class="street_lamp_color_yellow">离线</span>
          </template>
        </el-table-column>
        <el-table-column prop="termUid" label="控制器编号" width="150"></el-table-column>
        <el-table-column label="灯杆编号">
          <template>{{lamp_Marker_dialog_item.poleCode}}</template>
        </el-table-column>
        <el-table-column prop="concentName" label="集中器名称"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="el-icon-edit-outline"
              @click="open_Lamp_Dialog(scope.row.concentId,scope.row.lampId)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 按钮 -->
      <div class="button_bottom_box">
        <button class="button_bottom bottom_submit" @click="street_lamp_Dialog_card=false">关闭</button>
      </div>
    </el-dialog>
    <!-- 右下角warning -->
    <div v-if="concentMonitor_warning||lightLamp_warning" class="warning_right_bottom">
      <div v-if="concentMonitor_warning" class="warning_box">
        <img src="../../assets/img/index/xianshi_jinggaotianchong.png" alt />
        <span>集中器警告</span>
      </div>
      <div v-if="lightLamp_warning" class="warning_box">
        <img src="../../assets/img/index/tishi.png" alt />
        <span>灯源警告</span>
      </div>
    </div>
    <!-- 弹出菜单 -->
    <Menu :drawer="drawer" />
  </div>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import BmMarker from "vue-baidu-map/components/overlays/Marker"; //点标注
import BMap from "BMap";
import echarts from "echarts";
import old_lamp_icon from "../../assets/img/index/dingwei.png"; // 集中器(修改状态)
import light_lamp_icon from "../../assets/img/index/tishi@2x(1).png"; // 路灯(修改状态)
import street_lamp_icon from "../../assets/img/index/ludeng-green.png"; // 路灯绿
import street_lamp_icon_red from "../../assets/img/index/ludeng-red.png"; // 路灯红
import concentrator_icon from "../../assets/img/index/集中器.png"; // 集中器
import shangsanjiao from "../../assets/img/index/三角形(1).png";
import xiasanjiao from "../../assets/img/index/三角形@2x(2).png";
import Bus from "../../utils/bus/bus";
import { Loading } from "element-ui";

import {
  select_road,
  luminGroup,
  map_search,
  edit_concentrator,
  merker_pole,
  merker_pole_array,
  get_concentrator_byid,
  get_lamp_byid,
  get_lamp_linght_byid,
  close_lamp_linght_byid,
  open_lamp_linght_byid,
  dimming_lamp_linght_byid,
  dimming_lamp_linght_all
} from "../../api/http/index.js";
export default {
  name: "",
  props: [""],
  data() {
    return {
      // language:true,
      language: localStorage.getItem("locale") == "zh" ? true : false,
      drawer: false,
      _map: "",
      GG_map: "",
      center: { lng: 114.025, lat: 22.546 },
      zoom: 15,
      minZoom: 10,
      shrinkZoom: 14,
      maxZoom: 18,
      showMap: true,
      concentrator_Marker: [], // 集中器marker
      lamp_Marker: [], // 灯杆marker
      edit_street_lamp_list: [], // 编辑状态的路灯marker
      street_lamp_icon: street_lamp_icon, // 路灯icon绿
      street_lamp_icon_red: street_lamp_icon_red, // 路灯icon红
      concentrator_icon: concentrator_icon, // 集中器icon
      old_lamp_icon: old_lamp_icon, // 老路灯图标
      light_lamp_icon: light_lamp_icon, // 老路灯图标
      street_lamp_list: [], // 所有路灯数据
      concentrator_list: [], // 所有集中器数据
      GG_marker_number: [],
      edit_concentrator_marker_obj: {}, // 编辑(或者标记)的集中器marker记录(axios参数)
      edit_lamp_marker_array: [], // 编辑后的路灯marker记录(axios参数)
      new_marker_concentrator: "", // 新标记的集中器marker
      new_marker_for_lamp: [], // 新标记的路灯marker数组
      new_marker_for_lamp_array: [], // 新标记的路灯数组(axios参数)
      map_loading: false, // loading面板
      currentRow: "", //当前选中行
      selected: {
        road: "", // 地区/道路
        luminGroup: "", // 照明分组
        ctrCode: "" // 集中器编号
      },
      districtOptions: [], // 地区下拉框
      luminGroupOptions: [], // 照明分组下拉框
      ctrCodeOptions: [], // 控制器信息
      label_style: {
        "font-size": "9px",
        color: "#fff",
        padding: "2px 4px 2px 2px",
        "border-radius": "50%",
        border: "4px solid #fff",
        "background-color": "#5BD88B",
        "text-align": "center",
        "line-height": "14px",
        "-moz-box-shadow": "2px 2px 5px #ccc",
        "-webkit-box-shadow": " 2px 2px 5px #ccc",
        "box-shadow": "2px 2px 5px #ccc",
        cursor: "pointer"
      },
      // =======左下角集中器列表=========
      ctrCodeTableList: [], // 左下角集中器列表
      edit_status: false, // 编辑状态
      lightController: {
        // 光源亮度
        lightStatus: true,
        intensityControl: 5
      },

      // 集中器和灯源警告状态
      concentMonitor_warning: false,
      lightLamp_warning: false,
      // ========集中器弹框==========
      concentrator_dialogVisible: false,
      concentrator_dialog_item: {}, // 当前集中器对象
      concentrator_dialog_array: [],
      concentrator_Dialog_card: false,
      // 路灯弹框
      street_lamp_Dialog_card: false, //
      lamp_Marker_dialog_item: {},
      // 灯源弹框
      lamp_loading: false,
      single_lamp_loading: false,
      linght_Dialog_card: false,
      linght_Dialog_item: [],
      linght_Dialog_item_obj: {},
      single_linght_lampId: "",
      single_concent_Id: "",
      fn: "", // 储存点击事件函数
      lampFn: "", // 储存点击事件函数
      cursor: "", // 储存鼠标图标

      // =====WebSocket=======
      // WebSocket_path: "ws://47.106.141.162:8888/scoket/webServer/123",
      WebSocket_path:
        "ws://websocket.eclight.com/scoket/webServer/e10adc3949ba59abbe56e057f20f883e",
      socket: "",
      // ========echarts===========
      // 1
      lampMonitor: {},
      // 2
      concentMonitor: {},
      // 3
      alarmStatistics: {},
      // 4
      lightRateStatistics: {},
      // 语言
      yuyan: ""
    };
  },

  components: {
    // BaiduMap,
    // BmMarker
  },

  computed: {
    newLanguage: function() {
      return this.language;
    },
    languageZh: function() {
      let language = localStorage.getItem("locale");
      console.log(this.yuyan);
      if (language == "zh") {
        return true;
      } else {
        return false;
      }
    }
  },

  beforeMount() {},
  created() {
    // Bus.$on('language',language=>{
    //   if(language=='中文(简体)'){
    //   this.language=true
    //   }else{
    //   this.language=false
    //   }
    //   console.log(this.language);
    // })
  },
  watch: {
    newLanguage: function(newVal) {
      // console.log(newVal);
    },
    languageZh(val) {}
  },
  mounted() {
    this.getRoad(); // 道路
    this.getLuminGroup(); // 灯组
    if (this.language) {
      this.initMap();
      this.mapSearch();
    } else {
      this.initGGMap();
      setTimeout(() => {
        this.mapSearch();
      }, 1000);
    }

    this.WebSocket_init();
  },

  methods: {
    // 页面加载时获取道路下拉框内容
    async getRoad() {
      let res = await select_road();
      if (res.data.success) {
        this.districtOptions = res.data.content;
        this.districtOptions = this.remmoveEmpty(this.districtOptions);
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 页面加载时获取照明分组
    async getLuminGroup() {
      let from = new FormData();
      from.append("roadOptValue", this.selected.road);
      let res = await luminGroup({ data: from });
      if (res.data.success) {
        this.luminGroupOptions = res.data.content;
        this.luminGroupOptions = this.remmoveEmpty(this.luminGroupOptions);
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    changeMap() {
      this.language = !this.language;
    },
    // 搜索并设置marker
    async mapSearch(refresh = true) {
      let from = new FormData();
      from.append("road", this.selected.road);
      from.append("luminGroup", this.selected.luminGroup);
      from.append("ctrCode", this.selected.ctrCode);
      let res = await map_search({ data: from });
      if (res.data.success) {
        this.ctrCodeOptions = JSON.parse(JSON.stringify(res.data.content));
        this.ctrCodeTableList = JSON.parse(JSON.stringify(res.data.content));
        this.getMarker();
        if (this.language) {
          this.setMarker(refresh);
        } else {
          this.init_GG_marker();
        }
        this.map_loading = false;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 仅搜索marker
    async onlySearch() {
      let from = new FormData();
      from.append("road", this.selected.road);
      from.append("luminGroup", this.selected.luminGroup);
      from.append("ctrCode", this.selected.ctrCode);
      let res = await map_search({ data: from });
      if (res.data.success) {
        this.ctrCodeOptions = JSON.parse(JSON.stringify(res.data.content));
        this.ctrCodeTableList = JSON.parse(JSON.stringify(res.data.content));
        this.getMarker();
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 当前选择道路变化
    roadChange() {
      this.getLuminGroup();
      if (this.language) {
        this._map.clearOverlays();
      } else {
        this.clearMarkers();
      }
      this.mapSearch();
    },
    // 照明分组变化
    LuminGroupChange() {
      if (this.language) {
        this._map.clearOverlays();
      } else {
        this.clearMarkers();
      }
      this.mapSearch();
    },
    // 刷新弹框表单
    refresh(id) {},
    // 亮度调节
    lightChange() {},
    //=========百度MAP事件===============
    // 初始化地图
    initMap() {
      this._map = new BMap.Map("bd_map", {
        enableMapClick: false,
        minZoom: this.minZoom
      });
      var point = new BMap.Point(113.93237028712, 22.53905617781);
      this._map.centerAndZoom(point, this.maxZoom);
      this._map.enableScrollWheelZoom(true);
      this._map.addEventListener("zoomend", this.zoomend);
      this.cursor = this._map.getDefaultCursor();
    },
    // 地图缩放
    zoomend(e) {
      console.log(e.target.getZoom());

      if (e.target.getZoom() <= this.shrinkZoom) {
        this._map.clearOverlays(); // 清除
        this.set_label_overlay(); // 仅集中器(数字)
      } else {
        this._map.clearOverlays(); // 清除
        this.set_lamp_Marker(); // 灯
        this.set_concentrator_Marker(); // 集中器
      }
    },
    // 页面加载时获取所有marker标记点
    getMarker() {
      let list = [];
      let list1 = [];
      if (!this.ctrCodeOptions || this.ctrCodeOptions.length == 0) {
        this.street_lamp_list = list1;
        this.concentrator_list = list;
        return;
      }
      this.ctrCodeOptions.forEach(item => {
        list.push(item);
        if (item.poleList && item.poleList.length != 0) {
          item.poleList.forEach(item2 => {
            item2.workState = 1;
            if (!item2.lampList || item2.lampList.length == 0) {
              item2.workState = 0;
            } else {
              item2.lampList.forEach(item3 => {
                if (!item3.workState) {
                  item2.workState = 0;
                }
              });
            }
            list1.push(item2);
          });
        }
      });
      this.street_lamp_list = list1;
      this.concentrator_list = list;
    },
    // 设置marker
    setMarker(refresh) {
      this.set_lamp_Marker();
      this.set_concentrator_Marker();
      if (refresh) {
        if (this.concentrator_list.length > 1) {
          this._map.setZoom(18);

          this._map.centerAndZoom(
            new BMap.Point(
              this.concentrator_list[0].lng,
              this.concentrator_list[0].lat
            ),
            10
          );
        } else if (this.concentrator_list.length == 1) {
          this._map.centerAndZoom(
            new BMap.Point(
              this.concentrator_list[0].lng,
              this.concentrator_list[0].lat
            ),
            18
          );
        }
      }
    },

    // 生成集中器marker
    set_concentrator_Marker() {
      if (!this.concentrator_list || this.concentrator_list.length == 0) {
        return;
      }
      this.concentrator_list.forEach(item => {
        let point = new BMap.Point(item.lng, item.lat);
        let marker = new BMap.Marker(point);
        var icon = new BMap.Icon(
          this.concentrator_icon,
          new BMap.Size(24, 23),
          { anchor: new BMap.Size(12, 23) }
        );
        marker.setIcon(icon);
        marker.enableMassClear(); // 可以被清除
        marker.setTitle(
          item.concentName +
            "  id: " +
            item.addressField +
            "; 灯杆: " +
            item.poleAmount +
            "; 地址: " +
            item.address
        );
        marker.addEventListener("click", e => {
          this.concentratorClick(point, item.concentId);
        });
        marker.setZIndex(1);
        this.concentrator_Marker.push({
          addressField: item.addressField,
          marker: marker
        });
        this._map.addOverlay(marker);
      });
    },
    // 生成灯杆marker
    set_lamp_Marker() {
      if (!this.street_lamp_list || this.street_lamp_list.length == 0) {
        return;
      }
      this.street_lamp_list.forEach(item => {
        let point = new BMap.Point(item.lng, item.lat);
        let marker = new BMap.Marker(point);
        let icon_color = item.workState
          ? this.street_lamp_icon
          : this.street_lamp_icon_red;
        var icon = new BMap.Icon(icon_color, new BMap.Size(18, 32), {
          anchor: new BMap.Size(9, 32)
        });
        marker.setIcon(icon);
        marker.enableMassClear();
        marker.setTitle(
          "  id: " +
            item.poleCode +
            "; 灯源: " +
            item.lampList.length +
            "; 地址: " +
            item.address
        );
        this.lamp_Marker.push({
          poleId: item.poleId,
          marker
        });
        marker.addEventListener("click", e => {
          this.lamp_MarkerClick(point, item.poleId);
        });
        this._map.addOverlay(marker);
      });
    },
    // 生成覆盖物Overlay
    set_label_overlay() {
      let color = "#5bd88b";
      if (!this.ctrCodeOptions || this.ctrCodeOptions.length == 0) {
        return;
      }
      this.ctrCodeOptions.forEach(item => {
        if (!item.workState) {
          color = "#ff5353";
        } else {
          if (item.poleList && item.poleList.length != 0) {
            item.poleList.forEach(item1 => {
              if (item1.lampList.length != 0) {
                item1.lampList.forEach(item2 => {
                  if (!item2.workState) {
                    color = "#ff5353";
                  }
                });
              } else {
                color = "#ff5353";
              }
            });
          } else {
            color = "#ff5353";
          }
        }
      });
      if (!this.concentrator_list || this.concentrator_list.length == 0) {
        return;
      }
      this.concentrator_list.forEach(item3 => {
        let width = item3.lampAmount.toString().length * 5 + 10;

        if (this.language) {
          let center = new BMap.Point(item3.lng, item3.lat);
          this.initOverlay(
            center,
            width,
            color,
            item3.lampAmount,
            this._map,
            this.maxZoom
          );
        } else {
          let center = { lat: item3.lat, lng: item3.lng };
          let Overlay = this.init_GG_Overlay(
            center,
            width,
            color,
            item3.lampAmount,
            this.GG_map,
            item3.concentId
          );
          this.GG_marker_number.push(Overlay);
        }
      });
    },
    // =====初始化覆盖物====
    initOverlay(center, width, color, num, map, maxZoom) {
      // 定义自定义覆盖物的构造函数
      function SquareOverlay(center, length, color, num, map, maxZoom) {
        this._center = center;
        this._length = length;
        this._color = color;
        this._num = num;
        this._map = map;
        this._maxZoom = maxZoom;
      }
      // 继承API的BMap.Overlay
      SquareOverlay.prototype = new BMap.Overlay();
      // 实现初始化方法
      SquareOverlay.prototype.initialize = function() {
        // 保存map对象实例
        // 创建div元素，作为自定义覆盖物的容器
        var div = document.createElement("div");
        var span = document.createElement("span");
        span.innerText = this._num;
        div.appendChild(span);
        div.style.position = "absolute";
        // 可以根据参数设置元素外观
        div.style.width = this._length + "px";
        div.style.height = this._length + "px";
        div.style.background = this._color;
        div.style.textAlign = "center";
        div.style.lineHeight = this._length + "px";
        div.style.borderRadius = "50%";
        div.style.border = "4px solid #fff";
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
          this._map.centerAndZoom(this._center, this._maxZoom);
          this.toggle();
        });
        // 将div添加到覆盖物容器中
        this._map.getPanes().markerPane.appendChild(div);
        // 保存div实例
        this._div = div;
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return div;
      };
      // 实现绘制方法
      SquareOverlay.prototype.draw = function() {
        // 根据地理坐标转换为像素坐标，并设置给容器
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / 2 + "px";
        this._div.style.top = position.y - this._length / 2 + "px";
      };
      // 实现显示方法
      SquareOverlay.prototype.show = function() {
        if (this._div) {
          this._div.style.display = "";
        }
      };
      // 实现隐藏方法
      SquareOverlay.prototype.hide = function() {
        if (this._div) {
          this._div.style.display = "none";
        }
      };
      // 添加自定义方法
      SquareOverlay.prototype.toggle = function() {
        if (this._div) {
          if (this._div.style.display == "") {
            this.hide();
          } else {
            this.show();
          }
        }
      };
      var mySquare = new SquareOverlay(center, width, color, num, map, maxZoom);
      this._map.addOverlay(mySquare);
    },
    // 集中器marker被点击弹框
    async concentratorClick(point, id) {
      if (this.language) {
        this._map.centerAndZoom(point, this.maxZoom);
      } else {
        this.centerAndZoom(point, this.maxZoom);
      }
      this.getconcentratorbyid(id);
    },
    // 根据id获取集中器信息
    async getconcentratorbyid(id) {
      console.log(id);
      let loadingInstance = Loading.service();
      let from = new FormData();
      from.append("id", id);
      let res = await get_concentrator_byid({ data: from });
      if (res.data.success) {
        loadingInstance.close();
        this.concentrator_dialogVisible = true;
        this.concentrator_dialog_item = res.data.content;
        let arr = [];
        arr[0] = res.data.content;
        this.concentrator_dialog_array = arr;
      } else {
        loadingInstance.close();
        this.$message.error(res.data.msgCode);
      }
    },
    // 路灯marker被点击弹框
    async lamp_MarkerClick(point, id) {
      if (this.language) {
        this._map.centerAndZoom(point, this.maxZoom);
      } else {
        this.centerAndZoom(point, this.maxZoom);
      }
      this.get_lamp_by_id(id);
    },
    // 根据灯杆id获取信息
    async get_lamp_by_id(id) {
      let loadingInstance = Loading.service();
      let from = new FormData();
      from.append("poleId", id);
      let res = await get_lamp_byid({ data: from });
      if (res.data.success) {
        loadingInstance.close();
        this.single_concent_Id = res.data.content.concentId;
        if (res.data.content.lampList.length == 1) {
          this.get_linght_by_id(res.data.content.lampList[0].lampId);
        } else {
          this.street_lamp_Dialog_card = true;
          this.lamp_Marker_dialog_item = res.data.content;
        }
      } else {
        loadingInstance.close();
        this.$message.error(res.data.msgCode);
      }
    },
    // 根据id获取灯源信息
    async get_linght_by_id(lampId) {
      let data = {
        lampId: lampId
      };
      this.single_linght_lampId = lampId;
      let options = { target: this.$refs.single_lamp };
      let loadingInstance = Loading.service();
      let res = await get_lamp_linght_byid({ data });
      if (res) {
        this.linght_Dialog_card = true;
        loadingInstance.close();
        this.linght_Dialog_item_obj = res.data;
        this.linght_Dialog_item = res.data.fnResults || [];
      }
      if (res.data.ackState != "SUCCESS") {
        this.$message.error(res.data.ackState);
      }
    },
    // 灯源列表打开单灯
    open_Lamp_Dialog(lampId) {
      this.street_lamp_Dialog_card = false;
      this.get_linght_by_id(lampId);
    },
    // ====灯源调整=====
    set_light_by_id() {
      //  lightController: {
      //   // 光源亮度
      //   lightStatus: true,
      //   intensityControl: 5
      // },
      // DISCONNECTED, SUCCESS, FAILURE, TIME_OUT, ERROR, BUSY;

      // if (!this.lightController.lightStatus) {
      //   let data = {
      //     lampId: row[0].lampId
      //   };
      //   close_lamp_linght_byid({ data }).then(res => {
      //     console.log(res);
      //     if (res.data.ackState == "SUCCESS") {
      //       this.$message.success("关闭成功");
      //     } else {
      //       this.$message.error(res.data.ackState);
      //     }
      //   });
      // } else {
      //   let data = {
      //     lampId: row[0].lampId
      //   };
      //   open_lamp_linght_byid({ data }).then(res => {
      //     console.log(res);
      //     if (res.data.ackState == "SUCCESS") {
      //       this.$message.success("关闭成功");
      //     } else {
      //       this.$message.error(res.data.ackState);
      //     }
      //   });
      // }

      this.lamp_loading = true;
      let dateStart = new Date().getTime();
      let data = {
        conId: this.linght_Dialog_item_obj.concentId,
        lampId: this.single_linght_lampId,
        dimming: this.lightController.intensityControl
      };

      dimming_lamp_linght_all({ data }).then(res => {
        console.log(res);
        let dateEnd = new Date().getTime();
        let time = (dateEnd - dateStart) / 1000;

        if (res.data.ackState == "SUCCESS") {
          this.$message.success("关闭成功");
          this.lamp_loading = false;
          alert("成功:耗时: " + time + "s");
        } else {
          this.lamp_loading = false;
          this.$message.error(res.data.ackState);
          alert("失败:耗时: " + time + "s");
        }
      });
    },

    // ===========左下角集中器列表==============
    // 设置选中行
    handleCurrentChange(val) {
      if (!this.edit_status) {
        this.currentRow = val;
      }
    },
    // 路灯code被点击
    checkLampByCode(row) {
      // 居中和缩放
      if (!row.lng && !row.lat) {
        this.concentrator_list.forEach(item => {
          if (item.concentId == row.concentId) {
            if (this.language) {
              this._map.centerAndZoom(
                new BMap.Point(item.lng, item.lat),
                this.maxZoom
              );
            } else {
              this.centerAndZoom(
                { lat: item.lat, lng: item.lng },
                this.maxZoom
              );
            }
          }
        });
        return;
      }
      // 百度地图
      if (this.language) {
        this._map.centerAndZoom(new BMap.Point(row.lng, row.lat), this.maxZoom);
        let arr = "";
        if (!this.edit_status) {
          arr = this.lamp_Marker;
        } else {
          arr = this.edit_street_lamp_list;
        }
        arr.forEach(item => {
          if (item.poleId == row.poleId) {
            item.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            setTimeout(() => {
              item.marker.setAnimation();
            }, 3000);
          }
        });
        // 谷歌地图
      } else {
        this.centerAndZoom({ lat: row.lat, lng: row.lng }, this.maxZoom);
        if (this.lamp_Marker && this.lamp_Marker.length != 0) {
          this.lamp_Marker.forEach(item => {
            if (item.id == row.poleId) {
              item.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(() => {
                item.setAnimation(null);
              }, 3000);
            }
          });
        }
      }
    },
    // 打开编辑功能
    openEdit() {
      this.edit_status = true;
      this.searchController(this.currentRow);
      if (this.language) {
        this._map.removeEventListener("zoomend", this.zoomend);
        this.moveConcentrator(this.currentRow);
      } else {
        google.maps.event.clearListeners(this.GG_map, "zoom_changed");
        this.GG_moveConcentrator(this.currentRow);
      }
    },
    // 取消编辑
    cancelEditAll() {
      this.edit_status = false;
      this.edit_concentrator_marker_arr = {};
      this.edit_concentrator_marker_obj = {};
      this.edit_lamp_marker_array = [];
      this.new_marker_concentrator = "";
      this.new_marker_for_lamp = [];
      this.new_marker_for_lamp_array = [];
      if (this.language) {
        this._map.clearOverlays();
        this.mapSearch(false);
        this._map.addEventListener("zoomend", this.zoomend);
        this._map.removeEventListener("click", this.fn);
        this._map.removeEventListener("click", this.lampFn);
        this._map.setDefaultCursor(this.cursor);
      } else {
        google.maps.event.clearListeners(this.GG_map, "click");
        this.GG_map.addListener("zoom_changed", () => {
          this.GG_zoomend(this.GG_map.getZoom());
        });
        this.clearMarkers();
        this.onlySearch();
        setTimeout(() => {
          this.setMapOnAll(this.GG_map);
        }, 500);
        // this.setMapOnAll(this.GG_map);
      }
    },
    // =========修改====路灯===========
    // 路灯被拖拽
    street_lamp_dragend(e, id) {
      if (this.language) {
        let { type, target, pixel, point } = e;
        let flag = true;
        this.edit_lamp_marker_array.forEach(item => {
          if (item.poleId == id) {
            item.lng = point.lng;
            item.lat = point.lat;
            flag = false;
          }
        });
        if (flag) {
          this.edit_lamp_marker_array.push({
            poleId: id,
            lng: point.lng,
            lat: point.lat
          });
        }
      } else {
        let { latLng } = e;
        let flag = true;
        this.edit_lamp_marker_array.forEach(item => {
          if (item.poleId == id) {
            item.lng = latLng.lng();
            item.lat = latLng.lat();
            flag = false;
          }
        });
        if (flag) {
          this.edit_lamp_marker_array.push({
            poleId: id,
            lng: latLng.lng(),
            lat: latLng.lat()
          });
        }
      }
    },
    // =============点击标记路灯==
    // 开始标记路灯
    addNewLamp(id) {
      if (this.language) {
        this._map.removeEventListener("zoomend", this.zoomend);
        this._map.setDefaultCursor("crosshair");
        this._map.removeEventListener("click", this.lampFn);
        var lampFn = e => {
          this.mapClickAddLamp(e, id);
        };
        this.lampFn = lampFn;
        this._map.addEventListener("click", lampFn);
      } else {
        this.GG_map.addListener("click", e => {});
      }
    },
    // 点击地图标记路灯
    mapClickAddLamp(e, id) {
      if (this.language) {
        let marker = new BMap.Marker(e.point);
        let icon = new BMap.Icon(this.street_lamp_icon, new BMap.Size(18, 32), {
          anchor: new BMap.Size(9, 32)
        });
        marker.setIcon(icon);
        let flag = true;
        let oldMarker = "";
        if (this.new_marker_for_lamp.length != 0) {
          this.new_marker_for_lamp.forEach(item => {
            if (item.poleId == id) {
              oldMarker = item.marker;
              item.marker = marker;
              flag = false;
            }
          });
        }
        if (flag) {
          this.new_marker_for_lamp.push({
            poleId: id,
            marker: marker
          });
        } else {
          this._map.removeOverlay(oldMarker);
        }
        marker.enableDragging(true);
        marker.addEventListener("dragend", e => {
          this.checkLampPoint(e, id);
        });
        this._map.addOverlay(marker);
        this._map.setDefaultCursor(this.cursor);

        this.checkLampPoint(e, id);
      } else {
        // =======谷歌地图标记==========
        let marker = new google.maps.Marker({
          position: e.latLng,
          map: this.GG_map,
          icon: this.street_lamp_icon,
          id: id,
          title: "new路灯:" + id,
          draggable: true
        });
        marker.setZIndex(1);
        marker.addListener("click", () => {
          this.centerAndZoom(e.latLng, this.maxZoom);
        });
        marker.addListener("dragend", e => {});

        let flag = true;
        let oldMarker = "";
        if (this.new_marker_for_lamp.length != 0) {
          this.new_marker_for_lamp.forEach(item => {
            if (item.poleId == id) {
              oldMarker = item.marker;
              item.marker = marker;
              flag = false;
            }
          });
        }
        if (flag) {
          this.new_marker_for_lamp.push({
            poleId: id,
            marker: marker
          });
        } else {
          oldMarker.setMap(null);
        }

        this.checkLampPoint(e, id);
      }
    },
    // 保存标记后的路灯
    checkLampPoint(e, id) {
      if (this.language) {
        let { point } = e;
        let flag = true;

        if (this.edit_lamp_marker_array.length != 0) {
          this.edit_lamp_marker_array.forEach(item => {
            if (item.poleId == id) {
              item.lng = point.lng;
              item.lat = point.lat;
              flag = false;
            }
          });
        }
        if (flag) {
          this.edit_lamp_marker_array.push({
            poleId: id,
            lng: point.lng,
            lat: point.lat
          });
        }
      } else {
        let { latLng } = e;
        let flag = true;

        if (this.edit_lamp_marker_array.length != 0) {
          this.edit_lamp_marker_array.forEach(item => {
            if (item.poleId == id) {
              item.lng = latLng.lng();
              item.lat = latLng.lat();
              flag = false;
            }
          });
        }
        if (flag) {
          this.edit_lamp_marker_array.push({
            poleId: id,
            lng: latLng.lng(),
            lat: latLng.lat()
          });
        }
      }
    },
    // ========编辑或修改集中器marker====
    // 开始标记集中器
    addConcentrator(id) {
      if (this.language) {
        this._map.removeEventListener("zoomend", this.zoomend);
        this._map.setDefaultCursor("crosshair");
        var fn = e => {
          this.mapClickAddMarker(e, id);
        };
        this.fn = fn;
        this._map.addEventListener("click", fn);
      } else {
        this.GG_map.addListener("click", e => {
          this.mapClickAddMarker(e, id);
        });
      }
    },
    // 点击地图标记集中器
    mapClickAddMarker(e, id) {
      if (this.language) {
        let marker = new BMap.Marker(e.point);
        let icon = new BMap.Icon(
          this.concentrator_icon,
          new BMap.Size(24, 23),
          {
            anchor: new BMap.Size(12, 23)
          }
        );
        marker.setIcon(icon);
        if (this.new_marker_concentrator) {
          this._map.removeOverlay(this.new_marker_concentrator);
        }
        marker.enableDragging(true);
        marker.addEventListener("dragend", e => {
          this.checkConcentratorPoint(e, id);
        });
        this.new_marker_concentrator = marker;
        this._map.addOverlay(marker);
        this._map.setDefaultCursor(this.cursor);

        this.checkConcentratorPoint(e, id);
      } else {
        if (this.new_marker_concentrator) {
          this.new_marker_concentrator.setMap(null);
        }
        let marker = new google.maps.Marker({
          position: e.latLng,
          map: this.GG_map,
          icon: this.concentrator_icon,
          id: id,
          title: "集中器:" + id,
          draggable: true
        });
        marker.setZIndex(1);
        marker.addListener("click", () => {
          this.centerAndZoom(e.latLng, this.maxZoom);
        });
        marker.addListener("dragend", e => {
          this.checkConcentratorPoint(e, id);
        });
        this.new_marker_concentrator = marker;
        this.checkConcentratorPoint(e, id);
      }
    },
    // 保存标记后的集中器
    checkConcentratorPoint(e, id) {
      if (this.language) {
        let { point } = e;
        this.edit_concentrator_marker_obj.conId = id;
        this.edit_concentrator_marker_obj.lng = point.lng;
        this.edit_concentrator_marker_obj.lat = point.lat;
      } else {
        let { latLng } = e;
        this.edit_concentrator_marker_obj.conId = id;
        this.edit_concentrator_marker_obj.lng = latLng.lng();
        this.edit_concentrator_marker_obj.lat = latLng.lat();
      }
    },
    // 集中器被拖拽
    concentrator_dragend(e, id) {
      if (this.language) {
        let { type, target, pixel, point } = e;
        this.edit_concentrator_marker_obj.conId = id;
        this.edit_concentrator_marker_obj.lng = point.lng;
        this.edit_concentrator_marker_obj.lat = point.lat;
      } else {
        let { latLng } = e;
        this.edit_concentrator_marker_obj.conId = id;
        this.edit_concentrator_marker_obj.lng = latLng.lng();
        this.edit_concentrator_marker_obj.lat = latLng.lat();
      }
    },
    // 点击集中器的编号或者标记
    searchController(row) {
      if (!row.lng && !row.lat) {
        return;
      }
      if (!row.poleList || row.poleList.length == 0) {
        if (this.language) {
          this._map.centerAndZoom(
            new BMap.Point(row.lng, row.lat),
            this.maxZoom
          );
        } else {
          this.centerAndZoom({ lng: row.lng, lat: row.lat }, this.maxZoom);
        }

        return false;
      } else {
        if (this.language) {
          this._map.centerAndZoom(
            new BMap.Point(row.lng, row.lat),
            this.maxZoom
          );
        } else {
          this.centerAndZoom({ lng: row.lng, lat: row.lat }, this.maxZoom);
        }
      }
    },
    // 点击保存
    async editConcentrator() {
      this.map_loading = true;
      // 已存在的标记进行修改
      if (
        this.edit_concentrator_marker_obj.conId &&
        this.edit_concentrator_marker_obj.lng &&
        this.edit_concentrator_marker_obj.lat
      ) {
        let from = new FormData();
        from.append("conId", this.edit_concentrator_marker_obj.conId);
        from.append("lng", this.edit_concentrator_marker_obj.lng);
        from.append("lat", this.edit_concentrator_marker_obj.lat);
        let res = await edit_concentrator({ data: from });
        if (res.data.success) {
          this.$message.success(res.data.msgCode);
          this.sendEditLamp();
        } else {
          this.$message.error(res.data.msgCode);
          this.sendEditLamp();
        }
      } else {
        this.sendEditLamp();
      }
    },
    // 封装的灯杆请求
    sendEditLamp() {
      if (this.edit_lamp_marker_array.length != 0) {
        let data = JSON.stringify(this.edit_lamp_marker_array);
        merker_pole_array({ data }).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.map_loading = false;
            this.cancelEditAll();
          } else {
            this.$message.error(res.data.msgCode);
            this.map_loading = false;
            this.cancelEditAll();
          }
        });
      } else {
        this.map_loading = false;
        this.cancelEditAll();
      }
    },
    // 准备移动集中器
    moveConcentrator(row) {
      this._map.clearOverlays();
      // setTimeout(() => {
      // 设置集中器的marker
      this.concentrator_list.forEach(item => {
        let marker = new BMap.Marker(new BMap.Point(item.lng, item.lat));
        if (item.concentId != row.concentId) {
          let icon = new BMap.Icon(
            this.concentrator_icon,
            new BMap.Size(24, 23),
            { anchor: new BMap.Size(12, 23) }
          );
          marker.addEventListener("click", e => {
            this.concentratorClick(
              new BMap.Point(item.lng, item.lat),
              item.concentId
            );
          });
          marker.setZIndex(1);
          marker.setIcon(icon);
          this._map.addOverlay(marker);
        } else {
          let icon = new BMap.Icon(this.old_lamp_icon, new BMap.Size(26, 31), {
            anchor: new BMap.Size(13, 31)
          });
          marker.setZIndex(1);
          marker.setIcon(icon);
          marker.enableDragging();
          marker.addEventListener("dragend", e =>
            this.concentrator_dragend(e, row.concentId)
          );
          marker.addEventListener("click", e => {
            this.concentratorClick(
              new BMap.Point(item.lng, item.lat),
              item.concentId
            );
          });
          this._map.addOverlay(marker);
          marker.setAnimation(BMAP_ANIMATION_BOUNCE);
          setTimeout(() => {
            marker.setAnimation();
          }, 3000);
        }
        // marker.addEventListener("click", () => {
        //   this.addInfoWindow(
        //     item.concentName,
        //     "集中器编号: " +
        //       item.addressField +
        //       " ; 灯杆数量: " +
        //       item.poleAmount +
        //       " ; 灯源数量: " +
        //       item.lampAmount +
        //       " ; 地址: " +
        //       item.address,
        //     marker
        //   );
        // });
      });

      // 设置路灯的marker
      this.ctrCodeOptions.forEach(item2 => {
        if (item2.concentId != row.concentId) {
          if (item2.poleList && item2.poleList.length != 0) {
            item2.poleList.forEach(item => {
              let marker = new BMap.Marker(new BMap.Point(item.lng, item.lat));
              let icon_color = item.workState
                ? this.street_lamp_icon
                : this.street_lamp_icon_red;
              let icon = new BMap.Icon(icon_color, new BMap.Size(18, 32), {
                anchor: new BMap.Size(9, 32)
              });
              marker.setIcon(icon);
              this._map.addOverlay(marker);
              // 保存到数组
              this.edit_street_lamp_list.push({
                poleId: item.poleId,
                marker
              });
            });
          }
        } else {
          // 移动光源
          if (item2.poleList && item2.poleList.length != 0) {
            item2.poleList.forEach(item => {
              let marker = new BMap.Marker(new BMap.Point(item.lng, item.lat));
              let icon = new BMap.Icon(
                this.light_lamp_icon,
                new BMap.Size(44, 44),
                {
                  anchor: new BMap.Size(22, 44)
                }
              );
              marker.setIcon(icon);
              marker.enableDragging();
              marker.addEventListener("dragend", e =>
                this.street_lamp_dragend(e, item.poleId)
              );
              this._map.addOverlay(marker);
              marker.setAnimation(BMAP_ANIMATION_BOUNCE);
              setTimeout(() => {
                marker.setAnimation();
              }, 3000);
              marker.addEventListener("click", () => {
                this.addInfoWindow(
                  "灯杆:" + item.poleCode,
                  "灯杆编号: " +
                    item.poleCode +
                    " ; 灯源数量: " +
                    item.lampList.length +
                    " ; 地址: " +
                    item.address,
                  marker
                );
              });
              // 保存到数组
              this.edit_street_lamp_list.push({
                poleId: item.poleId,
                marker
              });
            });
          }
        }
      });

      // item.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      // setTimeout(() => {
      //   item.marker.setAnimation();
      // }, 3000);
      // ===========设置标注的信息窗口
      // var opts = {
      //   width: 20, // 信息窗口宽度
      //   height: 12, // 信息窗口高度
      //   // title: "海底捞王府井店", // 信息窗口标题
      //   offset: new BMap.Size(6, -23)
      // };
      // var infoWindow = new BMap.InfoWindow("Move This", opts); // 创建信息窗口对象
      // this._map.openInfoWindow(infoWindow, item.marker.getPosition()); //开启信息窗口
      // item.marker.addEventListener("dragend", e =>
      //   this.concentrator_dragend(e, row.concentId)
      // );
      // row.poleList.forEach(item2=>{

      // })
      // }, 1000);
    },
    // 添加info窗口
    addInfoWindow(title, content, marker) {
      var opts = {
        width: 220, // 信息窗口宽度
        height: 60, // 信息窗口高度
        title: title, // 信息窗口标题
        offset: new BMap.Size(6, -23)
      };
      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
      this._map.openInfoWindow(infoWindow, marker.getPosition()); //开启信息窗口
    },
    //===========ECHARTS事件====================
    // echarts图表
    initEcharts(elID, option) {
      var mycharts = echarts.init(document.getElementById(elID));
      mycharts.setOption(option);
    },

    // 设置options-----1
    setOption_one(data, total) {
      var option = {
        title: {
          text: ["{value|" + total + "}", "个"].join(""),
          left: "15%",
          top: "42%",
          zlevel: 10,
          rich: {
            value: {
              color: "#F05820",
              fontSize: 10,
              fontWeight: "normal",
              lineHeight: 10
            }
          },
          backgroundColor: "#fff",
          textStyle: {
            width: 50,
            height: 40,
            backgroundColor: "#fff",
            rich: {
              value: {
                color: "#333333",
                fontSize: 20,
                fontWeight: "bold",
                lineHeight: 20
              }
            }
          }
        },
        legend: {
          orient: "vertical",
          icon: "circle",
          top: "middle",
          itemGap: 25,
          right: 0,
          itemWidth: 5,
          itemHeight: 5,
          default: false,
          formatter: name => {
            let value = "";
            data.forEach(item => {
              if (item.name == name) {
                value = item.value;
              }
            });
            return ` ${name}  ${value} 个`;
          },
          data: ["正常", "离线", "警告"]
        },
        series: [
          {
            name: "数量",
            type: "pie",
            center: ["25%", "50%"],
            radius: ["50%", "60%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ],
        color: ["#FFCE5D", "#5BD88B", "#FF5353"]
      };
      return option;
    },
    // 设置options-----2
    setOption_two(data, total) {
      var option = {
        title: {
          text: ["{value|" + total + "}", "个"].join(""),
          left: "19%",
          top: "42%",
          zlevel: 10,
          rich: {
            value: {
              color: "#F05820",
              fontSize: 10,
              fontWeight: "normal",
              lineHeight: 10
            }
          },
          backgroundColor: "#fff",
          textStyle: {
            width: 50,
            height: 40,
            backgroundColor: "#fff",
            rich: {
              value: {
                color: "#333333",
                fontSize: 20,
                fontWeight: "bold",
                lineHeight: 20
              }
            }
          }
        },
        legend: {
          orient: "vertical",
          icon: "circle",
          top: "middle",
          itemGap: 25,
          right: 0,
          itemWidth: 5,
          itemHeight: 5,
          default: false,
          formatter: name => {
            let value = "";
            data.forEach(item => {
              if (item.name == name) {
                value = item.value;
              }
            });
            return ` ${name}  ${value} 个`;
          },
          data: ["正常", "离线"]
        },
        series: [
          {
            name: "数量",
            type: "pie",
            center: ["25%", "50%"],
            radius: ["50%", "60%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center",
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#00FFFF", "#00FF00"];
                  return colorList[params.dataIndex];
                }
              }
            },
            data: data
          }
        ],
        color: ["#5BD88B", "#FFCE5D"]
      };
      return option;
    },
    // 设置options-----3
    setOption_three(x, y) {
      var option = {
        xAxis: {
          type: "category",
          data: ["9号", "10号", "11号", "12号", "13号", "14号", "15号"],
          show: true,
          splitNumber: 7,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: "#666666"
          }
        },
        yAxis: {
          type: "value",
          show: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: "#666666"
          },
          // max:200,
          splitNumber: 5
        },
        legend: {
          orient: "horizontal",
          icon: "rect",
          top: 0,
          itemGap: 25,
          right: 0,
          itemWidth: 12,
          itemHeight: 2,
          default: false,
          data: ["光源", "集中器"],
          textStyle: {
            color: "#333333"
          }
        },
        grid: {
          left: "10%",
          top: 25,
          right: 10,
          bottom: 20
        },
        series: [
          {
            name: "光源",
            data: y,
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: "rgba(255, 188, 88)",
                shadowBlur: 15,
                shadowOffsetY: 20
              }
            }
          },
          {
            name: "集中器",
            data: [7, 5, 1, 3, 8, 2, 6, 5],
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: "rgba(167, 109, 227)",
                shadowBlur: 15,
                shadowOffsetY: 20
              }
            }
          }
        ],
        color: ["#FFBC58", "#9D5CE0"]
      };
      return option;
    },
    // 设置options-----4
    setOption_four(x, y) {
      var option = {
        xAxis: {
          type: "category",
          data: x,
          show: true,
          splitNumber: x.length,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: "#666666"
          }
        },
        yAxis: {
          type: "value",
          show: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: "#666666",
            formatter: function(value, index) {
              let text = `${value}%`;
              if (index === 0) {
                text = `${value}`;
              }
              return text;
            }
          },
          max: 100,
          splitNumber: 2
        },
        legend: {
          orient: "horizontal",
          icon: "rect",
          top: 0,
          itemGap: 25,
          right: 0,
          itemWidth: 12,
          itemHeight: 2,
          default: false,
          data: ["亮灯率"],
          textStyle: {
            color: "#333333"
          }
        },
        grid: {
          left: "15%",
          top: 25,
          right: 0,
          bottom: 20
        },
        series: [
          {
            name: "亮灯率",
            data: y,
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: "rgba(43, 201, 65)",
                shadowBlur: 15,
                shadowOffsetY: 20
              }
            }
          }
        ],
        color: ["#2BC941"]
      };
      return option;
    },
    //=========WebSocket接口==============
    WebSocket_init() {
      if (typeof WebSocket === "undefined") {
        alert("您的浏览器不支持socket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.WebSocket_path);
        // 监听socket连接
        this.socket.onopen = this.WebSocket_open;
        // 监听socket错误信息
        this.socket.onerror = this.WebSocket_error;
        // 监听socket消息
        this.socket.onmessage = this.WebSocket_getMessage;
        // 关闭
        this.socket.onclose = this.WebSocket_close;
      }
    },
    WebSocket_open() {
      // console.log("socket连接成功");
    },
    WebSocket_error() {
      console.log("连接错误");
    },
    WebSocket_getMessage(msg) {
      let {
        alarmStatistics,
        lampMonitor,
        concentMonitor,
        lightRateStatistics
      } = JSON.parse(msg.data);
      // this.lampMonitor = lampMonitor;
      // this.concentMonitor = concentMonitor;
      // this.alarmStatistics = alarmStatistics;
      // this.lightRateStatistics = lightRateStatistics;

      let echarts_data1 = [];
      if (lampMonitor && lampMonitor.monitorStateList.length != 0) {
        lampMonitor.monitorStateList.forEach((item, i) => {
          // 设置灯源warning
          if (
            (item.workState == 0 && item.amount != 0) ||
            (item.workState == 2 && item.amount != 0)
          ) {
            this.lightLamp_warning = true;
          } else {
            this.lightLamp_warning = false;
          }
          let obj = {};
          obj.value = item.amount;
          let text = "";
          if (item.workState == 1) {
            text = "正常";
          } else if (item.workState == 0) {
            text = "离线";
          } else {
            text = "警告";
          }
          obj.name = text;
          echarts_data1.push(obj);
        });
      }
      let echarts_data2 = [];
      if (concentMonitor && concentMonitor.monitorStateList.length != 0) {
        concentMonitor.monitorStateList.forEach((item, i) => {
          // 设置集中器warning
          if (item.workState == 0 && item.amount != 0) {
            this.concentMonitor_warning = true;
          } else {
            this.concentMonitor_warning = false;
          }
          let obj = {};
          obj.value = item.amount;
          let text = "";
          if (item.workState == 1) {
            text = "正常";
          } else if (item.workState == 0) {
            text = "离线";
          }
          obj.name = text;
          echarts_data2.push(obj);
        });
      }
      if (lampMonitor) {
        let option_1 = this.setOption_one(
          echarts_data1,
          lampMonitor.totalAmount
        );
        this.initEcharts("light_source", option_1);
      }
      if (concentMonitor) {
        let option_2 = this.setOption_two(
          echarts_data2,
          concentMonitor.totalAmount
        );
        this.initEcharts("concentrator_echarts", option_2);
      }

      if (
        alarmStatistics &&
        alarmStatistics.xAxisText.length != 0 &&
        alarmStatistics.yAxisValue.length != 0
      ) {
        this.initEcharts(
          "alarmStatistics_echarts",
          this.setOption_three(
            alarmStatistics.xAxisText,
            alarmStatistics.yAxisValue
          )
        );
      }
      if (
        lightRateStatistics &&
        lightRateStatistics.xAxisText.length != 0 &&
        lightRateStatistics.yAxisValue.length != 0
      ) {
        this.initEcharts(
          "lightRateStatistics_echarts",
          this.setOption_four(
            lightRateStatistics.xAxisText,
            lightRateStatistics.yAxisValue
          )
        );
      }
    },
    WebSocket_send() {
      // this.socket.send(params);
    },
    WebSocket_close() {
      console.log("socket已经关闭");
    },
    //==========WebSocket接口结束===============

    // =============谷歌地图==========================
    // 初始化地图
    initGGMap() {
      this.GG_map = new google.maps.Map(document.getElementById("gg_map"), {
        center: { lng: 113.932399, lat: 22.540131 },
        zoom: this.shrinkZoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        clickableIcons: false,
        minZoom: this.minZoom
      });
      // this.GG_map.addListener("click", e => {
      //   this.gg_addMarker(e.latLng);
      // });

      // setTimeout(() => {
      //   // 设置marker
      //   this.setMapOnAll(this.GG_map);

      //   this.set_label_overlay();
      // }, 500);
      // setTimeout(() => {
      //   this.GG_map.addListener("zoom_changed", () => {
      //     this.GG_zoomend(this.GG_map.getZoom());
      //   });
      // }, 600);
    },
    // 地图缩放
    GG_zoomend(zoom) {
      if (zoom <= this.shrinkZoom) {
        this.clearMarkers(); // 清除
        this.set_label_overlay(); // 仅集中器(数字)
      } else {
        this.clearMarkers(); // 清除
        this.setMapOnAll(this.GG_map);
        this.GG_marker_number.forEach(item => {
          // 清除数字集中器
          item.setMap(null);
        });
      }
    },
    // 初始化谷歌地图marker
    init_GG_marker() {
      if (this.concentrator_list.length > 1) {
        this.GG_map.setZoom(this.shrinkZoom);
        this.GG_map.setCenter({
          lat: this.concentrator_list[0].lat,
          lng: this.concentrator_list[0].lng
        });
        this.set_label_overlay();
      } else if (this.concentrator_list.length == 1) {
        this.setMapOnAll(this.GG_map);
        this.GG_map.setZoom(this.maxZoom);
        this.GG_map.setCenter({
          lat: this.concentrator_list[0].lat,
          lng: this.concentrator_list[0].lng
        });
      }
      this.GG_map.addListener("zoom_changed", () => {
        this.GG_zoomend(this.GG_map.getZoom());
      });
    },
    // 初始化地图中心和缩放比例
    centerAndZoom(center, zoom) {
      this.GG_map.setZoom(zoom);
      this.GG_map.setCenter(center);
    },
    // 循环设置所有marker
    setMapOnAll(map) {
      this.set_GG_concentrator_marker();
      this.set_GG_street_lamp_marker();
      this.concentrator_Marker.forEach(item => {
        item.setMap(map);
      });
      this.lamp_Marker.forEach(item => {
        item.setMap(map);
      });
    },
    // 清除所有marker
    clearMarkers() {
      this.setMapOnAll(null);
      this.concentrator_Marker = [];
      this.lamp_Marker = [];
    },
    // 显示所有marker
    showMarkers() {
      this.setMapOnAll(this.GG_map);
    },
    // 创建集中器marker
    set_GG_concentrator_marker() {
      if (!this.concentrator_list || this.concentrator_list.length == 0) {
        return;
      }
      this.concentrator_list.forEach(item => {
        let marker = this.gg_addMarker(
          { lng: item.lng, lat: item.lat },
          this.concentrator_icon,
          item.concentId
        );
        marker.setZIndex(1);
        marker.addListener("click", () => {
          this.concentratorClick(
            { lat: item.lat, lng: item.lng },
            item.concentId
          );
        });
        this.concentrator_Marker.push(marker);
      });
    },
    // 创建灯杆marker
    set_GG_street_lamp_marker() {
      if (!this.street_lamp_list || this.street_lamp_list.length == 0) {
        return;
      }
      this.street_lamp_list.forEach(item => {
        let icon_color = item.workState
          ? this.street_lamp_icon
          : this.street_lamp_icon_red;
        let point = { lng: item.lng, lat: item.lat };
        let marker = this.gg_addMarker(point, icon_color, item.poleId);

        marker.addListener("click", e => {
          this.lamp_MarkerClick(point, item.poleId);
        });
        this.lamp_Marker.push(marker);
      });
    },

    // 新增marker
    gg_addMarker(point, icon, id) {
      var marker = new google.maps.Marker({
        position: point,
        map: this.GG_map,
        icon: icon,
        id: id,
        title: "1234"
      });
      return marker;
    },
    // 设置谷歌地图Overlay
    init_GG_Overlay(center, width, color, num, map, id) {
      // 定义自定义覆盖物的构造函数

      function SquareOverlay(center, width, color, num, map, id) {
        this.map_ = map;
        this._center = new google.maps.LatLng(center);
        this._length = width;
        this._color = color;
        this._num = num;
        this._id = id;
      }
      // 继承API的BMap.Overlay
      SquareOverlay.prototype = new google.maps.OverlayView();
      // 实现初始化方法
      SquareOverlay.prototype.onAdd = function() {
        // 创建div元素，作为自定义覆盖物的容器
        var div = document.createElement("div");
        var span = document.createElement("span");
        var text = `<div id="gg_overlay_event${this._id}" style="border:4px solid #fff;cursor: pointer;width: ${this._length}px;height: ${this._length}px;background-color: ${this._color};text-align: center;line-height: ${this._length}px;box-shadow:0px 0px 4px 0px rgba(0,0,0,0.1) ;border-radius: 50%;">
        ${this._num}
    </div>`;
        // span.innerText = this._num;
        // div.appendChild(span);
        div.innerHTML = text;
        var map = this.map_;

        var center = this._center;
        div.onclick = function(e) {
          e.stopPropagation();
          map.setZoom(19);
          map.setCenter(center);
        };
        div.style.position = "absolute";
        // 保存div实例
        this._div = div;
        // 将div添加到覆盖物容器中
        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);

        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        // return div;
      };
      // 实现绘制方法
      SquareOverlay.prototype.draw = function() {
        // 根据地理坐标转换为像素坐标，并设置给容器
        var overlayProjection = this.getProjection();
        var latLng = overlayProjection.fromLatLngToDivPixel(this._center);
        // var size = new google.maps.Size(-26, -42); // 修正坐标的值;
        var size = new google.maps.Size(-this._length, -this._length); // 修正坐标的值;
        this._div.style.left = latLng.x - this._length / 2 + "px";
        this._div.style.top = latLng.y - this._length / 2 + "px";
      };
      // 当设置 悬浮层的 setMap(null) 会自动调用
      SquareOverlay.prototype.onRemove = function() {
        this._div.parentNode.removeChild(this._div);
        this._div = null;
      };
      // 添加自定义方法
      SquareOverlay.prototype.toggle = function() {
        if (this._div) {
          if (this._div.style.display == "") {
            this.onRemove();
          } else {
            this.draw();
          }
        }
      };
      var mySquare = new SquareOverlay(center, width, color, num, map, id);
      // this.GG_map.setMap(mySquare);

      mySquare.setMap(this.GG_map);
      // this.GG_map.addListener(mySquare,"click",()=>{
      //   console.log('====');

      // })
      return mySquare;
    },
    // =======谷歌地图编辑=========
    // 准备移动集中器
    GG_moveConcentrator(row) {
      this.clearMarkers();
      this.concentrator_Marker = [];
      this.lamp_Marker = [];

      // 设置集中器的marker
      this.concentrator_list.forEach(item => {
        if (item.concentId != row.concentId) {
          let point = { lng: item.lng, lat: item.lat };
          let marker = new google.maps.Marker({
            position: point,
            map: this.GG_map,
            icon: this.concentrator_icon,
            id: item.concentId
          });
          marker.addListener("click", e => {
            this.concentratorClick(point, item.concentId);
          });
          this.concentrator_Marker.push(marker);
        } else {
          let point = { lng: item.lng, lat: item.lat };
          let marker = new google.maps.Marker({
            position: { lng: item.lng, lat: item.lat },
            map: this.GG_map,
            icon: this.concentrator_icon,
            ZIndex: 1,
            draggable: true,
            animation: google.maps.Animation.BOUNCE,
            id: item.concentId
          });
          marker.addListener("dragend", e => {
            this.concentrator_dragend(e, row.concentId);
          });
          marker.addListener("click", e => {
            this.concentratorClick(point, item.concentId);
          });
          setTimeout(() => {
            marker.setAnimation(null);
          }, 3000);
          this.concentrator_Marker.push(marker);
        }
        // marker.addListener("click", () => {
        //   this.addInfoWindow(
        //     item.concentName,
        //     "集中器编号: " +
        //       item.addressField +
        //       " ; 灯杆数量: " +
        //       item.poleAmount +
        //       " ; 灯源数量: " +
        //       item.lampAmount +
        //       " ; 地址: " +
        //       item.address,
        //     marker
        //   );
        // });
      });

      // 设置路灯的marker
      this.ctrCodeOptions.forEach(item2 => {
        if (item2.concentId != row.concentId) {
          if (item2.poleList && item2.poleList.length != 0) {
            item2.poleList.forEach(item => {
              let icon_color = item.workState
                ? this.street_lamp_icon
                : this.street_lamp_icon_red;
              let marker = new google.maps.Marker({
                position: { lng: item.lng, lat: item.lat },
                map: this.GG_map,
                icon: icon_color,
                id: item.poleId
              });
              this.lamp_Marker.push(marker);
            });
          }
        } else {
          // 移动光源
          if (item2.poleList && item2.poleList.length != 0) {
            item2.poleList.forEach(item => {
              let marker = new google.maps.Marker({
                position: { lng: item.lng, lat: item.lat },
                map: this.GG_map,
                icon: this.light_lamp_icon,
                ZIndex: 1,
                draggable: true,
                animation: google.maps.Animation.BOUNCE,
                id: item.poleId
              });
              marker.addListener("dragend", e => {
                this.street_lamp_dragend(e, item.poleId);
              });

              setTimeout(() => {
                marker.setAnimation(null);
              }, 3000);
              this.lamp_Marker.push(marker);
              // marker.addEventListener("click", () => {
              //   this.addInfoWindow(
              //     "灯杆:" + item.poleCode,
              //     "灯杆编号: " +
              //       item.poleCode +
              //       " ; 灯源数量: " +
              //       item.lampList.length +
              //       " ; 地址: " +
              //       item.address,
              //     marker
              //   );
              // });
            });
          }
        }
      });

      // item.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      // setTimeout(() => {
      //   item.marker.setAnimation();
      // }, 3000);
      // ===========设置标注的信息窗口
      // var opts = {
      //   width: 20, // 信息窗口宽度
      //   height: 12, // 信息窗口高度
      //   // title: "海底捞王府井店", // 信息窗口标题
      //   offset: new BMap.Size(6, -23)
      // };
      // var infoWindow = new BMap.InfoWindow("Move This", opts); // 创建信息窗口对象
      // this._map.openInfoWindow(infoWindow, item.marker.getPosition()); //开启信息窗口
      // item.marker.addEventListener("dragend", e =>
      //   this.concentrator_dragend(e, row.concentId)
      // );
      // row.poleList.forEach(item2=>{

      // })
      // }, 1000);
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
    }
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  },
  watch: {}
};
</script>
<style lang='less' >
.selectCard {
  .el-input__inner {
    border: 0px;
  }
}
@import "../../assets/less/index/index.less";
</style>