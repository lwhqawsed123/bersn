<template>
  <div class="brand_box">
    <Table
      :table_title="'品牌管理'"
      :tableData="brandArray"
      :columnArray="[{prop:'brandName',label:'品牌名称'},{prop:'remark',label:'备注'}]"
      :_edit="openeditBrand"
      :_delete="deleteBrand"
      :pageChange="getAllBrand"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="brandTotal"
      :openAdd="openAddBrand"
    />
    <Table
      :table_title="'灯具管理'"
      :tableData="lightArray"
      :columnArray="[
      {prop:'lightModel',label:'灯光型号'},
      {prop:'lampCategory',label:'光源类型'},
      {prop:'brandName',label:'品牌'},
      {prop:'standardPower',label:'标称功率'},
      {prop:'avgLife',label:'额定寿命'},
      {prop:'procurementPrice',label:'采购单价'},
      {prop:'remark',label:'备注'},
      ]"
      :size="10"
      :sizes="[10,20,30,40]"
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
      {prop:'brandName',label:'品牌'},
      {prop:'annexType',label:'配套电器类型'},
      {prop:'dimmingType',label:'调光类型'},
      {prop:'dimmingAttribute',label:'调光属性'},
      {prop:'remark',label:'备注'},
      ]"
      :_edit="openeditAnnex"
      :_delete="deleteAnnex"
      :pageChange="getAllAnnex"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="annexTotal"
      :openAdd="openAddAnnex"
    />
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
            <el-input
              v-model="brandForm.brandName"
              maxlength="100"
              @input="e => brandForm.brandName = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="brandForm.remark"
              maxlength="200"
              @input="e => brandForm.remark = validSe(e)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
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
            <el-input
              v-model="editBrandForm.brandName"
              maxlength="100"
              @input="e => editBrandForm.brandName = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="editBrandForm.remark"
              maxlength="200"
              @input="e => editBrandForm.remark = validSe(e)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
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
            <el-input
              v-model="lightForm.lightModel"
              maxlength="100"
              @input="e => lightForm.lightModel = validSe(e)"
            ></el-input>
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
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标称功率" prop="standardPower">
            <el-input v-model.number="lightForm.standardPower"></el-input>
          </el-form-item>
          <el-form-item label="额定寿命" prop="avgLife">
            <el-input v-model.number="lightForm.avgLife" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="采购单价" prop="procurementPrice">
            <el-input v-model.number="lightForm.procurementPrice"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="lightForm.remark"
              maxlength="200"
              @input="e => lightForm.remark = validSe(e)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
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
            <el-input
              v-model="annexForm.annexModel"
              maxlength="100"
              @input="e => annexForm.annexModel = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="品牌" prop="brandId">
            <el-select v-model="annexForm.brandId" placeholder="请选择" class="brand_select">
              <el-option
                v-for="item in brandOptions"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="光源类型" prop="lampCategory">
            <el-select v-model="annexForm.lampCategory" placeholder="请选择" class="brand_select">
              <el-option
                v-for="item in lampOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配套电器类型" prop="annexType">
            <el-select v-model="annexForm.annexType" placeholder="请选择" class="brand_select">
              <el-option
                v-for="item in annexTypeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调光类型" prop="dimmingType">
            <el-select v-model="annexForm.dimmingType" placeholder="请选择" class="brand_select">
              <el-option
                v-for="item in dimmingTypeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调光属性" prop="dimmingAttribute">
            <el-select v-model="annexForm.dimmingAttribute" placeholder="请选择" class="brand_select">
              <el-option
                v-for="item in dimmingAttributeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="annexForm.remark"
              maxlength="200"
              @input="e => annexForm.remark = validSe(e)"
            ></el-input>
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
      brandisShow: false, 
      brandeditShow: false, 
      brandForm: {
        
        brandName: "",
        remark: ""
      },
      editBrandForm: {
        
        brandName: "",
        remark: ""
      },
      brandArray: [], 
      brandTotal: 0, 
      brandRules: {
        brandName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" }
        ]
      },
      lightIsShow: false, 
      lightSubmit: function() {}, 
      light_title: "", 
      lightForm: {
        lightModel: "",
        lampCategory: "",
        standardPower: "",
        avgLife: "",
        procurementPrice: "",
        remark: ""
      },
      brandOptions: [], 
      lampOptions: [
        {
          
          value: "LED",
          label: "LED"
        },
        {
          value: "HID",
          label: "HID"
        },
        {
          value: "COSMO",
          label: "COSMO"
        },
        {
          value: "HIGH_PRESSURE_SODIUM",
          label: "高压纳灯"
        },
        {
          value: "LOW_PRESSURE_SODIUM",
          label: "低压纳灯"
        },
        {
          value: "METAL_HALIDE",
          label: "金卤灯"
        }
      ],
      lightArray: [], 
      lightTotal: 0, 
      lightRules: {
        lightModel: [{ required: true, message: "不能为空", trigger: "blur" }],
        brandId: [{ required: true, message: "不能为空", trigger: "change" }],
        lampCategory: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        standardPower: [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        avgLife: [
          { required: true, message: "不能为空", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        procurementPrice: [{ type: "number", message: "必须为数字值" }]
      },
      annexIsShow: false, 
      annexSubmit: function() {}, 
      annex_title: "", 
      annexForm: {
        annexModel: "",
        brandId: "",
        lampCategory: "",
        annexType: "",
        dimmingType: "",
        dimmingAttribute: "",
        remark: ""
      },
      annexArray: [], 
      annexTypeOptions: [
        
        {
          value: "ELECTRONIC_BALLAST",
          label: "电子整流器"
        },
        {
          value: "DRIVE_POWER",
          label: "驱动电源"
        }
      ],
      dimmingTypeOptions: [
        
        {
          value: "UNDIMMING",
          label: "不可调光"
        },
        {
          value: "STEP_DIMMING",
          label: "分档调光"
        },
        {
          value: "STEPLESS_DIMMING",
          label: "无极调光"
        }
      ],
      dimmingAttributeOptions: [
        
        {
          value: "FORWARD",
          label: "正向调光"
        },
        {
          value: "REVERSE",
          label: "反向调光"
        }
      ],
      annexTotal: 0, 
      annexRules: {
        annexModel: [{ required: true, message: "不能为空", trigger: "blur" }],
        brandId: [{ required: true, message: "不能为空", trigger: "change" }],
        lampCategory: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        annexType: [{ required: true, message: "不能为空", trigger: "change" }],
        dimmingType: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        dimmingAttribute: [
          { required: true, message: "不能为空", trigger: "change" }
        ]
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
    async getAllBrand(val, currentPage = 1, size = 10) {
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
    openAddBrand() {
      this.brandisShow = true;
    },
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
    colseDialog() {
      if (this.brandisShow) {
        this.$refs["brandForm"].resetFields();
        this.brandisShow = false;
      }
      if (this.brandeditShow) {
        this.$refs["editBrand_Form"].resetFields();
        this.brandeditShow = false;
      }
      if (this.lightIsShow) {
        this.$refs["light_Form"].resetFields();
        this.lightIsShow = false;
      }
      if (this.annexIsShow) {
        this.$refs["annex_Form"].resetFields();
        this.annexIsShow = false;
      }
    },
    async getAllLight(val, currentPage = 1, size = 10) {
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
    openAddLight() {
      this.light_title = "灯具增加";
      this.getAllSelect();
      this.lightSubmit = this.addLight;
      this.lightIsShow = true;
    },
    async getAllSelect() {
      let res = await get_all_brand();
      if (res) {
        this.brandOptions = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    addLight() {
      this.$refs["light_Form"].validate(async valid => {
        if (valid) {
          let data = this.lightForm;

          let res = await add_light({ data });
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
    async openeditLight(row) {
      this.light_title = "灯具修改";
      let data = { id: row.lightId };
      let res = await get_light_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.lightForm = res.data.content;
        this.lightSubmit = this.addLight;
        this.lightIsShow = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    deleteLight(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.lightId };

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
    async getAllAnnex(val, currentPage = 1, size = 10) {
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
    async openeditAnnex(row) {
      this.annex_title = "灯具修改";
      let data = { id: row.annexId };
      let res = await get_annex_byid({ data });
      if (res.data.success) {
        this.getAllSelect();
        this.annexForm = res.data.content;
        this.annexSubmit = this.addAnnex;
        this.annexIsShow = true;
      } else {
        this.$message.error(res.data.msgCode);
      }
    },
    openAddAnnex() {
      this.annex_title = "电源增加";
      this.getAllSelect();
      this.annexSubmit = this.addAnnex;
      this.annexIsShow = true;
    },
    addAnnex() {
      this.$refs["annex_Form"].validate(async valid => {
        if (valid) {
          let data = this.annexForm;

          let res = await add_annex({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllAnnex();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    deleteAnnex(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.annexId };

          let res = await delete_annex({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllAnnex();
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
    line-height: 25px !important ;
  }
  .brand_select {
    width: 100%;
  }
}
</style>