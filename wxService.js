const express = require('express'),
wechat = require('../src/weChat'),
request = require('request'),
config = require('../src/config');

var wechatApp = new wechat(config); //实例wechat 模块
var app = express();

app.get('/wx', function (req, res) {
    wechatApp.auth(req, res)
});
app.get('/get_token', function (req, res) {
    var code = req.query.code
    if (code) {
        
    }else {
       res.send({
           error:true,
           errorMessage:'请正确填写code入参'
       })
    }
})
app.get('/', function (req, res) {
    res.send('hello word')
});

app.listen(3002)