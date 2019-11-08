<template>
  <div class="index_content">
    <el-button @click="changeMap" style="position: absolute;left:300px;z-index:999">Check</el-button>
    <baidu-map
    v-if="showMap"
      class="bd_map"
      :center="center"
      :zoom="zoom"
      ak="b0hqKLX0sjyi9RtYkpAZQu9yGP73unL7"
      @ready="handler"
      scroll-wheel-zoom
      @click="getLocationPoint"
      @zoomend="zoomend"
    >
      <!-- <bm-view style="width: 100%; height:100px; flex: 1"></bm-view> -->
      <!-- 路灯 -->
      <bm-marker
        v-for="(item,index) in street_lamp_zoom"
        :key="index"
        :position="{lng:item.lng,lat:item.lat}"
        :dragging="true"
        :icon="{url: street_lamp_icon, size: {width: 45, height: 46}}"
      ></bm-marker>
      <!-- 集中器 -->
      <bm-marker
        v-for="(item1,index1) in concentrator_list_zoom"
        :key="index1+'123'"
        :position="{lng:item1.lng,lat:item1.lat}"
        :dragging="true"
        :icon="{url: concentrator_icon, size: {width: 24, height: 23}}"
      ></bm-marker>
      <bm-label content="15" v-for="(item,index) in label_for_concentrator" :key="index" :position="{lng:item.lng,lat:item.lat}" :labelStyle='label_style' title="Hover me" />
    </baidu-map>
    <div class="selectCard">
      <el-select
        v-model="value"
        placeholder="请选择"
        popper-class="select1"
        @change="selectChange"
        style="width:30%"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="select_interval"></span>
      <el-select
        v-model="value2"
        placeholder="请选择"
        popper-class="select1"
        @change="selectChange"
        style="width:30%"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span class="select_interval"></span>
      <el-select
        v-model="value3"
        placeholder="请选择"
        popper-class="select1"
        @change="selectChange"
        style="width:30%"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <button @click="search" class="search_button">
        <img src="../../assets/img/index/el-icon-search.png" alt />
      </button>
    </div>
    <div class="box-card">
      <el-card class="echarts_box" :body-style="{ padding: '0px' }">
        <span class="box_title_red"></span>
        <div class="echarts_box_title">
          <span class="echarts_box_title_name">集中器信息</span>
          <div>
            <span class="echarts_box_title_edit">编辑</span>
            <img src="../../assets/img/index/路径.png" alt class="echarts_box_title_icon" />
          </div>
        </div>
        <!-- table -->
        <el-table
          :data="concentrator"
          width="100%"
          :header-cell-style="{'background-color':'#F0F0F0'}"
        >
          <el-table-column label="集中器" width prop="concentrator_id">
            <template slot-scope="scope">
              <span>{{scope.row.concentrator_id}}</span>
              <img src="../../assets/img/index/三角形(1).png" alt style="margin-left:3px" />
            </template>
          </el-table-column>
          <el-table-column label="控制器编号" width>
            <template slot-scope="scope"></template>
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
  </div>
</template>

<script>
// import BaiduMap from "vue-baidu-map/components/map/Map.vue";
// import BmMarker from "vue-baidu-map/components/overlays/Marker"; //点标注
import echarts from "echarts";
import street_lamp_icon from "../../assets/img/index/路灯.png";
import concentrator_icon from "../../assets/img/index/集中器.png";
import http from '../../utils/request'
export default {
  name: "",
  props: [""],
  data() {
    return {
      center: { lng: 114.025, lat: 22.546 },
      zoom: 15,
      showMap:true,
      street_lamp_icon: street_lamp_icon,  // 路灯icon
      street_lamp_icon_status: true,   // 图标显示控制
      concentrator_icon: concentrator_icon, // 集中器icon
      street_lamp_list: [],     // 所有路灯
      concentrator_list: [],    // 所有集中器
      label_style: {
        "font-size": "9px",
        color: "#fff",
        padding: '2px 4px 2px 2px',
        "border-radius": "50%",
        border: "4px solid #fff",
        "background-color": "#5BD88B",
        "text-align": "center",
        "line-height": "14px",
        "-moz-box-shadow": "2px 2px 5px #ccc",
        "-webkit-box-shadow": " 2px 2px 5px #ccc",
        "box-shadow": "2px 2px 5px #ccc"
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
        }
      ],
      options: [
        {
          value: "2",
          label: "标注2"
        },
        {
          value: "3",
          label: "标注3"
        },
        {
          value: "4",
          label: "标注4"
        },
        {
          value: "5",
          label: "标注5"
        }
      ],
      value: "",
      value2: "",
      value3: "",
      concentrator: [
        {
          concentrator_id: 1000,
          children: [
            { controller_id: "0B310E09BF08" },
            { controller_id: "0B310E09BF08" },
            { controller_id: "0B310E09BF08" },
            { controller_id: "0B310E09BF08" }
          ]
        },
        {
          concentrator_id: 2000,
          children: [
            { controller_id: "0B310E09BF08" },
            { controller_id: "0B310E09BF08" },
            { controller_id: "0B310E09BF08" },
            { controller_id: "0B310E09BF08" }
          ]
        }
      ],
      light_source: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" }
      ]
    };
  },

  components: {
    // BaiduMap,
    // BmMarker
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
  created() {
    // this.getMarker();
  },
  mounted() {
    // setTimeout(() => {
    //   this.center.lng = 114.025;
    //   this.center.lat = 22.546;
    // }, 5000);
    this.initEcharts({}, "light_source");
    this.setEchartsPie("echarts", [
      { value: 300, name: "课程报名" },
      { value: 350, name: "服装收费" },
      { value: 250, name: "物料收费" },
      { value: 100, name: "其它收费" }
    ]);
    this.getMarker();
  },

  methods: {
    changeMap(){

      this.showMap=!this.showMap
    },
    handler({ BMap, map }) {
      // console.log(BMap);
      // this.center.lng = 116.404;
      // this.center.lat = 39.915;
      // BMap.Overlay(BMap.Marker(BMap.Point(114.04321763573631,22.550239054111323)))
      // this.zoom = 15;
    },
    selectChange() {
      this.pointList[0].children.forEach(item => {
        if (item.id == this.value) {
          this.center.lng = item.x;
          this.center.lat = item.y;
        }
      });
    },
    // 双向绑定
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
    },
    search() {},
    // 页面加载时获取所有marker标记点
    getMarker() {
      let list = [];
      let list1 = [];
      this.pointList.forEach(item => {
        list.push({ lng: item.x, lat: item.y });
        if (item.children) {
          item.children.forEach(item2 => {
            list1.push({ lng: item2.x, lat: item2.y });
          });
        }
      });
      this.street_lamp_list = list1;
      this.concentrator_list = list;
    },
    // 地图缩放
    zoomend(e) {
      console.log(e.target.getZoom());
      this.zoom = e.target.getZoom();
      if (e.target.getZoom() <= 14) {
        this.street_lamp_icon_status = false;
      } else {
        this.street_lamp_icon_status = true;
      }
    },
    // 获取点击的坐标
    getLocationPoint(e) {
      alert(e.point.lat + "-" + e.point.lng);
    },
    // echarts图表
    initEcharts(data, elID) {
      var mycharts = echarts.init(document.getElementById(elID));
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          icon: "circle",
          top: "middle",
          itemGap: 25,
          right: 20,
          itemWidth: 5,
          itemHeight: 5,
          formatter: params => {
            let name = "";
            let value = "";
            this.light_source.forEach(item => {
              // console.log(this.light_source);

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
            name: "访问来源",
            type: "pie",
            center: ["25%", "50%"],
            radius: ["50%", "60%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
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
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" }
            ]
          }
        ]
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
              color: "#303133",
              fontSize: 10,
              fontWeight: "bold",
              lineHeight: 40
            },
            name: {
              color: "#909399",
              lineHeight: 20
            }
          },
          top: "center",
          left: "145",
          textAlign: "center",
          textStyle: {
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
            center: ['25%', "50%"],
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