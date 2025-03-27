// https://www.cnblogs.com/blqw/p/3782420.html
// http://www.smartjava.org/content/record-audio-using-webrtc-chrome-and-speech-recognition-websockets
// http://www.it1352.com/305552.html
// 重新取样音频缓冲从44100到16000(resample audio buffer from 44100 to 16000)
import PCMPlayer from "pcm-player";

function HZRecorder() {
  // 兼容
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
}
function HZRecorderInit(stream, config) {
  // var canRecording = navigator.getUserMedia != null
  config = config || {};
  config.sampleBits = config.sampleBits || 16; // 采样数位 8, 16
  config.sampleRate = config.sampleRate || 16000; // 采样率16khz
  // 44100)
  var context = new (window.webkitAudioContext || window.AudioContext)();
  var audioInput = context.createMediaStreamSource(stream);
  var createScript =
    context.createScriptProcessor || context.createJavaScriptNode;
  var recorder = createScript.apply(context, [4096, 1, 1]);

  var audioData = {
    size: 0, // 录音文件长度
    buffer: [], // 录音缓存
    inputSampleRate: 16000, // 输入采样率
    inputSampleBits: 16, // 输入采样数位 8, 16
    outputSampleRate: config.sampleRate, // 输出采样率
    oututSampleBits: config.sampleBits, // 输出采样数位 8, 16
    input: function (data) {
      const player = new PCMPlayer({
        encoding: "16bitInt",
        channels: 2,
        sampleRate: 16000,
        flushingTime: 2000,
      });

      // let pcmData = new Int16Array(data.length);
      const pcm = new Int16Array(data.length);
      for (let i = 0; i < data.length; i++) {
        let sample = data[i] * 32767;
        pcm[i] = Math.max(-32768, Math.min(32767, sample)); // 限制PCM值在范围 [-32768, 32767] 之间
      }

      const buffer = new ArrayBuffer(pcm.byteLength);
      const dataView = new DataView(buffer);
      dataView.setInt16(0, pcm[0], true); // 处理 PCM 数据第一个样本
      let byteOffset = 2; // "2" 表示 2 个字节，即一个 int16 样本
      for (let i = 1; i < pcm.length; i++) {
        dataView.setInt16(byteOffset, pcm[i], true);
        byteOffset += 2;
      }
      console.log(audioData);
      player.feed(buffer);

      let chunkSize = 1280;
      let chunks = [];

      for (let i = 0; i < buffer.byteLength; i += chunkSize) {
        let chunk = buffer.slice(i, i + chunkSize);
        chunks.push(chunk);
      }

      // this.buffer.push(new Float32Array(data));
      // this.size += data.length;

      if (config.ws != null) {
        chunks.forEach((item) => {
          config.ws.send(item);
        });

        // var reader = new FileReader();
        // reader.readAsDataURL(this.encodeWAV(new Float32Array(data))); // 读出 base64
        // reader.onloadend = function () {
        //   var audioBase64 = reader.result; //base64
        //   audioBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, "");
        //   var apiRequest = {
        //     common: {},
        //     business: {},
        //     data: {},
        //   };
        //   // common
        //   apiRequest.common.app_id = "ist";
        //   //business
        //   apiRequest.business.domain = config.domain;
        //   apiRequest.business.bizId = "demo";
        //   apiRequest.business.language = config.istLanguage;
        //   apiRequest.business.accent = config.accent;
        //   //data
        //   apiRequest.data.audio = audioBase64;
        //   apiRequest.data.format = "audio/L16;rate=16000";
        //   apiRequest.data.status = 1;
        //   apiRequest.data.encoding = "raw";
        //   // config.ws.send(JSON.stringify(apiRequest));
        //   console.log(data);
        //   config.ws.send(data);
        // };
      }

      this.clear();

      /*
      let a = new FileReader();
      a.onload = function (e) { 
        callback(e.target.result); 
      }
      a.readAsDataURL(blob);
      
      //config.ws.send(this.encodeWAV(new Float32Array(data)))
      var apiRequest = {
        "common":{},
        "business":{},
        "data":{}
      }
      apiRequest.common.app_id = 'ist'
      apiRequest.business.domain = 'ist'
      apiRequest.business.bizId = 'demo'
      apiRequest.business.language = 'zh_cn'
      apiRequest.business.accent = 'mandarin'

      //var audios = this.encodeWAV(new Float32Array(data))
     var base64A = Base64.encode(data)
      debugger
      apiRequest.data.audio = base64A
      apiRequest.data.status = 'audio/L16;rate=16000'
      apiRequest.data.format = 1
      apiRequest.data.encoding = 'raw'    
      console.log(apiRequest)
      config.ws.send(JSON.stringify(apiRequest))
*/
    },
    compress: function () {
      // 合并压缩
      // 合并
      var data = new Float32Array(this.size);
      var offset = 0;
      for (var i = 0; i < this.buffer.length; i++) {
        data.set(this.buffer[i], offset);
        offset += this.buffer[i].length;
      }
      // 压缩
      var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
      var length = data.length / compression;
      var result = new Float32Array(length);
      var index = 0;
      var j = 0;
      while (index < length) {
        result[index] = data[j];
        j += compression;
        index++;
      }
      return result;
    },
    clear: function () {
      this.size = 0;
      this.buffer = [];
    },
    encodeWAVNoHead: function () {
      var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
      var bytes = this.compress();
      var dataLength = bytes.length * (sampleBits / 8);
      var buffer = new ArrayBuffer(44 + dataLength);
      var data = new DataView(buffer);
      var offset = 0;
      // 写入采样数据
      if (sampleBits === 8) {
        for (var i = 0; i < bytes.length; i++, offset++) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          var val = s < 0 ? s * 0x8000 : s * 0x7fff;
          val = parseInt(255 / (65535 / (val + 32768)));
          data.setInt8(offset, val, true);
        }
      } else {
        for (var index = 0; index < bytes.length; index++, offset += 2) {
          var sIndex = Math.max(-1, Math.min(1, bytes[index]));
          data.setInt16(
            offset,
            sIndex < 0 ? sIndex * 0x8000 : sIndex * 0x7fff,
            true
          );
        }
      }
      return new Blob([data], { type: "audio/wav" });
    },
    encodeWAV: function () {
      //var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
      var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
      var bytes = this.compress();
      var dataLength = bytes.length * (sampleBits / 8);
      // var buffer = new ArrayBuffer(44 + dataLength);
      var buffer = new ArrayBuffer(dataLength);
      var data = new DataView(buffer);

      //var channelCount = 1;// 单声道
      var offset = 0;
      // var writeString = function (str) {
      //   for (var i = 0; i < str.length; i++) {
      //     data.setUint8(offset + i, str.charCodeAt(i));
      //   }
      // }
      // 写入采样数据
      if (sampleBits === 8) {
        for (var i = 0; i < bytes.length; i++, offset++) {
          var s = Math.max(-1, Math.min(1, bytes[i]));
          var val = s < 0 ? s * 0x8000 : s * 0x7fff;
          val = parseInt(255 / (65535 / (val + 32768)));
          data.setInt8(offset, val, true);
        }
      } else {
        for (var index = 0; index < bytes.length; index++, offset += 2) {
          var sIndex = Math.max(-1, Math.min(1, bytes[index]));
          data.setInt16(
            offset,
            sIndex < 0 ? sIndex * 0x8000 : sIndex * 0x7fff,
            true
          );
        }
      }
      return new Blob([data], { type: "audio/wav" });
    },
  };

  // 开始录音
  this.start = function () {
    audioInput.connect(recorder);
    recorder.connect(context.destination);
  };

  // 停止
  this.stop = function () {
    recorder.disconnect();
  };

  // 音频采集
  recorder.onaudioprocess = function (e) {
    audioData.input(e.inputBuffer.getChannelData(0));
    // record(e.inputBuffer.getChannelData(0));
  };
}
// 抛出异常
HZRecorder.prototype.throwError = function (message) {
  alert(message);
  throw new (function () {
    this.toString = function () {
      return message;
    };
  })();
};
// 是否支持录音
// HZRecorder.prototype.canRecording = navigator.getUserMedia != null
// 获取录音机
HZRecorder.prototype.get = function (callback, config) {
  var that = this;
  if (callback) {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: {
            sampleRate: 16000,
          },
        }, // 只启用音频
        function (stream) {
          // console.log(stream);
          var rec = new HZRecorderInit(stream, config);
          callback(rec);
        },
        function (error) {
          switch (error.code || error.name) {
            case "PERMISSION_DENIED":
            case "PermissionDeniedError":
              that.throwError("用户拒绝提供信息。");
              break;
            case "NOT_SUPPORTED_ERROR":
            case "NotSupportedError":
              that.throwError("浏览器不支持硬件设备。");
              break;
            case "MANDATORY_UNSATISFIED_ERROR":
            case "MandatoryUnsatisfiedError":
              that.throwError("无法发现指定的硬件设备。");
              break;
            default:
              that.throwError(
                "无法打开麦克风。异常信息:" + (error.code || error.name)
              );
              break;
          }
        }
      );
    } else {
      that.throwErr("当前浏览器不支持录音功能。");
    }
  }
};
let obj = new HZRecorder();
export default obj;
//var Base64 = require('js-base64').Base64;
