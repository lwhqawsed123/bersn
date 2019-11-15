<template>
  <bm-overlay ref="customOverlay" :class="{sample: true}" pane="labelPane" @draw="draw">
    <div v-text="text" @click="childMethod" class="labelNum"></div>
  </bm-overlay>
</template>

<script>
export default {
  props: ["text", "position", "active"],
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload();
      },
      deep: true
    }
  },
  methods: {
    handleClick() {
      console.log(this.position);
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x + "px";
      el.style.top = pixel.y + "px";
    },
    childMethod() {
      this.$emit('concentratorClick',this.position)
    }
  }
};
</script>
<style lang='' scoped>
.sample {
  position: absolute;
  display: inline-block;
  border-radius: 50%;
  min-width: 12px;
  min-height: 12px;
  padding: 2px 2px 3px 2px;
  border: 4px solid #fff;
  background: #5bd88b;
  color: white;
  text-align: center;
  line-height: 12px;
  box-sizing: content-box;
  white-space: nowrap;
  cursor: pointer;
}
.sample:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  padding-top: 100%;
  height: 0;
}

.sample .labelNum {
  display: inline-block;
  vertical-align: middle;
}
</style>