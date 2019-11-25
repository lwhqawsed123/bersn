<template>
  <div class="brand_box">
    <Table
      :table_title="'照明区域管理'"
      :tableData="categoryArray"
      :columnArray="[{prop:'categoryName',label:'照明区域名称'},{prop:'remark',label:'备注'}]"
      :_edit="openeditcategory"
      :_delete="deletecategory"
      :pageChange="getAllcategory"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="categoryTotal"
      :openAdd="openAddcategory"
    />
    <Table
      :table_title="'照明分组管理'"
      :tableData="groupArray"
      :columnArray="[
      {prop:'categoryId',label:'照明类型名称'},
      {prop:'luminName',label:'照明分组'}
      ]"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="groupTotal"
      :pageChange="getAllgroup"
      :openAdd="openAddgroup"
      :_edit="openeditgroup"
      :_delete="deletegroup"
    />
    <!-- 区域弹出框 -->
    <Mydialog
      :isShow="categoryisShow"
      :tittle="category_title"
      :width="'600px'"
      :submit="categorySubmit"
    >
      <div class="form_box">
        <el-form
          ref="categoryForm"
          :rules="categoryRules"
          :model="categoryForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="照明区域名称" prop="categoryName">
            <el-input v-model="categoryForm.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="categoryForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>

    <!-- 道路弹框 -->
    <Mydialog :isShow="groupIsShow" :tittle="group_title" :width="'600px'" :submit="groupSubmit">
      <div class="form_box">
        <el-form
          ref="group_Form"
          :rules="groupRules"
          :model="groupForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="照明类型" prop="categoryId">
            <el-select
              v-model="groupForm.categoryId"
              placeholder="请选择照明类型"
              class="category_select brand_select"
            >
              <el-option
                v-for="item in categoryOptions"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </el-form-item>
         
          <el-form-item label="照明分组名称" prop="luminName">
            <el-input v-model="groupForm.luminName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="groupForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
  </div>
</template>

<script>
import Table from "../../home/table/table";
import Mydialog from "../../my-dialog/my-dialog";
import {
  add_category,
  get_all_category,
  get_category_byid,
  delete_category,
  add_group,
  get_all_group,
  get_group_byid,
  delete_group
} from "../../../api/http/lumin";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      // ===========区域===========
      categoryisShow: false, // 新增弹框
      categoryForm: {
        // 新增
        categoryName: "",
        remark: ""
      },
      category_title: "", // 标题
      categorySubmit: function() {}, // 提交的默认函数
      categoryArray: [], // 列表
      categoryTotal: 0, // 总数
      categoryRules: {
        categoryName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },
      // =============道路=========
      groupIsShow: false, // 新增弹框
      groupSubmit: function() {}, // 提交
      group_title: "", // 标题
      groupForm: {},
      categoryOptions: [], // 区域下拉列表
      groupOptions: [], // 道路等级下拉列表
      groupArray: [], // 列表
      groupTotal: 0, // 总数
      groupRules: {
        categoryId: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        luminName: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },

  components: {
    Table,
    Mydialog
  },

  computed: {},

  beforeMount() {},

  mounted() {
    this.getAllcategory();
    this.getAllgroup();
  },

  methods: {
    // ============区域==================
    // 获取所有区域数据
    async getAllcategory(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_category({ data });
      if (res) {
        this.categoryTotal = res.data.total;
        this.categoryArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增弹框
    openAddcategory() {
      this.category_title = "新增区域";
      this.categorySubmit = this.addcategory;
      this.categoryisShow = true;
    },
    // 新增区域
    addcategory() {
      this.$refs["categoryForm"].validate(async valid => {
        if (valid) {
          let data = this.categoryForm;
          console.log(data);
          
          // let res = await add_category({ data });
          // if (res.data.success) {
          //   this.$message.success(res.data.msgCode);
          //   this.colseDialog();
          //   this.getAllcategory();
          // } else {
          //   this.$message.error(res.data.msgCode);
          // }
        } else {
          return false;
        }
      });
    },
    // 打开修改区域弹框
    async openeditcategory(row) {
      let data = { id: row.categoryId };

      let res = await get_category_byid({ data });
      if (res.data.success) {
        this.categoryisShow = true;
        this.category_title = "区域修改";
        this.categorySubmit = this.editcategory;
        this.categoryForm = res.data.content;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 修改区域
    editcategory() {
      let data = {
        categoryId: this.categoryForm.categoryId,
        categoryName: this.categoryForm.categoryName,
        remark: this.categoryForm.remark
      };
      this.$refs["categoryForm"].validate(async valid => {
        if (valid) {
          let res = await add_category({ data });

          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllcategory();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 删除区域
    deletecategory(row) {
      this.$confirm("是否删除该区域?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.categoryId };
          let res = await delete_category({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllcategory();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    // 关闭窗口
    colseDialog() {
      this.categoryisShow = false;
      this.categoryForm = {};
      // 道路
      this.groupIsShow = false;
      this.groupForm = {};
    },
    // ============道路===================
    // 获取所有道路数据
    async getAllgroup(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_group({ data });
      if (res) {
        this.groupTotal = res.data.total;
        this.groupArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增道路
    openAddgroup() {
      this.group_title = "道路增加";
      this.getAllSelect();
      this.groupSubmit = this.addgroup;
      this.groupIsShow = true;
    },
    // 获取下拉列表
    async getAllSelect() {
      let res = await get_all_category();
      if (res) {
        this.categoryOptions = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 新增区域
    addgroup() {
      this.$refs["group_Form"].validate(async valid => {
        if (valid) {
          let data = this.groupForm;
          let res = await add_group({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllgroup();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改弹框
    async openeditgroup(row) {
      this.group_title = "道路修改";
      let data = { id: row.luminId };
      let res = await get_group_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.groupSubmit = this.addgroup;
        this.groupForm = res.data.content;
        this.groupIsShow = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 删除道路
    deletegroup(row) {
      this.$confirm("是否删除该道路?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.brandId };
          let res = await delete_group({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllgroup();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    }
  },

  watch: {}
};
</script>
<style lang='less' >
.form_box {
  width: 100%;
  padding: 0 60px;
  box-sizing: border-box;
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__error {
    left: unset;
    right: 0;
  }
  .el-form-item__label {
    line-height: 9px !important ;
  }
  .brand_select {
    width: 100%;
  }
}
</style>