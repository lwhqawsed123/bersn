<template>
  <div class="brand_box">
    <Table
      :table_title="'品牌管理'"
      :tableData="brandArray"
      :columnArray="[{prop:'brandName',label:'品牌名称'},{prop:'remark',label:'备注'}]"
      :_edit="openeditBrand"
      :_delete="deleteBrand"
      :pageChange="getAllBrand"
      :total="brandTotal"
      :openAdd="openAddBrand"
    />
    <Table
      :table_title="'灯具管理'"
      :tableData="lightArray"
      :columnArray="[
      {prop:'lightModel',label:'灯光型号'},
      {prop:'lampCategory',label:'光源类型'},
      {prop:'brandId',label:'品牌'},
      {prop:'standardPower',label:'标称功率'},
      {prop:'avgLife',label:'额定寿命'},
      {prop:'procurementPrice',label:'采购单价'},
      {prop:'remark',label:'备注'},
      ]"
      :total="lightTotal"
      :pageChange="getAllLight"
      :openAdd="openAddLight"
      :_edit="openeditLight"
      :_delete="deleteLight"
    />
    <Table
      :table_title="'电源管理'"
      :tableData="annexArray"
      :columnArray="[
      {prop:'annexModel',label:'电源型号'},
      {prop:'lampCategory',label:'光源类型'},
      {prop:'brandId',label:'品牌'},
      {prop:'annexType',label:'配套电器类型'},
      {prop:'dimmingType',label:'调光类型'},
      {prop:'dimmingAttribute',label:'调光属性'},
      {prop:'remark',label:'备注'},
      ]"
      :_edit="openeditAnnex"
      :_delete="deleteAnnex"
      :pageChange="getAllAnnex"
      :total="annexTotal"
      :openAdd="openAddAnnex"
    />
    <!-- 新增品牌弹出框 -->
    <Mydialog :isShow="brandisShow" :tittle="'品牌添加'" :width="'600px'" :submit="addBrand">
      <div class="form_box">
        <el-form
          ref="brandForm"
          :rules="brandRules"
          :model="brandForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="品牌名称" prop="brandName">
            <el-input v-model="brandForm.brandName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="brandForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
    <!-- 修改品牌弹出框 -->
    <Mydialog :isShow="brandeditShow" :tittle="'品牌修改'" :width="'600px'" :submit="editBrand">
      <div class="form_box">
        <el-form
          ref="editBrand_Form"
          :rules="brandRules"
          :model="editBrandForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="品牌名称" prop="brandName">
            <el-input v-model="editBrandForm.brandName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="editBrandForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
    <!-- 灯具弹框 -->
    <Mydialog :isShow="lightIsShow" :tittle="light_title" :width="'600px'" :submit="lightSubmit">
      <div class="form_box">
        <el-form
          ref="light_Form"
          :rules="lightRules"
          :model="lightForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="光源型号" prop="lightModel">
            <el-input v-model="lightForm.lightModel"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="lightForm.brandId" placeholder="请选择品牌" class="brand_select">
              <el-option
                v-for="item in brandOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="光源类型" prop="lampCategory">
            <el-select v-model="lightForm.lampCategory" placeholder="请选择光源类型" class="brand_select">
              <el-option
                v-for="item in lampOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标称功率" prop="standardPower">
            <el-input v-model="lightForm.standardPower"></el-input>
          </el-form-item>
          <el-form-item label="额定寿命" prop="avgLife">
            <el-input v-model="lightForm.avgLife"></el-input>
          </el-form-item>
          <el-form-item label="采购单价" prop="procurementPrice">
            <el-input v-model="lightForm.procurementPrice"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="lightForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
    <!-- 光源弹框 -->
    <Mydialog :isShow="annexIsShow" :tittle="annex_title" :width="'600px'" :submit="annexSubmit">
      <div class="form_box">
        <el-form
          ref="annex_Form"
          :rules="annexRules"
          :model="annexForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="光源型号" prop="annexModel">
            <el-input v-model="annexForm.annexModel"></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="annexForm.brandId" placeholder="请选择品牌" class="brand_select">
              <el-option
                v-for="item in brandOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="光源类型" prop="lampCategory">
            <el-select v-model="annexForm.lampCategory" placeholder="请选择光源类型" class="brand_select">
              <el-option
                v-for="item in lampOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标称功率" prop="standardPower">
            <el-input v-model="annexForm.standardPower"></el-input>
          </el-form-item>
          <el-form-item label="额定寿命" prop="avgLife">
            <el-input v-model="annexForm.avgLife"></el-input>
          </el-form-item>
          <el-form-item label="采购单价" prop="procurementPrice">
            <el-input v-model="annexForm.procurementPrice"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="annexForm.remark"></el-input>
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
  get_all_brand,
  add_brand,
  delete_brand,
  get_brand_byid,
  add_light,
  get_all_light,
  get_light_byid,
  delete_light,
  get_annex_select,
  add_annex,
  get_all_annex,
  get_annex_byid,
  delete_annex
} from "../../../api/http/brand";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      // ===========品牌===========
      brandisShow: false, // 新增弹框
      brandeditShow: false, // 修改弹框
      brandForm: {
        // 新增
        brandName: "",
        remark: ""
      },
      editBrandForm: {
        // 修改
        brandName: "",
        remark: ""
      },
      brandArray: [], // 列表
      brandTotal: 0, // 总数
      brandRules: {
        brandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ]
      },
      // =============灯具=========
      lightIsShow: false, // 新增弹框
      lightSubmit: function() {}, // 提交
      light_title: "", // 标题
      lightForm: {},
      brandOptions: [], // 品牌下拉列表
      lampOptions: [], // 光源类型下拉列表
      lightArray: [], // 列表
      lightTotal: 0, // 总数
      lightRules: {
        lightModel: [{ required: true, message: "不能为空", trigger: "blur" }],
        brandId: [{ required: true, message: "不能为空", trigger: "change" }],
        lampCategory: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        standardPower: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        avgLife: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      // =============电源=========
      annexIsShow: false, // 新增弹框
      annexSubmit: function() {}, // 提交
      annex_title: "", // 标题
      annexForm: {},
      annexArray: [], // 列表
      annexTotal: 0, // 总数
      annexRules: {
        lightModel: [{ required: true, message: "不能为空", trigger: "blur" }],
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
    this.getAllBrand();
    this.getAllLight();
    this.getAllAnnex();
  },

  methods: {
    // ============品牌==================
    // 获取所有品牌数据
    async getAllBrand(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_brand({ data });
      if (res) {
        this.brandTotal = res.data.total;
        this.brandArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增弹框
    openAddBrand() {
      this.brandisShow = true;
    },
    // 新增品牌
    addBrand() {
      this.$refs["brandForm"].validate(async valid => {
        if (valid) {
          let data = this.brandForm;
          let res = await add_brand({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllBrand();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改品牌弹框
    async openeditBrand(row) {
      let data = { id: row.brandId };
      let res = await get_brand_byid({ data });
      if (res.data.success) {
        this.brandeditShow = true;
        this.editBrandForm = res.data.content;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 修改品牌
    editBrand() {
      let data = {
        brandId: this.editBrandForm.brandId,
        brandName: this.editBrandForm.brandName,
        remark: this.editBrandForm.remark
      };
      this.$refs["editBrand_Form"].validate(async valid => {
        if (valid) {
          let res = await add_brand({ data });

          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllBrand();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 删除品牌
    deleteBrand(row) {
      this.$confirm("是否删除该品牌?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.brandId };
          let res = await delete_brand({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllBrand();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    // 关闭窗口
    colseDialog() {
      this.brandisShow = false;
      this.brandeditShow = false;
      this.editBrandForm = {};
      this.brandForm = {};
      // 灯具
      this.lightIsShow = false;
      this.lightForm = {};
      // 光源
      this.annexIsShow = false;
      this.annexForm = {};
    },
    // ============灯具===================
    // 获取所有灯具数据
    async getAllLight(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_light({ data });
      if (res) {
        this.lightTotal = res.data.total;
        this.lightArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增灯具
    openAddLight() {
      this.light_title = "灯具增加";
      this.getAllSelect();
      this.lightSubmit = this.addLight;
      this.lightIsShow = true;
    },
    // 获取下拉列表
    async getAllSelect() {
      let res = await get_all_brand();
      if (res) {
        this.brandOptions = res.data.rows;
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
    addLight() {
      this.$refs["light_Form"].validate(async valid => {
        if (valid) {
          let data = this.lightForm;
          console.log(data);

          let res = await add_light({ data });
          console.log(res);

          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllLight();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改弹框
    async openeditLight(row) {
      this.light_title = "灯具修改";
      let data = { id: row.brandId };
      let res = await get_light_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.lightForm = res.data.content;
        this.lightIsShow = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    // 删除灯具
    deleteLight(row) {
      this.$confirm("是否删除该灯具?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.brandId };
          let res = await delete_light({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllLight();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    //==========光源==============
    //   add_annex
    // get_all_annex
    // get_annex_byid
    // delete_annex

    // openeditAnnex
    // deleteAnnex
    // getAllAnnex
    // openAddAnnex
    // 获取列表
    async getAllAnnex(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_annex({ data });
      if (res) {
        this.annexTotal = res.data.total;
        this.annexArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开修改
    openeditAnnex(){

    },
    // 修改

    // 打开新增
    openAddAnnex(){
      this.annex_title = "电源增加";
      this.getAllSelect()
      this.annexSubmit = this.addAnnex;
      this.annexIsShow = true;
    },
    // 新增
    // 删除
    deleteAnnex(){}
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