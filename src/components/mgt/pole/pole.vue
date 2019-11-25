<template>
  <div class="brand_box">
    <Table
      :table_title="'集中器管理'"
      :tableData="poleArray"
      :columnArray="[
      {prop:'regionName',label:'区域'},
      {prop:'poleName',label:'集中器名称'},
      {prop:'roadName',label:'道路'},
      {prop:'addressField',label:'集中器地址'},
      {prop:'simcard',label:'SIM卡号'},
      {prop:'lng',label:'经度'},
      {prop:'lat',label:'纬度'},
      {prop:'address',label:'地址'},
      {prop:'remark',label:'备注'}
      ]"
      :_edit="openeditpole"
      :pageChange="getAllpole"
      :total="poleTotal"
      :openAdd="openAddpole"
    >
      <div class="search_box">
        <span>集中器编号：</span>
        <el-input class="search_input" clearable v-model="search.poleCode" placeholder="全部" @keyup.enter.native="getAllpole" @clear='getAllpole'></el-input>
        <span class="search_road">道路：</span>
        <el-select
          v-model="search.roadOptValue"
          clearable
          placeholder="全部"
          popper-class="myselect search_select"
           class="search_input"
          @change="getAllpole"
        >
          <el-option-group v-for="group in roadOptions" :key="group.id" :label="group.optText">
            <el-option
              v-for="item in group.children"
              :key="item.id"
              :label="item.optText"
              :value="item.id"
            ></el-option>
          </el-option-group>
        </el-select>
        <span class="search_workStates">工作状态：</span>
        <el-select v-model="search.workState" clearable placeholder="全部" class="search_input" @change="getAllpole">
          <el-option
            v-for="item in [{
                value: 1,
                label: '正常'
              }, {
                value: 2,
                label: '警告'
              }]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            placeholder="全部"
          ></el-option>
        </el-select>
        <button class="search_button" @click="getAllpole">搜索</button>
      </div>
    </Table>
    <!-- 集中器弹出框 -->
    <Mydialog
      :isShow="poleisShow"
      :tittle="pole_title"
      :width="'600px'"
      :submit="poleSubmit"
    >
      <div class="form_box">
        <el-form
          ref="poleForm"
          :rules="poleRules"
          :model="poleForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="集中器名称" prop="poleName">
            <el-input v-model="poleForm.poleName"></el-input>
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
          <el-form-item label="集中器地址" prop="addressField">
            <el-input v-model="poleForm.addressField"></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号" prop="simcard">
            <el-input v-model="poleForm.simcard"></el-input>
          </el-form-item>
          <el-form-item required>
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
            <el-input v-model="poleForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="poleForm.remark"></el-input>
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
  get_select_road
} from "../../../api/http/pole";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      // ===========集中器===========
      poleisShow: false, // 新增弹框
      poleForm: {
        // 新增
        poleName: "",
        remark: ""
      },
      pole_title: "", // 标题
      poleSubmit: function() {}, // 提交的默认函数
      poleArray: [], // 列表
      poleTotal: 0, // 总数
      poleRules: {
        poleId: [{ required: true, message: "不能为空", trigger: "blur" }],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        simcard: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      roadOptions: [], // 集中器下拉列表
      search: {
        poleCode: "",
        roadOptValue: "",
        workState: ""
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
    // ============集中器==================
    // 获取所有集中器数据
    async getAllpole(val,currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size,
        'pole.roadId':this.search.roadOptValue,
        'pole.addressField':this.search.poleCode,
        'pole.workState':this.search.workState,
      };
      let res = await get_all_pole({ data });
      if (res) {
        this.poleTotal = res.data.total;
        this.poleArray = res.data.rows;
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增弹框
    openAddpole() {
      this.pole_title = "新增集中器";
      this.poleSubmit = this.addpole;
      this.getAllSelect();
      this.poleisShow = true;
    },
    // 新增集中器
    addpole() {
      this.$refs["poleForm"].validate(async valid => {
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
    // 打开修改集中器弹框
    openeditpole(row) {
      this.$router.push({ name: 'detail', params: { addressField: row.poleId }})
    },

    // 关闭窗口
    colseDialog() {
      this.poleisShow = false;
      this.poleForm = {};
    },
    // 获取下拉列表(仅子节点)
    async getAllSelect() {
      let res = await get_select_road();
      if (res) {
        this.roadOptions = res.data.content;
        this.roadOptions.shift();
        this.roadOptions = this.remmoveEmpty(this.roadOptions);
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 删除数组中为空的children
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