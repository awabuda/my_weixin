const express = require('express'),
    weMethod = require('./src/weChat'),
    request = require('request'),
    config = require('./src/config');
var wx_boot = require('weixin-robot');
var md5 = require('md5');

var wxChat = new weMethod(config); //实例wechat 模块
var app = express();
// 允许跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
}); // webhook 

app.get('/wx', function (req, res) {
    console.log('dsafdf--', req)
    wxChat.auth(req, res)
});
app.get('/userInfo', function (req, res) { // 入参 code
    wxChat.userInfo(req, res);
});
app.get('/signature', function (req, res) {
    wxChat.signature(req, res)
})
// app.post('/wx',function (req,res){
//     console.log(res,req)
//     res.setEncoding('utf8');
//     var data = '';

//     res.on('data', function (chunk) {
//         console.log('11111-',chunk);
//         data += chunk;
//     });
//     res.on('end', function () {
//         console.log('22222-',data);
//     })
// })
wx_boot.set('subscribe', {
    pattern: function (info) {
        return info.is('event') && info.param.event === 'subscribe';
    },
    handler: function (info) {
        return '欢迎订阅悟凌斋,如果你要是闷了咱俩可以聊聊天哦';
    }
});

wx_boot.set('cpt', {
    pattern: /^w*/i,
    handler: function (info, next) {
        if (info.type == 'text') {
            wxChat.chat(info.text, info.uid, next);
        }else {
            next(null, '你难道不知道我只支持文字吗')
        }
    }
})

wx_boot.watch(app, {
    token: 'wechat',
    path: '/wx'
});

app.listen(3002, function (err) {
    console.log(err);
})