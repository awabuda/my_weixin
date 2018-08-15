var crypto = require('crypto');
var exec = require('child_process').exec;
module.exports = function (req, res) {
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
                console.log(stdout);
                console.log(stderr);

            })
            res.send('校验通过');

        } else {
            console.log('非法请求')
        }

    });
}