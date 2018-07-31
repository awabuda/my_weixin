const express = require('express'),
weMethod = require('./src/weChat'),
request = require('request'),
config = require('./src/config');

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
app.get('/ww', function () {

})
app.get('/wx', function (req, res) {
    wxChat.auth(req, res)
});
app.get('/userInfo', function (req, res) { // 入参 code
    wxChat.userInfo(req,res);
});
app.get('/signature', function (req,res) {
    wxChat.signature(req, res)
})

app.get('/', function (req, res) {
    console.log('更目录', req.query.code)
    res.send('hello word')
});

app.listen(3002, function (err) {
    console.log(err);
})