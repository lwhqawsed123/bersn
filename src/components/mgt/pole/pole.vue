<template>
  <div class="brand_box">
    <Table
      :table_title="'光源管理'"
      :tableData="poleArray"
      :columnArray="[
      {prop:'poleCode',label:'灯杆编号'},
      {prop:'poleType',label:'灯杆类型'},
      {prop:'regionName',label:'区域'},
      {prop:'roadName',label:'道路'},
      {prop:'addressField',label:'集中器编号'},
      {prop:'lng',label:'经度'},
      {prop:'lat',label:'纬度'},
      {prop:'address',label:'地址'},
      ]"
      :_edit="openeditpole"
      :size="10"
      :sizes="[10,20,30,40]"
      :pageChange="getAllpole"
      :total="poleTotal"
      :openAdd="openAddpole"
      :_delete="deletepole"
    >
      <div class="search_box">
        <span>灯杆编号：</span>
        <el-input
          class="search_input"
          clearable
          v-model="search.poleCode"
          placeholder="全部"
          @keyup.enter.native="getAllpole"
          @clear="getAllpole"
        ></el-input>
        <span class="search_road">道路：</span>
        <el-select
          v-model="search.roadId"
          clearable
          placeholder="全部"
          popper-class="myselect search_select"
          class="search_input"
          @change="getAllpole"
        >
          <el-option-group v-for="group in roadOptions" :key="group.id" :label="group.optText">
            <el-option :label="group.optText" :value="group.optValue"></el-option>
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.optText"
              :value="item.optValue"
            ></el-option>
          </el-option-group>
        </el-select>
        <span class="search_road">集中器编号：</span>
        <el-input
          class="search_input"
          clearable
          v-model="search.concentCode"
          placeholder="全部"
          @keyup.enter.native="getAllpole"
          @clear="getAllpole"
        ></el-input>

        <button class="search_button" @click="getAllpole">搜索</button>
      </div>
    </Table>
    <Mydialog :isShow="poleisShow" :tittle="pole_title" :width="'600px'" :submit="poleSubmit">
      <div class="form_box">
        <el-form
          ref="pole_Form"
          :rules="poleRules"
          :model="poleForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="灯杆编号" prop="poleCode">
            <el-input
              v-model="poleForm.poleCode"
              maxlength="100"
              @input="e => poleForm.poleCode = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="道路" prop="roadId">
            <el-select v-model="poleForm.roadId" placeholder="请选择" popper-class="myselect">
              <el-option-group v-for="group in roadOptions" :key="group.id" :label="group.optText">
                <el-option
                  v-for="item in group.children"
                  :key="item.id"
                  :label="item.optText"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="集中器" prop="concentId">
            <el-select v-model="poleForm.concentId" placeholder="请选择">
              <el-option
                v-for="item in contentOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="灯杆类型" prop="poleType">
            <el-select v-model="poleForm.poleType" placeholder="请选择" popper-class="myselect">
              <el-option
                v-for="item in poleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="经度" prop="lng">
                <el-input v-model="poleForm.lng"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item label="纬度" prop="lat">
                <el-input v-model="poleForm.lat"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="poleForm.address"
              maxlength="100"
              @input="e => poleForm.address = validSe(e)"
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
  add_pole,
  get_all_pole,
  get_pole_byid,
  delete_pole,
  get_select_road,
  get_select_content
} from "../../../api/http/pole";
export default {
  name: "",
  props: [""],
  data() {
    var checkLng = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      if (!longrg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    var checkLat = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (!latreg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    return {
      requiredMsg: "不能为空",
      poleisShow: false, 
      poleForm: {
        poleCode: "",
        roadId: "",
        concentId: "",
        poleType: "",
        lng: "",
        lat: "",
        address: ""
      },
      pole_title: "", 
      poleSubmit: function() {}, 
      poleArray: [], 
      poleTotal: 0, 
      poleRules: {
        poleCode: [{ required: true, message: "不能为空", trigger: "blur" }],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        concentId: [{ required: true, message: "不能为空", trigger: "change" }],
        poleType: [{ required: true, message: "不能为空", trigger: "change" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        roadId: [{ required: true, message: "不能为空", trigger: "change" }],
        lng: [{ validator: checkLng }],
        lat: [{ validator: checkLat }]
      },
      roadOptions: [], 
      contentOptions: [], 
      poleOptions: [
        {
          value: "MIDDLE_POLE",
          label: "中杆灯"
        },
        {
          value: "HIGH_POLE",
          label: "高杆灯"
        },
        {
          value: "LANDSCAPE",
          label: "景观灯"
        }
      ],
      search: {
        poleCode: "",
        roadId: "",
        concentCode: ""
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
    this.getAllpole();
    this.getAllSelect();
  },

  methods: {
    async getAllpole(val, currentPage = 1, size = 10) {
      let data = {};
      if (this.search.poleCode) {
        data = {
          pageNo: currentPage,
          pageSize: size,
          "pole.optValue": this.search.roadId,
          "pole.poleCode": this.search.poleCode,
          "pole.concentCode": this.search.concentCode
        };
      } else {
        data = {
          pageNo: currentPage,
          pageSize: size,
          "pole.optValue": this.search.roadId,
          "pole.concentCode": this.search.concentCode
        };
      }

      let res = await get_all_pole({ data });
      if (res) {
        this.poleTotal = res.data.total;
        this.poleArray = res.data.rows;
        this.poleArray.forEach(item => {
          if (item.poleType == "HIGH_POLE") {
            item.poleType = "高杆灯";
          } else if (item.poleType == "LANDSCAPE") {
            item.poleType = "景观灯";
          } else if (item.poleType == "MIDDLE_POLE") {
            item.poleType = "中杆灯";
          }
        });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    
    openAddpole() {
      this.pole_title = "新增集中器";
      this.poleSubmit = this.addpole;
      this.getAllSelect();
      this.poleisShow = true;
    },
    
    addpole() {

      this.$refs["pole_Form"].validate(async valid => {
        if (valid) {
          let data = this.poleForm;

          let res = await add_pole({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAllpole();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    
    async openeditpole(row) {
      this.pole_title = "集中器修改";
      this.poleSubmit = this.addpole;
      let data = {
        id: row.poleId
      };

      let res = await get_pole_byid({ data });
      if (res.data.success) {
        this.getAllSelect();

        this.poleForm = res.data.content;
        this.poleisShow = true;
      }
    },

    
    deletepole(row) {
      this.$confirm("是否删除该灯杆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.poleId };
          let res = await delete_pole({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAllpole();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },

    
    colseDialog() {
      this.$refs["pole_Form"].resetFields();
      setTimeout(() => {
        this.poleisShow = false;
      }, 100);
    },
    async getAllSelect() {
      let res = await get_select_road();
      if (res) {
        this.roadOptions = res.data.content;
        this.roadOptions.shift();
        this.roadOptions = this.remmoveEmpty(this.roadOptions);
        get_select_content().then(res => {
          if (res.data.success) {
            this.contentOptions = res.data.content;
          }
        });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    
    remmoveEmpty(arr) {
      arr.forEach(item => {
        if (item.children) {
          if (item.children.length === 0) {
            delete item.children;
          } else {
            this.remmoveEmpty(item.children);
          }
        }
      });
      return arr;
    }
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../../assets/less/concent/concent.less";
</style>