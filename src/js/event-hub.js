window.eventHub = {
	events:{
		//"光明日报":["fn1","fn2",...],
		//"天天日报":[]   ---形如上述hash
	},
	emit(eventName, data){ //发布, 即找到那个桶 把所有的函数找到并call下,call时带data	
		for(let key in this.events){
			if(key === eventName){
				let fnList = this.events[key]
				fnList.map((fn)=>{
					fn.call(undefined, data)
				})
			}
		}
	},
	on(eventName, fn){ //订阅 , 即把函数放入桶内
		if(this.events[eventName] === undefined){
			this.events[eventName] = []
		}
		this.events[eventName].push(fn)
	}
}