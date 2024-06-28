<template>
  <div id="app-base-db">
    <div class="header">
      <div class="header-title">
        <span>{{ period }}期总数：</span>
        <span>{{ allSum }}</span>
      </div>

      <div style="display: flex; align-items: center; margin: 28px 0px">
        <van-button class="header-button" type="primary" @click="returnInit">重新选择期数</van-button>
        <van-button class="header-button" type="primary" @click="openBatch">智能加数</van-button>
        <van-button class="header-button" type="primary" @click="openType">类别加数</van-button>
        <van-button class="header-button" type="primary" @click="openHistory">历史记录</van-button>
        <van-button class="header-button" type="primary" @click="openBatch2">批量添加</van-button>
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
    <a-modal v-model:visible="showType" title="按类别加数(生肖和类别只能选一种操作)" @ok="typeConfirm" ok-text="确认" cancel-text="取消">
      <div style="padding: 24px">

        <a-checkbox-group v-model:value="addType" name="checkboxgroup2" :options="shengxiaoOptions"
          @change="typeChange" />
        <a-radio-group style="margin-top: 24px;" v-model:value="colorValue" @change="typeChange2" button-style="solid">
          <a-radio-button value="红">红</a-radio-button>
          <a-radio-button value="绿">绿</a-radio-button>
          <a-radio-button value="蓝">蓝</a-radio-button>
          <a-radio-button value="单">单</a-radio-button>
          <a-radio-button value="双">双</a-radio-button>
          <a-radio-button value="红单">红单</a-radio-button>
          <a-radio-button value="红双">红双</a-radio-button>
          <a-radio-button value="绿单">绿单</a-radio-button>
          <a-radio-button value="绿双">绿双</a-radio-button>
          <a-radio-button value="蓝单">蓝单</a-radio-button>
          <a-radio-button value="蓝双">蓝双</a-radio-button>
        </a-radio-group>
        <p style="margin-top: 24px;">{{ typeStr }}</p>
        <a-input prefix="￥" v-model:value="typeAmount" style="width: 200px;" />
      </div>
    </a-modal>
    <a-modal width="800px" v-model:visible="showHistory" title="历史记录" @ok="showHistory = false" ok-text="确认"
      cancel-text="取消">
      <div style="padding: 24px">
        <a-table :dataSource="historyDataList" :columns="columns" />
      </div>
    </a-modal>
    <a-modal width="580px" v-model:visible="showBatch2" title="数字多选加数" @ok="batchConfirm" ok-text="确认" cancel-text="取消">
      <div style="padding: 24px">
        <a-checkbox-group  v-model:value="numCheckValue" name="checkboxgroup">
          <div>
            <a-checkbox v-for="(num1, index) in numOptions1" :value="num1">{{ num1 }}</a-checkbox>
          </div>
          <div>
            <a-checkbox v-for="(num1, index) in numOptions2" :value="num1">{{ num1 }}</a-checkbox>
          </div>
          <div>
            <a-checkbox v-for="(num1, index) in numOptions3" :value="num1">{{ num1 }}</a-checkbox>
          </div>
          <div>
            <a-checkbox v-for="(num1, index) in numOptions4" :value="num1">{{ num1 }}</a-checkbox>
          </div>
          <div>
            <a-checkbox v-for="(num1, index) in numOptions5" :value="num1">{{ num1 }}</a-checkbox>
          </div>
        </a-checkbox-group>
        <a-input prefix="￥" v-model:value="numCheckAmount" style="width: 200px;margin-top: 24px;" />
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
      showBatch2: false,
      showType: false,
      showHistory: false,
      amount: '',
      amountText: "",
      period: "",
      numCheckValue: "",
      numOptions1: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      numOptions2: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
      numOptions3: ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"],
      numOptions4: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39"],
      numOptions5: ["40", "41", "42", "43", "44", "45", "46", "47", "48", "49"],
      shengxiaoArr: [],
      numCheckAmount: '',
      shengxiaoOptions: ["龙", "兔", "虎", "牛", "鼠", "猪", "狗", "鸡", "猴", "羊", "马", "蛇"],
      typeOptions: [

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
      typeStr: '',
      addType: [],
      typeAmount: '',
      historyDataList: [],
      columns: [
        {
          title: '操作详情',
          dataIndex: 'desc',
          key: 'desc',
          width: 500
        },
        {
          title: '操作时间',
          dataIndex: 'create_time',
          key: 'create_time',
          width: 200
        },
      ],
      colorValue: ''
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
        this.allList.forEach(item => {
          this.allSum = parseInt(this.allSum) + parseInt(item.sum);
        })
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
    typeChange2() {
      this.typeStr = ''
      let addType = ''
      let colorSelect = ''
      let ballTypeSelect = ''
      if (this.colorValue) {
        this.addType = []
        addType = this.colorValue
      }
      if (addType === '红') {
        colorSelect = 'red'
      }
      if (addType === '蓝') {
        colorSelect= 'blue'
      }
      if (addType === '绿') {
        colorSelect = 'green'
      }
      if (addType === '单') {
        ballTypeSelect = 1
      }
      if (addType === '双') {
        ballTypeSelect = 2
      }
      if (addType === '红单') {
        ballTypeSelect = 1
        colorSelect = 'red'
      }
      if (addType === '红双') {
        ballTypeSelect = 2
        colorSelect = 'red'
      }
      if (addType === '绿单') {
        ballTypeSelect = 1
        colorSelect = 'green'
      }
      if (addType === '绿双') {
        ballTypeSelect = 2
        colorSelect = 'green'
      }
      if (addType === '蓝单') {
        ballTypeSelect = 1
        colorSelect = 'blue'
      }
      if (addType === '蓝双') {
        ballTypeSelect = 2
        colorSelect = 'blue'
      }
      
      
      if (colorSelect !== '' && ballTypeSelect === '') {
        this.typeStr = this.allList.filter(item => item.color === colorSelect).map(item => item.ballNum).join(', ')
      }
      if (colorSelect === '' && ballTypeSelect !== '') {
        this.typeStr = this.allList.filter(item => item.ballType === ballTypeSelect).map(item => item.ballNum).join(', ')
      }
      if (colorSelect !== '' && ballTypeSelect !== '') {
        this.typeStr = this.allList.filter(item => item.ballType === ballTypeSelect && item.color === colorSelect).map(item => item.ballNum).join(', ')
      }

    },
    typeChange() {
      let addType = ''
      this.typeStr = ''
      if (this.addType) {
        this.colorValue = ''
        addType = this.addType
      }

      this.typeStr = this.allList.filter(item => addType.indexOf(item.zodiac) !== -1).map(item => item.ballNum).join(', ')

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
    openBatch2() {
      this.showBatch2 = true;
    },
    openHistory() {
      this.showHistory = true;
      const params = {
        action: 'queryHistory',
        ballDTO: {
          period: this.period
        },
        period: this.period
      }

      ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
        this.historyDataList = res.all_list
      });
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
      if (amountTextArr.length <= 1 || amountTextArr[1] === '') {
        this.$message.error(`智能加数失败：请检查你的公式是否正确！`, 1);
        return;
      }
      let pattern1 = /\d+\./;
      let pattern2 = /\d+\*/;
      let pattern3 = /\d+\+/;
      let pattern4 = /\d+\-/;
      let pattern5 = /\d+\,/;
      let pattern6 = /\d+\，/;
      let numArr = [];
      let patternFlag = false;
      if (pattern1.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split('.');
        patternFlag = true;
      }
      if (pattern2.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split('*');
        patternFlag = true;
      }
      if (pattern3.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split('+');
        patternFlag = true;
      }
      if (pattern4.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split('-');
        patternFlag = true;
      }
      if (pattern5.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split(',');
        patternFlag = true;
      }
      if (pattern6.test(amountTextArr[0]) && !patternFlag) {
        numArr = amountTextArr[0].split('，');
        patternFlag = true;
      }
      if (!patternFlag) {
        this.$message.error(`智能加数失败：请检查你的公式是否正确！`, 1);
        return;
      }
      if (isNaN(amountTextArr[1])) {
        this.$message.error(`智能加数失败：请检查你的公式 各 后面的数字是否正确！`, 2);
        return;
      }
      let desc = numArr.join(',') + ' 加 ' + amountTextArr[1] + '元'
      let historyParam = {
        action: 'insertHistory',
        ballDTO: {
          desc: desc,
          period: this.period
        },

      }
      this.amountText = ''
      const promises = numArr.map(num => {
        return new Promise((resolveItem, rejectItem) => {
          let params = {
            action: 'operationAmount',
            ballDTO: {
              ballNum: num,
              amount: amountTextArr[1],
              period: this.period
            },

          }

          ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
            resolveItem()
          }).catch(e => {
            rejectItem(new Error('加数异常：请检查你的公式是否正确'))
          });
        })
      })

      Promise.all(promises).then(() => {
        this.queryAllSum();
        ipc.invoke(ipcApiRoute.ballSqliteOperation, historyParam).then((res) => {
          this.$message.success(`智能批量加数成功！`, 1);
        });
      })


    },
    amountConfirm() {
      let operationText = ' 加 ' + this.operationBall.amount + '元'
      if (this.operationBall.operation === 'sub') {
        operationText = ' 减 ' + this.operationBall.amount + '元'
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
        this.$message.success(`操作成功！`, 1);
      });
      // 历史记录

      let desc = this.operationBall.ballNum + operationText
      let historyParam = {
        action: 'insertHistory',
        ballDTO: {
          desc: desc,
          period: this.period
        },
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, historyParam).then((res) => {

      });

    },
    typeConfirm() {
      if (!this.typeStr) {
        this.$message.error(`请选择需要操作的类别！`, 1);
        return;
      }
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

      let desc = ballNumArr.join(',') + ' 加 ' + this.typeAmount + '元'
      let historyParam = {
        action: 'insertHistory',
        ballDTO: {
          desc: desc,
          period: this.period
        },
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, historyParam).then((res) => {

      });
      this.$message.success(`操作成功！`, 1);
    },
    batchConfirm() {
      if (this.numCheckValue.length === 0 || this.numCheckAmount === '') {
        this.$message.error(`数字未选择或者金额未填入`, 1);
        return;
      }
      this.numCheckValue.forEach(num => {
        const params = {
          action: 'operationAmount',
          ballDTO: {
            ballNum: num,
            amount: this.numCheckAmount,
            period: this.period
          },

        }

        ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
          this.queryAllSum();
          this.numCheckAmount = ''
          this.numCheckValue = []
          this.showBatch2 = false
        });
      })

      let desc = this.numCheckValue.join(',') + ' 加 ' + this.numCheckAmount + '元'
      let historyParam = {
        action: 'insertHistory',
        ballDTO: {
          desc: desc,
          period: this.period
        },
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, historyParam).then((res) => {

      });
      this.$message.success(`操作成功！`, 1);
    },

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
