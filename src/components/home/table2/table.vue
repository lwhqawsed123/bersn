<template>
  <div class="table_box">
    <div class="table_header">
      <span class="table_header_left">
        <span class="table_header_left_line"></span>
        <span class="table_title">{{table_title}}</span>
      </span>
      <button v-if="!delete_button&&!tongbu" class="add_button" @click="open_add">+ 添加</button>
      <button v-if="delete_button&&!tongbu" class="add_button delete_button" @click="delete_fn">删除</button>
      <button v-if="!delete_button&&tongbu" class="delete_button tongbu_button" @click="delete_fn">同步信息</button>
    </div>
    <slot></slot>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="table_content"
      :header-cell-style="{background:'#f1f1f1',color:'#666666'}"
    >
      <el-table-column v-if="workState" label="工作状态" prop="workState">
        <template slot-scope="scope">
          <span v-if="scope.row.workState" class="success">正常</span>
          <span v-if="!scope.row.workState" class="warning">警告</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in columnArray"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column v-if="!operation" label="操作" width="116">
        <template slot-scope="scope">
          <img
            class="edit"
            src="../../../assets/img/mgt/bianji.png"
            style="cursor: pointer;"
            alt
            @click="open_editBrand(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!noPagination" class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="sizes"
        :page-size="size"
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
    "table_title",  // 表格标题
    "tableData",    // 表格数据
    "sizes",        // 可选页容量
    "size",         // 当前页容量
    "total",        // 数据总数
    "columnArray",  // 表头
    "_edit",        // 打开修改弹框
    "pageChange",   // 页码发生改变(重新获取数据)
    "openAdd",      // 打开新增弹框(右上)
    "delete_button",  // 是否显示删除按钮(右上) 不显示为true
    "_delete",        // 删除
    "noPagination",   // 是否显示页码
    "workState",      // 是否显示工作状态
    "operation",      // 是否显示操作栏
    "tongbu"          // 是否为同步按钮(右上)
  ],
  data() {
    return {
      currentPage: 1,
      pageSize: this.size
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {
    console.log(this.delete_button);
    
  },
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
        this.pageChange(this.currentPage, val);
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
    open_add() {
      if (this.openAdd) {
        this.openAdd();
      }
    },
    // 修改
    open_editBrand(row) {
      if (this._edit) {
        this._edit(row);
      }
    },
    // 删除
    delete_fn(row){
       if (this._delete) {
        this._delete(row);
      }
    }
  },

  watch: {}
};
</script>
<style lang='less' scoped>
@import "../../../assets/less/table/table.less";
</style>