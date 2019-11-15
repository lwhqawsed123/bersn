<template>
  <div class="index_content">
    <el-button @click="changeMap" style="position: absolute;left:300px;z-index:999">Check</el-button>
    <baidu-map
      v-if="showMap"
      class="bd_map"
      :center="center"
      :zoom="zoom"
      :min-zoom="10"
      :map-click="false"
      @ready="MapReady"
      ak="b0hqKLX0sjyi9RtYkpAZQu9yGP73unL7"
      scroll-wheel-zoom
      @click="getLocationPoint"
      @zoomend="zoomend"
    >
      <!-- <bm-view style="width: 100%; height:100px; flex: 1"></bm-view> -->
      <!-- 路灯 -->
      <!-- <bm-marker
        v-for="(item,index) in street_lamp_zoom"
        :key="index"
        :position="{lng:item.lng,lat:item.lat}"
        :dragging="item.canMove"
        :title="'灯杆id: '+item.poleCode"
        @dragend="street_lamp_dragend($event,item.poleId)"
        :icon="{url: street_lamp_icon, size: {width: 45, height: 46}}"
        :animation="item.poleId==24?'BMAP_ANIMATION_BOUNCE':''"
      ></bm-marker> -->
      <!-- 集中器 -->
      <!-- <bm-marker
        v-for="(item1,index1) in concentrator_list_zoom"
        :key="index1+'123'"
        :position="{lng:item1.lng,lat:item1.lat}"
        :dragging="item1.canMove"
        :title="'集中器id: '+item1.addressField+'; 道路: '+item1.address"
        @dragend="concentrator_dragend"
        :icon="{url: concentrator_icon, size: {width: 24, height: 23}}"
      ></bm-marker> -->
      <!-- 缩小地图显示数量 -->
      <!-- <div v-if="!street_lamp_icon_status">
        <bm-label
          :content="item.lampAmount+''"
          v-for="(item,index) in concentrator_list"
          :key="index+'111'"
          :position="{lng:item.lng,lat:item.lat}"
          :labelStyle="label_style"
          @click="concentratorClick(item)"
        />
      </div> -->
     
    </baidu-map>
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
          <div @click="editConcentrator">
            <span class="echarts_box_title_edit">{{edit_status?'保存':'编辑'}}</span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <!-- table -->
        <el-table
          :data="ctrCodeTableList"
          width="100%"
          :header-cell-style="{'background-color':'#F0F0F0'}"
          max-height="240"
        >
          <el-table-column label="集中器" width prop="addressField">
            <template slot-scope="scope">
              <span class="concentrator_code_icon" style="background:rgba(51,195,96,1)"></span>
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
                  <span>灯杆</span>
                  <span class>
                    <span>{{item.poleCode}}</span>
                    <span v-if="edit_status" class="controller_biaoji">标记</span>
                  </span>
                </div>
                <div
                  v-for="item2 in item.lampList"
                  :key="item2.lampId"
                  class="inside_ligth illuminant_list"
                >
                  <span class="concentrator_code_icon" style="background:rgba(51,195,96,1)"></span>
                  <span>{{item2.termUid}}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="控制器编号" width align="right">
            <template slot-scope="scope">
              <span v-if="edit_status" class="controller_biaoji" @click="moveConcentrator(scope.row.concentId)">标记</span>
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
        <div class="echarts_content" id="echarts"></div>
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
      </el-card>
    </div>
    <!-- Dialog -->
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
    <!-- Dialog2 -->
    <div class="mengban" v-if="mengban">
      <!-- 集中器 -->
      <el-card class="dialog_card concentrator_card" v-if="concentrator_Dialog_card">
        <div class="clearfix dialog_card_header">
          <div class="header_left">
            <img src="../../assets/img/index/集中器.png" alt class="header_left_icon" />
            <span class="header_left_span_Num">198021</span>
            <span class="header_left_span_success">正常</span>
          </div>
          <div class="header_right">
            <img src="../../assets/img/index/shuaxin.png" alt class="refresh_icon" @click="refresh" />
            <span class="header_right_time">2019-09-04 10:15:55</span>
          </div>
        </div>
        <!-- 弹框表格1 -->
        <el-table :data="[]" style="width: 100%" header-cell-class-name="table_header_color">
          <el-table-column prop="date" label="区域"></el-table-column>
          <el-table-column prop="name" label="道路"></el-table-column>
          <el-table-column prop="address" label="集中器地址"></el-table-column>
          <el-table-column prop="address" label="SIM卡号"></el-table-column>
        </el-table>
        <!-- 弹框表格2 -->
        <el-table :data="[]" style="width: 100%" header-cell-class-name="table_header_color">
          <el-table-column prop="date" label="纬度"></el-table-column>
          <el-table-column prop="name" label="经度"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="address" label="备注"></el-table-column>
        </el-table>

        <!-- 按钮 -->
        <div class="button_bottom_box">
          <button class="button_bottom bottom_submit">关闭</button>
        </div>
      </el-card>
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
import echarts from "echarts";
import street_lamp_icon from "../../assets/img/index/ludeng-green.png";
import concentrator_icon from "../../assets/img/index/集中器.png";
import shangsanjiao from "../../assets/img/index/三角形(1).png";
import xiasanjiao from "../../assets/img/index/三角形@2x(2).png";
import { select_road, luminGroup, map_search } from "../../api/http/index.js";
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
      concentrator_Marker:[],
      street_lamp_icon: street_lamp_icon, // 路灯icon
      street_lamp_icon_status: true, // 图标显示控制
      concentrator_icon: concentrator_icon, // 集中器icon
      street_lamp_list: [], // 所有路灯
      concentrator_list: [], // 所有集中器
      dragging_status: true,
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
      light_source: [
        { value: 335, name: "正常" },
        { value: 310, name: "离线" },
        { value: 234, name: "警告" }
      ],
      lightController: {
        lightStatus: true,
        intensityControl: 5
      },
      showDialog_card: false,
      mengban: false,
      concentrator_Dialog_card: false,
      street_lamp_Dialog_card: false
    };
  },

  components: {
    // BaiduMap,
    // BmMarker
    MyOverlay
  },

  computed: {
    street_lamp_zoom: function() {
      if (this.street_lamp_icon_status) {
        return this.street_lamp_list;
      } else {
        return [];
      }
    },
    concentrator_list_zoom: function() {
      if (this.street_lamp_icon_status) {
        return this.concentrator_list;
      } else {
        return [];
      }
    },
    label_for_concentrator: function() {
      if (!this.street_lamp_icon_status) {
        return this.concentrator_list;
      } else {
        return [];
      }
    }
  },

  beforeMount() {},
  created() {},
  mounted() {
    this.initEcharts(
      [
        { value: 335, name: "正常" },
        { value: 310, name: "离线" },
        { value: 234, name: "警告" }
      ],
      "light_source"
    );
    this.setEchartsPie("echarts", [
      { value: 300, name: "课程报名" },
      { value: 350, name: "服装收费" },
      { value: 250, name: "物料收费" },
      { value: 100, name: "其它收费" }
    ]);
    this.getRoad();
    this.getLuminGroup();
    setTimeout(() => {
      this.mapSearch();
      this.setMarker()
    }, 500);
  },

  methods: {
    // 组件方法
    log123(item) {},
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
    MapReady({ BMap, map }) {
      console.log(map);
      this._map = map;
      // console.log(BMap);
      // this.center.lng = 116.404;
      // this.center.lat = 39.915;
      // BMap.Overlay(BMap.Marker(BMap.Point(114.04321763573631,22.550239054111323)))
      // this.zoom = 15;
    },
    // 双向绑定
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
    },
    async mapSearch() {
      let from = new FormData();
      console.log(
        this.selected.road[this.selected.road.length - 1],
        this.selected.luminGroup[this.selected.luminGroup.length - 1],
        this.selected.ctrCode
      );

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
        console.log(res.data.content);
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
    refresh() {},
    // 亮度调节
    lightChange() {},
    //=========MAP事件===============
    // 页面加载时获取所有marker标记点
    getMarker() {
      let list = [];
      let list1 = [];
      this.ctrCodeOptions.forEach(item => {
        list.push(item);
        if (item.poleList && item.poleList.length != 0) {
          item.poleList.forEach(item2 => {
            list1.push(item2);
          });
        }
      });
      
      
      this.street_lamp_list = list1;

      this.concentrator_list = list;
      

      if (list.length > 1) {
        this._map.centerAndZoom(new BMap.Point(list[0].lng, list[0].lat), 10);
        // this.center.lng = list[0].lng;
        // this.center.lat = list[0].lat;
        // this.zoom = 10;
      } else if (list.length == 1) {
        this._map.centerAndZoom(new BMap.Point(list[0].lng, list[0].lat), 18);

        // this.center = list[0];
        // this.zoom = 18;
      }
    },
    // 生成marker
    setMarker(){
      console.log(this.concentrator_list_zoom);
      
      this.concentrator_list_zoom.forEach(item=>{
        let point = new BMap.Point(item.lng,item.lat)
        let marker = new BMap.Marker(point)
        this.concentrator_Marker.push(marker)
        this._map.addOverlay(marker)
        console.log(123);
        
      })
    },
    // 地图缩放
    zoomend(e) {
      console.log(e.target.getZoom());
      // this.zoom = e.target.getZoom();
      if (e.target.getZoom() <= 14) {
        this.street_lamp_icon_status = false;
      } else {
        this.street_lamp_icon_status = true;
      }
    },

    // 获取点击的坐标
    getLocationPoint(e) {
      // this.center = e.point;
      // this.zoom = 15;
      // alert(e.point.lat + "-" + e.point.lng);
    },
    // 集中器被点击
    concentratorClick(item) {
      this.street_lamp_icon_status = !this.street_lamp_icon_status;
      this._map.centerAndZoom(new BMap.Point(item.lng, item.lat), 15);
      // this.center= item

      // // this.center.lng = item.lng;
      // this.zoom = 15;
    },

    // ===========左下角集中器列表==============
    // 路灯被拖拽
    street_lamp_dragend(e, id) {
      let { type, target, pixel, point } = e;
      console.log(e);
      console.log(id);
    },
    // 集中器被拖拽
    concentrator_dragend(e) {
      console.log(e);

      let { type, target, pixel, point } = e;
    },
    // 点击集中器的标记
    searchController(row) {
      console.log(row);
      let code = "";
      if (!row.poleList || row.poleList.length == 0) {
        this._map.centerAndZoom(new BMap.Point(row.lng, row.lat), 15);
        return false;
      } else {
        row.poleList.forEach(item => {
          if (!code&&item.lampList && item.lampList.length != 0) {
            code = item.lampList[0].termUid;
            return;
          }
        });
        if (code) {
          this.selected = {
            road: [""], // 地区/道路
            luminGroup: [""], // 照明分组
            ctrCode: code // 集中器编号
          };
          this.mapSearch();
        } else {
          this._map.centerAndZoom(new BMap.Point(row.poleList[0].lng, row.poleList[0].lat), 15);
        }
        console.log(code);
        
      }
    },
    // 开启编辑模式
    editConcentrator() {
      this.edit_status = !this.edit_status;
    },
    // 移动集中器
    moveConcentrator(id){
      console.log(id);
      this.concentrator_list_zoom.forEach(item=>{
        if(item.concentId==id){
          item.canMove=true
          // item.animation='BMAP_ANIMATION_BOUNCE'
        }
      })
      // setTimeout(()=>{

      // })
    },
    //===========ECHARTS事件====================
    // echarts图表
    initEcharts(data, elID) {
      var mycharts = echarts.init(document.getElementById(elID));
      let total = 0;
      data.forEach(item => {
        total += item.value;
      });
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
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
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
          formatter: params => {
            let name = "";
            let value = "";
            this.light_source.forEach(item => {
              if (item.name == params) {
                name = item.name;
                value = item.value;
              }
            });
            return `${name}  ${value}`;
          }
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
                  var colorList = ["#00FFFF", "#00FF00", "#FFFF00"];
                  return colorList[params.dataIndex];
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "12",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ],
        color: ["#5BD88B", "#FFCE5D", "#FF5353"]
      };
      mycharts.setOption(option);
    },
    // 参考图表
    setEchartsPie(id, data) {
      let $el = document.getElementById(id);
      let myChart = echarts.init($el);
      let dataName = [];
      let total = 0;
      data.forEach(res => {
        dataName.push(res.name);
        total += parseFloat(res.value) * 10000;
      });
      total = total / 10000;
      let option = {
        title: {
          zlevel: 0,
          text: ["{value|￥" + total + "}", "{name|总金额}"].join("\n"),
          rich: {
            value: {
              color: "#F05820",
              fontSize: 10,
              fontWeight: "normal",
              lineHeight: 40
            },
            name: {
              color: "#909399",
              lineHeight: 20
            }
          },
          top: "center",
          left: "60",
          textAlign: "center",
          textStyle: {
            rich: {
              value: {
                color: "#F05820",
                fontSize: 20,
                fontWeight: "bold",
                lineHeight: 40
              },
              name: {
                color: "#909399",
                lineHeight: 20
              }
            }
          }
        },
        tooltip: {
          // 悬停指示
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right",
          data: dataName,
          itemGap: 30,
          top: "middle",
          align: "left",
          icon: "circle",
          formatter: function(name) {
            return name;
          }
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["60%", "64%"],
            center: ["25%", "50%"],
            stillShowZeroSum: false,
            avoidLabelOverlap: false,
            zlevel: 1,
            label: {
              normal: {
                padding: [30, 30, 30, 30],
                backgroundColor: "#fff",
                show: false,
                position: "center",
                formatter: ["{value|￥{c}}", "{name|{b}}"].join("\n"),
                rich: {
                  value: {
                    color: "#303133",
                    fontSize: 40,
                    fontWeight: "bold",
                    lineHeight: 40
                  },
                  name: {
                    color: "#909399",
                    lineHeight: 20
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            data: data
          }
        ],
        color: ["#410ADF", "#F42850", "#F6A93B", "#7ED321", "#282828"]
      };
      myChart.setOption(option);
    }
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