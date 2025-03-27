<template>
    <div class="logomain" @contextmenu.prevent>
        <CommonHeader></CommonHeader>
        <p class="loadingtext" ref="loadingtext">
            {{ loadingprogress }}%
        </p>
        <div v-if="nowStep === 1">第一步</div>
        <div v-if="nowStep === 2">
        <div class="background">
        <img src="@/assets/images/item.png" style="height: 9vw; width: 9vw; padding: 0vw;">
        </div>
            <div class="message-box">
                <div id="textContainer" ref="textContainer" class="message-box-text"></div>
                <audio id="audioPlayer" ref="audioRef" autoplay>
                    <source src="@/assets/voice/second4.wav">
                </audio>
            </div>
            <div>
            <div class="item-container1"> 
                <div v-for="item in gridItems1" :key="item.name" class="xuanxiang1" @click="handleClick1(item.name, 1)"
                    :class="{ selected: selectedName1 === item.name }">
                    {{ item.name }}
                </div>
            </div>
            <div class="item-container2">
                <div v-for="item in gridItems4" :key="item.name" class="xuanxiang1" @click="handleClick1(item.name, 2)"
                    :class="{ selected: selectedName2 === item.name }">
                    {{ item.name }}
                </div>
                
            </div>
            <div class="item-container3">
                
                <div v-for="item in gridItems5" :key="item.name" class="xuanxiang1" @click="handleClick1(item.name, 3)"
                    :class="{ selected: selectedName3 === item.name }">
                    {{ item.name }}
                </div>

            </div>
            <img src="@/assets/images/xiaohui.png" alt="" ref="cuzlogo" class="cuzlogo" @click="toggleLogoSelection('cuzlogo')">
            <img src="@/assets/images/zhongxin.png" alt="" ref="logo2" class="logo2" @click="toggleLogoSelection('logo2')">
        </div>
            <div class="line"></div>

            <div class="item-container4">
                <!-- 颜色 -->
          
                <div v-for="item in gridItems2" :key="item.name" class="xuanxiang2" @click="handleClick2(item.name, 4)"
                    :class="{ selected: selectedName4 === item.name }" :style="`border-color: ${item.mycolor};color: ${selectedName4 === item.name?'white':item.mycolor};background-color: ${selectedName4 === item.name? item.mycolor : 'white'};`">
                    {{ item.name }}
                </div>
               
            </div>

            <div class="line"></div>

            <div class="item-container5">
                <div v-for="item in gridItems3" :key="item.name" class="xuanxiang3" @click="handleClick2(item.name, 5)"
                    :class="{ selected: selectedName5 === item.name }">
                    {{ item.name }}
                </div>
            </div>

            <PageChangeComp :nowStep="nowStep" :total-steps="2" @change-step="handleStep" @start-create="handleCreate">
            </PageChangeComp>

        </div>

        

    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';
import { postGenerateApi,postLogo } from "@/api/generateApi";
import { getBlob } from "@/utils/getblob.js";
import { ElLoading } from "element-plus";
import { onMounted } from "vue";
import { getViewApi } from "@/api/userApi";
import { useDrawStore } from "@/stores/drawStore";
import { showNotify } from "vant";
import { fa } from "element-plus/es/locales.mjs";
import { addNumber } from "vant/lib/utils";
import base from "@/api/base";
const logoimg1=ref(null);
const logoimg2=ref(null);
const cuzlogo=ref(null);
const logo2=ref(null);
const selectedImage = ref(null);
const audioRef = ref(null);
const text = '下面是常用标签预设推荐，如果有合适的请您勾选'; // 使用 \n 来分隔不同的行
const textContainer = ref(null);
const lineWidth = '50vw'; // 设置每行文本的宽度
let currentLine = '';

onMounted(() => {
 if (audioRef.value) {
   audioRef.value.volume = 1;
 }
});


//创建第一个网格数据
const gridItems1 = ref([
    { name: "三维" },
    { name: "简易" },
    { name: "抽象" },
    { name: "塔罗牌" },
    { name: "水彩" },
]);
const selectedName1 = ref( '');

const gridItems4 = ref([
    { name: "复古" },
    { name: "卡通" },
    { name: "油画" },
    { name: "新艺术" },
]);
const selectedName4 = ref( '');

const gridItems5 = ref([
    { name: "单色" },
    { name: "剪影" },
    { name: "强阴影" },
]);
const selectedName5 = ref( '');

//创建第二个网络数据
const gridItems2 = ref([
    { name: "红色", mycolor: "#FF0000" },
    { name: "橙色", mycolor: "#FFA500" },
    { name: "黄色", mycolor: "#F8DD50" },
    { name: "绿色", mycolor: "#008000" },
    { name: "蓝色", mycolor: "#0000FF" },
    { name: "紫色", mycolor: "#800080" },
    { name: "黑色", mycolor: "#000000" },
    { name: "棕色", mycolor: "#A52A2A" },
    { name: "粉色", mycolor: "#FFC0CB" },
    { name: "金色", mycolor: "#DEBD13" },
    { name: "银色", mycolor: "#C0C0C0" },
    { name: "白色", mycolor: "#D9D9D9" },
]);

const selectedName2 = ref( '');
//创建第三个网络数据
const gridItems3 = ref([
    { name: "猫" },
    { name: "云" },
    { name: "狗" },
    { name: "剑" },
    { name: "树" },
    { name: "鸟" },
    { name: "拳" },
    { name: "花" },
    { name: "太阳" },
    { name: "月亮" },
]);
const selectedName3 = ref( '');

const handleClick1 = (name, gridNumber) => {
    // 检查当前点击的名称是否已经与选中的名称相同
    if (
        (gridNumber === 1 && selectedName1.value === name) ||
        (gridNumber === 2 && selectedName2.value === name) ||
        (gridNumber === 3 && selectedName3.value === name) ||
        (gridNumber === 4 && selectedName4.value === name) ||
        (gridNumber === 5 && selectedName5.value === name)
    ) {
        // 如果名称相同，则取消选中
        if (gridNumber === 1) {
            selectedName1.value = '';
        } else if (gridNumber === 2) {
            selectedName2.value = '';
        } else if (gridNumber === 3) {
            selectedName3.value = '';
        } else if (gridNumber === 4) {
            selectedName4.value = '';
        } else if (gridNumber === 5) {
            selectedName5.value = '';
        }
    } else {
        // 如果名称不同，则清除 handleClick1 相关的选中状态并更新选中的名称
        clearSelectionsForHandleClick1();

        if (gridNumber === 1) {
            selectedName1.value = name;
        } else if (gridNumber === 2) {
            selectedName2.value = name;
        } else if (gridNumber === 3) {
            selectedName3.value = name;
        } else if (gridNumber === 4) {
            selectedName4.value = name;
        } else if (gridNumber === 5) {
            selectedName5.value = name;
        }
    }
};

const clearSelectionsForHandleClick1 = () => {
    selectedName1.value = '';
    selectedName2.value = '';
    selectedName3.value = '';
    // 注意：不清除 selectedName4 和 selectedName5，以保持 handleClick2 的独立性
};

const handleClick2 = (name, gridNumber) => {
    // 检查当前点击的名称是否已经与选中的名称相同
    if (
        (gridNumber === 4 && selectedName4.value === name) ||
        (gridNumber === 5 && selectedName5.value === name)
    ) {
        // 如果名称相同，则取消选中
        if (gridNumber === 4) {
            selectedName4.value = '';
        } else if (gridNumber === 5) {
            selectedName5.value = '';
        }
    } else {
        // 如果名称不同，则更新选中的名称
        if (gridNumber === 4) {
            selectedName4.value = name;
        } else if (gridNumber === 5) {
            selectedName5.value = name;
        }
    }
};


const drawStore = useDrawStore();
let voicetext=drawStore.voiceinput
console.log(voicetext);
const router = useRouter();

let nowStep = ref(2);

const handleStep = (mystep) => {

    // mystep的值为-1或1,对应改变nowStep的值
    console.log("mystep", mystep);
    nowStep.value += mystep;
    if (nowStep.value == 1 && mystep == -1) {
        //   window.location.reload();
        router.push('/logo')
    }
}

let index = 0;
  const intervalId = setInterval(() => {
    if (index < text.length) {
      currentLine += text[index];
      if (currentLine.includes('\n')) {
        textContainer.value.innerHTML += `<span style="display:inline-block; width:${lineWidth};">${currentLine.replace('\n', '')}</span><br>`;
        currentLine = '';
      }
      index++;
    } else {
      clearInterval(intervalId);
      if (currentLine !== '') {
        textContainer.value.innerHTML += `<span style="display:inline-block; width:${lineWidth};">${currentLine}</span>`;
      }
    }
  }, 25); // 每个字符间隔500毫秒

const mystring=ref('')
const websocket = ref(null);
const receivedMessage = ref('');
   
const loadingprogress=ref(0)
const loadingtext=ref(null)

const logoname=ref('')
logoname.value=""
const toggleLogoSelection = (logoRef) => {
    let errorMessage = '';

    // 检查当前点击的 logoRef 是否已经选中
    if (
        (logoRef === 'cuzlogo' && cuzlogo.value.classList.contains('logoselected')) ||
        (logoRef === 'logo2' && logo2.value.classList.contains('logoselected'))
    ) {
        // 如果已经选中，则取消选中
        clearLogoSelections();
        logoname.value = ''; // 清空选中的 Logo 名称
    } else {
        // 如果未选中，则清除所有选中状态并更新选中的 Logo
        clearLogoSelections();

        switch (logoRef) {
            case 'cuzlogo':
                cuzlogo.value.classList.add('logoselected');
                logoname.value = 'xiaohui.png';
                break;
            case 'logo2':
                logo2.value.classList.add('logoselected');
                logoname.value = 'zhongxin.png';
                break;
            default:
                logoname.value = '';
                break;
        }
    }

    if (errorMessage) {
        alert(errorMessage); // 或者使用其他方式显示错误提示，如模态框
    }
};

const clearLogoSelections = () => {
    cuzlogo.value.classList.remove('logoselected');
    logo2.value.classList.remove('logoselected');
};

// 点击生成与后端交互
const handleCreate = () => {
audioRef.value.pause(); // 暂停音频播放
audioRef.value.currentTime = 0; // 重置音频播放位置

//生成界面语音播放
const result = ref('')
console.log(selectedName1.value, selectedName2.value, selectedName3.value, selectedName4.value, selectedName5.value);
result.value =selectedName1.value + selectedName2.value + selectedName3.value +","+ selectedName4.value +","+ selectedName5.value;
console.log(result.value);
let textaudio;
var myHeaders = new Headers();
myHeaders.append("Host", "jjc.cuz.edu.cn");
myHeaders.append("Connection", "close");

var formdata = new FormData();
formdata.append("text", "已为您生成有关"+voicetext+"包含"+result.value+"等元素的logo， 如有其他需要可点击下方重新生成。");
formdata.append("voice", "147");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};
//生成界面语音播放 end

const loadingInstance = ElLoading.service({
    fullscreen: true,
    //text: loadingtext.value+'%',
  });
  
loadingtext.value.style.display='block'
mystring.value=selectedName1.value + ',' + selectedName2.value + ',' + selectedName3.value + ',' + selectedName4.value + ',' + selectedName5.value;

//语音生成后端请求
fetch("https://jjc.cuz.edu.cn/api/logo/tts", requestOptions)
  .then(response => response.text())
  .then(result => {
    let data = JSON.parse(result);
    let musicurl = data.filename;

    result = "http://jjc.cuz.edu.cn" + musicurl;

    // 正则表达式或字符串分割方法来提取链接
    var urlLinks = result;
    console.log(result);
    console.log(urlLinks);
    textaudio = new Audio(urlLinks);

    
  })
  .catch(error => console.log('error', error));
//语音生成后端请求 end

//logo生成后端请求
var myHeaders = new Headers();

myHeaders.append("Host", "jjc.cuz.edu.cn");
myHeaders.append("Connection", "keep-alive");

var formdata = new FormData();
formdata.append("client", "cuz-logo");
formdata.append("prompt", "logo");
formdata.append("ai_sever_host", "10.1.251.11");
formdata.append("ai_sever_port", "8188");
formdata.append("logoname", logoname.value);
formdata.append("voice_text", "logo,"+voicetext+","+mystring.value);
if (logoname.value === "xiaohui.png" || logoname.value === "zhongxin.png") {
        formdata.append("weight", 0.8);
    } else {
        formdata.append("weight", 0);
    }
formdata.append("seed", Math.floor(1000000000000000 + Math.random() * 9000000000000000));

console.log(formdata);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

// 发起第一个请求，获取 promptId
fetch("https://jjc.cuz.edu.cn/api/logo/logogen", requestOptions)
  .then(response => response.text())
  .then(result => {
    let data = JSON.parse(result);
    let promptId = data.prompt_id;
    console.log("promptId的值为:", promptId);
    console.log("收到的消息：", result);

    // 创建 queue 请求的选项
    var queueOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    // 轮询 queue 接口，直到收到 finish 消息
    function pollQueue() {
      const queueUrl = `https://jjc.cuz.edu.cn/api/logo/queue?ai_sever_host=10.1.251.11&ai_sever_port=8188&prompt_id=${promptId}`;

      fetch(queueUrl, queueOptions)
        .then(response => response.text())
        .then(result => {
          console.log('Queue 请求返回:', result);

          // 判断是否已完成
          let data = JSON.parse(result);
          if (data.status === 'finish') {
            console.log('Queue 完成，开始第二个请求');
            // 执行第二个请求
            const secondFetchUrl = `https://jjc.cuz.edu.cn/api/logo/view?frontend=logo&prompt_id=${promptId}&client_id=cuz-logo&ai_sever_host=10.1.251.11&ai_sever_port=8188`;

            var photoOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };

            fetch(secondFetchUrl, photoOptions)
              .then(response => response.json())
              .then(receivedMessage => {
                console.log(receivedMessage);
                drawStore.logooutputs = receivedMessage.data;
                console.log("绘图成功", drawStore.logooutputs);
                router.push('/logo/view');
                loadingInstance.close();
                textaudio.volume = 0.5;
                textaudio.play();
              })
              .catch(error => console.log('第二个请求出错', error));

            // 停止轮询
            clearInterval(pollInterval);
          } else {
            if (loadingprogress.value < 94) {
                loadingprogress.value += 12;
            } else {
                loadingprogress.value = 96;
            }

            console.log("loadingProgress.value", loadingprogress.value);
            loadingInstance.text = loadingprogress.value + '%';
            console.log('尚未完成，继续轮询...');
          }
        })
        .catch(error => console.log('Queue 请求出错', error));
    }

    // 开始轮询 queue 接口，每隔5秒请求一次
    const pollInterval = setInterval(pollQueue, 3000);

  })
  .catch(error => console.log('第一个请求出错', error));

};





</script>

<style lang="scss" scoped>
.background{
  background-color: rgb(224, 223, 221);
  width: 9vw;
  height: 10vw;
  border:0.1vw solid #a2a3a7;
  border-radius: 2vw;
}

.message-box {
    display: flex;
justify-content: center;
align-items: center;
height: 16vw;
width: 60vw;
margin-left: 10vw;
margin-top: -8vw;
border:0.5vw solid #4769ff70;
border-radius: 0px 15px 15px 15px;
animation: dynamicWidth 1.2s linear;
}
.message-box-text {
overflow: hidden;
height: 12vw;
padding: 5vw;
margin-top: 0vw;
font-family: 'Source Han Sans CN VF';
font-style: normal;
font-weight: bold;
font-size: 3.3vw;
line-height: 6vw;
letter-spacing: 0.1vw;
color: #585858;
}
@keyframes dynamicWidth {
0% {
left: 0;
width: 2vw;

}
100% {
left: 100%;
width: 50vw;

}
      }
@keyframes typewriter {
  0% {width: 0; height: 5vw;}
  100% { width: 100%;height: 5vw; }
}

.item-container1 {
    display: grid;
    grid-template-columns: repeat(5, 14vw);
    row-gap: 0vw;
    column-gap: -20vw;
    margin-top: 6vw;
    margin-left: 2vw;
    width: 80vw;
}

.item-container1 .selected {
    background-color: white;
    width:5.5vw;
    height: 5.5vw;
    font-size: 1.8vw;
    margin-left: 1vw;
    background-image: url('@/assets/images/diamond1.png');
}

.item-container2 {
    display: grid;
    grid-template-columns: repeat(4, 14vw);
    row-gap: 0vw;
    column-gap: -20vw;
    margin-top: 0vw;
    margin-left: 10vw;
    width: 60vw;
}

.item-container2 .selected {
    background-color: white;
    width:5.5vw;
    height: 5.5vw;
    font-size: 1.8vw;
    font-size: 1.8vw;
    margin-left: 1vw;
    background-image: url('@/assets/images/diamond1.png');
}

.item-container3 {
    display: grid;
    grid-template-columns: repeat(3, 14vw);
    row-gap: 0vw;
    column-gap: -20vw;
    margin-top: 0vw;
    margin-left: 18vw;
    width: 40vw;
}

.item-container3 .selected {
    background-color: white;
    width:5.5vw;
    height: 5.5vw;
    font-size: 1.8vw;
    font-size: 1.8vw;
    margin-left: 1vw;
    background-image: url('@/assets/images/diamond1.png');
}

.item-container4 {

    display: grid;
    grid-template-columns: repeat(6, 15vw);
    grid-row-gap: 1vw;
    margin-top: 3vw;
    margin-left: 4vw;
    justify-items: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}

.item-container4 .selected {
    background-color: #4768FF;
}

.item-container5 {
    display: grid;
    grid-template-columns: repeat(5, 15vw);
    row-gap: 2vw;
    column-gap: 2vw;
    margin-top: 5vw;
    margin-left: 6vw;
}

.item-container5 .selected {
    background-color: white;
    background-image: url('@/assets/images/label1.png');
}

.xuanxiang1 {
    position: relative;
    display: flex;
    /* 使用 Flexbox 布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    width:7vw;
    /* 确保整个区域可点击 */
    height: 7vw;
    border: none;
    /* 移除边框 */
    padding: 10px;
    font-size: 32px;
    cursor: pointer;
    overflow: hidden;
    /* 确保溢出部分被隐藏 */
    writing-mode: vertical-lr;
    /* 设置垂直书写模式 */
    text-orientation: mixed;
    /* 确保文字方向混合 */
    background-image: url('@/assets/images/diamond.png');
    background-size: cover;
    /* 确保背景图案覆盖整个区域 */
    font-size: 2.3vw;
}

.xuanxiang2 {
    border: 2px solid;
    border-radius: 5px;
    padding: 10px;
    width: 6vw;
    height: 1vw;
    cursor: pointer;
    font-size: 2.8vw;

    display: flex; /* 使用 Flexbox 布局 */
    align-items: center; /* 垂直居中 */
}

.xuanxiang3 {
    position: relative;
    display: flex;
    /* 使用 Flexbox 布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    width: 9vw;
    /* 确保整个区域可点击 */
    height: 2vw;
    border: none;
    /* 移除边框 */
    padding: 3vw;
    font-size: 3vw;
    cursor: pointer;
    overflow: hidden;
    /* 确保溢出部分被隐藏 */
    background-image: url('@/assets/images/label.png');
    background-size: cover;
    /* 确保背景图案覆盖整个区域 */
    font-size: 3vw;
}

.selected {
    background-color: #92b0fd;
    // background:linear-gradient( #92b0fd, #f2f2f2);
    color: aliceblue
}

.line {
    border: 0.2vw solid #e0e0e0;
    margin-top: 4vw;
    margin-left: 5vw;
    width: 88vw;
}
.el-loading-spinner .el-loading-text {
    // color: var(--el-color-primary);
    font-size: 4vw !important;
    margin: 3px 0;
}
.item-container3 img {
    width: 14vw;
    // height: 12vw; /* 与宽度相同，保持正方形 */
    position: absolute;
    top:96.5vw;
    // background-color: #b52f2f;
    display: block;
    box-sizing: border-box;
}
.cuzlogo{
    position: absolute;
    width: 11vw;
    height: 11vw;
    left: 78vw;
    top: 73vw;
    border: 0.5vw solid #92b0fd; 
    // top:103vw;


}
.logo2{
    position: absolute;
    width: 11vw;
    height: 11vw;
    left: 78vw;
    top: 89vw;
    border: 0.5vw solid #92b0fd; 
}

.logoselected{
    border: 0.8vw solid #4768FF
}
.loadingtext{
    height: 6vw;
    width: 6vw;
    text-align: center;
    font-size: 4vw;
    position: fixed;
    top: 57vh;
    left: 48vw;
    margin-left: -3vw;
    margin-top: -3vw;
    color: #1989fa;
    z-index: 9999;
    display: none
}

.part-one{
    position: relative;
    top: 3vw;
    left: 5vw;
    width: 75vw;
    padding-bottom: 5vw;
    border:0.1vw solid #144f83;
    border-radius: 5vw;
    box-shadow: inset 0 0 2vw rgba(106, 173, 255, 0.5);
}

</style>
