<template>
  <div>
    <div id="map_canvas" style="height: 700px; width: 800px"></div>
  </div>
</template>

<script>
// import google from 'vue-google-maps'
import http from '../../utils/request'
import street_lamp_icon from "../../assets/img/index/ludeng-green.png";
import concentrator_icon from "../../assets/img/index/集中器.png";
export default {
  name: "",
  props: [""],
  data() {
    return {
      GG_map: "", // 当前地图
      GG_center: { lng: 120.5, lat: 30.2 },
      GG_street_lamp_icon: street_lamp_icon, // 路灯icon
      GG_street_lamp_icon_status: true, // 图标显示控制
      GG_concentrator_icon: concentrator_icon, // 集中器icon
      GG_street_lamp_list: [], // 所有路灯
      GG_concentrator_list: [], // 所有集中器
      GG_marker_array: [], // 所有marker标记
      GG_marker_circle_arr: [], // 所有缩略标记
      GG_markers: [
        {
          position: { lng: 120.4, lat: 30.2 },
          orderId: "123456",
          name: "吴韩伟",
          show: false
        },
        {
          position: { lng: 120.5, lat: 30.2 },
          orderId: "654321",
          name: "姚永琪",
          show: false
        }
      ],
      position: {},
      websock: null,
      GG_pointList: [
        {
          id: 1,
          x: -34.397,
          y: 150.644,
          children: [
            {
              id: 2,
              x: -34.457123,
              y: 150.544665,
              name: "坐标1"
            },
            {
              id: 3,
              x: -34.787324,
              y: 150.524453,
              name: "坐标2"
            },
            {
              id: 4,
              x: -34.697345,
              y: 150.554633,
              name: "坐标3"
            },
            {
              id: 5,
              x: -34.227876,
              y: 150.514123,
              name: "坐标4"
            }
          ]
        }
      ]
    };
  },

  components: {},

  computed: {
   
    GG_marker_arr: function() {
      console.log(
        this.GG_street_lamp_icon_status,
        this.GG_street_lamp_list,
        this.GG_concentrator_list
      );
      if (this.GG_street_lamp_icon_status) {
        return this.GG_street_lamp_list;
      } else {
        return this.GG_concentrator_list;
      }
    }
  },

  beforeMount() {},

  mounted() {
    this.mapBuild();
    this.getGGMarker();
    this.GG_initMap();
    this.set_GG_street_lamp();
  },

  methods: {
 

    // 初始化谷歌地图
    GG_initMap() {
      this.GG_map = new google.maps.Map(document.getElementById("map_canvas"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      });
      // 设置谷歌地图marker
      // var beachMarker = new google.maps.Marker({
      //   position: { lat: -34.397, lng: 150.644 },
      //   map: this.GG_map,
      //   icon: this.GG_concentrator_icon
      // });
      // 地图点击事件（在此获取经纬度）
      this.GG_map.addListener("click", e => {
        // console.log(e.latLng.lat());
        // console.log(e.latLng.lng());
        this.addMarker(e.latLng);
      });
      // 监听地图缩放事件
      this.GG_map.addListener("zoom_changed", () => {
        console.log(this.GG_map.getZoom());
        if (this.GG_map.getZoom() <= 7) {
          this.GG_street_lamp_icon_status = false;
          this.clearMarkers()
        } else {
          this.GG_street_lamp_icon_status = true;
          this.showMarkers()
        }
      });
    },
    // 设置路灯marker
    set_GG_street_lamp() {
      // console.log(this.GG_street_lamp_zoom);

      this.GG_street_lamp_list.forEach(item => {
        this.addMarker(item);
        // let beachMarker = new google.maps.Marker({
        //   position: item,
        //   map: this.GG_map,
        //   icon: this.GG_concentrator_icon
        // });
        // this.attachSecretMessage(beachMarker, "路灯");
        // beachMarker.addListener("click", function() {
        //   // console.log(beachMarker.getPosition());
        //   // map.setCenter(marker.getPosition());
        // });
      });
    },
    // 设置集中器marker
    set_GG_marker_circle() {
      // console.log(this.GG_street_lamp_zoom);

      this.GG_street_lamp_list.forEach(item => {
        this.addMarker(item);
        // let beachMarker = new google.maps.Marker({
        //   position: item,
        //   map: this.GG_map,
        //   icon: this.GG_concentrator_icon
        // });
        // this.attachSecretMessage(beachMarker, "路灯");
        // beachMarker.addListener("click", function() {
        //   // console.log(beachMarker.getPosition());
        //   // map.setCenter(marker.getPosition());
        // });
      });
    },
    // 闭包设置marker的事件
    attachSecretMessage(marker, secretMessage) {
      var infowindow = new google.maps.InfoWindow({
        content: secretMessage
      });

      marker.addListener("click", function() {
        infowindow.open(marker.get("map"), marker);
      });
    },
    // 页面加载时，获取路灯和集中器
    getGGMarker() {
      let list = [];
      let list1 = [];
      this.GG_pointList.forEach(item => {
        list.push({ lat: item.x, lng: item.y });
        if (item.children) {
          item.children.forEach(item2 => {
            list1.push({ lat: item2.x, lng: item2.y });
          });
        }
      });
      this.GG_street_lamp_list = list1;
      this.GG_concentrator_list = list;
    },
    // =====新增和隐藏marker========
    // 新增marker
    addMarker( location) {
      var marker = new google.maps.Marker({
        position: location,
        map: this.GG_map,
        icon: this.GG_street_lamp_icon,
        id:123
      });
      marker.addListener("click", () => {
        // console.log(beachMarker.getPosition());
        // this.GG_map.setCenter(marker.getPosition());
        console.log(marker.id);
        
      });
      this.GG_marker_array.push(marker);
    },
    // 循环设置所有marker
    setMapOnAll(map) {
      this.GG_marker_array.forEach(item => {
        item.setMap(map);
      });
    },
    // 清除所有marker
    clearMarkers() {
      this.setMapOnAll(null);
    },
    // 显示所有marker
    showMarkers() {
      this.setMapOnAll(this.GG_map);
    },
    // ==============
    //  地图实例
    mapBuild() {
      //创建地图实例，zoom是缩放比例
      let map = new google.maps.Map(document.getElementById("map_canvas"), {
        zoom: 12,
        center: this.center,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      //这里因为需要很多标记，所以遍历了this.markers（后端给的数据）来循环创建标记
      // this.markers.map(item => {
      //   let marker = new MarkerWithLabel({
      //     position: item.position,
      //     icon: "../../assets/img/index/集中器.png", //标记自定义图标
      //     draggable: false, //不可拖动
      //     map: map, //地图实例
      //     labelContent: item.name, //label的内容
      //     labelAnchor: new google.maps.Point(22, 0), //label的位置，可以调
      //     labelClass: "labels", // the CSS class for the label
      //     labelStyle: { background: "#fff", padding: "5px" }
      //   });
      //   //自定义信息窗口
      //   let iw = new google.maps.InfoWindow({
      //     content: `<div>
      //                     <p>订单编号： ${item.orderId}</p>
      //                     <p>快递员：${item.name}</p>
      //                   </div>`
      //   });
      //   //点击信息窗口显示
      //   google.maps.event.addListener(marker, "click", function(e) {
      //     iw.open(map, marker);
      //   });
      // });
    }
  },

  watch: {}
};
</script>
<style lang='' scoped>
</style>