<template>
    <div class= "inputBox" v-if="isShow">
      <p>本软件仅供学习交流请勿用于非法用途</p>
         <a-input style="width: 50%" v-model:value="period" addon-before="期数" />
         <van-button class="login-button" type="success" @click="jinru">进入</van-button>
    </div>
</template>

<script>
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";

export default {
  data() {
      return {
          period: '',
          macAddress: '',
          isShow: true
      }
  },
  mounted() {
    this.init()
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
          if (!config.internal && config.mac && config.mac !== "00:00:00:00:00:00" && config.family === 'IPv4') {
            macAdress = config.mac;
          }
        }
      }
      // 0c-9D-92-BC-14-BD 龙
      // 18-C0-4D-36-8C-21 WIN
      let macArr = ['0c-9d-92-bc-14-bc', '18:c0:4d:36:8c:21', 'c8:89:f3:b9:14:40']
      console.log(macAdress)
      if(macArr.indexOf(macAdress) === -1) {
        this.isShow = false;
      } 
    },
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
        this.initData();
      });
    },
    initData() {
      const params = {
        action: 'initData'
      }
      ipc.invoke(ipcApiRoute.ballSqliteOperation, params).then((res) => {
        
      });
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