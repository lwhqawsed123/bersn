<template>
  <div class="test">
    <el-button >请求</el-button>
  </div>
</template><script>
export default {
  name: "test",
  data() {
    return { websock: null };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    initWebSocket() {
      //初始化weosocket
      // const wsuri = "ws://121.40.165.18:8800";
      const wsuri = "ws://47.106.141.162:8888/scoket/webServer/123";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      // let actions = { test: "12345" };
      // this.websocketsend(JSON.stringify(actions));
      console.log('发送数据1');
      
    },
    websocketonerror() {
      //连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      //数据接收
      // const redata = JSON.parse(e.data);
      console.log(e);
      
    },
    websocketsend(Data) {
      //数据发送
      // this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      console.log("断开连接", e);
    }
  }
};
</script>
<style lang='less' scoped>
</style>