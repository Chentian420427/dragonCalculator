<template>
    <div class= "inputBox" v-if="isShow">
         <a-input style="width: 50%" v-model:value="period" addon-before="期数" />
         <van-button class="login-button" type="primary" @click="jinru">进入</van-button>
    </div>
</template>

<script>
export default {
  data() {
      return {
          period: '',
          macAddress: '',
          isShow: true
      }
  },
  mounted() {
    this.getMacAddress()
  },
  methods: {
    jinru() {
      this.$router.push({name:'Index',query: {period: this.period}})
    },
    getMacAddress() {
      const os = require('os');
      let macAdress = ''
      const interfaces = os.networkInterfaces();
      for (const iface of Object.values(interfaces)) {
        for (const config of iface) {
          if (!config.internal && config.mac !== '00:00:00:00:00:00') {
            macAdress = config.mac;
          }
        }
      }
      // 0c-9D-92-BC-14-BD 龙
      // 18-C0-4D-36-8C-21 WIN
      let macArr = ['0c-9d-92-bc-14-bc', '18:c0:4d:36:8c:21']
      console.log(macAdress)
      console.log(macArr.indexOf(macAdress))
      if(macArr.indexOf(macAdress) === -1) {
        this.isShow = false;
      } 
    }
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