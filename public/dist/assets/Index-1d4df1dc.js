import{i as t,a as e}from"./ipcRenderer-b6d714b6.js";import{g as l,i as a,m as o,u as i,a as n,h as s,s as u,_ as r,r as h,o as p,c as m,w as d,f as c,n as b,d as g,t as y,F as v,j as f,k as x}from"./index-a14839f4.js";let S;let w=l({},{title:"",width:"",theme:null,message:"",overlay:!0,callback:null,teleport:"body",className:"",allowHtml:!1,lockScroll:!0,transition:void 0,beforeClose:null,overlayClass:"",overlayStyle:void 0,messageAlign:"",cancelButtonText:"",cancelButtonColor:null,cancelButtonDisabled:!1,confirmButtonText:"",confirmButtonColor:null,confirmButtonDisabled:!1,showConfirmButton:!0,showCancelButton:!1,closeOnPopstate:!0,closeOnClickOverlay:!1});function C(t){return a?new Promise(((e,a)=>{S||function(){const t={setup(){const{state:t,toggle:e}=i();return()=>n(u,s(t,{"onUpdate:show":e}),null)}};({instance:S}=o(t))}(),S.open(l({},w,t,{callback:t=>{("confirm"===t?e:a)(t)}}))})):Promise.resolve(void 0)}const A={class:"box"},T={class:"flex-box"},k={class:"flex-box"},B={style:{color:"red","font-weight":"bold"}},D={class:"flex-box"};const N={id:"app-base-db"},O={class:"header"},_={class:"header-title"},q={style:{display:"flex","align-items":"center",margin:"28px 0px"}},z={class:"card-warpper"},I={class:"operation-box"},L={class:"operation-box"},$={style:{padding:"24px"}},U={style:{padding:"24px"}},E={style:{"margin-top":"24px"}};const j=r({components:{itemCard:r({props:{ballNum:{type:Number,default:0},shengxiao:{type:Number,default:0},sum:{type:Number,default:0},color:{type:String,default:""}},methods:{openDialog(t){let e={ballNum:this.ballNum,operation:t};this.$emit("openDialog",e)},openDetail(){this.$emit("openDetail",this.ballNum,this.sum)},getStyle(){let t="#f50";return"blue"===this.color&&(t="#1989fa"),"green"===this.color&&(t="#07c160"),{"background-color":t,color:"white",width:"150px","font-weight":"bold","font-size":"medium"}}}},[["render",function(t,e,l,a,o,i){const s=h("a-button"),u=h("van-tag"),r=h("van-icon"),v=h("van-button"),f=h("a-card");return p(),m("div",A,[n(f,{hoverable:"",style:{width:"200px","border-radius":"15%"}},{default:d((()=>[c("div",null,[n(s,{style:b(i.getStyle()),onClick:i.openDetail},{default:d((()=>[g(y(l.ballNum),1)])),_:1},8,["style","onClick"])]),c("div",T,[n(u,{plain:"",type:"primary",size:"large"},{default:d((()=>[g("生肖")])),_:1}),c("span",null,y(l.shengxiao),1)]),c("div",k,[n(u,{plain:"",type:"primary",size:"large"},{default:d((()=>[g("总计")])),_:1}),c("span",B,y(l.sum)+" / "+y(47*l.sum),1)]),c("div",D,[n(v,{plain:"",size:"small",style:{"font-size":"16px",flex:"1"},type:"success",onClick:e[0]||(e[0]=t=>i.openDialog("add"))},{default:d((()=>[n(r,{name:"plus"})])),_:1}),n(v,{plain:"",size:"small",style:{"margin-left":"12px","font-size":"16px",flex:"1"},type:"danger",onClick:e[1]||(e[1]=t=>i.openDialog("sub"))},{default:d((()=>[n(r,{name:"minus"})])),_:1})])])),_:1})])}],["__scopeId","data-v-98ac3491"]])},data:()=>({all_list:["空"],sum:100,shengxiao:"zhu",ballNum:99,showAddSub:!1,showDetail:!1,showBatch:!1,showType:!1,amount:"",amountText:"",period:"",shengxiaoArr:[],shengxiaoOptions:[{value:"龙"},{value:"兔"},{value:"虎"},{value:"牛"},{value:"鼠"},{value:"猪"},{value:"狗"},{value:"鸡"},{value:"猴"},{value:"羊"},{value:"马"},{value:"蛇"}],typeOptions:[{value:"单"},{value:"双"},{value:"红"},{value:"绿"},{value:"蓝"},{value:"龙"},{value:"兔"},{value:"虎"},{value:"牛"},{value:"鼠"},{value:"猪"},{value:"狗"},{value:"鸡"},{value:"猴"},{value:"羊"},{value:"马"},{value:"蛇"}],allSum:0,allList:[],operationBall:{ballNum:"",amount:"",operation:""},detailList:[],amountStr:"",danSum:0,shuangSum:0,shengxiaoSum:0,redSum:0,blueSum:0,greenSum:0,typeStr:"",addType:"",typeAmount:""}),mounted(){this.init(),this.period=this.$route.query.period},methods:{init(){t.invoke(e.sqlitedbOperation,{action:"getDataDir"}).then((t=>{-1!=t.code?(this.data_dir=t.result,console.log("xxxxxx"),this.queryAllSum()):this.$message.error("请检查sqlite是否正确安装",5)}))},queryAllSum(){const l={action:"queryAllSum",ballDTO:{},period:this.period,ballType:this.ballType,zodiac:this.zodiac};t.invoke(e.ballSqliteOperation,l).then((t=>{this.allList=t.all_list,this.allSum=0;let e=0,l=0,a=0,o=0,i=0,n=0;this.allList.forEach((t=>{this.allSum=parseInt(this.allSum)+parseInt(t.sum),1===t.ballType&&(e=parseInt(e)+parseInt(t.sum)),2===t.ballType&&(l=parseInt(l)+parseInt(t.sum)),this.shengxiaoArr.length>0&&this.shengxiaoArr.forEach((e=>{e===t.zodiac&&(a+=t.sum)})),"blue"===t.color&&(n=parseInt(n)+parseInt(t.sum)),"green"===t.color&&(i=parseInt(i)+parseInt(t.sum)),"red"===t.color&&(o=parseInt(o)+parseInt(t.sum))})),this.danSum=e,this.shuangSum=l,this.shengxiaoSum=a,this.redSum=o,this.blueSum=n,this.greenSum=i}))},shengxiaoChange(){let t=0;this.allList.forEach((e=>{this.shengxiaoArr.length>0&&this.shengxiaoArr.forEach((l=>{l===e.zodiac&&(t+=e.sum)}))})),this.shengxiaoSum=t},typeChange(){let t=this.addType;"红"===t&&(t="red"),"蓝"===t&&(t="blue"),"绿"===t&&(t="green"),"单"===t&&(t=1),"双"===t&&(t=2),this.typeStr=this.allList.filter((e=>e.zodiac===t)).map((t=>t.ballNum)).join(", "),0===this.typeStr.length&&(this.typeStr=this.allList.filter((e=>e.color===t)).map((t=>t.ballNum)).join(", ")),0===this.typeStr.length&&(this.typeStr=this.allList.filter((e=>e.ballType===t)).map((t=>t.ballNum)).join(", "))},openDetail(l,a){const o={action:"queryDetailByNum",ballDTO:{period:this.period,ballNum:l}};t.invoke(e.ballSqliteOperation,o).then((t=>{this.detailList=t.all_list,console.log(this.detailList.length),0===this.detailList.length?this.amountStr="无":(this.amountStrArr=this.detailList.map((t=>t.amount)),this.amountStrArr.forEach((t=>{this.amountStr=t>0?this.amountStr+t+"+":this.amountStr.substring(0,this.amountStr.length-1)+t})),this.amountStr=this.amountStr+" = "+a)})),this.showDetail=!0},openDialog(t){console.log(t),this.operationBall.ballNum=t.ballNum,this.operationBall.operation=t.operation,this.showAddSub=!0,this.$nextTick((()=>{console.log(this.$refs.inputAmountRef),this.$refs.inputAmountRef.focus()}))},openBatch(){this.showBatch=!0},returnInit(){this.$router.push({name:"Login"})},deleteAll(){var a;(a={title:"温馨提示",width:500,message:"是否确认删除本期数据？删除后不可恢复数据"},C(l({showCancelButton:!0},a))).then((()=>{const l={action:"deleteByPeriod",ballDTO:{ballNum:this.operationBall.ballNum,amount:this.operationBall.amount},period:this.period};t.invoke(e.ballSqliteOperation,l).then((t=>{this.queryAllSum()}))})).catch((()=>{}))},openType(){this.showType=!0},zhinengConfirm(){let l=this.amountText.split("各");if(l.length<=1||""===l[1])return void this.$message.error("智能加数失败：请检查你的公式是否正确！",1);let a=[],o=!1;/\d+\./.test(l[0])&&!o&&(a=l[0].split("."),o=!0),o?(a.forEach((a=>{const o={action:"operationAmount",ballDTO:{ballNum:a,amount:l[1],period:this.period}};t.invoke(e.ballSqliteOperation,o).then((t=>{this.queryAllSum(),this.amountText=""}))})),this.$message.success("智能批量加数成功！",1)):this.$message.error("智能加数失败：请检查你的公式是否正确！",1)},amountConfirm(){console.log("amountConfirm"),"sub"===this.operationBall.operation&&(this.operationBall.amount=-this.operationBall.amount);const l={action:"operationAmount",ballDTO:{ballNum:this.operationBall.ballNum,amount:this.operationBall.amount,period:this.period}};t.invoke(e.ballSqliteOperation,l).then((t=>{this.queryAllSum(),this.operationBall.amount="",this.$message.success("操作成功！")}))},typeConfirm(){this.typeStr.split(", ").forEach((l=>{const a={action:"operationAmount",ballDTO:{ballNum:l,amount:this.typeAmount,period:this.period}};t.invoke(e.ballSqliteOperation,a).then((t=>{this.queryAllSum(),this.typeAmount="",this.addType="",this.showType=!1}))})),this.$message.success("操作成功！")},shengxiaoSearch(){}}},[["render",function(t,e,l,a,o,i){const s=h("van-button"),u=h("itemCard"),r=h("a-input"),b=h("van-dialog"),S=h("a-textarea"),w=h("a-select"),C=h("a-modal");return p(),m("div",N,[c("div",O,[c("div",_,[c("span",null,y(o.period)+"期总数：",1),c("span",null,y(o.allSum),1)]),c("div",q,[n(s,{class:"header-button",type:"primary",onClick:i.returnInit},{default:d((()=>[g("重新选择期数")])),_:1},8,["onClick"]),n(s,{class:"header-button",type:"primary",onClick:i.openBatch},{default:d((()=>[g("智能加数")])),_:1},8,["onClick"]),n(s,{class:"header-button",type:"primary",onClick:i.openType},{default:d((()=>[g("类别加数")])),_:1},8,["onClick"]),n(s,{class:"header-button",type:"danger",onClick:i.deleteAll},{default:d((()=>[g("清空本期数据")])),_:1},8,["onClick"])])]),c("div",z,[(p(!0),m(v,null,f(o.allList,((t,e)=>(p(),x(u,{key:e,ballNum:t.ballNum,sum:t.sum,color:t.color,shengxiao:t.zodiac,onOpenDialog:i.openDialog,onOpenDetail:i.openDetail},null,8,["ballNum","sum","color","shengxiao","onOpenDialog","onOpenDetail"])))),128))]),n(b,{show:o.showAddSub,"onUpdate:show":e[1]||(e[1]=t=>o.showAddSub=t),title:"操作","show-cancel-button":"",onConfirm:i.amountConfirm},{default:d((()=>[c("div",I,[n(r,{autofocus:"true",ref:"inputAmountRef",value:o.operationBall.amount,"onUpdate:value":e[0]||(e[0]=t=>o.operationBall.amount=t),type:"number","addon-before":"金额"},null,8,["value"])])])),_:1},8,["show","onConfirm"]),n(b,{width:"800",show:o.showDetail,"onUpdate:show":e[2]||(e[2]=t=>o.showDetail=t),title:"详情","show-cancel-button":""},{default:d((()=>[c("div",L,[c("span",null,y(o.amountStr),1)])])),_:1},8,["show"]),n(b,{show:o.showBatch,"onUpdate:show":e[4]||(e[4]=t=>o.showBatch=t),title:"智能批量添加","show-cancel-button":"",width:"800",onConfirm:i.zhinengConfirm},{default:d((()=>[c("div",$,[n(S,{value:o.amountText,"onUpdate:value":e[3]||(e[3]=t=>o.amountText=t),placeholder:"例如：10.25.33.11.22各15"},null,8,["value"])])])),_:1},8,["show","onConfirm"]),n(C,{visible:o.showType,"onUpdate:visible":e[7]||(e[7]=t=>o.showType=t),title:"按类别加数",onOk:i.typeConfirm,"ok-text":"确认","cancel-text":"取消"},{default:d((()=>[c("div",U,[n(w,{class:"header-button",value:o.addType,"onUpdate:value":e[5]||(e[5]=t=>o.addType=t),options:o.typeOptions,size:"large",placeholder:"请选择需要添加的类别",style:{width:"200px","margin-right":"22px"},onChange:i.typeChange},null,8,["value","options","onChange"]),c("p",E,y(o.typeStr),1),n(r,{prefix:"￥",value:o.typeAmount,"onUpdate:value":e[6]||(e[6]=t=>o.typeAmount=t),style:{width:"200px"}},null,8,["value"])])])),_:1},8,["visible","onOk"])])}],["__scopeId","data-v-bec1c0dc"]]);export{j as default};