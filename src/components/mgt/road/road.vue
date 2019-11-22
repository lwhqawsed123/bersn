<template>
  <div class="brand_box">
    <Table
      :table_title="'区域管理'"
      :tableData="regionArray"
      :columnArray="[{prop:'regionName',label:'区域名称'},{prop:'remark',label:'备注'}]"
      :_edit="openeditregion"
      :_delete="deleteregion"
      :pageChange="getAllregion"
      :total="regionTotal"
      :openAdd="openAddregion"
    />
    <Table
      :table_title="'道路管理'"
      :tableData="roadArray"
      :columnArray="[
      {prop:'roadName',label:'道路名称'},
      {prop:'regionId',label:'区域'},
      {prop:'roadGrade',label:'道路级别'},
      {prop:'roadLength',label:'道路长度(Km)'},
      {prop:'poleAmount',label:'灯杆数量'},
      {prop:'lampAmount',label:'光源数量'},
      {prop:'remark',label:'备注'},
      ]"
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
          <el-form-item label="品牌名称" prop="regionName">
            <el-input v-model="regionForm.regionName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="regionForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>

    <!-- 道路弹框 -->
    <Mydialog :isShow="roadIsShow" :tittle="road_title" :width="'600px'" :submit="roadSubmit">
      <div class="form_box">
        <el-form
          ref="road_Form"
          :rules="roadRules"
          :model="roadForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="光源型号" prop="roadModel">
            <el-input v-model="roadForm.roadModel"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="roadForm.brandId" placeholder="请选择品牌" class="brand_select">
              <el-option
                v-for="item in regionOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="光源类型" prop="lampCategory">
            <el-select v-model="roadForm.lampCategory" placeholder="请选择光源类型" class="brand_select">
              <el-option
                v-for="item in lampOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标称功率" prop="standardPower">
            <el-input v-model="roadForm.standardPower"></el-input>
          </el-form-item>
          <el-form-item label="额定寿命" prop="avgLife">
            <el-input v-model="roadForm.avgLife"></el-input>
          </el-form-item>
          <el-form-item label="采购单价" prop="procurementPrice">
            <el-input v-model="roadForm.procurementPrice"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="roadForm.remark"></el-input>
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
      // ===========品牌===========
      //       regionArray
      // openeditregion
      // deleteregion
      // getAllregion
      // regionTotal
      // openAddregion
      regionisShow: false, // 新增弹框
      regionForm: {
        // 新增
        regionName: "",
        remark: ""
      },
      region_title: "", // 标题
      regionSubmit: function() {}, // 提交的默认函数
      regionArray: [], // 列表
      regionTotal: 0, // 总数
      regionRules: {
        regionName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ]
      },
      // =============灯具=========
      roadIsShow: false, // 新增弹框
      roadSubmit: function() {}, // 提交
      road_title: "", // 标题
      roadForm: {},
      regionOptions: [], // 品牌下拉列表
      lampOptions: [], // 光源类型下拉列表
      roadArray: [], // 列表
      roadTotal: 0, // 总数
      roadRules: {
        roadModel: [{ required: true, message: "不能为空", trigger: "blur" }],
        brandId: [{ required: true, message: "不能为空", trigger: "change" }],
        lampCategory: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        standardPower: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        avgLife: [{ required: true, message: "不能为空", trigger: "blur" }]
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
    this.getAllAnnex();
  },

  methods: {
    // ============品牌==================
    // 获取所有品牌数据
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
        this.region_title='新增区域'
      this.regionSubmit = this.addregion;
      this.regionisShow = true;
    },
    // 新增品牌
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
    // 打开修改品牌弹框
    async openeditregion(row) {
      let data = { id: row.regionId };

      let res = await get_region_byid({ data });
      if (res.data.success) {
        this.regionisShow = true;
        this.region_title='区域修改'
        this.regionSubmit = this.editregion;
        this.regionForm = res.data.content;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 修改品牌
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
    // 删除品牌
    deleteregion(row) {
      this.$confirm("是否删除该品牌?", "提示", {
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
      this.regionisShow = false;
      this.regionForm = {};
      // 灯具
      this.roadIsShow = false;
      this.roadForm = {};
    },
    // ============灯具===================
    // 获取所有灯具数据
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
    // 打开新增灯具
    openAddroad() {
      this.road_title = "灯具增加";
      this.getAllSelect();
      this.roadSubmit = this.addroad;
      this.roadIsShow = true;
    },
    // 获取下拉列表
    async getAllSelect() {
      let res = await get_all_region();
      if (res) {
        this.regionOptions = res.data.rows;
        get_annex_select().then(res => {
          if (res.data.success) {
            this.lampOptions = res.data.content;
          } else {
            this.$message.error(res.data.msgCode);
          }
        });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 新增品牌
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
      this.road_title = "灯具修改";
      let data = { id: row.brandId };
      let res = await get_road_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.roadForm = res.data.content;
        this.roadIsShow = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 删除灯具
    deleteroad(row) {
      this.$confirm("是否删除该灯具?", "提示", {
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
<style lang='less' scope>
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