<template>
    <div class= "inputBox">
         <a-input style="width: 50%" v-model:value="period" addon-before="期数" />
         <van-button class="login-button" type="primary" @click="jinru">进入</van-button>
    </div>
</template>

<script>
export default {
  data() {
      return {
          period: ''
      }
  },
  methods: {
    jinru() {
      this.$router.push({name:'Index',query: {period: this.period}})
    },
  },
};
</script>

<style lang="less" scoped>
.inputBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.login-button {
    margin-top: 24px;
    width: 200px;
}

</style>