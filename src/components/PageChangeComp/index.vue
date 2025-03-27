<template>
    <div class="pager">
        <!-- 当前是第 {{ nowStep }}个步骤 -->
        <VanButton class="laststep" v-if="nowStep !== 1" @click="handleStep(-1)">上一步</VanButton>
        <VanButton class="nextstep" v-if="nowStep < totalSteps" @click="handleStep(1)">下一步</VanButton>
        <VanButton class="resetbtn" v-if="nowStep === 1" @click="handleReset">上一步</VanButton>
        <VanButton class="createbtn" v-if="nowStep === totalSteps" @click="handleCreate">生成</VanButton>

    </div>
</template>

<script setup lang="ts">
import {reactive,ref} from 'vue'
import {useRouter} from 'vue-router'
const router=useRouter()

defineProps({
    // 一共有几页
    totalSteps: {
        type: Number,
        default: 3
    },
    nowStep: {
        type: Number,
        default: 1
    },
    
})
// let stepchange=ref(0)
const handleReset = () => {
    // 刷新页面
    // window.location.reload();
    router.push('/logo')
}
const emit = defineEmits(["changeStep","startCreate"]);
const handleStep = (mystep:number) => {
    emit("changeStep",mystep)
   

}
const handleCreate = () => {
    emit("startCreate")
   

}


</script>

<style scoped>
.van-button {
    position: relative;
    width: 32.4vw;
    height: 9.72vw;
    font-size: 4vw;
    font-weight: bold;
    /* letter-spacing: 5px; */
    top: 5vw;
    left: 20vw;
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
</style>