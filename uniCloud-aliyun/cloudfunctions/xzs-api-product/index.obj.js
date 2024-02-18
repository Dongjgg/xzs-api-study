const db = uniCloud.database();
const { result } = require("xzs-utils");
let dbJQL;

module.exports = {
	_before: function () { // 通用预处理器
		this.startTime = Date.now();
		let body =  this.getHttpInfo().body;
		if(!body) throw result(400,"required");
		this.params = JSON.parse(this.getHttpInfo().body)
		
		dbJQL = uniCloud.databaseForJQL({ 
			clientInfo: this.getClientInfo()
		})
		dbJQL.setUser({ 
			uid: '64af4b8d819ce80336e26560', // 建议此处使用真实uid，在
			role: ['admin']
		})
	},	
	//获取产品列表
	getlist:async function(){
		let {navid,limit=5,size=0,keyword=""} =  this.params;		
		
		//判断是否使用的是搜索关键字
		let wer 
		if(keyword){
			wer = {
				title:new RegExp(keyword,'gi')
			}
		}else{
			if(!navid) return result(400,"required");
			wer = `navid == "${navid}" && checked == true`
		}
		//查询数据库获取列表数据
		let res = await dbJQL.collection("xzs_product_list").where(wer)
		.field("picurl.url as picpath,title,weight,year,price,grade,pronum")
		.skip(size).limit(limit).orderBy("orderid","asc").get();
		
		let count = await dbJQL.collection("xzs_product_list").where(wer).count()
		
		return result(0,"success",res.data,count.total)
		
	},
	//获取产品详情
	detail:async function (){
		let {id} = this.params;
		if(!id) return result(400,"required");
		let res = await dbJQL.collection("xzs_product_list").where(`_id == "${id}"`)
		.field("picurl.url as picpath,title,weight,year,price,grade,pronum,createTime")
		.get({
			getOne:true
		});
		return result(0,"success",res.data)
	},	
	
	_after:function(error,result){
		if(error) {
			throw error // 如果方法抛出错误，也直接抛出不处理
		}
		result.timeCost = Date.now() - this.startTime
		return result
	}
}
