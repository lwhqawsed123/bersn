<template>
  <div class="brand_box">
    <Table
      :table_title="'区域管理'"
      :tableData="regionArray"
      :columnArray="[{prop:'regionName',label:'区域名称'},{prop:'remark',label:'备注'}]"
      :_edit="openeditregion"
      :_delete="deleteregion"
      :pageChange="getAllregion"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="regionTotal"
      :openAdd="openAddregion"
    />
    <Table
      :table_title="'道路管理'"
      :tableData="roadArray"
      :columnArray="[
      {prop:'roadName',label:'道路名称'},
      {prop:'regionName',label:'区域'},
      {prop:'roadGrade',label:'道路级别'},
      {prop:'roadLength',label:'道路长度(Km)'},
      {prop:'poleAmount',label:'灯杆数量'},
      {prop:'lampAmount',label:'光源数量'},
      {prop:'remark',label:'备注'},
      ]"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="roadTotal"
      :pageChange="getAllroad"
      :openAdd="openAddroad"
      :_edit="openeditroad"
      :_delete="deleteroad"
    />
    <!-- 区域弹出框 -->
    <Mydialog :isShow="regionisShow" :tittle="region_title" :width="'600px'" :submit="regionSubmit">
      <div class="form_box">
        <el-form
          ref="regionForm"
          :rules="regionRules"
          :model="regionForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="区域名称" prop="regionName">
            <el-input v-model="regionForm.regionName" maxlength="100"
              @input="e => regionForm.regionName = validSe(e)"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="regionForm.remark" maxlength="200"
              @input="e => regionForm.remark = validSe(e)"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>

    <!-- 道路弹框 -->
    <Mydialog :isShow="roadIsShow" :tittle="road_title" :width="'600px'" :submit="roadSubmit">
      <div class="form_box">
        <el-form
          ref="roadForm"
          :rules="roadRules"
          :model="roadForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="道路名称" prop="roadName">
            <el-input v-model="roadForm.roadName" maxlength="100"
              @input="e => roadForm.roadName = validSe(e)"></el-input>
          </el-form-item>
          <el-form-item label="区域" prop="regionId">
            <el-select
              v-model="roadForm.regionId"
              placeholder="请选择区域"
              class="region_select brand_select"
            >
              <el-option
                v-for="item in regionOptions"
                :key="item.regionId"
                :label="item.regionName"
                :value="item.regionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="道路等级" prop="roadGrade">
            <el-select v-model="roadForm.roadGrade" placeholder="请选择道路等级" class="brand_select">
              <el-option
                v-for="item in roadOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="道路长度" prop="roadLength">
            <el-input v-model="roadForm.roadLength" maxlength="100"
              @input="e => roadForm.roadLength = validSe(e)"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="roadForm.remark" maxlength="200"
              @input="e => roadForm.remark = validSe(e)"></el-input>
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
  add_region,
  get_all_region,
  get_region_byid,
  delete_region,
  add_road,
  get_all_road,
  get_road_byid,
  delete_road
} from "../../../api/http/region";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      // ===========区域===========
      //       regionArray
      // openeditregion
      // deleteregion
      // getAllregion
      // regionTotal
      // openAddregion
      regionisShow: false, // 新增弹框
      regionForm: {},
      region_title: "", // 标题
      regionSubmit: function() {}, // 提交的默认函数
      regionArray: [], // 列表
      regionTotal: 0, // 总数
      regionRules: {
        regionName: [
          { required: true, message: "请输入区域名称", trigger: "blur" }
        ]
      },
      // =============道路=========
      roadIsShow: false, // 新增弹框
      roadSubmit: function() {}, // 提交
      road_title: "", // 标题
      roadForm: {},
      regionOptions: [], // 区域下拉列表
      roadOptions: [], // 道路等级下拉列表
      roadArray: [], // 列表
      roadTotal: 0, // 总数
      roadRules: {
        roadName: [{ required: true, message: "不能为空", trigger: "blur" }],
        regionId: [{ required: true, message: "不能为空", trigger: "change" }],
        roadGrade: [{ required: true, message: "不能为空", trigger: "change" }],
        roadLength: [{ required: true, message: "不能为空", trigger: "blur" }]
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
    this.getAllregion();
    this.getAllroad();
  },

  methods: {
    // ============区域==================
    // 获取所有区域数据
    async getAllregion(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_region({ data });
      if (res) {
        this.regionTotal = res.data.total;
        this.regionArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增弹框
    openAddregion() {
      this.region_title = "新增区域";
      this.regionSubmit = this.addregion;
      this.regionisShow = true;
    },
    // 新增区域
    addregion() {
      this.$refs["regionForm"].validate(async valid => {
        if (valid) {
          let data = this.regionForm;
          let res = await add_region({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllregion();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改区域弹框
    async openeditregion(row) {
      let data = { id: row.regionId };

      let res = await get_region_byid({ data });
      if (res.data.success) {
        this.regionisShow = true;
        this.region_title = "区域修改";
        this.regionSubmit = this.editregion;
        this.regionForm = res.data.content;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 修改区域
    editregion() {
      let data = {
        regionId: this.regionForm.regionId,
        regionName: this.regionForm.regionName,
        remark: this.regionForm.remark
      };
      this.$refs["regionForm"].validate(async valid => {
        if (valid) {
          let res = await add_region({ data });

          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllregion();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 删除区域
    deleteregion(row) {
      this.$confirm("是否删除该区域?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.regionId };
          let res = await delete_region({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllregion();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    // 关闭窗口
    colseDialog() {
      if (this.regionisShow) {
        this.$refs["regionForm"].resetFields();
      } else {
        this.$refs["roadForm"].resetFields();
      }
      // 区域
      this.regionisShow = false;
      // 道路
      this.roadIsShow = false;
    },
    // ============道路===================
    // 获取所有道路数据
    async getAllroad(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_road({ data });
      if (res) {
        this.roadTotal = res.data.total;
        this.roadArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增道路
    openAddroad() {
      this.road_title = "道路增加";
      this.getAllSelect();
      this.roadSubmit = this.addroad;
      this.roadIsShow = true;
    },
    // 获取下拉列表
    async getAllSelect() {
      let res = await get_all_region();
      if (res) {
        this.regionOptions = res.data.rows;
        // get_annex_select().then(res => {
        //   if (res.data.success) {
        //     this.roadOptions = res.data.content;
        //   } else {
        //     this.$message.error(res.data.msgCode);
        //   }
        // });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 新增区域
    addroad() {
      this.$refs["road_Form"].validate(async valid => {
        if (valid) {
          let data = this.roadForm;
          console.log(data);

          let res = await add_road({ data });
          console.log(res);

          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllroad();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改弹框
    async openeditroad(row) {
      this.road_title = "道路修改";
      let data = { id: row.roadId };
      let res = await get_road_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.roadSubmit = this.addroad;
        this.roadForm = res.data.content;
        this.roadIsShow = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 删除道路
    deleteroad(row) {
      this.$confirm("是否删除该道路?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.brandId };
          let res = await delete_road({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllroad();
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