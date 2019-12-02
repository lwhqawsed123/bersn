<template>
  <div class="brand_box">
    <div class="table_box">
      <div class="table_header">
        <span class="table_header_left">
          <span class="table_header_left_line"></span>
          <span class="table_title">调光计划</span>
        </span>
        <button class="add_button" @click="toScheduleDetail">+ 添加</button>
      </div>
      <div class="search_box">
        <span>计划名称：</span>
        <el-input
          class="search_input"
          clearable
          v-model="search.scheduleName"
          placeholder="全部"
          @keyup.enter.native="getAllschedule"
          @clear="getAllschedule"
        ></el-input>
        <button class="search_button" @click="getAllschedule">搜索</button>
      </div>
      <el-table
        :data="scheduleArray"
        style="width: 100%"
        class="table_content"
        :header-cell-style="{background:'#f1f1f1',color:'#666666'}"
      >
        <el-table-column label="计划名称" prop="scheduleName"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>

        <el-table-column label="操作" width="116">
          <template slot-scope="scope">
            <img
              class="edit"
              src="../../../assets/img/mgt/bianji.png"
              style="cursor: pointer;"
              alt
              @click="toScheduleDetail(scope.row)"
            />
            <img
              class="delete"
              src="../../../assets/img/mgt/删除.png"
              style="margin-left:15px;cursor: pointer;"
              alt
              @click="deleteschedule(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="sizes"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="scheduleTotal"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Mydialog from "../../my-dialog/my-dialog";
import {
  get_all_schedule,
  delete_schedule
} from "../../../api/http/schedule";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      schedule_title: "", 
      scheduleArray: [], 
      
      scheduleTotal: 0, 
      currentPage: 1,
      sizes: [10, 20, 30, 40],
      size: 10,
      search: {
        scheduleName: ""
      }
    };
  },

  components: {
    Mydialog
  },

  computed: {},

  beforeMount() {},

  mounted() {
    this.getAllschedule();
  },

  methods: {
    async getAllschedule() {
      let data = {};
      if (this.search.scheduleName) {
        data = {
          pageNo: this.currentPage,
          pageSize: this.size,
          "lampSchedule.scheduleName": this.search.scheduleName
        };
      } else {
        data = {
          pageNo: this.currentPage,
          pageSize: this.size
        };
      }
      let res = await get_all_schedule({ data });
      if (res) {
        this.scheduleTotal = res.data.total;
        this.scheduleArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    toScheduleDetail(row) {
      if(row){
        this.$router.push({ name: 'scheduleDetail', params: { scheduleId: row.scheduleId }})
      }else{
        this.$router.push({ name: 'scheduleDetail'})
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
    handleSizeChange(val) {
      this.size = val;
      this.getAllschedule();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAllschedule();
    }
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../../assets/less/table/table.less";
@import "../../../assets/less/concent/concent.less";
.schedule_active{
  color: #1ACC56;
}
.schedule_frozen{
  color: rgb(138, 128, 128);
}

</style>