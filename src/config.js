
module.exports = {
    'token': 'wechat',
    'appID': 'wxa9d7e371ea59e8a0',
    'appScrect': '1bba3ed5665aa91a844a6be171c9adc5',
    'apiDomain': 'https://api.weixin.qq.com/',
    'noncestr': 'Wm3WZYTPz0wzccnW',
    'apiURL': {
        // 基础库接口的token
        'all_access_token': 'cgi-bin/token?grant_type=client_credential&appid=wxa9d7e371ea59e8a0&secret=1bba3ed5665aa91a844a6be171c9adc5',
        // 用户的token
        'user_access_token_api': 'sns/oauth2/access_token?appid=wxa9d7e371ea59e8a0&secret=1bba3ed5665aa91a844a6be171c9adc5&code=${code}&grant_type=authorization_code',
        /**
         *{
             "access_token": "ACCESS_TOKEN",
             "expires_in": 7200,
             "refresh_token": "REFRESH_TOKEN",
             "openid": "OPENID",
             "scope": "SCOPE"
         }
         */
        // 刷新用户token
        'refresh_token_api': 'sns/oauth2/refresh_token?appid=wxa9d7e371ea59e8a0&grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}',
        /**
         *{
             "access_token": "ACCESS_TOKEN",
             "expires_in": 7200,
             "refresh_token": "REFRESH_TOKEN",
             "openid": "OPENID",
             "scope": "SCOPE"
         }
         */
        // 获取用户的信息 该ACCESS_TOKEN为网页授权接口调用凭证 openid 用户的唯一标识
        'userinfo_api': 'sns/userinfo?access_token=${ACCESS_TOKEN}&openid=${openid}&lang=zh_CN',
        // 微信接口票据
        'jsapi_ticket': 'cgi-bin/ticket/getticket?access_token=${ACCESS_TOKEN}&type=jsapi'
    }

}