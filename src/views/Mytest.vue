<template>
    <div class="main-right">
      <div class="nav-content-wrap">
        <div class="nav-content-item active">
          <div class="slide-side">
            <div class="audio-wrap">
              <div
                id="audio-wave"
                style="position: relative; width: 298px; height: 234px"
              >
                <img
                  style="position: absolute; top: 110px; left: 130px"
                  src="@/assets/images/voice.png"
                />
                <canvas
                  ref="myCanvas"
                  id="myCanvas"
                  width="298px"
                  height="230px"
                ></canvas>
              </div>
              <div
                class="button-shibie"
                v-if="begin"
                ref="audio"
                @click="doAstOperate()"
              >
                <el-icon><VideoPlay /></el-icon>
                开始识别
              </div>
              <div
                class="button-shibie"
                v-else
                ref="audio"
                @click="doAstOperate()"
              >
                <el-icon><VideoPause /></el-icon>结束识别
              </div>
            </div>
            <div class="hotWord">
              <h5 class="text-title" align="left">设置</h5>
              <el-form
                label-position="left"
                label-width="80px"
                style="padding-top: 10px"
              >
                <el-form-item
                  label="语种:"
                  size="small"
                  style="padding-left: 10px; padding-right: 10px"
                >
                  <el-select
                    v-model="language"
                    placeholder="请选择"
                    size="small"
                    popper-class="optionsContent"
                  >
                    <el-option
                      v-for="item in languages"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="采样率:"
                  size="small"
                  style="padding-left: 10px; padding-right: 10px"
                >
                  <el-select
                    v-model="sample"
                    placeholder="请选择"
                    size="small"
                    popper-class="optionsContent"
                  >
                    <el-option
                      v-for="item in samples"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="音频编码:"
                  size="small"
                  style="padding-left: 10px; padding-right: 10px"
                >
                  <el-select
                    v-model="encode"
                    placeholder="请选择"
                    size="small"
                    popper-class="optionsContent"
                  >
                    <el-option
                      v-for="item in encodings"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="content" style="width: auto; height: auto; font-size: 14px">
            <!--当 result-wrap 添加none时，可显示无文本时的样式-->
            <div class="result-wrap" v-bind:class="{ none: isNone }">
              <h5 class="text-title">识别结果</h5>
              <p align="left" class="text" v-html="rawHtml" ref="ast_result"></p>
              <p class="none-text" v-bind:style="{ display: issDisplay }">
                暂时没有识别的内容
              </p>
              <!--div class="word-count" style="display:none;">字数：0</div-->
              <div class="word-count" :v-model="counts">字数：{{ counts }}</div>
            </div>
            <div align="left" class="log-wrap">
              <h5 class="text-title">日志</h5>
              <div ref="log" style="height: 260px; overflow-y: auto"></div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import PCMPlayer from "pcm-player";
//   let base64 = require('@/utils/base64.js').Base64;
import Base64  from '@/utils/base64.js';
  export default {
    data() {
      return {
        // 样式控制
        isNone: true,
        issDisplay: "block",
        dialogVisible: false,
        // 插件
        bars: "",
        canvas: null,
        ctx: null,
        // 定时器
        drawTimer: "", // 定时器需要关闭
        // intervalKey: '', // 定时器需要关闭
        timer: "", // 获取时间定时器
        // HZRecorder.js录音控件
        recorder: "",
        // 自定义参数
        isopen: false,
        time: 0,
        // 自定义参数，显示转写结果
        rawHtml: "",
        sentence: "",
        tmpHtml: "",
        timeStr: "00:00:00",
        // websocket
        ws: null, // websocket链接需要关闭
        config: {},
        bootSvcAddr: "",
        languages: [
          { label: "中英文", value: "cn" },
          // { label: "英文", value: "en" },
        ],
        language: "cn",
        counts: 0,
        samples: [
          { label: "16k16bit", value: 16000 },
          { label: "8k8bit", value: 8000 },
        ],
        sample: 16000,
        encodings: [{ label: "raw", value: "raw" }],
        encode: "raw",
        appName: "实时转写演示",
        domain: "",
        istLanguage: "",
        accent: "",
        host: "172.31.99.167:8800",
        begin: true,
        res: "",
        player: null,
        //录音组件
        audioContext: null,
        source: null,
        processor: null,
        isRecording: false,
      };
    },
    created() {
      // this.getAvailableServer();
      // axios
      //   .get("./static/json/config.json")
      //   .then((res) => (this.host = res.data.host));
    },
    mounted() {
      this.initDraw();
      this.log("欢迎来到在线转写演示页面！！！");
    },
  
    beforeDestroy() {},
    components: {},
    methods: {
      doAstOperate() {
        if (this.begin) {
          this.start();
        } else {
          this.stop();
        }
      },
      async start() {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          this.$message.error("无法获取麦克风权限");
          return;
        }
  
        this.rawHtml = "";
        this.counts = 0;
        this.begin = false;
  
        console.log("start");
        var serviceIdSplit = this.language.split(".");
        this.domain = serviceIdSplit[0];
        this.istLanguage = serviceIdSplit[1];
        this.accent = serviceIdSplit[2];
        this.log("开始会话[" + this.language + "]");
        this.dialogVisible = false;
        // 样式控制
        this.isNone = false;
        this.issDisplay = "none";
        // 开始绘制时间和音量条
        this.getTimer();
        // 初始化websocket客户端
        this.initWs();
      },
      testVoice() {
        let buffer = this.res.data;
        let chunkSize = 1280;
        let chunks = [];
  
        for (let i = 0; i < buffer.byteLength; i += chunkSize) {
          let chunk = buffer.slice(i, i + chunkSize);
          chunks.push(chunk);
        }
  
        let flag = 0;
        let timer = setInterval(() => {
          console.log(chunks[flag]);
          if (chunks[flag]) {
            this.ws.send(chunks[flag]);
          } else {
            clearInterval(timer);
          }
          flag++;
        }, 40);
      },
      stop() {
        this.begin = true;
        // this.counts = 0;
        console.log("STOP");
        this.isopen = false;
  
        if (this.ws !== null) {
          this.ws.close();
          this.ws = null;
        }
        this.stopRecording();
        // 清空定时器
        clearInterval(this.timer);
        // clearInterval(this.intervalKey)
        clearInterval(this.drawTimer);
        this.initDraw();
        // 样式控制
        if (this.rawHtml.length <= 0) {
          this.isNone = true;
          this.issDisplay = "block";
        }
        this.sentence = "";
        this.log("会话已结束");
      },
      initWs() {
        var that = this;
        var protocol = window.location.protocol;
        this.player = new PCMPlayer({
          channels: 1,
          sampleRate: this.sample,
          encoding: this.sample == "8000" ? "8bit" : "16bit",
        });
        const info = btoa(
          `language=${this.language}&engine=ast&aue=raw&rate=${this.sample}`
        );
        var host = window.location.host;
        // var host = "123.123.123";
        var wsuri = "";
        console.log(protocol);
        if (protocol === "http:") {
          wsuri =
            "ws://" +
            host +
            `/api/ability-case/iflyrec/ast/websocket?signa=${info}`;
        } else if (protocol === "https:") {
          wsuri =
            "wss://" + host + `/ability-case/iflyrec/ast/websocket?signa=${info}`;
        }
        // if (process.env.NODE_ENV === "development") {
        //   wsuri =
        //     "ws://" +
        //     host +
        //     `/api/ability-case/iflyrec/ast/websocket?signa=${info}`;
        // } else if (process.env.VUE_APP_ENV === "production") {
        //   wsuri =
        //     "wss://" + host + `/ability-case/iflyrec/ast/websocket?signa=${info}`;
        // } else {
        //   "ws://" +
        //     host +
        //     `/api/ability-case/iflyrec/ast/websocket?signa=${info}`;
        // }
        //wsuri = "ws://127.0.0.1:8089/turing/v2/talk?serviceId=ist";
        that.log("演示页面访问服务地址：" + wsuri);
        console.log(wsuri);
        that.ws = new WebSocket(wsuri);
        that.ws.onopen = function () {
          // that.testVoice();
          that.startRecording();
          that.startDraw();
        };
        that.ws.onmessage = function (e) {
          var jsonResponse = JSON.parse(e.data);
          if (jsonResponse.msg == "success") {
            // try {
            //   var data = JSON.parse(jsonResponse.data);
            // } catch (e) {
            //   console.log(jsonResponse.data);
            // }
            // var data = JSON.parse(jsonResponse.data);
            // console.log(jsonResponse.data);
            that.show(jsonResponse.data);
          }
        };
        that.ws.onclose = function (e) {
          if (e.code === 1001) {
            stop();
          }
        };
        that.ws.onerror = () => {
          this.$message.error("连接错误请重试");
          this.stop();
        };
        // that.config.ws = that.ws;
        // that.config.domain = that.domain;
        // that.config.istLanguage = that.istLanguage;
        // that.config.accent = that.accent;
      },
  
      initDraw() {
        this.canvas = document.getElementById("myCanvas");
        this.canvas.height = 230;
        this.canvas.width = 298;
        this.ctx = this.canvas.getContext("2d");
        this.bars = Array(23).fill(5);
        // 先清除 在绘制
        this.ctx.clearRect(
          0,
          0,
          this.canvas.clientWidth,
          this.canvas.clientHeight
        );
        this.drawBars();
        this.drawTime("00:00:00");
      },
      startDraw() {
        var that = this;
        this.drawTimer = setInterval(function () {
          // 先清除 在绘制
          that.ctx.clearRect(
            0,
            0,
            that.canvas.clientWidth,
            that.canvas.clientHeight
          );
          that.drawBars();
          that.setBar();
          that.drawTime(that.timeStr);
        }, 120);
      },
      drawBars() {
        for (var i = 0; i < this.bars.length; i++) {
          var height = this.bars[i];
          var color = height > 5 ? "#fff" : "rgba(255,255,255,0.48)";
          this.ctx.fillStyle = color;
          this.ctx.fillRect(20 + i * 4, this.alignCenter(height), 2, height);
          this.ctx.fillRect(
            298 - 20 - i * 4,
            this.alignCenter(height),
            2,
            height
          );
        }
      },
      setBar() {
        var average = Math.random() * 20 + 5;
        this.bars.push(average);
        this.bars.shift();
      },
      getTimer() {
        var that = this;
        that.time = 0;
        that.timeStr = "00:00:00";
        that.timer = setInterval(function () {
          that.time += 1;
          var h =
            parseInt(that.time / 3600) < 10
              ? "0" + parseInt(that.time / 3600)
              : parseInt(that.time / 3600);
          var last__ = that.time % 3600;
          var m =
            parseInt(last__ / 60) < 10
              ? "0" + parseInt(last__ / 60)
              : parseInt(last__ / 60);
          var s =
            that.time % 60 < 10
              ? "0" + parseInt(that.time % 60)
              : parseInt(that.time % 60);
          that.timeStr = "" + h + ":" + m + ":" + s;
        }, 1000);
      },
      drawTime(timeStr) {
        this.ctx.font = "14px bold 黑体";
        this.ctx.fillStyle = "#fff";
        this.ctx.fillText(
          timeStr,
          (300 - 38) / 2 - 11,
          ((230 - 56) * 3) / 5 + 78
        );
      },
      alignCenter(height) {
        return ((this.canvas.clientHeight - height) * 3) / 5;
      },
      log(e, data) {
        var dateString = "[" + new Date().toLocaleString() + "]  ";
        this.$refs.log.innerHTML =
          this.$refs.log.innerHTML + dateString + e + " " + (data || "") + "<br>";
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
      },
      show(e) {
        // var text = "";
        // if (e.ws != null) {
        //   for (var i = 0; i < e.ws.length; i++) {
        //     var cw = e.ws[i].cw;
        //     if (cw != null) {
        //       text = text + cw[0].w + " ";
        //     }
        //   }
        // }
        var that = this;
        if (e.msgType == "sentence") {
          that.sentence = that.sentence + e.txt;
          // that.sentence = that.sentence + '<a class="el-link el-link--default is-underline"><span class="el-link--inner">' + e.text + '</span></a>'
          that.rawHtml = that.sentence;
        } else {
          that.tmpHtml =
            '<temp class="ast-temp" style="color: RGB(68, 114, 196);" ref="asttemp">' +
            e.txt +
            "</temp>";
          that.rawHtml = that.sentence + that.tmpHtml;
        }
        that.counts = that.checksum(that.sentence);
        // $('.word-count').text('字数：' + checksum($('#ast_result').text()))
      },
      getRandomString(len) {
        len = len || 32;
        var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
        var maxPos = $chars.length;
        var pwd = "";
        for (var i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      checksum(chars) {
        var sum = 0;
        for (var i = 0; i < chars.length; i++) {
          var c = chars.charCodeAt(i);
          if (!(c >= 0x0001 && c <= 0x007e) && !(0xff60 <= c && c <= 0xff9f)) {
            sum += 1;
          }
        }
        return sum;
      },
      async startRecording() {
        this.isRecording = true;
  
        // 创建 AudioContext
        this.audioContext = new AudioContext({
          sampleRate: this.sample,
        });
  
        // 获取用户媒体设备，开启麦克风
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          this.$message.error("无法获取麦克风权限");
          return;
        }
  
        // 创建媒体流源
        this.source = this.audioContext.createMediaStreamSource(stream);
  
        // 创建 ScriptProcessor 节点用于处理音频
        this.processor = this.audioContext.createScriptProcessor(
          this.bufferSize,
          1,
          1
        );
  
        // 将媒体流源连接到音频处理器
        this.source.connect(this.processor);
  
        // 将音频处理器连接到 AudioContext 目标
        this.processor.connect(this.audioContext.destination);
  
        // 当音频处理器处理音频数据时触发 onaudioprocess 事件
        this.processor.onaudioprocess = (event) => {
          // 获取输入音频数据
          const inputBuffer = event.inputBuffer.getChannelData(0);
  
          // 将浮点音频数据转换为 Int16Array 格式
          // const outputBuffer = event.outputBuffer.getChannelData(0);
  
          // console.log("777", inputBuffer);
  
          // 转换为 Int16Array 格式
          const pcmData = this.convertFloat32ToInt16(inputBuffer);
  
          const chunks = this.splitInt16Array(pcmData, 1280);
  
          // console.log(chunks);
  
          chunks.forEach((item) => {
            this.ws.send(item.buffer);
            // this.player.feed(item.buffer);
          });
        };
      },
      stopRecording() {
        if (this.isRecording) {
          // 断开媒体流源与音频处理器之间的连接
          this.source.disconnect();
  
          // 断开音频处理器与 AudioContext 之间的连接
          this.processor.disconnect();
  
          // 移除音频处理回调函数
          this.processor.onaudioprocess = null;
  
          // 关闭 AudioContext
          this.audioContext.close();
  
          // 设置录音状态为停止录音
          this.isRecording = false;
        }
      },
      // 将录音流原始数据Float32转换为Int16数据
      convertFloat32ToInt16(buffer) {
        let pcmData = new Int16Array(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
          let s = Math.max(-1, Math.min(1, buffer[i]));
          pcmData[i] = (s < 0 ? s * 0x8000 : s * 0x7fff) | 0;
        }
  
        // console.log(pcmData);
  
        return pcmData;
      },
      splitInt16Array(array, chunkSize) {
        // 将数组拆为若干等长的块
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize / 2) {
          const chunk = array.slice(i, i + chunkSize / 2);
          chunks.push(chunk);
        }
        // 将每个块转换为 Int16Array 类型
        return chunks.map((chunk) => {
          return new Int16Array(chunk.buffer);
        });
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  // canvas {
  //   width: 298px;
  //   height: 230px;
  // }
  .text {
    float: left;
    overflow-y: auto;
    position: absolute;
  }
  
  .content {
    position: relative;
    height: 524px;
    overflow: hidden;
  }
  
  .text-content {
    float: left;
    overflow-y: auto;
    position: absolute;
  }
  .text-title {
    padding: 6px;
    font-size: 14px;
    background: #e2e9f5;
    height: 31px;
    line-height: 19px;
    box-sizing: border-box;
    font-weight: bold;
  }
  ::v-deep .el-form-item__label {
    line-height: 32px;
    height: 32px;
    font-size: 14px;
  }
  ::v-deep .el-select .el-input__inner {
    height: 32px;
    padding-left: 8px;
  }
  .ast-temp {
    color: RGB(68, 114, 196);
  }
  .nav-content-wrap .nav-content-item .slide-side {
    float: left;
    width: 300px;
    padding: 20px;
    padding-bottom: 0;
    background-color: white;
  }
  
  .nav-content-wrap .nav-content-item .content {
    padding: 20px;
    margin-left: 300px;
    background: white;
    padding-bottom: 0;
  }
  
  .nav-content-wrap .nav-content-item .slide-side .audio-wrap {
    margin-bottom: 20px;
    height: 330px;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    text-align: center;
    background: url("./img/bg.png") no-repeat;
    background-size: 100% 100%;
  }
  
  .nav-content-wrap .nav-content-item .slide-side .audio-wrap .audio-button {
    width: 108px;
    height: 32px;
    border-radius: 4px;
    background: #1a90ff;
    font-size: 14px;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  .nav-content-wrap .nav-content-item .slide-side .hotWord {
    height: 300px;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
  }
  
  .nav-content-wrap .nav-content-item .slide-side .hotWord .title {
    padding: 10px;
    font-size: 14px;
    background: #fafafa;
  }
  
  .nav-content-wrap .nav-content-item .slide-side .hotWord .search .c-input {
    margin: 20px 10px 20px 20px;
    height: 28px;
    width: 173px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
  }
  
  .nav-content-wrap .nav-content-item .slide-side .hotWord .search .c-button {
    width: 72px;
    height: 30px;
    border: 1px solid #1a90ff;
    background: #e6f7ff;
    border-radius: 4px;
    color: #1a90ff;
    cursor: pointer;
  }
  .nav-content-wrap
    .nav-content-item
    .slide-side
    .hotWord
    .search
    .c-button:active {
    border: 1px solid #105cff;
    color: #105cff;
    background: #f4f8ff;
  }
  
  .nav-content-wrap
    .nav-content-item
    .slide-side
    .hotWord
    .search
    .c-button
    .iconfont {
    font-size: 12px;
  }
  .nav-content-wrap .nav-content-item .slide-side .hotWord .hotWord-wrap {
    padding: 0 10px;
    height: 60%;
    overflow-y: auto;
  }
  .nav-content-wrap .nav-content-item .slide-side .hotWord .hotWordBlock {
    position: relative;
    float: left;
    display: block;
    margin-right: 15px;
    margin-bottom: 15px;
    max-width: 218px;
    height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    padding: 5px 23px 5px 5px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    background: #f5f5f5;
    white-space: nowrap;
  }
  .nav-content-wrap .nav-content-item .slide-side .hotWord .hotWordBlock .close {
    position: absolute;
    right: 5px;
    top: 6px;
  }
  .nav-content-wrap
    .nav-content-item
    .slide-side
    .hotWord
    .hotWordBlock
    .close
    .iconfont {
    margin-left: 3px;
    vertical-align: top;
    font-size: 14px;
    cursor: pointer;
  }
  
  .nav-content-wrap .nav-content-item .content .result-wrap {
    position: relative;
    margin-bottom: 20px;
    height: 330px;
    border: 1px solid #e8e8e8;
    /* border-left: none; */
    border-radius: 2px;
    margin-left: 5px;
  }
  .nav-content-wrap .nav-content-item .content .result-wrap.none {
    background: url("./img/none.png") no-repeat;
    background-position: center;
    margin-left: 5px;
  }
  .nav-content-wrap .nav-content-item .content .result-wrap .text {
    padding: 20px;
    font-size: 14px;
    line-height: 24px;
    max-height: 248px;
    overflow: auto;
    color: #505050;
  }
  .nav-content-wrap .nav-content-item .content .result-wrap .none-text {
    position: absolute;
    top: 220px;
    left: 50%;
    transform: translate(-50%, 0);
    line-height: 1;
    text-align: center;
    font-size: 14px;
    color: #bdbdc2;
  }
  .nav-content-wrap .nav-content-item .content .result-wrap .title {
    padding: 10px;
    font-size: 14px;
    background: #fafafa;
    border-left: 1px solid #e8e8e8;
    text-align: left;
  }
  .nav-content-wrap .nav-content-item .content .result-wrap .word-count {
    position: absolute;
    bottom: 9px;
    right: 13px;
    font-size: 12px;
    color: #8c8c8c;
    line-height: 12px;
  }
  
  .nav-content-wrap .nav-content-item .content .log-wrap {
    height: 300px;
    border: 1px solid #e8e8e8;
    /* border-left: none; */
    border-radius: 2px;
    margin-left: 5px;
  }
  
  .nav-content-wrap .nav-content-item .content .log-wrap .title {
    padding: 10px;
    font-size: 14px;
    background: #fafafa;
  }
  .nav-content-wrap .nav-content-item .content .log-wrap .text {
    padding: 20px;
    line-height: 24px;
    font-size: 14px;
    color: #505050;
  }
  .ast-temp {
    color: RGB(68, 114, 196);
  }
//   .optionsContent /deep/ .el-select-dropdown__wrap {
//     max-height: 471px;
//   }
  
  .button-shibie {
    width: 108px;
    height: 32px;
    cursor: pointer;
    margin: 0 auto;
    color: #fff;
    background-color: #1a90ff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 17px;
    box-sizing: border-box;
    justify-content: space-around;
    font-size: 10px;
    .el-icon {
      display: block;
    }
  }
  </style>
  