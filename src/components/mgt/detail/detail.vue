<template>
  <div class="brand_box">
    <!-- 集中器表格 -->
    <Table
      :table_title="'集中器管理'"
      :tableData="concentArray"
      :columnArray="[
      {prop:'regionName',label:'区域'},
      {prop:'concentName',label:'集中器名称'},
      {prop:'roadName',label:'道路'},
      {prop:'addressField',label:'集中器地址'},
      {prop:'simcard',label:'SIM卡号'},
      {prop:'lng',label:'经度'},
      {prop:'lat',label:'纬度'},
      {prop:'address',label:'地址'},
      {prop:'remark',label:'备注'}
      ]"
      :_delete="deleteConcent"
      :delete_button="true"
      :noPagination="true"
      :_edit="openEditconcent"
      :workState="true"
    ></Table>
    <!-- 光源信息 -->
    <Table
      :table_title="'光源信息'"
      :tableData="lightArray"
      :columnArray="[
      {prop:'termUid',label:'控制器编号'},
      {prop:'concentName',label:'区域'},
      {prop:'roadName',label:'道路'},
      {prop:'lightId',label:'灯杆编号'},
      {prop:'luminId',label:'照明类型'},
      {prop:'lng',label:'照明分组'}
      ]"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="lightTotal"
      :pageChange="getAllLight"
      :operation="true"
      :tongbu="true"
    ></Table>
    <!-- 终端信息 -->
    <Table
      :table_title="'终端信息'"
      :tableData="versionInfo"
      :columnArray="[
      {prop:'termUid',label:'设备编号'},
      {prop:'concentName',label:'软件版本'},
      {prop:'roadName',label:'软件发布日期'},
      {prop:'lightId',label:'配置容量信息码'},
      {prop:'luminId',label:'通信协议版本'},
      {prop:'lng',label:'硬件版本'},
      {prop:'lat',label:'硬件发布日期'}
      ]"
      :noPagination="true"
      :operation="true"
      :tongbu="true"
    ></Table>
    <!-- 主站IP地址和端口 -->
    <Table
      :table_title="'主站IP地址和端口'"
      :tableData="[1]"
      :columnArray="[
      {prop:'termUid',label:'IP地址'},
      {prop:'concentName',label:'端口'},
      {prop:'roadName',label:'IP地址'},
      {prop:'lightId',label:'备用端口'},
      {prop:'luminId',label:'APN'}
      ]"
      :noPagination="true"
      :tongbu="true"
      :_edit="openEditIP"
    ></Table>
    <!-- 集中器弹出框 -->
    <Mydialog
      :isShow="concentisShow"
      :tittle="concent_title"
      :width="'600px'"
      :submit="concentSubmit"
    >
      <div class="form_box">
        <el-form
          ref="concentForm"
          :rules="concentRules"
          :model="concentForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="集中器名称" prop="concentName">
            <el-input v-model="concentForm.concentName"></el-input>
          </el-form-item>
          <el-form-item label="道路" prop="roadId">
            <el-select v-model="concentForm.roadId" placeholder="请选择" popper-class="myselect">
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
            <el-input v-model="concentForm.addressField"></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号" prop="simcard">
            <el-input v-model="concentForm.simcard"></el-input>
          </el-form-item>
          <el-form-item required>
            <el-col :span="11">
              <el-form-item label="经度" prop="lng">
                <el-input v-model="concentForm.lng"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item label="纬度" prop="lat">
                <el-input v-model="concentForm.lat"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="concentForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="4" class="textarea_ps" v-model="concentForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
    <!-- 主站ip地址和端口编辑 -->
    <Mydialog :isShow="IPisShow" :tittle="IP_title" :width="'600px'" :submit="IPSubmit">
      <div class="form_box">
        <el-form
          ref="IPForm"
          :rules="IPRules"
          :model="IPForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="ip地址" prop="IP">
            <el-input v-model="IPForm.IPName"></el-input>
          </el-form-item>

          <el-form-item label="端口" prop="port">
            <el-input v-model="IPForm.addressField"></el-input>
          </el-form-item>
          <el-form-item label="备用ip" prop="stand-by">
            <el-input v-model="IPForm.simcard"></el-input>
          </el-form-item>

          <el-form-item label="备用端口" prop="stand-by">
            <el-input v-model="IPForm.address"></el-input>
          </el-form-item>
          <el-form-item label="APN" prop="APN">
            <el-input v-model="IPForm.address"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
  </div>
</template>

<script>
import Table from "../../home/table2/table";
import Mydialog from "../../my-dialog/my-dialog";
import {
  get_concent_byid,
  delete_concent,
  edit_concent,
  get_select_road,
  get_all_light,
  get_concentVersionInfo
} from "../../../api/http/detail";
export default {
  name: "",
  props: [""],
  data() {
    return {
      requiredMsg: "不能为空",
      // ===========集中器===========
      concentId: 12,
      concentisShow: false, // 新增弹框
      concentForm: {
        // 新增
        concentName: "",
        remark: ""
      },
      concent_title: "", // 标题
      concentSubmit: function() {}, // 提交的默认函数
      concentArray: [], // 列表
      concentTotal: 0, // 总数
      concentRules: {
        concentId: [{ required: true, message: "不能为空", trigger: "blur" }],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        simcard: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      roadOptions: [], // 集中器下拉列表
      search: {
        concentCode: "",
        roadOptValue: "",
        workState: ""
      },
      // =======光源=======
      lightArray: [],
      lightTotal: 0,
      // =======终端信息===
      versionInfo: [],
      //=====IP和端口======
      IPisShow: false,
      IP_title: "主站ip地址和端口编辑",
      IPSubmit: function() {},
      IPRules: {
        IP: [{ required: true, message: "不能为空", trigger: "blur" }],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        simcard: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      IPForm: {}
    };
  },

  components: {
    Table,
    Mydialog
  },

  computed: {},

  beforeMount() {},
  created() {
    // 获取concentId
    // this.concentId = this.$route.params.addressField;
    if (this.concentId) {
      this.getConcentById();
      this.getAllLight();
      this.getVersionInfo();
    }
  },
  mounted() {},

  methods: {
    // ============集中器==================
    // 获取集中器数据
    async getConcentById(edit) {
      let data = {
        id: this.concentId
      };
      let res = await get_concent_byid({ data });
      console.log(data);

      if (res.data.success) {
        if (edit) {
          this.concentForm = res.data.content;
        } else {
          let arr = [];
          arr[0] = res.data.content;
          this.concentArray = arr;
        }
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开修改弹框
    openEditconcent() {
      this.concent_title = "集中器编辑";
      this.concentSubmit = this.editconcent;
      this.getConcentById(true);
      this.getAllSelect();
      this.concentisShow = true;
    },
    // 修改集中器
    editconcent() {
      this.$refs["concentForm"].validate(async valid => {
        if (valid) {
          let data = {
            id: this.concentForm.concentId,
            roadId: this.concentForm.roadId,
            addressField: this.concentForm.addressField,
            concentName: this.concentForm.concentName,
            simcard: this.concentForm.simcard,
            lng: this.concentForm.lng,
            lat: this.concentForm.lat,
            address: this.concentForm.address,
            remark: this.concentForm.remark
          };
          console.log(data);

          let res = await edit_concent({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getConcentById();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 删除集中器
    deleteConcent() {
      this.$confirm("是否删除该集中器?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: this.concentId };
          let res = await delete_concent({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.$router.push({ name: "concent" });
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },
    // 获取集中器终端信息
    async getVersionInfo() {
      let data = {
        conId: this.concentId
      };
      let res = await get_concentVersionInfo({ data });
      console.log(res);
      if (res.data.ackState == "SUCCESS") {
        this.versionInfo = res.data.fnResults[0].data;
      } else {
        this.$message.error(res.data.ackState);
      }
    },
    // 获取集中器内所有光源
    async getAllLight(currentPage = 1, size = 5) {
      let data = {
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_light({ data });
      console.log(res);
      if (res) {
        this.lightTotal = res.data.total;
        this.lightArray = res.data.rows;
      }
    },

    // 关闭窗口
    colseDialog() {
      this.concentisShow = false;
      this.concentForm = {};
      // ===ip===
      this.IPisShow=false
    },
    //========打开修改ip弹框==========
    openEditIP(){
      this.IPisShow=true
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