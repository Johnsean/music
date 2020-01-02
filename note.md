## 方案：

1. ###  浏览器url获得:  id 

> 案例： .song.html?id=5e0975&&a=1

```javascript
let search = window.location.search  //获得查询参数
if(search.indexOf('?') === 0){ //?位于首位则执行: 
	search = search.substring(1)	//去掉问号 id=5e0975&&a=1
}

let array = search.split('&').filter((v=>v))//过滤掉空字符串 [id=5e0975,a=1]
let id = ''
for(let i = 0 ;i<array.length; i++){
    let kv = array[i].split('=') //[id, 5e0975] [a, 1]
    let key = kv[0]
    let value = kv[1]
    if(key === 'id'){
		id = value
        break
    }
}
return id
```



2. ###  外链 url 

   **URL 规范不能有中文**

   将查询参数 或者 网址的后面一部分转码 用URIC

> domain ：域名  是为不带协议的 

``` javascript
url = 'http://' + domain + '/' + encodeURIComponent(res.key)
```

​	将 整个url 转义用 URI ： `url = encodeURI(url)`

> 查询参数中不能出现`&` : 这样有歧义  是分割成两个部分 还是查询这个整体
>
> ex : search?a=1&b=2   //1. `a=1 b=2 `  2.`a=   1&b=2`
>
> encodeURI('1&b=2')  // 1&b=2
>
> encodeURIComponent('1&b=2') // 1%26b%3D2



3. ### return  获得 更新返回值

``` javascript
// songs : [{},{},{},...]
 //ex1:
this.data.songs = songs.map((song)=>{  //song={id:xx,attributes:{},xxx...}
    return {id: song.id, ...song.attributes}  //更新data.songs 
})

 //ex2:
let liList = songs.map((song)=>{
    let $li = $("<li></li>").text(song.name).attr("data-id", song.id)
    if(song.id === selectSongId){ 
        $li.addClass("active")
    }
    return $li
})
liList.map((domLi)=>{
    $el.find("ul").append(domLi)
})
```

插入li  接上面ex2:

```  javascript
let {songs} = data    //data:{songs:[{},{},...],... }
			
songs.map((song)=>{
    let $li = $(`
        <li>
            <h3>${song.name}</h3>
            <p>
                <svg class="icon icon-sq">
                    <use xlink:href="#icon-sq"></use>
                </svg>
            ${song.singer}
            </p>
            <a class="playButton" href="./song.html?id=${song.id}">
                <svg class="icon icon-play">
                	<use xlink:href="#icon-play"></use>
                </svg>
            </a>
        </li>
		`)
    this.$el.find("ol.list").append($li)
})
```



### 分割歌词&时间：

``` javascript
function createLrc(song){
    let arr = song.lyrics.split('\n')
    let regexp = /\[([\d:.]+)\](.+)/	
    //match 成功返回: [1.原值string, 2.第一个括号内容, 3.第二个括号内容]
    arr.map((string)=>{
        let p = document.createElement('p')
        let matches = string.match(regexp)
        if(matches){ // '[00:10.1]' 返回null
            p.textContent = matches[2]
            let parts = matches[1].split(':') //第一个括号内 ：时间 转化成秒
            let newTime = parseInt(parts[0],10)*60 + parseFloat(parts[1],10)
            p.setAttribute('data-time', newTime)
        }else{
            p.textContent = string
        }
        this.$el.find('.lyric-container>.lyric').append(p)
    })
}

// 滚动歌词：  触发ontimeupdate事件  传入audio属性currentTime
function scrollLrc(time){
    let allP = $('.lyric>p')
    let p
    for(let i =0;i<allP.length;i++){
        if(i === allP.length-1){
            p = allP[i]
            break
        }else{
            let currenttime = allP.eq(i).attr('data-time')
            let nextTime = allP.eq(i+1).attr('data-time')
            if(currenttime <= time && time <= nextTime){
                //当没有[00:00.00]时 不满足if--> lyc会到末尾
                p = allP[i]
                break
            }
        }
    }
    let height = p.getBoundingClientRect().top - $('.lyric')[0].getBoundingClientRect().top
    // 整体移动👇 差值👆
    $('div.lyric').css({'transform':`translateY(${-(height==0?0:height-37)}px)`})
    $(p).addClass('active').siblings('.active').removeClass('active')
}

```



### 调试：alert / console /vconsole

``` html
//v1
window.onerror = function(message, file, row){
    alert(message)
    alert(file)
    alert(row)
}
//v2
<script src="https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js"></script>
<script>
    var vConsole = new VConsole();
	window.onerror = function(message, file, row){
        console.log(message)
        console.log(file)
        console.log(row)
	}
</script>
//v3
<div id="consoleOutput" style="position: fixed;width: 100%;left: 0;bottom: 0;height: 100px;border: 1px solid black; background: red;overflow: auto;">
</div>
 <script>
	  window.console = {
		  log(x){
			  let p = document.createElement("p")
			  p.innerText = x
			  consoleOutput.appendChild(p)
		  }
	  }
	  window.onerror = function(message, file, row){
		  console.log(message)
		  ...}
</script>
```



### map & reduce 填充空对象对比：

``` javascript
let form = this.view.$form.get(0)
let keys = ["name", "summary"]  //扩充这个数组即可 对应标签name属性名
let data = {}
keys.reduce((prev, item)=>{     //1. prev ={name:formValue1}
prev[item] = form[item].value	//2. prev = {name:formValue1, summary:fV2}
//console.log("prev")			//3. data = prev 第二步因为是在prev上找键 prev是Obj
//console.log(prev)				// 不像简单数据那样叠加数值 这里是叠加对象属性
return prev
}, data)
//console.log(data)
this.model.create(data)

//map:
let needs = "name singer url cover lyrics".split(" ")
let data = {}
needs.map((string)=>{
data[string] = this.view.$el.find(`[name="${string}"]`).val()
})
this.model.create(data)
```



**leanClound 操作：**

### 一对多/dependent/依赖/coment/ pointer设置指向：

``` javascript
var song = AV.Object.createWithoutData('Song', id);
song.set('name','777')
var playlist = AV.Object.createWithoutData('Playlist', id);
song.set('dependent',playlist)  // 创建song表的属性dependent 值为playlistID

song.save().then((newSong)=>{
    console.log(newSong)
},(error)=>{
    console.error(error)
})
```

