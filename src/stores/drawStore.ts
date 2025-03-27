import { defineStore } from "pinia"
import { ref } from "vue"

export const useDrawStore = defineStore('draw2', () => {
    
    const logoimgurl1 = ref('')
    const logoimgurl2 = ref('')
    const logooutputs=ref<any>([])
    const voiceinput=ref('')
  
  
    return { logoimgurl1,logoimgurl2,logooutputs,voiceinput}
  },{persist:true})