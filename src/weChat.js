var crypto = require('crypto'); //引入加密模块
var Promise = require('promise');
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var axios = require('axios');

//构建 weMethod 对象 即 js中 函数就是对象
var weMethod = function (config) {
    //设置 WeChat 对象属性 config
    this.config = config;
    //设置 WeChat 对象属性 token
    this.token = config.token;
}
/**
 * 微信接入验证
 */
weMethod.prototype.auth = function (req, res) {
    //1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    var signature = req.query.signature, //微信加密签名
        timestamp = req.query.timestamp, //时间戳
        nonce = req.query.nonce, //随机数
        echostr = req.query.echostr; //随机字符串
    console.log('0000', req.query)
    //2.将token、timestamp、nonce三个参数进行字典序排序
    var array = [this.token, timestamp, nonce];
    array.sort();

    //3.将三个参数字符串拼接成一个字符串进行sha1加密
    var tempStr = array.join('');
    const hashCode = crypto.createHash('sha1'); //创建加密类型 
    var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (resultCode === signature) {

        res.send(echostr);
    } else {

    }
}
//获取接口的凭证 任何微调微信的接口都需要此凭证
weMethod.prototype.getAccessToken = function () {
    var _this = this;
    console.log('开始获取token')
    return new Promise(function (resolve, rej) {
        //获取当前时间 
        var currentTime = new Date().getTime();
        //判断 本地存储的 access_token 是否有效
        var accessTokenJson = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/accesstoken.json'), 'utf-8') || "{}");
        console.log(accessTokenJson);
        if (!accessTokenJson.access_token || accessTokenJson.expires_time < currentTime) {
            console.log('token过期重新请求')
            axios.get(_this.config.apiDomain + _this.config.apiURL.all_access_token).then(data=>{
                 var result = data.data;
                if (!result.errcode) {
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    //更新本地存储的
                    fs.writeFileSync(path.resolve(__dirname + '/accesstoken.json'), JSON.stringify(accessTokenJson));
                    //将获取后的 access_token 返回
                    resolve(accessTokenJson);
                } else {
                    //将错误返回`
                    resolve(result);
                }
            })
           
        } else {
            console.log('取自缓存的token')
            //将本地存储的 access_token 返回
            resolve(accessTokenJson);
        }
    })
}
// 获取签名
weMethod.prototype.signature = function (req, res) {
    console.log('开始获取签名计算')
    var _this = this;
    var noncestr = this.config.noncestr;
    var timestamp = Math.floor(Date.now() / 1000);
    var currentTime = new Date().getTime();
    var url = req.query.url;
    var jsapi_ticket;
    var accessTokenJson = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/accesstoken.json'), 'utf-8') || "{}");
    if (!url) {
        res.send({
            error: 'true',
            errorMessage: 'url参数不能为空'
        })
    }
    if (accessTokenJson && accessTokenJson.jsapi_ticket && accessTokenJson.jsapi_ticket_time < currentTime) {
        jsapi_ticket = accessTokenJson.jsapi_ticket;
        console.log('缓存中含有jsapi_ticket')
        res.send({
            noncestr: noncestr,
            timestamp: timestamp,
            url: url,
            jsapi_ticket: jsapi_ticket,
            signature: sha1('jsapi_ticket=' + jsapi_ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
        })
    } else {
        console.log('缓存中含没有jsapi_ticket')

        _this.getAccessToken().then(data => {
            console.log('重新获取jsapi_ticket')
            if (data.access_token) {
                axios.get(_this.config.apiDomain + _this.config.apiURL.jsapi_ticket.replace('${ACCESS_TOKEN}', data.access_token)).then(json=>{
                    console.log(json.data);
                    var result = json.data;
                    if (!result.errcode) {
                        accessTokenJson.jsapi_ticket = result.ticket;
                        accessTokenJson.jsapi_ticket_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                        //更新本地存储的
                        fs.writeFileSync(path.resolve(__dirname + '/accesstoken.json'), JSON.stringify(accessTokenJson));
                        res.send({
                            appid: _this.config.appID,
                            noncestr: noncestr,
                            timestamp: timestamp,
                            url: url,
                            jsapi_ticket: result.ticket,
                            signature: sha1('jsapi_ticket=' + result.ticket + '&noncestr=' + noncestr + '&timestamp=' + timestamp + '&url=' + url)
                        })
                    } else {
                        res.send(result);
                    }
                })
                
            } else {
                res.send(data);
            }
        })
    }
}
// 获取用户的token;
weMethod.prototype.get_user_token = function (code) {
    var _this = this;
    console.log('开始获取用户的token')
    return new Promise(function (resolve, reject) {
        console.log(_this.config.apiDomain + _this.config.apiURL.user_access_token_api.replace('${code}', code));
       axios.get(_this.config.apiDomain + _this.config.apiURL.user_access_token_api.replace('${code}', code)).then(res=>{
           console.log(res);
        var data = res.data;
        if (data.openid) {
            resolve(data)
        } else {
            resolve(Object.assign({
                'error': 'true'
            }, data))
        }
       })
      
    })
}
// 获取用户信息；
weMethod.prototype.userInfo = function (req, res) {
    var _this = this;
    var code = req.query.code;
    console.log('通过code拿用户的信息')
    if (code) {
        _this.get_user_token(code).then(data => {
            if (!data.error) {
                axios.get(_this.config.apiDomain + _this.config.apiURL.userinfo_api.replace('${ACCESS_TOKEN}', data.access_token).replace('${openid}', data.openid)).then(json=>{
                    res.send(json.data);
                });
            } else {
                res.send(data);
            }
        })
    } else {
        res.send({
            error: true,
            errorMessage: 'code 入参错误'
        })
    }
}
weMethod.prototype.chat = function (text, userid, next) {
    var data = {
        "reqType": 0,
        "perception": {
            "inputText": {
                "text": text
            }
        },
        "userInfo": {
            "apiKey": "2dd30183f9bb4c4c88d66b0aeb3ad98f",
            "userId": userid.replace(/[^0-9a-zA-Z]*/g,'')
        }
    };
    
    try {
        axios.post("http://openapi.tuling123.com/openapi/api/v2", data,{
           headers: {
               "content-type": "application/json",
           }
        }).then(json=>{
            var json = json.data;
            var text = json.results && json.results[0] && json.results[0].values && json.results[0].values.text || '对你的话我无可回答'
            console.log('传入的内容', text, '传入的id', userid, '恢复text', text);
            next(null, text);
        })
    } catch (e) {
        next(null, '抱歉小悟空出错了，等住人修复后再试吧');
    }


}
weMethod.prototype.createMenu =  function (req,res) {
    this.getAccessToken().then(dd=>{
        if (dd.access_token) {
            let url ='https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + dd.access_token;
            var menu = {
                "button": [{
                        "type": "view", //view表示跳转
                        "name": "**商城",
                        "url": "http://***.cn/shop"
                    },
                    {
                        "type": "click", //表示事件
                        "name": "戳一下",
                        "key": "clickEvent" //事件的key可自定义,微信服务器会发送到指定的服务器用于识别事件做出相应回应
                    },
                    {
                        "name": "菜单",
                        "sub_button": [ //二级菜单
                            {
                                "type": "view",
                                "name": "搜索",
                                "url": "http://***.cn/shop"
                            },
                            {
                                "type": "click",
                                "name": "赞一下我们",
                                "key": "V1001_GOOD"
                            }
                        ]
                    }
                ]
            }
            axios.post(url, menu, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }).then(dt=>{
                res.send(dt.data);
            })

        }else{
            res.send('access_token')
        }
    })
}
//暴露可供外部访问的接口
module.exports = weMethod;