const express = require('express'),
weMethod = require('./src/weChat'),
request = require('request'),
config = require('./src/config');
var wx_boot = require('weixin-robot');

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
});// webhook 

app.get('/wx', function (req, res) {
    console.log('dsafdf--',req)
    wxChat.auth(req, res)
});
app.get('/userInfo', function (req, res) { // 入参 code
    wxChat.userInfo(req,res);
});
app.get('/signature', function (req,res) {
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
wx_boot.set('hi','你好');
wx_boot.set('subscribe', {
    pattern: function (info) {
        return info.is('event') && info.param.event === 'subscribe';
    },
    handler: function (info) {
        return '欢迎订阅悟凌斋订阅号';
    }
});

wx_boot.set('test', {
    pattern: /^test/i,
    handler: function (info, next) {
        next(null, '设施啥!')
    }
});
wx_boot.set('*', {
    pattern: /^w*/i,
    handler: function (info, next) {
        console.log(info)
        next(null,'干啥类')
    }
})

wx_boot.watch(app, {
    token: 'wechat',
    path: '/wx'
});

app.listen(3002, function (err) {
    console.log(err);
})  