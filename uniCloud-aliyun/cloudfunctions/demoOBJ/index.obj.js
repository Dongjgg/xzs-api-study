const db = uniCloud.database(); //连接unicloud数据库
module.exports = {
	_before: function () { // 通用预处理器
		this.startTime = Date.now()this.startTime = Date.now()
		this.params = this.getParams()[0] //定义一个参数
	},
	async get(){
		let {num} = this.params;  //ES6语法解构
				let res = await db.collection("xzs_product_nav").limit(num).get();
				let result = {
					errCode:0,
					errMsg:"查询成功",
					data:res.data
				}
				return result;
	},
	add:function(){
		
	},
	update(){
		
	},
	remove(){
		
	},
	_after(error, result) {
			if(error) {
				throw error // 如果方法抛出错误，也直接抛出不处理
			}
			result.timeCost = Date.now() - this.startTime
			result.ikun="坤坤的认可"  
			return result
		}
}
