<template>
  <div id="app-base-db">
    <div class="header">
      <div class="header-title">
        <span>{{ period }}期总数：</span>
        <span>{{ allSum }}</span>
      </div>
      <div style="display: flex; align-items: center; margin: 28px 0px">
        <van-button class="header-button" type="primary" @click="openBatch">批量加数</van-button>
        <van-button class="header-button" type="danger" @click="deleteAll">清空本期数据</van-button>
        <van-button class="header-button" type="primary" @click="deleteAll">单数</van-button>
        <van-button class="header-button" type="primary" @click="deleteAll">双数</van-button>
        <a-select class="header-button" v-model:value="shengxiaoArr" :options="shengxiaoOptions" mode="multiple"
          size="large" placeholder="Please select" style="width: 200px" @popupScroll="popupScroll">
        </a-select>
        <van-button class="header-button" type="primary" @click="shengxiaoSearch">生肖查询</van-button>
      </div>
    </div>
    <div class="card-warpper">
      <itemCard v-for="(item, index) in allList" :key="index" :ballNum="item.ballNum" :sum="item.sum"
        :shengxiao="item.zodiac" @openDialog="openDialog" @openDetail="openDetail" />
    </div>
    <van-dialog v-model:show="showAddSub" title="操作" show-cancel-button @confirm="amountConfirm">
      <div class="operation-box">
        <a-input autofocus="true" ref="inputAmountRef" v-model:value="operationBall.amount" type="number"
          addon-before="金额" />
      </div>
    </van-dialog>
    <van-dialog width="800" v-model:show="showDetail" title="详情" show-cancel-button>
      <div class="operation-box">
        <span>1+236+365+335</span>
      </div>
    </van-dialog>
    <van-dialog v-model:show="showBatch" title="智能批量添加" show-cancel-button width="800">
      <div style="padding: 24px">
        <a-textarea v-model:value="amountText" placeholder="例如：10.25.33.11.22各15" />
      </div>
    </van-dialog>

    <div class="one-block-1">
      <span> 1. sqlite本地数据库 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="8"> • 大数据量: 0-1024GB(单库) </a-col>
        <a-col :span="8"> • 高性能 </a-col>
        <a-col :span="8"> • 类mysql语法 </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 2. 数据目录 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="12">
          <a-input v-model="data_dir" :value="data_dir" addon-before="数据目录" />
        </a-col>
        <a-col :span="2"> </a-col>
        <a-col :span="5">
          <a-button @click="selectDir"> 修改目录 </a-button>
        </a-col>
        <a-col :span="5">
          <a-button @click="openDir"> 打开目录 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 3. 测试数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="24">
          {{ all_list }}
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 4. 添加数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input v-model:value="name" addon-before="姓名" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-input v-model:value="age" addon-before="年龄" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('add')"> 添加 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 4. 获取数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input v-model="search_age" :value="search_age" addon-before="年龄" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6"> </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('get')"> 查找 </a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          {{ userList }}
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 5. 修改数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input v-model="update_name" :value="update_name" addon-before="姓名(条件)" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-input v-model="update_age" :value="update_age" addon-before="年龄" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('update')"> 更新 </a-button>
        </a-col>
      </a-row>
    </div>
    <div class="one-block-1">
      <span> 6. 删除数据 </span>
    </div>
    <div class="one-block-2">
      <a-row>
        <a-col :span="6">
          <a-input v-model="delete_name" :value="delete_name" addon-before="姓名" />
        </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6"> </a-col>
        <a-col :span="3"> </a-col>
        <a-col :span="6">
          <a-button @click="sqlitedbOperation('del')"> 删除 </a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import itemCard from "@/components/itemCard.vue";
import { showConfirmDialog } from "vant";

export default {
  components: {
    itemCard,
  },
  data() {
    return {
      name: "李四",
      age: 20,
      userList: ["空"],
      search_age: 20,
      update_name: "李四",
      update_age: 31,
      delete_name: "李四",
      all_list: ["空"],
      data_dir: "",
      sum: 100,
      shengxiao: "zhu",
      ballNum: 99,
      showAddSub: false,
      showDetail: false,
      showBatch: false,
      amount: '',
      amountText: "1.5.9.35各10",
      period: "20240531",
      shengxiaoArr: [],
      shengxiaoOptions: [
        {
          value: "猪",
        },
        {
          value: "龙",
        },
      ],
      allSum: 0,
      allList: [],
      operationBall: {
        ballNum: '',
        amount: '',
        operation: ''
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const params = {
        action: "getDataDir",
      };
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
        if (res.code == -1) {
          this.$message.error("请检查sqlite是否正确安装", 5);
          return;
        }

        this.data_dir = res.result;
        console.log('xxxxxx')
        this.queryAllSum();
      });
    },
    getAllTestData() {
      const params = {
        action: "all",
      };
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
        if (res.all_list.length == 0) {
          return false;
        }
        this.all_list = res.all_list;
      });
    },
    selectDir() {
      ipc.invoke(ipcApiRoute.selectFolder, "").then((r) => {
        this.data_dir = r;
        // 修改数据目录
        this.modifyDataDir(r);
      });
    },
    openDir() {
      console.log("dd:", this.data_dir);
      ipc
        .invoke(ipcApiRoute.openDirectory, { id: this.data_dir })
        .then((res) => {
          //
        });
    },
    modifyDataDir(dir) {
      const params = {
        action: "setDataDir",
        data_dir: dir,
      };
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
        this.all_list = res.all_list;
      });
    },
    sqlitedbOperation(ac) {
      const params = {
        action: ac,
        info: {
          name: this.name,
          age: parseInt(this.age),
        },
        search_age: parseInt(this.search_age),
        update_name: this.update_name,
        update_age: parseInt(this.update_age),
        delete_name: this.delete_name,
      };
      if (ac == "add" && this.name.length == 0) {
        this.$message.error(`请填写数据`);
      }
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then((res) => {
        console.log("res:", res);
        if (ac == "get") {
          if (res.result.length == 0) {
            this.$message.error(`没有数据`);
            return;
          }
          this.userList = res.result;
        }
        if (res.all_list.length == 0) {
          this.all_list = ["空"];
          return;
        }
        this.all_list = res.all_list;
        this.$message.success(`success`);
      });
    },
    queryAllSum() {
      const params = {
        action: 'queryAllSum',
        ballDTO: {},
        period: this.period,
        ballType: this.ballType,
        zodiac: this.zodiac
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
        console.log("res:", res);
        this.allList = res.all_list;
        this.allSum = 0;
        this.allList.forEach(item => {
          this.allSum = parseInt(this.allSum) + parseInt(item.sum);
        })
      });
    },
    openDetail(ballNum) {
      this.showDetail = true;
      console.log("打开详情");
    },
    openDialog(param) {
      console.log(param);
      this.operationBall.ballNum = param.ballNum
      this.operationBall.operation = param.operation

      this.showAddSub = true;
      this.$nextTick(() => {
        console.log(this.$refs.inputAmountRef)
        this.$refs.inputAmountRef.focus();
      })

    },
    openBatch() {
      this.showBatch = true;
    },
    deleteAll() {
      showConfirmDialog({
        title: "温馨提示",
        width: 500,
        message: "是否确认删除本期数据？删除后不可恢复数据",
      })
        .then(() => {
          const params = {
            action: 'deleteByPeriod',
            ballDTO: {
              ballNum: this.operationBall.ballNum,
              amount: this.operationBall.amount,
            },
            period: this.period
          }

          ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
            this.queryAllSum();
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    amountConfirm() {
      console.log('amountConfirm')
      if (this.operationBall.operation === 'sub') {
        this.operationBall.amount = -this.operationBall.amount
      }
      const params = {
        action: 'operationAmount',
        ballDTO: {
          ballNum: this.operationBall.ballNum,
          amount: this.operationBall.amount,
          period: this.period
        },

      }

      ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
        this.queryAllSum();
        this.operationBall.amount = ''
      });

    },
    shengxiaoSearch() { },
  },
};
</script>
<style lang="less" scoped>
#app-base-db {
  padding: 0px 10px;
  text-align: left;
  width: 100%;

  .card-warpper {
    display: flex;
    flex-wrap: wrap;
  }

  .header-title {
    text-align: center;
    font-size: 28px;

    span:last-of-type {
      color: red;
    }
  }

  .header-button {
    margin-left: 12px;
  }

  .operation-box {
    padding: 24px 48px;
  }

  .one-block-1 {
    font-size: 16px;
    padding-top: 10px;
  }

  .one-block-2 {
    padding-top: 10px;
  }
}
</style>
