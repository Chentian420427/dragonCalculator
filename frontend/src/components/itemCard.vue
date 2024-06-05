<template>
  <div class="box">
    <a-card hoverable style="width: 200px; border-radius: 15%">
      <div>
        <a-button
          :style="getStyle()"
          @click="openDetail"
          >{{ ballNum }}</a-button
        >
      </div>
      <div class="flex-box">
        <van-tag plain type="primary" size="large">生肖</van-tag>
        <span>
          {{ shengxiao }}
        </span>
      </div>
      <div class="flex-box">
        <van-tag plain type="primary" size="large">总计</van-tag>
        <span style="color: red; font-weight: bold">
          {{ sum }}
        </span>
      </div>

      <div class="flex-box">
        <van-button
          plain
          size="small"
          style="font-size: 16px; flex: 1"
          type="success"
          @click="openDialog('add')"
          ><van-icon name="plus"
        /></van-button>
        <van-button
          plain
          size="small"
          style="margin-left: 12px; font-size: 16px; flex: 1"
          type="danger"
          @click="openDialog('sub')"
          ><van-icon name="minus"
        /></van-button>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
  props: {
    ballNum: {
      type: Number,
      default: 0,
    },
    shengxiao: {
      type: Number,
      default: 0,
    },
    sum: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '',
    },
  },
  methods: {
    openDialog(operation) {
      let param = {
        ballNum: this.ballNum,
        operation: operation,
      };
      this.$emit("openDialog", param);
    },
    openDetail() {
      this.$emit("openDetail", this.ballNum, this.sum);
    },
    getStyle() {
      let colorStyle = '#f50';
      if(this.color === 'blue') {
        colorStyle = '#1989fa'
      }
      if(this.color === 'green') {
        colorStyle = '#07c160'
      }

      return {
        'background-color': colorStyle,
            'color': 'white',
            'width': '150px',
            'font-weight': 'bold',
            'font-size': 'medium',
      }
    }
  },
};
</script>

<style lang="less" scoped>
.box {
  margin: 12px;
}
.flex-box {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 5px;
}
</style>