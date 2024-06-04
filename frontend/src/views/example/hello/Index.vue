<template>
  <div id="app-base-db">
    <div class="header">
      <div class="header-title">
        <span>{{ period }}期总数：</span>
        <span>{{ allSum }}</span>
      </div>
      <div>
        <a-row>
          <a-col :span="6">
            <a-statistic title="单数" v-model:value="danSum" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="双数" v-model:value="shuangSum" />
          </a-col>
          <a-col :span="12">
            <div style="display: flex;align-items: center;">
              <a-select class="header-button" v-model:value="shengxiaoArr" :options="shengxiaoOptions" mode="multiple"
                size="large" placeholder="请选择需要统计的生肖" style="width: 200px;margin-right: 22px;"
                @popupScroll="popupScroll" @change="shengxiaoChange">
              </a-select>
              <a-statistic title="生肖" v-model:value="shengxiaoSum" />
            </div>
          </a-col>
        </a-row>
      </div>
      <div style="display: flex; align-items: center; margin: 28px 0px">
      <van-button class="header-button" type="primary" @click="returnInit">重新选择期数</van-button>
        <van-button class="header-button" type="primary" @click="openBatch">批量加数</van-button>
        <van-button class="header-button" type="danger" @click="deleteAll">清空本期数据</van-button>
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
        <span>{{ amountStr }}</span>
      </div>
    </van-dialog>
    <van-dialog v-model:show="showBatch" title="智能批量添加" show-cancel-button width="800" @confirm="zhinengConfirm">
      <div style="padding: 24px">
        <a-textarea v-model:value="amountText" placeholder="例如：10.25.33.11.22各15" />
      </div>
    </van-dialog>
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
      all_list: ["空"],
      sum: 100,
      shengxiao: "zhu",
      ballNum: 99,
      showAddSub: false,
      showDetail: false,
      showBatch: false,
      amount: '',
      amountText: "1.5.9.35各10",
      period: "",
      shengxiaoArr: [],
      shengxiaoOptions: [
        {
          value: "狗",
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
      },
      detailList: [],
      amountStr: '',
      danSum: 0,
      shuangSum: 0,
      shengxiaoSum: 0
    };
  },
  mounted() {
    this.init();
    this.period = this.$route.query.period
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
    queryAllSum() {
      const params = {
        action: 'queryAllSum',
        ballDTO: {},
        period: this.period,
        ballType: this.ballType,
        zodiac: this.zodiac
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
        this.allList = res.all_list;
        this.allSum = 0;
        let danSum = 0;
        let shuangSum = 0;
        let shengxiaoSum = 0;
        this.allList.forEach(item => {
          this.allSum = parseInt(this.allSum) + parseInt(item.sum);

          if (item.ballType === 1) {
            danSum = parseInt(danSum) + parseInt(item.sum)
          }
          if (item.ballType === 2) {
            shuangSum = parseInt(shuangSum) + parseInt(item.sum)
          }
          if (this.shengxiaoArr.length > 0) {
            this.shengxiaoArr.forEach(option => {
              if (option === item.zodiac) {
                shengxiaoSum = shengxiaoSum + item.sum
              }

            })
          }
        })
        this.danSum = danSum
        this.shuangSum = shuangSum
        this.shengxiaoSum = shengxiaoSum
      });
    },
    shengxiaoChange() {
      let shengxiaoSum = 0;
      this.allList.forEach(item => {
        if (this.shengxiaoArr.length > 0) {
          this.shengxiaoArr.forEach(option => {
            if (option === item.zodiac) {
              shengxiaoSum = shengxiaoSum + item.sum
            }

          })
        }
      })
      this.shengxiaoSum = shengxiaoSum
    },
    openDetail(ballNum, sum) {
      const params = {
        action: 'queryDetailByNum',
        ballDTO: {
          period: this.period,
          ballNum: ballNum
        }
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
        this.detailList = res.all_list;
        console.log(this.detailList.length)
        if (this.detailList.length === 0) {
          this.amountStr = '无';
        } else {
          this.amountStr = this.detailList.map(item => item.amount).join('+')
          this.amountStr = this.amountStr + ' = ' + sum
        }

      });

      this.showDetail = true;
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
    returnInit() {
      this.$router.push({name:'Login'})
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
    zhinengConfirm() {
      let amountTextArr = this.amountText.split('各');
      let numArr = amountTextArr[0].split('.');
      numArr.forEach(num => {
        const params = {
        action: 'operationAmount',
        ballDTO: {
          ballNum: num,
          amount: amountTextArr[1],
          period: this.period
        },

      }

        ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
          this.queryAllSum();
          this.amountText= ''
          this.$message.success(`智能批量加数成功！`);
        });
      })
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
        this.$message.success(`操作成功！`);
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
