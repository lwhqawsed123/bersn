<template>
  <div class="table_box">
    <div class="table_header">
      <span class="table_header_left">
        <span class="table_header_left_line"></span>
        <span class="table_title">{{table_title}}</span>
      </span>
      <button v-if="!delete_button&&!tongbu&&!refresh" class="add_button" @click="open_add">+ 添加</button>
      <button v-if="delete_button&&!tongbu" class="add_button delete_button" @click="delete_fn">删除</button>
      <button v-if="!delete_button&&tongbu" class="delete_button tongbu_button" @click="delete_fn">同步信息</button>
      <button v-if="!delete_button&&refresh" class="delete_button tongbu_button" @click="delete_fn">刷新</button>
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
          <span v-if="scope.row.workState=='NORMAL'" class="success">正常</span>
          <span v-if="scope.row.workState=='ALARM'" class="warning">警告</span>
          <span v-if="scope.row.workState=='OFFLINE'" class="offline">离线</span>
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
    "table_title",  
    "tableData",    
    "sizes",        
    "size",         
    "total",        
    "columnArray",  
    "_edit",        
    "pageChange",   
    "openAdd",     
    "delete_button",  
    "_delete",        
    "noPagination",    
    "workState",       
    "operation",      
    "tongbu",         
    "refresh",         
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
    
  },
  watch: {
    tableData() {},
    columnArray() {},
    total() {}
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.pageChange) {
        this.pageChange('event',this.currentPage, val);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.pageChange) {
        this.pageChange('event',val, this.pageSize);
      }
    },
    open_add() {
      if (this.openAdd) {
        this.openAdd();
      }
    },
    open_editBrand(row) {
      if (this._edit) {
        this._edit(row);
      }
    },
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