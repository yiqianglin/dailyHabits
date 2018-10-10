import qiniu from 'qiniu';

const config = {
	bucket_name: 'henixtest',	// 默认
	domain: 'http://owmaw6xqh.bkt.clouddn.com/',
	ACCESS_KEY: '4ccVyu4N2KTXRghwSRMtRHvBI-1xp5JDXzJYlZ5D',
	SECRET_KEY: '-RPr3W8PjtbplcfYR1BRxDs7cLQ5LTFmNQgvu7x-',
	uptoken: null
};

config.uptoken = create_uptoken();

function create_uptoken(bucket_name) {
	qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
	qiniu.conf.SECRET_KEY = config.SECRET_KEY;
    var putPolicy = new qiniu.rs.PutPolicy(config.bucket_name);
    return putPolicy.token();
}

export default create_uptoken;