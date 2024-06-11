<template>
  <div id="app-base-db">
    <div class="header">
      <div class="header-title">
        <span>{{ period }}期总数：</span>
        <span>{{ allSum }}</span>
      </div>
      <!-- <div>
        <a-row>
          <a-col :span="4">
            <a-statistic title="单数" v-model:value="danSum">
              <template #suffix>
                <span>/ {{ danSum * 47 }}</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="4">
            <a-statistic title="双数" v-model:value="shuangSum">
              <template #suffix>
                <span>/ {{ shuangSum * 47 }}</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="4">
            <a-statistic title="红色" v-model:value="redSum">
              <template #suffix>
                <span>/ {{ redSum * 47 }}</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="4">
            <a-statistic title="绿色" v-model:value="greenSum">
              <template #suffix>
                <span>/ {{ greenSum * 47 }}</span>
              </template>
            </a-statistic>
          </a-col>
          <a-col :span="4">
            <a-statistic title="蓝色" v-model:value="blueSum">
              <template #suffix>
                <span>/ {{ blueSum * 47 }}</span>
              </template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-row style="margin-top: 24px;">
          <a-col :span="12">
            <div style="display: flex;align-items: center;">
              <a-select class="header-button" v-model:value="shengxiaoArr" :options="shengxiaoOptions" mode="multiple"
                size="large" placeholder="请选择需要统计的生肖" style="width: 200px;margin-right: 22px;"
                @change="shengxiaoChange">
              </a-select>
              <a-statistic title="生肖" v-model:value="shengxiaoSum">
                <template #suffix>
                  <span>/ {{ shengxiaoSum * 47 }}</span>
                </template>
              </a-statistic>
            </div>
          </a-col>
        </a-row>
      </div> -->
      <div style="display: flex; align-items: center; margin: 28px 0px">
        <van-button class="header-button" type="primary" @click="returnInit">重新选择期数</van-button>
        <van-button class="header-button" type="primary" @click="openBatch">智能加数</van-button>
        <van-button class="header-button" type="primary" @click="openType">类别加数</van-button>
        <van-button class="header-button" type="danger" @click="deleteAll">清空本期数据</van-button>

      </div>
    </div>
    <div class="card-warpper">
      <itemCard v-for="(item, index) in allList" :key="index" :ballNum="item.ballNum" :sum="item.sum"
        :color="item.color" :shengxiao="item.zodiac" @openDialog="openDialog" @openDetail="openDetail" />
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
    <a-modal v-model:visible="showType" title="按类别加数" @ok="typeConfirm" ok-text="确认"
      cancel-text="取消">
      <div style="padding: 24px">
        <a-select class="header-button" v-model:value="addType" :options="typeOptions" size="large"
          placeholder="请选择需要添加的类别" style="width: 200px;margin-right: 22px;" @change="typeChange">
        </a-select>
        <p style="margin-top: 24px;">{{ typeStr }}</p>
        <a-input prefix="￥" v-model:value="typeAmount" style="width: 200px;" />
      </div>
    </a-modal>
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
      showType: false,
      amount: '',
      amountText: "",
      period: "",
      shengxiaoArr: [],
      shengxiaoOptions: [
        {
          value: "龙",
        },
        {
          value: "兔",
        },
        {
          value: "虎",
        },
        {
          value: "牛",
        },
        {
          value: "鼠",
        },
        {
          value: "猪",
        },
        {
          value: "狗",
        },
        {
          value: "鸡",
        },
        {
          value: "猴",
        },
        {
          value: "羊",
        },
        {
          value: "马",
        },
        {
          value: "蛇",
        },
      ],
      typeOptions: [
        {
          value: "单",
        },
        {
          value: "双",
        },
        {
          value: "红",
        },
        {
          value: "绿",
        },
        {
          value: "蓝",
        },
        {
          value: "龙",
        },
        {
          value: "兔",
        },
        {
          value: "虎",
        },
        {
          value: "牛",
        },
        {
          value: "鼠",
        },
        {
          value: "猪",
        },
        {
          value: "狗",
        },
        {
          value: "鸡",
        },
        {
          value: "猴",
        },
        {
          value: "羊",
        },
        {
          value: "马",
        },
        {
          value: "蛇",
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
      shengxiaoSum: 0,
      redSum: 0,
      blueSum: 0,
      greenSum: 0,
      typeStr: '',
      addType: '',
      typeAmount: ''
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
        let redSum = 0;
        let greenSum = 0;
        let blueSum = 0;
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
          if (item.color === 'blue') {
            blueSum = parseInt(blueSum) + parseInt(item.sum)
          }
          if (item.color === 'green') {
            greenSum = parseInt(greenSum) + parseInt(item.sum)
          }
          if (item.color === 'red') {
            redSum = parseInt(redSum) + parseInt(item.sum)
          }
        })
        this.danSum = danSum
        this.shuangSum = shuangSum
        this.shengxiaoSum = shengxiaoSum
        this.redSum = redSum
        this.blueSum = blueSum
        this.greenSum = greenSum
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
    typeChange() {
      let addType = this.addType
      if (addType === '红') {
        addType = 'red'
      }
      if (addType === '蓝') {
        addType = 'blue'
      }
      if (addType === '绿') {
        addType = 'green'
      }
      if(addType === '单') {
        addType = 1
      }
      if(addType === '双') {
        addType = 2
      }
      this.typeStr = this.allList.filter(item => item.zodiac === addType).map(item => item.ballNum).join(', ')
      if (this.typeStr.length === 0) {
        this.typeStr = this.allList.filter(item => item.color === addType).map(item => item.ballNum).join(', ')
      }
      if (this.typeStr.length === 0) {
        this.typeStr = this.allList.filter(item => item.ballType === addType).map(item => item.ballNum).join(', ')
      }
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
          this.amountStrArr = this.detailList.map(item => item.amount)
          this.amountStrArr.forEach(amount => {
            if (amount > 0) {
              this.amountStr = this.amountStr + amount + '+'
            } else {
              this.amountStr = this.amountStr.substring(0, this.amountStr.length - 1) + amount
            }
          })
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
      this.$router.push({ name: 'Login' })
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
    openType() {
      this.showType = true
    },
    zhinengConfirm() {
      let amountTextArr = this.amountText.split('各');
      if(amountTextArr.length <= 1 || amountTextArr[1] === '') {
        this.$message.error(`智能加数失败：请检查你的公式是否正确！`,1);
        return;
      }
      let pattern1 = /\d+\./;
      // let pattern2 = /\d+\*/;
      // let pattern3 = /\d+\+/;
      // let pattern4 = /\d+\-/;
      // let pattern5 = /\d+\,/;
      // let pattern6 = /\d+\，/;
      let numArr = [];
      let patternFlag =false;
      if(pattern1.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split('.');
        patternFlag = true;
      }
      // if(pattern2.test(amountTextArr[0]) && !patternFlag) {
      //   numArr = amountTextArr[0].split('*');
      //   patternFlag = true;
      // }
      // if(pattern3.test(amountTextArr[0]) && !patternFlag) {
      //   numArr = amountTextArr[0].split('+');
      //   patternFlag = true;
      // }
      // if(pattern4.test(amountTextArr[0]) && !patternFlag) {
      //   numArr = amountTextArr[0].split('-');
      //   patternFlag = true;
      // }
      // if(pattern5.test(amountTextArr[0]) && !patternFlag) {
      //   numArr = amountTextArr[0].split(',');
      //   patternFlag = true;
      // }
      // if(pattern6.test(amountTextArr[0]) && !patternFlag) {
      //   numArr = amountTextArr[0].split('，');
      //   patternFlag = true;
      // }
      if(!patternFlag) {
        this.$message.error(`智能加数失败：请检查你的公式是否正确！`,1);
        return;
      }
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
          this.amountText = ''
        });
      })
      this.$message.success(`智能批量加数成功！`, 1);
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
    typeConfirm() {
      let ballNumArr = this.typeStr.split(', ')
      ballNumArr.forEach(ballNum => {
        const params = {
          action: 'operationAmount',
          ballDTO: {
            ballNum: ballNum,
            amount: this.typeAmount,
            period: this.period
          },

        }

        ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
          this.queryAllSum();
          this.typeAmount = ''
          this.addType = ''
          this.showType = false
        });

      })
      this.$message.success(`操作成功！`);
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
