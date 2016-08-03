
var config = {
    // mongodb 配置
    db: 'mongodb://127.0.0.1/my_node_club',
    
    // redis 配置，默认是本地
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,
    redis_password: '',
    
    // 版块
    tabs: [
        ['share', '分享'],
        ['ask', '问答'],
        ['job', '招聘'],
    ],
    session_secret: 'my_node_club_secret',
    name: 'MyNodeclub',    //社区名称
}

module.exports = config;