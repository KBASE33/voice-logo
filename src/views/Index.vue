<template>
<div>
  <div class="container">
    <img src="@/assets/images/background.png" style="position: absolute; height: 100vh; width: 100vw;" alt="">
    <img src="@/assets/images/logo1.png" style="position: absolute; left: -2vw; width: 80vw; bottom: 88vh;" alt="">
    <img src="@/assets/images/title.png" style="position: absolute; bottom: 62vh; left: 10vw; width: 60vw; height: 40vw;" alt="">
    <img src="@/assets/images/item.png" style="position: absolute; height: 10vh; width: 13vw; left: 70vw; top: 40vh;" alt="">
    <img src="@/assets/images/kuang.png" style="position: absolute; height: 15vh; width: 24vw; left: 46vw; top: 28vh;" alt="" class="think1">
    <img src="@/assets/images/kuang2.png" style="position: absolute; height: 10vh; width: 20vw; left: 78vw; top: 28vh;" alt="" class="think2">
    <img src="@/assets/images/cat.png" style="position: absolute; height: 9vh; width: 13vw; left: 52vw; top: 30.5vh;" alt="" class="think1">
    <img src="@/assets/images/dog.png" style="position: absolute; height: 10vh; width: 13vw; left: 82vw; top: 26.5vh;" alt="" class="think2">
    <img src="@/assets/images/dianji.png" style="position: absolute; height: 10vh; width: 13vw; left: 72vw; top: 85vh;" alt="" class="dianji">
    <transition name="fade">
      <div v-if="showDetails" class="details">
        <p>通过普通输入以及其它的途径，来实现生成LOGO的效果</p>
      </div>
    </transition>

    <!-- 项目详情按钮 -->
    <transition name="fade">
      <div v-if="!showDetails" class="summary">
        <VanButton @click="toggleDetails" class="project-button">项目详情</VanButton>
      </div>
    </transition>

    <!-- 开始生成按钮 -->
    <transition name="button-move">
      <VanButton @click="gotostart" :class="{'move-down': showDetails}" class="start-button">开始生成我的LOGO</VanButton>
    </transition>

    <!-- 点击图标（重复） -->
    <img src="@/assets/images/dianji.png" style="position: absolute; height: 10vh; width: 13vw; left: 72vw; top: 85vh;" alt="" class="dianji">

    <!-- 团队成员信息 -->
    <div class="message">
      <p style="margin-bottom: 0.4vh;">指导老师：张随雨</p>
      <p>团队成员</p>
      <p>桑菲阳 徐嘉杞 贾贝希 王紫茹 汪瑾</p>
      <p>李牧展 顾菁仪 宋鹏伟 张洛 杨云戈</p>
    </div>
  </div>
</div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import useUserStore from "@/stores/userStore";
  
  let userStore = useUserStore();
  const router = useRouter();
  const showDetails = ref(false);
  
  const gotostart = () => {
    router.push("/logo");
  }
  
  const toggleDetails = () => {
    showDetails.value = !showDetails.value;
  }
  </script>
  
  <style scoped>
  .container {
    position:relative;
    display: flex;
    justify-content: center;
    width: 100vw;
    height: 100vh;
  }
  
  .van-button {
    width: 65vw; 
    height: 5.5vh;
    font-size: 4vw;
    color: white;
    font-family: '方正黑体简体';
    font-weight: bold;
    border: none;
    border-radius: 10px;
    letter-spacing: 1vw;
    position:relative;
    background-color: rgba(255, 255, 255, 0.312);
  }
  
  .project-button {
    top: 55vh;
    width: 55vw;
  }
  
  .start-button {
    top: 65vh;
    transition: top 0.5s ease;
  }
  
  .move-down {
    
  }
  
  .container .message {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    bottom: 3vh;
  }
  
  .container p {
    position: relative;
    font-family: '方正黑体简体';
    color: white;
    font-size: 2.5vw; 
    letter-spacing: 0.5vw;
  }
  
  /* 定义淡入淡出动画 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  .button-move-enter-active, .button-move-leave-active {
    transition: top 0.5s ease;
  }
  
  .details {
    position: absolute;
    font-family: '方正黑体简体';
    top: 53vh;
    padding: 10px;
    width: 75vw;
    letter-spacing: 0.8vw;
  }
  
  .summary {
    position: absolute;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @keyframes fadeInOut1 {
  0% {
    opacity: 0; /* 完全透明 */
  }
  50% {
    opacity: 1; /* 完全不透明 */
  }
  100% {
    opacity: 0; /* 完全透明 */
  }
}

@keyframes fadeInOut2 {
  0% {
    opacity: 1; /* 完全透明 */
  }
  50% {
    opacity: 0; /* 完全不透明 */
  }
  100% {
    opacity: 1; /* 完全透明 */
  }
}

@keyframes fadeInOut3 {
  0% {
    top:65vh;
    left: 74vw;
  }
  100% {
    top: 66vh;
    left: 72vw;
  }
}

  .think1{
    animation: fadeInOut1 5s infinite;
  }

  .think2{
    animation: fadeInOut2 5s infinite;
  }

  .dianji{
    animation: fadeInOut3 1s infinite;
  }
  </style>
  