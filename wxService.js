const express = require('express'),
wechat = require('./weChat'),
config = require('./config');

var wechatApp = new wechat(config); //实例wechat 模块
var app = express();
app.use(express.static(__dirname));

app.get('/wx', function (req, res) {
    wechatApp.auth(req, res)
});
app.get('/', function (req, res) {
    res.send('hello word')
});

app.listen(3002)