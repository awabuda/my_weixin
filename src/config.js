
module.exports = {
    'redirect_url': 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa9d7e371ea59e8a0&redirect_uri=http%3A%2F%2Fwx.5zreo.cn&response_type=code&scope=snsapi_base&state=present',
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
        'jsapi_ticket': 'cgi-bin/ticket/getticket?access_token=${ACCESS_TOKEN}&type=jsapi',
        // 创建菜单
        'createMenu': 'cgi-bin/menu/create?access_token=${ACCESS_TOKEN}',
        // 获取菜单
        'getMenu': 'cgi-bin/menu/get?access_token=${ACCESS_TOKEN}',
        // 删除菜单
        'delectMenu': 'cgi-bin/menu/delete?access_token=${ACCESS_TOKEN}',
        // 给公众号设置标签
        'createTag': 'cgi-bin/tags/create?access_token=${ACCESS_TOKEN}',
        // 设置用户的备注名
        'updateremark': 'cgi-bin/user/info/updateremark?access_token=${ACCESS_TOKEN}',
        // 根据openid获取用户信息
        'openid_useinfo': 'cgi-bin/user/info?access_token=${ACCESS_TOKEN}&openid=${openid}&lang=zh_CN',
        // 获取用户列表  默认取1000条，
        'uselist': 'cgi-bin/user/get?access_token=${ACCESS_TOKEN}&next_openid=${NEXT_OPENID}'
        
    },
    tulingapi: "http://openapi.tuling123.com/openapi/api/v2",
    menu: {
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

}