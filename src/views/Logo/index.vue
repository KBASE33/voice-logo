<template>
  <div class="logomain">
    <CommonHeader></CommonHeader>
    <div>
      <div class="background">
        <img src="@/assets/images/item.png" style="height: 9vw; width: 9vw; padding: 0vw;">
      </div>
      <div class="message-box">
        <div id="textContainer" ref="textContainer" class="message-box-text"></div>
        <audio id="audioPlayer" ref="audioRef" autoplay>
          <source src="@/assets/voice/first5.wav">
        </audio>
      </div>
      <p class="example-title">案例参考</p>
      <div @click="handleExampleClick">
      <p class="example-text1" >竹篮里放着多个香甜美味的面包</p>
      <p class="example-text1" >早八的一杯咖啡</p>
      </div>
      <div @click="handleExampleClick">
        <p class="example-text2" >花丛里的一只小猫</p>
        <p class="example-text2" >镜头聚焦、话筒收声</p>
      </div>
      
      <div class="transcription-box" v-show="transcription !== ''">
        <div id="transcription" class="record">
          <span class="record-text">{{ transcription }}</span>
        </div>
      </div>
      <div class="ripple" v-show="showRipple"></div>
      
    </div>
    <p class="tishi">点击 录音</p>
    <img :src="recordIcon" ref="recordButton" @click="toggleRecording" class="record-button"/>
    <img @click="router.push('/')" src="@/assets/images/back.png" class="back-button"/>
    <img @click="router.push('/logo/select')" v-show="button" src="@/assets/images/next.png" class="next-button"/>

  </div>
</template>

<script setup>
import { ref} from "vue";
import { useRouter } from "vue-router";
import axios from 'axios';
import fs from 'fs';
import { onBeforeUnmount } from 'vue';
import { onMounted } from "vue";
import { postGenerateApi } from "@/api/generateApi";
import { getBlob } from "@/utils/getblob.js";
import { ElLoading } from "element-plus";
import { getViewApi } from "@/api/userApi";
import { showNotify } from "vant";
import { fa } from "element-plus/es/locales.mjs";
import { addNumber } from "vant/lib/utils";
import { useDrawStore } from "@/stores/drawStore";
import recordIcon from "@/assets/images/voice.png";
import pauseIcon from "@/assets/images/stop.png";
const router = useRouter();
const audioRef = ref(null);
const text = '您好，我是传媒智绘—哆哆！请先使用语音输入需求，我将会为您生成专属的logo。'; // 使用 \n 来分隔不同的行
const textContainer = ref(null);
const lineWidth = '50vw'; // 设置每行文本的宽度
let currentLine = '';
let nowStep = ref(1);
let showRipple = ref(false);
let recordButton = ref(false);
const transcription = ref('');
const showTranscription = ref(false);
let retryCount = 0;
const maxRetries = 3;



let isRecording = false;
let button = false;
let lastTranscription = '';
const drawStore=useDrawStore()
const recordingIcon = ref(recordIcon);
const handleReset = () => {
    // 刷新页面
    window.location.reload();
    // router.push('/logo')
}
const handleStep = (mystep) => {
  
  // mystep的值为-1或1,对应改变nowStep的值
  console.log("mystep", mystep);
  nowStep.value += mystep;
  if(nowStep.value==1 && mystep==-1){
    window.location.reload();
  }
}

onMounted(() => {
 if (audioRef.value) {
   audioRef.value.volume = 0.7;
 }
});

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

let recognition = new webkitSpeechRecognition();
recognition.lang = 'zh-CN'; // 设置语言
recognition.interimResults = true; // 启用临时结果

const startRecording = () => {
  console.log('开始录音'); // Debug
  isRecording = true;
  showTranscription.value = true;
  transcription.value = '......';
  recordingIcon.value = pauseIcon;
  showRipple.value = true;
  recognition.start(); // 确保这里启动了识别

  recognition.onresult = function(event) {
    let result = event.results[0][0].transcript;
    transcription.value = result;
    drawStore.voiceinput = result;
    lastTranscription = result;
    console.log(lastTranscription);
    showRipple.value = false;
    button = true;
  };

  recognition.onerror = function() {
    transcription.value = '语音未识别成功，请重新输入';
    showRipple.value = false;
    recordingIcon.value = recordIcon;
    console.log(`Speech recognition error detected: ${event.error}`);
    console.log(`Additional information: ${event.message}`);
  };
};

const stopRecording = () => {
  console.log('结束录音'); // Debug
  isRecording = false;
  recognition.stop();
  recordingIcon.value = recordIcon;
  if (lastTranscription.trim() === '') {
    showTranscription.value = false;
  }
}

const toggleRecording = () =>{
    if(isRecording){
      showRipple.value = false;
      stopRecording();
    }else{
      button=false;
      audioRef.value.pause(); // 暂停音频播放
      audioRef.value.currentTime = 0; // 重置音频播放位置
      startRecording();
    }
}

//案例输入交互
const handleExampleClick = (event) =>{
  const text = event.target.innerText;
  transcription.value = text;
  drawStore.voiceinput = text;
  button = true;
  console.log(drawStore.voiceinput);
}

  // var fd = new FormData();

  // fd.append("logoKeys", logokeysarr.value);
  // fd.append("language", "chinese simplified");
  // fd.append("weight", myweight);
  // fd.append("prompt", "Custom_Logo");
  // fd.append("client", "cuz");
  // // getViewApi({prompt_id: "64e8f292-3db5-41cc-b9fa-b37a4e128450", client_id: "client_id_argv" })
  // // .then((res)=>console.log(res))
  // console.log("执行生成逻辑", bodyImg, logokeysarr.value);
  // postGenerateApi(fd, { product: "logo" })
  //   .then((postres) => {
  //     console.log("posterupload res", postres);

// 点击生成与后端交互
const handleCreate = () => {
router.push('/logo/view')
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
height: 20vw;
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
margin-top: -6vw;
font-family: 'Source Han Sans CN VF';
font-style: normal;
font-weight: bold;
font-size: 3.2vw;
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
.example-title{
margin-left:3vw;
margin-top: 1.5vw;
font-family: 'Inter';
font-style: normal;
font-size: 2.5vw;
line-height: 6vw;
letter-spacing: 0.1vw;
color: #4D4D4D;
}

.example-text1{
border-radius: 5vw;
border:0.1vw solid #4769ff70;
box-shadow: 0px 1px 1px 1px rgba(125, 213, 248, 0.188);
padding-inline: 2vw;
padding-block: 1vw;
cursor: pointer;
display: inline;
margin-left: 2vw;
margin-right: 5vw;
margin-top: -0.5vw;
font-family: 'Source Han Sans CN VF';
font-style: normal;
font-size: 2.5vw;
line-height: 6vw;
letter-spacing: 0.1vw;
}

.example-text2{
border-radius: 5vw;
border:0.1vw solid #4769ff70;
box-shadow: 0px 1px 1px 1px rgba(125, 213, 248, 0.188);
padding-inline: 2vw;
padding-block: 1vw;
cursor: pointer;
display: inline;
margin-left: 2vw;
margin-right: 5vw;
margin-top: -0.5vw;
font-family: 'Source Han Sans CN VF';
font-style: normal;
font-size: 2.5vw;
line-height: 6vw;
letter-spacing: 0.1vw;
color: #252525;
}


.record-button {
position: absolute;
left: 46vw;
top: 150vw;
width: 10vw;
height:10vw;
}

.ripple {
  position: absolute;
  top: 154.4vw;
  left: 50.3vw;
  width: 1.4vw;
  height:1.4vw;
  background-color: #4B6BFF;
  border-radius: 50%;
  transform: scale(6);
  animation: rippleEffect 1.5s linear infinite;
}

@keyframes rippleEffect {
  to {
    transform: scale(10);
    opacity: 0;
  }
}

.record{
box-sizing: border-box;
position: absolute;
max-width: 50vw;
padding: 10px;
border: 0.2vw solid #4B6BFF;
box-shadow: 0px 2px 3.1px 2px rgba(0, 0, 0, 0.11);
border-radius: 15px 0px 15px 15px;
overflow-wrap: break-word;
text-orientation: sideways-right;
transform-origin: top right; /* 指定变换的原点 */
}

.transcription-box {
margin-top: 5vw;
margin-left: -8vw;
width: 100%;
height: 30vw;
display: flex;
justify-content: flex-end; /* 框位于画面最右侧 */
align-items: flex-start;
overflow: hidden;
}

.record-text{
font-size: 5vw;
padding: 3vw;
font-family: 'Source Han Sans CN VF';
font-style: normal;
font-weight: 300;
font-size: 4vw;
line-height: 6vw;
letter-spacing: 0.1vw;
display: flex;
align-items: center;
color: #585858;
}

.tishi{
  position: absolute;
font-size: 3vw;
top: 146vw;
left:45.5vw;
font-family: 'Source Han Sans CN VF';
font-style: normal;
font-weight: 300;
font-size: 2.5vw;
display: flex;
align-items: center;
color: #585858;
}


.van-button {
    width: 32.4vw;
    height: 9.72vw;
    font-size: 4vw;
    font-weight: bold;
    /* letter-spacing: 5px; */
    position: absolute;
    bottom: 13.888vw;
    border-radius: 1vw;
    /* top: 730px; */
    border:0.5vw solid #4768FF;



}

.laststep,
.resetbtn {
    /* background-color: #E3E3E3; */
    color: #4768FF;
    left: 10.42vw;



}

.nextstep,
.createbtn {
    background-color: #4768FF;
    color: white;
    right: 10.42vw;
    /* bottom: 85px; */



}

.next-button {
position: absolute;
left: 70vw;
top: 150vw;
width: 10vw;
height:10vw;
}

.back-button {
position: absolute;
left: 22vw;
top: 150vw;
width: 10vw;
height:10vw;
}
</style>
