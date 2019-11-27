<template>
  <div class="brand_box">
    <div class="table_box">
      <div class="table_header">
        <span class="table_header_left">
          <span class="table_header_left_line"></span>
          <span class="table_title">调光定时任务</span>
        </span>
        <button class="add_button" @click="openAddlampTask">+ 添加</button>
      </div>
      <!-- 搜索框 -->
      <div class="search_box">
      <span>灯杆编号：</span>
      <el-input
        class="search_input"
        clearable
        v-model="search.lampTaskCode"
        placeholder="全部"
        @keyup.enter.native="getAlllampTask"
        @clear="getAlllampTask"
      ></el-input>
      <span class="search_road">道路：</span>
      <el-select
        v-model="search.roadId"
        clearable
        placeholder="全部"
        popper-class="myselect search_select"
        class="search_input"
        @change="getAlllampTask"
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
      <span class="search_workStates">集中器编号：</span>
      <el-input
        class="search_input"
        clearable
        v-model="search.concentCode"
        placeholder="全部"
        @keyup.enter.native="getAlllampTask"
        @clear="getAlllampTask"
      ></el-input>

      <button class="search_button" @click="getAlllampTask">搜索</button>
    </div>
    <!-- 搜索框结束 -->
      <el-table
        :data="lampTaskArray"
        style="width: 100%"
        class="table_content"
        :header-cell-style="{background:'#f1f1f1',color:'#666666'}"
      >
        <el-table-column label="任务名称" prop="taskName"></el-table-column>
        <el-table-column label="任务区域" prop="taskName"></el-table-column>
        <el-table-column label="任务道路" prop="taskName"></el-table-column>
        <el-table-column label="起始日期" prop="taskName"></el-table-column>
        <el-table-column label="周期" prop="taskName"></el-table-column>
        <el-table-column label="状态" prop="taskName"></el-table-column>

        <el-table-column label="操作" width="116">
          <template slot-scope="scope">
            <img
              class="edit"
              src="../../../assets/img/mgt/bianji.png"
              style="cursor: pointer;"
              alt
              @click="openAddlampTask(scope.row)"
            />
            <img
              class="delete"
              src="../../../assets/img/mgt/删除.png"
              style="margin-left:15px;cursor: pointer;"
              alt
              @click="deletelampTask(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="sizes"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="lampTaskTotal"
        ></el-pagination>
      </div>
    </div>
    
    <!-- 集中器弹出框 -->
    <Mydialog
      :isShow="lampTaskisShow"
      :tittle="lampTask_title"
      :width="'600px'"
      :submit="lampTaskSubmit"
    >
      <div class="form_box">
        <el-form
          ref="lampTaskForm"
          :rules="lampTaskRules"
          :model="lampTaskForm"
          label-width="80px"
          label-position="top"
        >
          <el-form-item label="杠杆编号" prop="lampTaskCode">
            <el-input v-model="lampTaskForm.lampTaskCode" maxlength="100"
              @input="e => lampTaskForm.lampTaskCode = validSe(e)"></el-input>
          </el-form-item>
          <el-form-item label="道路" prop="roadId">
            <el-select v-model="lampTaskForm.roadId" placeholder="请选择" popper-class="myselect">
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
            <el-select v-model="lampTaskForm.concentId" placeholder="请选择">
              <el-option
                v-for="item in contentOptions"
                :key="item.id"
                :label="item.optText"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="灯杆类型" prop="lampTaskType">
            <el-select
              v-model="lampTaskForm.lampTaskType"
              placeholder="请选择"
              popper-class="myselect"
            >
              <el-option
                v-for="item in lampTaskOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-col :span="11">
              <el-form-item label="经度" prop="lng">
                <el-input v-model="lampTaskForm.lng"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item label="纬度" prop="lat">
                <el-input v-model="lampTaskForm.lat"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="lampTaskForm.address" maxlength="100"
              @input="e => lampTaskForm.address = validSe(e)"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Mydialog>
  </div>
</template>

<script>
import Mydialog from "../../my-dialog/my-dialog";
import {
  add_lampTask,
  get_all_lampTask,
  get_lampTask_byid,
  delete_lampTask
} from "../../../api/http/lampTask";
export default {
  name: "",
  props: [""],
  data() {
     var checkLng = (rule, value, callback) => {
      var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
      if (!longrg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    var checkLat = (rule, value, callback) => {
      var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
      if (!latreg.test(value)) {
        callback(new Error("格式错误"));
      } else {
        callback();
      }
    };
    return {
      requiredMsg: "不能为空",
      // ===========集中器===========
      lampTaskisShow: false, // 新增弹框
      lampTaskForm: {},
      lampTask_title: "", // 标题
      lampTaskSubmit: function() {}, // 提交的默认函数
      lampTaskArray: [], // 列表
      // 分页
      lampTaskTotal: 0, // 总数
      currentPage: 1,
      sizes: [10,20,30,40],
      size: 10,
      // 规则
      lampTaskRules: {
        lampTaskCode: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        addressField: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        concentId: [{ required: true, message: "不能为空", trigger: "change" }],
        lampTaskType: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        address: [{ required: true, message: "不能为空", trigger: "blur" }],
        roadId: [{ required: true, message: "不能为空", trigger: "change" }],
        lng: [{ validator: checkLng, trigger: "blur" }],
        lat: [{ validator: checkLat, trigger: "blur" }]
      },
      roadOptions: [], // 道路下拉列表
      contentOptions: [], // 集中器下拉列表
      lampTaskOptions: [
        {
          value: "MIDDLE_lampTask",
          label: "中杆灯"
        },
        {
          value: "HIGH_lampTask",
          label: "高杆灯"
        },
        {
          value: "LANDSCAPE",
          label: "景观灯"
        }
      ],
      search: {
        lampTaskCode: "",
        roadId: "",
        concentCode: ""
      }
    };
  },

  components: {
    Mydialog
  },

  computed: {},

  beforeMount() {},

  mounted() {
    this.getAlllampTask();
    this.getAllSelect();
  },

  methods: {
    // ============集中器==================
    // 获取所有集中器数据
    async getAlllampTask() {
      let data = {};
      if (this.search.lampTaskCode) {
        data = {
          pageNo: this.currentPage,
          pageSize: this.size,
          "lampTask.roadId": this.search.roadId,
          "lampTask.lampTaskCode": this.search.lampTaskCode,
          "lampTask.concentCode": this.search.concentCode
        };
      } else {
        data = {
          pageNo: this.currentPage,
          pageSize: this.size,
          "lampTask.roadId": this.search.roadId,
          "lampTask.concentCode": this.search.concentCode
        };
      }

      let res = await get_all_lampTask({ data });
      if (res) {
        this.lampTaskTotal = res.data.total;
        this.lampTaskArray = res.data.rows;
        this.lampTaskArray.forEach(item => {
          if (item.lampTaskType == "HIGH_lampTask") {
            item.lampTaskType = "高杆灯";
          } else if (item.lampTaskType == "LANDSCAPE") {
            item.lampTaskType = "景观灯";
          } else if (item.lampTaskType == "MIDDLE_lampTask") {
            item.lampTaskType = "中杆灯";
          }
        });
      } else {
        this.$message.error("服务器未响应");
      }
    },
    // 打开新增弹框
    openAddlampTask() {
      this.lampTask_title = "新增集中器";
      this.lampTaskSubmit = this.addlampTask;
      this.getAllSelect();
      this.lampTaskisShow = true;
    },
    // 新增集中器
    addlampTask() {
      this.$refs["lampTaskForm"].validate(async valid => {
        if (valid) {
          let data = this.lampTaskForm;
          let res = await add_lampTask({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.colseDialog();
            this.getAlllampTask();
          } else {
            this.$message.error(res.data.msgCode);
          }
        } else {
          return false;
        }
      });
    },
    // 打开修改集中器弹框
    async openeditlampTask(row) {
      this.lampTask_title = "集中器修改";
      this.lampTaskSubmit = this.addlampTask;
      let data = {
        id: row.lampTaskId
      };

      let res = await get_lampTask_byid({ data });
      if (res.data.success) {
        this.getAllSelect();

        this.lampTaskForm = res.data.content;
        this.lampTaskisShow = true;
      }
    },

    // 删除灯杆
    deletelampTask(row) {
      this.$confirm("是否删除该灯杆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = { id: row.lampTaskId };
          let res = await delete_lampTask({ data });
          if (res.data.success) {
            this.$message.success(res.data.msgCode);
            this.getAlllampTask();
          } else {
            this.$message.error(res.data.msgCode);
          }
        })
        .catch(() => {});
    },

    // 关闭窗口
    colseDialog() {
      this.lampTaskisShow = false;
      this.$refs["lampTaskForm"].resetFields();
    },
    // 获取下拉列表(仅子节点)
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
    },
    handleSizeChange(val){
      this.size=val
      this.getAlllampTask()
    },
    handleCurrentChange(val){
      this.currentPage=val
      this.getAlllampTask()
    },
  },

  watch: {}
};
</script>
<style lang='less' >
@import "../../../assets/less/table/table.less";
@import "../../../assets/less/concent/concent.less";
</style>