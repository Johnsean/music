{
	let view = {
		el:".page > aside > .newSong",
		template:`
			新建歌曲
		`,
		render(data){
			$(this.el).html(this.template)
		}
	}
	let model = {}
	let controller = {
		init(view,model){
			this.view = view
			this.model = model
			this.view.render(this.model.data)
			window.eventHub.on("upload",(data)=>{
				this.active()
				console.log("new song 模块得到了 data:")
				console.log(data)
			})
		},
		active(){
			$(this.view.el).addClass("active")
		}
	}
	controller.init(view,model)
}