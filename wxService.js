var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var exec = require('child_process').exec;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var weMethod = require('./src/weChat'); // 微信方法 
var config = require('./src/config'); // 默认配置
var wx_boot = require('weixin-robot'); // 微信机器人
var wxChat = new weMethod(config); //实例wechat 模块
var onlineCount = 0;
// test
// 允许跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DEvarE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
}); 
// 解析自定义的 JSON
app.use(bodyParser.json({
    type: 'application/*+json'
}))
// 解析自定义的 Buffer
app.use(bodyParser.raw({
    type: 'application/vnd.custom-type'
}))
// 将 HTML 请求体做为字符串处理
app.use(bodyParser.text({
    type: 'text/html'
}))
app.use(bodyParser.urlencoded())

app.get('/loginredirect', function (req,res) {
    res.redirect(config.redirect_url);
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
app.post('/gitpush', function (req,res) {
    var data = '';
    req.on('data', function (chuck) {
        data += chuck;
    })
    req.on('end', function () {
         const hmac = crypto.createHmac('sha1', 'weixin');
         const ourSignature = `sha1=${hmac.update(data).digest('hex')}`;
         console.log(ourSignature, req.headers['x-hub-signature']);
        if (!!req.headers['x-hub-signature'] && req.headers['x-hub-signature'] == ourSignature) {
           var cmdStr = 'git pull origin master && npm i';
            console.log('正在拉取代码');
            exec(cmdStr, function (error, stdout, stderr) {
                console.log(stderr);
                if (error){
                    console.log(error)
                }
            })
           res.send('校验通过');

        }else{
            console.log('非法请求')
        }
            
    });
    
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

// 当有用户连接进来时
io.on('connection', function (socket) {
    console.log(socket)
    console.log('a user connected');

    // 发送给客户端在线人数
    io.emit('connected', ++onlineCount);

    // 当有用户断开
    socket.on('disconnect', function () {
        console.log('user disconnected');

        // 发送给客户端断在线人数
        io.emit('disconnected', --onlineCount);
        console.log(onlineCount);
    });

    // 收到了客户端发来的消息
    socket.on('message', function (message) {
        // 给客户端发送消息
        io.emit('message', message);
    });

});
// 起服务

http.listen(3002, function (err) {
    console.log(err);
})
