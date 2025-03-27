<template>
  <div class="header" >
   <img src="@/assets/images/heading.png" alt="Header" class="header-img">
   <div class="eyes">
    <img src="@/assets/images/eye.png" alt="Eye" class="eye-img">
   </div>
  </div>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';

// const router=useRouter()


</script>

<style scoped>

.header{
  position: relative;
  width: 100%; /* 根据页面宽度动态调整 */
  max-width: 1000px; /* 最大宽度 */
  margin: 0 auto; /* 居中 */
}

.header-img {
  width: 100%; /* 图片宽度跟随容器 */
  height: auto; /* 高度自适应 */
}

img{
  width: 100%;
}

.eyes{
  position: absolute;
  top:30%; /* 调整眼睛位置 */
  left: 35%; /* 眼睛相对于 character 的水平起始位置 */
  width: 60%; /* 眼睛容器的宽度 */
  display: flex;
  justify-content: space-between;
}

.eye-img {
  width: 50%; /* 眼睛宽度 */
  height: auto; /* 高度自适应 */
  animation: blink 2.5s infinite;
}

@keyframes blink {
  0%, 100% {
    transform: scaleY(1); /* 正常大小 */
  }
  50% {
    transform: scaleY(0); /* 眨眼时高度为0 */
  }
}

</style>
