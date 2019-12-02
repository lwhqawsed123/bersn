<template>
  <div class="brand_box">
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
    <Table
      :table_title="'光源信息'"
      :tableData="lightArray"
      :columnArray="[
      {prop:'termUid',label:'控制器编号'},
      {prop:'regionName',label:'区域'},
      {prop:'roadName',label:'道路'},
      {prop:'poleCode',label:'灯杆编号'},
      {prop:'categoryName',label:'照明类型'},
      {prop:'luminName',label:'照明分组'}
      ]"
      :size="10"
      :sizes="[10,20,30,40]"
      :total="lightTotal"
      :pageChange="getAllLight"
      :_delete="pushLamp"
      :operation="true"
      :tongbu="true"
    ></Table>
    <Table
      :table_title="'终端信息'"
      :tableData="termInfo"
      :columnArray="[
      {prop:'deviceCode',label:'设备编号'},
      {prop:'softVersion',label:'软件版本'},
      {prop:'softPublishDate',label:'软件发布日期'},
      {prop:'storeInfoCode',label:'配置容量信息码'},
      {prop:'procotolVersion',label:'通信协议版本'},
      {prop:'hardVersion',label:'硬件版本'},
      {prop:'hardPublishDate',label:'硬件发布日期'}
      ]"
      :noPagination="true"
      :operation="true"
      :refresh="true"
      :_delete="getConcentById"
    ></Table>
    <Table
      :table_title="'主站IP地址和端口'"
      :tableData="IPArray"
      :columnArray="[
      {prop:'mainIp',label:'IP地址'},
      {prop:'mainPort',label:'端口'},
      {prop:'secIp',label:'备用IP地址'},
      {prop:'secPort',label:'备用端口'},
      {prop:'apn',label:'APN'}
      ]"
      :noPagination="true"
      :refresh="true"
      :_delete="getConcentById"
      :_edit="openEditIP"
    ></Table>
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
            <el-input
              v-model="concentForm.concentName"
              maxlength="100"
              @input="e => concentForm.concentName = validSe(e)"
            ></el-input>
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
            <el-input
              v-model="concentForm.addressField"
              maxlength="100"
              @input="e => concentForm.addressField = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="SIM卡号" prop="simcard">
            <el-input
              v-model="concentForm.simcard"
              maxlength="100"
              @input="e => concentForm.simcard = validSe(e)"
            ></el-input>
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
            <el-input
              v-model="concentForm.address"
              maxlength="100"
              @input="e => concentForm.address = validSe(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="4"
              class="textarea_ps"
              v-model="concentForm.remark"
              maxlength="200"
              @input="e => concentForm.remark = validSe(e)"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
    <Mydialog :isShow="IPisShow" :tittle="IP_title" :width="'600px'" :submit="IPSubmit">
      <div class="form_box">
        <el-form
          ref="IPForm"
          :rules="IPRules"
          :model="IPForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="ip地址" prop="mainIp">
            <el-input
              v-model="IPForm.mainIp"
              maxlength="20"
              @input="e => IPForm.mainIp = setIPinput(e)"
            ></el-input>
          </el-form-item>

          <el-form-item label="端口" prop="mainPort">
            <el-input
              v-model="IPForm.mainPort"
              maxlength="5"
              @input="e => IPForm.mainPort = setPort(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="备用ip" prop="secIp">
            <el-input
              v-model="IPForm.secIp"
              maxlength="20"
              @input="e => IPForm.secIp = setIPinput(e)"
            ></el-input>
          </el-form-item>

          <el-form-item label="备用端口" prop="secPort">
            <el-input
              v-model="IPForm.secPort"
              maxlength="5"
              @input="e => IPForm.secPort = setPort(e)"
            ></el-input>
          </el-form-item>
          <el-form-item label="APN" prop="apn">
            <el-input v-model="IPForm.apn" maxlength="32"></el-input>
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
  push_lamp
} from "../../../api/http/detail";
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
    var checkIP = (rule, value, callback) => {
      var IPreg = /^(\d{1}|[1-9]{1}\d{1}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1}|[1-9]{1}\d{1}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1}|[1-9]{1}\d{1}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1}|[1-9]{1}\d{1}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!IPreg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    var checkPort = (rule, value, callback) => {
      var portReg = /^[1-9]$|(^[1-9][0-9]$)|(^[1-9][0-9][0-9]$)|(^[1-9][0-9][0-9][0-9]$)|(^[1-6][0-5][0-5][0-3][0-5]$)/;
      if (!portReg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    return {
      requiredMsg: "不能为空",
      concentId: "",
      concentisShow: false, 
      concentForm: {
        concentName: "",
        roadId: "",
        addressField: "",
        simcard: "",
        lng: "",
        lat: "",
        address: "",
        remark: ""
      },
      concent_title: "", 
      concentSubmit: function() {}, 
      concentArray: [], 
      concentTotal: 0, 
      concentRules: {
        concentName: [{ required: true, message: "不能为空", trigger: "blur" }],
        roadId: [{ required: true, message: "不能为空", trigger: "change" }],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        simcard: [{ required: true, message: "不能为空", trigger: "blur" }],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        lng: [{ validator: checkLng, trigger: "blur" }],
        lat: [{ validator: checkLat, trigger: "blur" }]
      },
      roadOptions: [], 
      search: {
        concentCode: "",
        roadOptValue: "",
        workState: ""
      },
      lightArray: [],
      lightTotal: 0,
      termInfo: [],
      IPisShow: false,
      IPArray: [],
      IP_title: "主站ip地址和端口编辑",
      IPSubmit: function() {},
      IPRules: {
        mainIp: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: checkIP, trigger: "blur" }
        ],
        mainPort: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: checkPort, trigger: "blur" }
        ],
        secIp: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: checkIP, trigger: "blur" }
        ],
        secPort: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: checkPort, trigger: "blur" }
        ],
        apn: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      IPForm: {
        mainIp: "",
        mainPort: "",
        secIp: "",
        secPort: "",
        apn: ""
      }
    };
  },

  components: {
    Table,
    Mydialog
  },

  computed: {},

  beforeMount() {},
  created() {
    let concentId = sessionStorage.getItem("concentId");
    if (concentId) {
      this.concentId = concentId;
      this.getConcentById();
      this.getAllLight();
    }
  },
  mounted() {},

  methods: {
    async getConcentById(edit) {
      let data = {
        id: this.concentId
      };

      let res = await get_concent_byid({ data });

      if (res.data.success) {
        if (edit) {
          this.concentForm = res.data.content;
        } else {
          let arr = [];
          arr[0] = res.data.content;
          this.concentArray = arr;

          let arr1 = [];
          arr1[0] = JSON.parse(
            JSON.stringify(res.data.content.siteIpPort.data)
          );
          this.IPArray = arr1;
          this.IPForm = JSON.parse(
            JSON.stringify(res.data.content.siteIpPort.data)
          );

          let arr2 = [];
          arr2[0] = res.data.content.termInfo.data;
          this.termInfo = arr2;
        }
      } else {
        this.$message.error("服务器未响应");
      }
    },
    
    openEditconcent() {
      this.concent_title = "集中器编辑";
      this.concentSubmit = this.editconcent;
      this.getConcentById(true);
      this.getAllSelect();
      this.concentisShow = true;
    },
    
    editconcent() {
      this.$refs["concentForm"].validate(async valid => {
        if (valid) {
          let data = {
            concentId: this.concentForm.concentId,
            roadId: this.concentForm.roadId,
            addressField: this.concentForm.addressField,
            concentName: this.concentForm.concentName,
            simcard: this.concentForm.simcard,
            lng: this.concentForm.lng,
            lat: this.concentForm.lat,
            address: this.concentForm.address,
            remark: this.concentForm.remark
          };

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
    
    async pushLamp() {
      let data = {
        conId: this.concentId
      };
      console.log(data);

      let res = await push_lamp({ data });
      console.log(res);
      if (res.data.ackState == "SUCCESS") {
        this.$message.success(res.data.ackState);
      } else {
        this.$message.error(res.data.ackState);
      }
    },
    
    async getAllLight(val, currentPage = 1, size = 10) {
      let data = {
        concentId: this.concentId,
        pageNo: currentPage,
        pageSize: size
      };
      let res = await get_all_light({ data });
      if (res) {
        this.lightTotal = res.data.total;
        this.lightArray = res.data.rows;
      }
    },

    
    colseDialog() {
      if (this.concentisShow) {
        this.$refs["concentForm"].resetFields();
        this.concentisShow = false;
      }
      if (this.IPisShow) {
        this.$refs["IPForm"].resetFields();
        this.IPisShow = false;
      }
    },
    openEditIP() {
      this.getConcentById();
      this.IPisShow = true;
    },
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
    },
    
    setIPinput(value) {
      if (!value) {
        return value;
      }
      value = value
        .replace(
          /[^\d|.]/g,
          ""
        )
      return value;
    },
    setPort(value) {
      if (!value) {
        return value;
      }
      value = value
        .replace(
          /[^\d]/g,
          ""
        )
      return value;
    }
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../../assets/less/concent/concent.less";
</style>