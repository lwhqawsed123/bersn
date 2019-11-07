<template>
  <baidu-map
    class="map-container"
    center="广东"
    id="map-container"
    :scroll-wheel-zoom="scrollzoom"
    :zoom="9"
  >
    <bml-marker-clusterer :averageCenter="true">
      <div v-for="(marker,index) of MarkerArray" :key='index'>
        <bm-marker
          :position="{lng: marker.Longitude, lat: marker.Latitude}"
          @click="infoWindowOpen(marker)"
        ></bm-marker>

        <bm-marker

:position="{lng: marker.Longitude, lat: marker.Latitude}"

:title="marker.RiverName"

@click="infoWindowOpen(marker)"

>

<bm-info-window

:position="{lng: marker.lng, lat: marker.lat}"

:show="marker.showFlag"

@close="infoWindowClose(marker)"

@open="infoWindowOpen(marker)"

class="windowbm"

>

<table class="bordered">

<tr>

<td>站点名称：</td>

<td>{{marker.StationName}}</td>

</tr>

<tr>

<td>监测参数：</td>

<td>{{marker.Items}}</td>

</tr>

<tr>

<td>河流名称：</td>

<td>{{marker.RiverName}}</td>

</tr>

<tr>

<td>所属区域：</td>

<td>{{marker.AreaName}}</td>

</tr>

<tr>

<td>经纬度：</td>

<td>{{marker.Longitude}} ~{{marker.Latitude}}</td>

</tr>

</table>

</bm-info-window>

        </bm-marker>
      </div>
    </bml-marker-clusterer>

    <bm-info-window
      :position="positionData"
      :title="tableData.RiverName"
      :show="showFlag"
      class="windowbm"
    >
      <table class="bordered">
        <tr>
          <td>站点名称：</td>

          <td>{{tableData.StationName}}</td>
        </tr>

        <tr>
          <td>监测参数：</td>

          <td>{{tableData.Items}}</td>
        </tr>

        <tr>
          <td>河流名称：</td>

          <td>{{tableData.RiverName}}</td>
        </tr>

        <tr>
          <td>所属区域：</td>

          <td>{{tableData.AreaName}}</td>
        </tr>

        <tr>
          <td>经纬度：</td>

          <td>{{tableData.Longitude}} ~ {{tableData.Latitude}}</td>
        </tr>
      </table>
    </bm-info-window>
  </baidu-map>
</template>

<script>
import { BmlMarkerClusterer } from "vue-baidu-map";

export default {
  name: "BaiduMapz",

  components: {
    BmlMarkerClusterer
  },

  props: {
    MarkerArray: {
      type: [Array, Object],

      default() {
        return {};
      }
    }
  },

  data() {
    return {
      MarkerList: [],

      scrollzoom: true,

      showFlag: false,

      positionData: { lng: 0, lat: 0 },

      tableData: {}
    };
  },

  watch: {
    MarkerArray(val) {
      this.positionData = { lng: 0, lat: 0 };

      this.showFlag = false;

      this.tableData = {};

      this.MarkerList = val;
    }
  },

  methods: {
    infoWindowOpen(val) {
      this.positionData = {
        lng: parseFloat(val.Longitude),
        lat: parseFloat(val.Latitude)
      };

      this.showFlag = true;

      let arr = {};

      for (let item in val) {
        arr[item] = val[item];
      }

      this.tableData = arr;
    }
  },

  mounted() {}
};
</script>

<style>
.map-container {
  width: 100%;

  height: 79%;
}

.windowbm {
  width: 350px;
}

.bordered {
  width: 350px;

  border: solid #ccc 1px;

  -moz-border-radius: 6px;

  -webkit-border-radius: 6px;

  border-radius: 6px;

  -webkit-box-shadow: 0 1px 1px #ccc;

  -moz-box-shadow: 0 1px 1px #ccc;

  box-shadow: 0 1px 1px #ccc;
}

.bordered tr {
  -o-transition: all 0.1s ease-in-out;

  -webkit-transition: all 0.1s ease-in-out;

  -moz-transition: all 0.1s ease-in-out;

  -ms-transition: all 0.1s ease-in-out;

  transition: all 0.1s ease-in-out;
}

.bordered td:first-child {
  width: 73px;

  text-align: right;
}
</style>