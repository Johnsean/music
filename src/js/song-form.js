{
	let view = {
		el:".page > main",
		init(){
			this.$el = $(this.el)
		},
		template:`
			<h1>新建歌曲</h1>
			<form class="form">
				<div class="row"> 
					<label>歌名</label>
					<input type="text" name="name" value="__name__">
				</div>
				<div class="row">
					<label>歌手</label>
					<input type="text" name="singer" value="__singer__">
				</div>
				<div class="row">
					<label>外链</label>
					<input type="text" name="url" value="__url__">
				</div>
				<div class="row actions">
					<button type="submit">保存</button>
				</div>
			</form>
		`,
		render(data = {}){ //若没有传data或data为undefined 则 传空对象
			let placeholders = ["name", "singer", "url", "id"]
			let html = this.template
			placeholders.map((string)=>{
				html = html.replace(`__${string}__`, data[string]||"")
			})
			$(this.el).html(html)
		},
		reset(){
			this.render({})
		}
	}
	let model = {
		data:{
			name:"",url:"",singer:"",id:""
		},
		create(data){
			var Song = AV.Object.extend('Song');
			var song = new Song();
			song.set('name', data.name);
			song.set('singer', data.singer);	
			song.set('url', data.url);
			
			return song.save().then((newsong)=>{ //这里的this 为model,箭头函数没有this. 用function 则this变为window
				let {attributes,id} = newsong  // 等价于 let attribute/id = newsong.attribute/id ...	
				Object.assign(this.data,{id,...attributes})   //更新的是同一块内存 model 传出去的时候注意传新的内存
					//key/value同名可省略一个,id:id
					//name:attribute.name;singer:attribute.singer  etc依次遍历attribute的所有属性
			}, function (error) {
			  console.log(error);
			});
		}
	}
	let controller = {
		init(view,model){
			this.view = view
			this.view.init()
			this.model = model
			this.view.render(this.model.data)
			this.bindEvents()
			window.eventHub.on("upload",(data)=>{
				this.model.data = data
				this.view.render(this.model.data)
			})
		},
		bindEvents(){
			this.view.$el.on("submit","form",(e)=>{
				e.preventDefault()
				let needs = "name singer url".split(" ")
				let data = {}
				needs.map((string)=>{
					data[string] = this.view.$el.find(`input[name="${string}"]`).val()
				})
				this.model.create(data)
					.then(()=>{  //上面的return Promise给这个then用
						this.view.reset()
						//深拷贝 传复制后的对象出去 避免引用同一块旧内存
						let string = JSON.stringify(this.model.data)
						let object = JSON.parse(string)
						window.eventHub.emit("create", object)
					})
			})
		}
	}
	controller.init(view,model)
}