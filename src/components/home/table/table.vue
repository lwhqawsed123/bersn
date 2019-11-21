<template>
  <div class="table_box">
    <div class="table_header">
      <span class="table_header_left">
        <span class="table_header_left_line"></span>
        <span class="table_title">{{table_title}}</span>
      </span>
      <button class="add_button" @click="open_add">+ 添加</button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="table_content"
      :header-cell-style="{background:'#f1f1f1',color:'#666666'}"
    >
      <el-table-column
        v-for="item in columnArray"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>

      <el-table-column label="操作" width="116">
        <template slot-scope="scope">
          <img
            class="edit"
            src="../../../assets/img/mgt/bianji.png"
            style="cursor: pointer;"
            alt
            @click="open_editBrand(scope.row.brandId)"
          />
          <img
            class="delete"
            src="../../../assets/img/mgt/删除.png"
            style="margin-left:15px;cursor: pointer;"
            alt
            @click="T_delete(scope.row.brandId)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: [
    "table_title",
    "tableData",
    "total",
    "columnArray",
    "_edit",
    "_delete",
    "pageChange",
    "openAdd"
  ],
  data() {
    return {
      currentPage: 1,
      pageSize: 5
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},
  watch: {
    tableData() {},
    columnArray() {},
    total() {}
  },
  methods: {
    // 页容量变化
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.pageChange) {
        this.pageChange(this.currentPage,val);
      }
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.pageChange) {
        this.pageChange(val, this.pageSize);
      }
    },
    // 打开弹框
    open_add(){
      if(this.openAdd){
        this.openAdd()
      }
    },
    // 修改品牌
    open_editBrand(id) {
      if (this._edit) {
        this._edit(id);
      }
    },
    // 删除品牌
    T_delete(id) {
      if (this._delete) {
        this._delete(id);
      }
    }
  },

  watch: {}
};
</script>
<style lang='less' scoped>
@import "../../../assets/less/table/table.less";
</style>