{
	let view = {
		el: "#tabs"
	}
	let model = {}
	let controller= {
		init(view,model){
			this.view = view
			this.model = model
			this.bindEvents()
		},
		bindEvents(){
			$(this.view.el).on("click",".tabs-nav > li",(e)=>{
				let $li = $(e.currentTarget)
				let tabName = $li.attr("data-tab-name")
				$li.addClass("active")
				.siblings().removeClass("active")
				window.eventHub.emit("selectTab",tabName)
			})
		}
	}
	controller.init(view,model)
}