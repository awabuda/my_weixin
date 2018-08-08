const express = require('express'),
    weMethod = require('./src/weChat'),
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
}); // webhook 
app.get('/', function (req,res) {
    console.log('code-----',req.query.code);
    res.send('欢迎')
})
// 微信认证
app.get('/wx', function (req, res) {
    wxChat.auth(req, res)
});
// 通过code拿取用户信息
app.get('/userInfo', function (req, res) { // 入参 code
    wxChat.userInfo(req, res);
});
// 创建公众号菜单
app.get('/createMenu', function (req,res) {
    wxChat.createMenu(req,res);
});
// js鉴权随后调用分享等功能
app.get('/signature', function (req, res) {
    wxChat.signature(req, res)
});
// 获取自定义菜单
app.get('/getmenu', function (req,res){
    wxChat.getMenu(req, res);
});
// 闪住自定义菜单
app.get('/delectMenu', function (req,res) {
    wxChat.delectMenu(req,res);
})
// 创建标签
app.get('/createtag', function (req,res) {
      wxChat.createtag(req,res);
});
// 设置备注名
app.get('/updateremark', function (req,res) {
    wxChat.updateremark(req,res);
})
// 根据openid查询用户信息
app.get('/openiduseinfo', function(req,res){
    wxChat.openidUserInfo(req,res);
})
// 用户列表
app.get('/uselist', function (req,res) {
    wxChat.uselist(req,res)
})

// 关注后的规则
wx_boot.set('subscribe', {
    pattern: function (info) {
        return info.is('event') && info.param.event === 'subscribe';
    },
    handler: function (info) {
        return '欢迎订阅悟凌斋,如果你要是闷了咱俩可以聊聊天哦';
    }
});
// 自动回复的规则
wx_boot.set('cpt', {
    pattern: /^w*/i,
    handler: function (info, next) {
        if (info.type == 'text') {
            wxChat.chat(info.text, info.uid, next);
        } else {
            next(null, '你难道不知道我只支持文字吗')
        }
    }
})
// 托管
wx_boot.watch(app, {
    token: 'wechat',
    path: '/wx'
});
// 起服务
app.listen(3002, function (err) {
    console.log(err);
})