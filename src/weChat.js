const crypto = require('crypto'); //引入加密模块
const Promise = require('promise');
const fs =require('fs');
const path = require('path');
var accessTokenJson = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/accesstoken.json'),'utf-8') || "{}");
console.log(accessTokenJson, path.resolve(__dirname + '/accesstoken.json'));
if (!accessTokenJson.token){
    accessTokenJson.token='fdfa';
    fs.writeFile(path.resolve(__dirname + '/accesstoken.json'), JSON.stringify(accessTokenJson), function(err){
        console.log('成功',err)
    });
}else{
    console.log(accessTokenJson);
}
//构建 WeChat 对象 即 js中 函数就是对象
var WeChat = function (config) {
    //设置 WeChat 对象属性 config
    this.config = config;
    //设置 WeChat 对象属性 token
    this.token = config.token;
}
/**
 * 微信接入验证
 */
WeChat.prototype.auth = function (req, res) {
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature, //微信加密签名
        timestamp = req.query.timestamp, //时间戳
        nonce = req.query.nonce, //随机数
        echostr = req.query.echostr; //随机字符串

    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [this.token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {
        console.log({
                    error: false,
                    errorMessage: '',
                    signature: signature,
                    timestamp: timestamp,
                    nonce: nonce,
                    echostr: echostr
        });
        res.send({
            error:false,
            errorMessage:'',
            signature: signature,
            timestamp: timestamp,
            nonce: nonce,
            echostr: echostr
        });
    } else {
        res.send({
            error:true,
            errorMessage:'签名校验失败'
        });
    }
}
WeChat.prototype.getAccessToken = function (){
    var _this = this;
    return new Promise(function (rel,rej) {
         //获取当前时间 
        
         var currentTime = new Date().getTime();
         //判断 本地存储的 access_token 是否有效
         if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
             that.requestGet(url).then(function (data) {
                 var result = JSON.parse(data);
                 if (data.indexOf("errcode") < 0) {
                     accessTokenJson.access_token = result.access_token;
                     accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                     //更新本地存储的
                     fs.writeFile('./wechat/access_token.json', JSON.stringify(accessTokenJson));
                     //将获取后的 access_token 返回
                     resolve(accessTokenJson.access_token);
                 } else {
                     //将错误返回
                     resolve(result);
                 }
             });
         } else {
             //将本地存储的 access_token 返回
             resolve(accessTokenJson.access_token);
         }
    })
}

//暴露可供外部访问的接口
module.exports = WeChat;