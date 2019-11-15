<template>
  <div class="index_content">
    <div v-loading="map_loading" class="bd_map" id="bd_map"></div>
    <div class="selectCard">
      <!-- 道路 -->
      <el-cascader
        v-model="selected.road"
        :options="districtOptions"
        :props="{value:'optValue',label:'optText', expandTrigger: 'hover',checkStrictly: true }"
        @change="roadChange"
      ></el-cascader>

      <span class="select_interval"></span>
      <!-- 照明分组 -->
      <el-cascader
        v-model="selected.luminGroup"
        :options="luminGroupOptions"
        :props="{ value:'optValue',label:'optText', expandTrigger: 'hover',checkStrictly: true  }"
      ></el-cascader>

      <span class="select_interval"></span>
      <!-- <el-select
        v-model="selected.ctrCode"
        placeholder="请选择集中器"
        popper-class="select1"
        style="width:30%"
        size="small"
      >
        <el-option
          v-for="item in ctrCodeOptions"
          :key="item.id"
          :label="item.optText"
          :value="item.optValue"
        ></el-option>
      </el-select>-->
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
          max-height="240"
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
                    <span>{{item.poleCode}}</span>
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
    <el-card class="dialog_card first_card" v-if="showDialog_card">
      <div class="clearfix dialog_card_header">
        <div class="header_left">
          <img src="../../assets/img/index/tishi(1).png" alt class="header_left_icon" />
          <span class="header_left_span_Num">20330D08BF08</span>
          <span class="header_left_span_warning">警告</span>
          <img
            src="../../assets/img/index/tishi(3).png"
            alt
            class="header_left_icon header_left_icon_warning"
          />
          <span class="header_left_span_success">正常</span>
        </div>
        <div class="header_right">
          <img src="../../assets/img/index/shuaxin.png" alt class="refresh_icon" @click="refresh" />
          <span class="header_right_time">2019-09-04 10:15:55</span>
        </div>
      </div>
      <!-- 弹框表格1 -->
      <el-table :data="[]" style="width: 100%" header-cell-class-name="table_header_color">
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
      <el-table :data="[]" style="width: 100%" header-cell-class-name="table_header_color">
        <el-table-column prop="date" label="灯杆"></el-table-column>
        <el-table-column prop="name" label="区域"></el-table-column>
        <el-table-column prop="address" label="道路"></el-table-column>
        <el-table-column prop="address" label="照明类型"></el-table-column>
        <el-table-column prop="address" label="集中器"></el-table-column>
        <el-table-column prop="address" label="经度"></el-table-column>
        <el-table-column prop="address" label="纬度"></el-table-column>
      </el-table>
      <!-- 弹框表格3 -->
      <el-table :data="[]" style="width: 100%" header-cell-class-name="table_header_color">
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
          width="32"
        ></el-switch>
        <img src="../../assets/img/index/tishi.png" alt class="light_controller_icon" />
        <span>调光值：</span>
        <div class="intensity_control">
          <div class="slider_inner_line"></div>
          <div class="slider_out_line" :style="{width:30+'%'}">
            <el-slider v-model="lightController.intensityControl" :max="30"></el-slider>
          </div>
        </div>
        <div class="intensity_inputnumber">
          <el-input-number
            v-model="lightController.intensityControl"
            controls-position="right"
            @change="lightChange"
            :min="1"
            :max="30"
          ></el-input-number>
        </div>
        <span>%</span>
      </div>
      <!-- 按钮 -->
      <div class="button_bottom_box">
        <button class="button_bottom bottom_cancel" @click="showDialog_card=false">取消</button>
        <button class="button_bottom bottom_submit">确认</button>
      </div>
    </el-card>
    <!-- 集中器Dialog2 -->
    <el-dialog
      :visible.sync="concentrator_dialogVisible"
      width="30%"
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
            <img src="../../assets/img/index/shuaxin.png" alt class="refresh_icon" @click="refresh" />
            <span class="header_right_time">{{concentrator_dialog_item.createTime}}</span>
          </div>
        </div>
         <!-- 弹框表格1 -->
        <el-table
          :data="concentrator_dialog_item"
          style="width: 100%"
          header-cell-class-name="table_header_color"
        >
          <el-table-column label="区域">{{concentrator_dialog_item.road}}</el-table-column>
          <el-table-column label="道路">{{concentrator_dialog_item.road}}</el-table-column>
          <el-table-column label="集中器编号">{{concentrator_dialog_item.addressField}}</el-table-column>
          <el-table-column label="SIM卡号">{{concentrator_dialog_item.simcard}}</el-table-column>
        </el-table>
        <!-- 弹框表格2 -->
        <el-table
          :data="concentrator_dialog_item"
          style="width: 100%"
          header-cell-class-name="table_header_color"
        >
          <el-table-column label="纬度">{{concentrator_dialog_item.lng}}</el-table-column>
          <el-table-column label="经度">{{concentrator_dialog_item.lat}}</el-table-column>
          <el-table-column label="地址">{{concentrator_dialog_item.address}}</el-table-column>
          <el-table-column label="备注">{{concentrator_dialog_item.remark}}</el-table-column>
        </el-table>

        <!-- 按钮 -->
        <div class="button_bottom_box">
          <button class="button_bottom bottom_submit" @click="concentrator_dialogVisible=false">关闭</button>
          <!-- <el-button  type="primary" @click="dialogVisible = false">关 闭</el-button> -->
        </div>
      </div>
    </el-dialog>
    <div class="mengban" v-if="mengban">
      
      <!-- 路灯 -->
      <el-card class="dialog_card street_lamp_card" v-if="street_lamp_Dialog_card">
        <div class="clearfix dialog_card_header">
          <div class="header_left"></div>
          <div class="header_right">
            <img src="../../assets/img/index/shuaxin.png" alt class="refresh_icon" @click="refresh" />
            <span class="header_right_time">2019-09-04 10:15:55</span>
          </div>
        </div>
        <!-- 弹框表格1 -->
        <el-table
          :data="[1,1,1,,1,1,1,1,1,1]"
          style="width: 100%"
          height="220"
          header-cell-class-name="table_header_color"
        >
          <el-table-column prop="date" label="状态"></el-table-column>
          <el-table-column prop="name" label="控制器编号"></el-table-column>
          <el-table-column prop="address" label="灯杆编号"></el-table-column>
          <el-table-column prop="address" label="集中器名称"></el-table-column>
          <el-table-column prop="address" label="操作">
            <template>
              <el-button size="mini" class="el-icon-edit-outline"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 按钮 -->
        <div class="button_bottom_box">
          <button class="button_bottom bottom_submit">关闭</button>
        </div>
      </el-card>
    </div>
    <!-- 右下角warning -->
    <div class="warning_right_bottom">
      <div class="warning_box">
        <img src="../../assets/img/index/xianshi_jinggaotianchong.png" alt />
        <span>集中器警告</span>
      </div>
      <div class="warning_box" v-if="false">
        <img src="../../assets/img/index/tishi.png" alt />
        <span>集中器警告</span>
      </div>
    </div>
  </div>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import BmMarker from "vue-baidu-map/components/overlays/Marker"; //点标注
import BMap from "BMap";
import echarts from "echarts";
import old_lamp_icon from "../../assets/img/index/dingwei.png";
import light_lamp_icon from "../../assets/img/index/tishi@2x(1).png";
import street_lamp_icon from "../../assets/img/index/ludeng-green.png";
import street_lamp_icon_red from "../../assets/img/index/ludeng-red.png";
import concentrator_icon from "../../assets/img/index/集中器.png";
import shangsanjiao from "../../assets/img/index/三角形(1).png";
import xiasanjiao from "../../assets/img/index/三角形@2x(2).png";
import {
  select_road,
  luminGroup,
  map_search,
  edit_concentrator,
  merker_pole,
  merker_pole_array,
  get_concentrator_byid
} from "../../api/http/index.js";
import MyOverlay from "./MyOverlay";
export default {
  name: "",
  props: [""],
  data() {
    return {
      _map: "",
      center: { lng: 114.025, lat: 22.546 },
      zoom: 15,
      showMap: true,
      concentrator_Marker: [], // 集中器marker
      lamp_Marker: [], // 灯杆marker
      street_lamp_icon: street_lamp_icon, // 路灯icon绿
      street_lamp_icon_red: street_lamp_icon_red, // 路灯icon红
      concentrator_icon: concentrator_icon, // 集中器icon
      old_lamp_icon: old_lamp_icon, // 老路灯图标
      light_lamp_icon: light_lamp_icon, // 老路灯图标
      street_lamp_list: [], // 所有路灯
      concentrator_list: [], // 所有集中器
      edit_concentrator_marker_obj: {}, // 编辑后的集中器marker记录
      edit_lamp_marker_array: [], // 编辑后的集中器marker记录
      new_marker_for_concentrator: {}, // 新标记的集中器(axios参数)
      new_marker_concentrator: "", // 新标记的集中器marker
      new_marker_for_lamp: [], // 新标记的路灯marker数组
      new_marker_fn: [], // 新标记的路灯map点击事件数组
      new_marker_for_lamp_array: [], // 新标记的路灯数组(axios参数)
      dragging_status: true,
      map_loading: false,
      currentRow: "", //当前选中行
      selected: {
        road: [""], // 地区/道路
        luminGroup: [""], // 照明分组
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
        },
        {
          id: 5,
          x: 114.036,
          y: 22.557,
          children: [
            {
              id: 2,
              x: 114.02713220534451,
              y: 22.551979925649353,
              name: "坐标1"
            },
            {
              id: 3,
              x: 114.02568881435818,
              y: 22.546365799135364,
              name: "坐标2"
            },
            {
              id: 4,
              x: 114.03850983406092,
              y: 22.545833105103622,
              name: "坐标3"
            },
            {
              id: 5,
              x: 114.04521763573631,
              y: 22.559239054111323,
              name: "坐标4"
            },
            {
              id: 6,
              x: 114.07521763573631,
              y: 22.559239054111323,
              name: "坐标4"
            }
          ]
        }
      ],
      // =======左下角集中器列表=========
      ctrCodeTableList: [], // 左下角集中器列表
      edit_status: false, // 编辑状态
      lightController: {
        lightStatus: true,
        intensityControl: 5
      },
      showDialog_card: false,
      mengban: false,
      // ========集中器弹框==========
      concentrator_dialogVisible: false,
      concentrator_dialog_item: [], // 当前集中器对象
      concentrator_Dialog_card: false,
      street_lamp_Dialog_card: false,
      fn: "",
      lampFn: "",
      cursor: "",

      // =====WebSocket=======
      WebSocket_path: "ws://47.106.141.162:8888/scoket/webServer/123",
      socket: "",
      // ========echarts===========
      // 1
      lampMonitor: {},
      // 2
      concentMonitor: {},
      // 3
      alarmStatistics: {},
      // 4
      lightRateStatistics: {}
    };
  },

  components: {
    // BaiduMap,
    // BmMarker
    MyOverlay
  },

  computed: {},

  beforeMount() {},
  created() {},
  mounted() {
    this.getRoad(); // 道路
    this.getLuminGroup(); // 灯组
    this.initMap(); // 初始化地图
    this.mapSearch();
    this.WebSocket_init();
  },

  methods: {
    // 页面加载时获取道路下拉框内容
    async getRoad() {
      let res = await select_road();
      if (res.data.success) {
        this.districtOptions = res.data.content;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 页面加载时获取照明分组
    async getLuminGroup() {
      let from = new FormData();
      from.append(
        "roadOptValue",
        this.selected.road[this.selected.road.length - 1]
      );
      let res = await luminGroup({ data: from });
      if (res.data.success) {
        this.luminGroupOptions = res.data.content;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    changeMap() {
      this.showMap = !this.showMap;
    },
    // 搜索并设置marker
    async mapSearch(refresh = true) {
      let from = new FormData();
      from.append("road", this.selected.road[this.selected.road.length - 1]);
      from.append(
        "luminGroup",
        this.selected.luminGroup[this.selected.luminGroup.length - 1]
      );
      from.append("ctrCode", this.selected.ctrCode);
      let res = await map_search({ data: from });
      if (res.data.success) {
        this.ctrCodeOptions = JSON.parse(JSON.stringify(res.data.content));
        this.ctrCodeTableList = JSON.parse(JSON.stringify(res.data.content));
        this.getMarker();
        this.setMarker(refresh);
        this.map_loading = false;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 仅搜索marker
    async onlySearch() {
      let from = new FormData();
      from.append("road", this.selected.road[this.selected.road.length - 1]);
      from.append(
        "luminGroup",
        this.selected.luminGroup[this.selected.luminGroup.length - 1]
      );
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
    },
    // 刷新弹框表单
    refresh(id) {},
    // 亮度调节
    lightChange() {},
    //=========MAP事件===============
    // 初始化地图
    initMap() {
      this._map = new BMap.Map("bd_map", { enableMapClick: false });
      var point = new BMap.Point(113.93237028712, 22.53905617781);
      this._map.centerAndZoom(point, 18);
      this._map.enableScrollWheelZoom(true);
      this._map.addEventListener("zoomend", this.zoomend);
      this.cursor = this._map.getDefaultCursor();
    },
    // 地图缩放
    zoomend(e) {
      if (e.target.getZoom() <= 14) {
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
        this.lamp_Marker.push(marker);
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
        let center = new BMap.Point(item3.lng, item3.lat);
        this.initOverlay(center, width, color, item3.lampAmount);
      });
    },
    // =====初始化覆盖物====
    initOverlay(center, width, color, num) {
      // 定义自定义覆盖物的构造函数
      function SquareOverlay(center, length, color, num) {
        this._center = center;
        this._length = length;
        this._color = color;
        this._num = num;
      }
      // 继承API的BMap.Overlay
      SquareOverlay.prototype = new BMap.Overlay();
      // 实现初始化方法
      SquareOverlay.prototype.initialize = function(map) {
        // 保存map对象实例
        this._map = map;
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
          this._map.centerAndZoom(this._center, 18);
          this.toggle();
        });
        // 将div添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(div);
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
      var mySquare = new SquareOverlay(center, width, color, num);
      this._map.addOverlay(mySquare);
    },
    // 集中器被点击
    async concentratorClick(point, id) {
      this._map.centerAndZoom(point, 18);

      let from = new FormData();
      from.append("id", id);
      let res = await get_concentrator_byid({ data: from });
      console.log(res);
      if (res.data.success) {
        this.concentrator_dialog_item[0] = res.data.content;
        this.concentrator_dialogVisible = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
      
    },

    // ===========左下角集中器列表==============
    // 设置选中行
    handleCurrentChange(val) {
      if (!this.edit_status) {
        this.currentRow = val;
      }
    },
    // 打开编辑功能
    openEdit() {
      this.edit_status = true;
      this._map.removeEventListener("zoomend", this.zoomend);
      this.searchController(this.currentRow);
      this.moveConcentrator(this.currentRow);
    },
    // 取消编辑
    cancelEditAll() {
      this.edit_status = false;
      this.edit_concentrator_marker_arr = {};
      this.edit_concentrator_marker_obj = {};
      this.edit_lamp_marker_array = [];
      this.new_marker_for_concentrator = {};
      this.new_marker_concentrator = "";
      this.new_marker_for_lamp = [];
      this.new_marker_for_lamp_array = [];
      // setTimeout(() => {
      this._map.clearOverlays();
      this.mapSearch(false);
      // }, 1500);
      this._map.addEventListener("zoomend", this.zoomend);
      this._map.removeEventListener("click", this.fn);
      this._map.removeEventListener("click", this.lampFn);
      this._map.setDefaultCursor(this.cursor);
    },
    // =========修改====路灯===========
    // 路灯被拖拽
    street_lamp_dragend(e, id) {
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
    },
    // =============点击标记路灯==
    // 开始标记路灯
    addNewLamp(id) {
      this._map.removeEventListener("zoomend", this.zoomend);
      this._map.setDefaultCursor("crosshair");
      this._map.removeEventListener("click", this.lampFn);
      var lampFn = e => {
        this.mapClickAddLamp(e, id);
      };
      this.lampFn = lampFn;
      this._map.addEventListener("click", lampFn);
    },
    // 点击地图标记路灯
    mapClickAddLamp(e, id) {
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
    },
    // 保存标记后的路灯
    checkLampPoint(e, id) {
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
    },
    // ========编辑或修改集中器marker====
    // 开始标记集中器
    addConcentrator(id) {
      this._map.removeEventListener("zoomend", this.zoomend);
      this._map.setDefaultCursor("crosshair");
      var fn = e => {
        this.mapClickAddMarker(e, id);
      };
      this.fn = fn;
      this._map.addEventListener("click", fn);
    },
    // 点击地图标记集中器
    mapClickAddMarker(e, id) {
      let marker = new BMap.Marker(e.point);
      let icon = new BMap.Icon(this.concentrator_icon, new BMap.Size(24, 23), {
        anchor: new BMap.Size(12, 23)
      });
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
    },
    // 保存标记后的集中器
    checkConcentratorPoint(e, id) {
      let { point } = e;
      this.edit_concentrator_marker_obj.conId = id;
      this.edit_concentrator_marker_obj.lng = point.lng;
      this.edit_concentrator_marker_obj.lat = point.lat;
    },
    // 集中器被拖拽
    concentrator_dragend(e, id) {
      let { type, target, pixel, point } = e;
      this.edit_concentrator_marker_obj.conId = id;
      this.edit_concentrator_marker_obj.lng = point.lng;
      this.edit_concentrator_marker_obj.lat = point.lat;
    },
    // 点击集中器的编号或者标记
    searchController(row) {
      if (!row.poleList || row.poleList.length == 0) {
        this._map.centerAndZoom(new BMap.Point(row.lng, row.lat), 19);
        return false;
      } else {
        this._map.centerAndZoom(new BMap.Point(row.lng, row.lat), 19);
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
            this.cancelEditAll();
          } else {
            this.$message.error(res.data.msgCode);
            this.cancelEditAll();
          }
        });
      } else {
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
          this._map.addOverlay(marker);
          marker.setAnimation(BMAP_ANIMATION_BOUNCE);
          setTimeout(() => {
            marker.setAnimation();
          }, 3000);
        }
        marker.addEventListener("click", () => {
          this.addInfoWindow(
            item.concentName,
            "集中器编号: " +
              item.addressField +
              " ; 灯杆数量: " +
              item.poleAmount +
              " ; 灯源数量: " +
              item.lampAmount +
              " ; 地址: " +
              item.address,
            marker
          );
        });
        // this._map.addOverlay(marker);
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
    // 标记灯杆
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
    // 设置options-----3
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
      console.log("socket连接成功");
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
      console.log(JSON.parse(msg.data));
      // this.lampMonitor = lampMonitor;
      // this.concentMonitor = concentMonitor;
      // this.alarmStatistics = alarmStatistics;
      // this.lightRateStatistics = lightRateStatistics;
      let echarts_data1 = [];
      if (lampMonitor && lampMonitor.monitorStateList.length != 0) {
        lampMonitor.monitorStateList.forEach((item, i) => {
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
      let option_1 = this.setOption_one(echarts_data1, lampMonitor.totalAmount);
      let option_2 = this.setOption_two(
        echarts_data2,
        concentMonitor.totalAmount
      );
      this.initEcharts("light_source", option_1);
      this.initEcharts("concentrator_echarts", option_2);
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
    }
    //==========WebSocket接口结束===============
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = this.close;
  },
  watch: {}
};
</script>
<style lang='less' >
@import "../../assets/less/index/index.less";
.el-input__inner {
  border: none !important;
}
</style>