<template>
    <div class="logoresult">
      <CommonHeader></CommonHeader>
      <div class="background">
        <img src="@/assets/images/item.png" style="height: 9vw; width: 9vw; padding: 0vw;">
        </div>
      <div class="container">
        <p>您的LOGO生成成功</p>
        <div class="imgbox">
          <img  v-for="(item,index) in drawStore.logooutputs" :key="index" :src="item.oss_url" alt="">

        </div>
      </div>
      <VanButton class="redraw"  @click="router.back()">重新生成</VanButton>
      <VanButton class="backtohome" @click="backtohome">回到主页</VanButton>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {ref} from 'vue'
import { useDrawStore } from "@/stores/drawStore";
import { showNotify, closeNotify } from 'vant';
import { useRouter } from 'vue-router';
import  base from '@/api/base';

let drawStore = useDrawStore();

const router=useRouter()
const backtohome=()=>{
  router.push("/")
}
</script>

<style scoped>
.background{
  background-color: rgb(224, 223, 221);
  width: 9vw;
  height: 10vw;
  border:0.1vw solid #a2a3a7;
  border-radius: 2vw;
}

.van-button {
    width: 32.4vw;
    height: 9.72vw;
    font-size: 4vw;
    font-weight: bold;
    /* letter-spacing: 5px; */
    /* position: absolute;
    bottom: 13.888vw;
    border-radius: 1vw; */
    /* top: 730px; */
    border:0.5vw solid #4768FF;
    position: relative;
    /* bottom: 5vw; */



}

.redraw {
    /* background-color: #E3E3E3; */
    color: #4768FF;
    /* left: 10.42vw; */
    bottom: -13vw;
    left:52.5vw;



}


.backtohome {
    background-color: #4768FF;
    color: white;
    /* right: 10.42vw; */
    /* bottom: 85px; */
    bottom: -2vw;
    left:20vw;


}
.container{
  width: 77vw;
    height: 79vw;
    border: 2px solid rgb(200, 200, 200);
    margin-left: 10vw;
    margin-top: -5vw;
    border-radius: 0 3vw 3vw 3vw;
    box-shadow:1vw 1vw 1vw rgba(167, 167, 167, 0.3);
}
.container p{

  font-size: 5vw;
  margin: 3vw 5vw;
}
.imgbox{
  display: flex;
    justify-content: space-around;
    align-content: space-around;
    flex-wrap: wrap;
    /* background-color: #4768FF; */
    margin: 0 auto;
    width: 82%;
    height: 81%;

}
.imgbox img{
  width:26vw;
  height: 26vw;
  /* margin-bottom: 2vw; */
}



</style>