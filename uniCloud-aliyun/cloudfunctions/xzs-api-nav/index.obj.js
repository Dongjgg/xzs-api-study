const db = uniCloud.database();
const { result} = require("xzs-utils");

module.exports = {
	_before: function () { // 通用预处理器
		this.startTime = Date.now() 
	},
	get:async function(){
		let res= await db.collection("xzs_product_nav").field({  //不返回这些字段
			createTime:false, 
			orderid:false,
			state:false
		}).where({
			state:true //条件查询
		}).orderBy("orderid","asc").get();
		let arr = res.data.map(item=>{ //过滤一些东西
			return {
				_id:item._id,
				classname:item.classname,
				icon:item.icon.url
			}
		})
		return result(0,"success",arr)
	},
	_after:function(error,result){
		if(error) {
			throw error // 如果方法抛出错误，也直接抛出不处理
		}
		result.timeCost = Date.now() - this.startTime
		return result
	}
	
}
