//打飞机的盒子
var planeDiv;
//背景图片的y坐标
var backgroundY = 0;
//控制创建飞机的时间
var time1 =0;
var time2 =0;
//敌方飞机的数组
var enemyArr = [];
//子弹的数组
var bulletArr = [];
//循环调用方法的标记
var timer;
//本方飞机
var myPlane;
var body;
//判断是否是暂停状态
var isPause = false;
//暂停的div
var suspendDiv;
//结束界面的div
var endDiv;
//总分数
var plane_Score = 0;
//分数标签
var planeScore;
//左上角的分数标签
var scoreSpan;
//窗口加载完毕
window.onload = function () {
	//拿到开始游戏的button
var beginButton =document.getElementById('beginButton');
//拿到开始游戏的盒子
var beginDiv = document.getElementById('beginDiv');
//拿到打飞机的盒子
planeDiv = document.getElementById('planeDiv');
//拿到body
body = document.getElementsByTagName('body') [0];
//拿到暂停的div
suspendDiv=document.getElementById('suspendDiv');
//拿到结束的div
endDiv=document.getElementById('endDiv');
//拿到分数标签
planeScore=document.getElementById('planeScore');
//拿到左上角的分数标签
scoreSpan=document.getElementById('score');
// 添加点击事件

beginButton.onclick =function () {
	// alert('开始游戏');
	//切换两个盒子的display
	beginDiv.style.display = 'none';
	//显示打飞机的盒子
	planeDiv.style.display = 'block';
	//没个几ms循环调用某个函数或方法
	timer=setInterval(movingBG,30);
	}
	//创建本方飞机
	myPlane = new MyPlane(127,480);
	//给打飞机的div添加鼠标移动事件
	addEvent(planeDiv,'mousemove',moveAirPlane);
	//给body添加移动事件
	addEvent(body,'mousemove',moveBoder);
	//给飞机的图片添加点击事件
	addEvent(myPlane.imgNode,'click',suspendPlane);
	//给暂停界面两个按钮添加事件
	addEvent(suspendDiv.getElementsByTagName('button')[0],'click',suspendPlane);
	//重新开始按钮
	addEvent(suspendDiv.getElementsByTagName('button')[1],'click',replay);
}
//重新开始
function replay(){
	//刷新界面
	window.location.reload();
}
//移动飞机
function moveAirPlane (evt){
	//兼容IE，拿到事件对象
	evt = evt ||window.event;
	//盒子左上角到浏览器左边的距离
	//ocument.body.clientWidth:窗口的宽度
	var distance = (document.body.clientWidth-320)/2;
	//拿到飞机的标签
	var ourAirPlane = myPlane.imgNode;
	//改变飞机的left和top
	ourAirPlane.style.left=evt.clientX-distance - 33 +'px';
	ourAirPlane.style.top=evt.clientY -40 +'px';


}
//边界判断函数
function moveBoder (evt){
	//事件对象
	evt = evt || window.evt;
	var bodyX=evt.clientX;
	var bodyY=evt.clientY;
	//盒子左上角到浏览器左边的距离
	//ocument.body.clientWidth:窗口的宽度
	var distance = (document.body.clientWidth-320)/2;
	if (bodyX<distance || bodyX>(distance+320)||bodyY<0 ||bodyY>568){
		//到边界了
		removeEvent(planeDiv,'mousemove',moveAirPlane);
	}else {
		//给打飞机的div添加鼠标移动事件
		addEvent(planeDiv,'mousemove',moveAirPlane);
	}
}
//暂停事件
function suspendPlane(){
	if (isPause) {
		//恢复循环调用函数
		timer=setInterval(movingBG,30);

		//恢复移动事件的添加
		addEvent(planeDiv,'mousemove',moveAirPlane);
		addEvent(body,'mousemove',moveBoder);
		//影藏暂停界面
		suspendDiv.style.display ='none';
		isPause=false;
	}else{
			//清除循环调用函数
	clearInterval(timer);
	//显示暂停界面
	suspendDiv.style.display = 'block';
	//移除飞机移动事件
	removeEvent(planeDiv,'mousemove',moveAirPlane);
	//移除body的移动事件
	removeEvent(body,'mousemove',moveBoder);
	isPause=true;
	}
	
	
}

//移动背景图片
function movingBG () {

	//取得背景图片的y
	planeDiv.style.backgroundPositionY = backgroundY+'px';
	//改变Y坐标(0可以省略)
	backgroundY += 0.5;
	if (backgroundY == 500) {
		backgroundY = 0;
	}
	//飞机创建的间隔时间
	time1++;
	if (time1==20) {
		time2++;
		if(time2%5==0) {
			//创建中型飞机
			var middlePlane =new EnemyPlane(274,-100,46,60,'image/enemy3_fly_1.png','image/中飞机爆炸.gif',2,200,6,200);
			//加入数组
			enemyArr.push(middlePlane);

		}
		if (time2==20) {
			//创建大型飞机
			var largePlane =new EnemyPlane(210,-100,110,164,'image/enemy2_fly_1.png','image/大飞机爆炸.gif',1,300,12,300);
			enemyArr.push(largePlane);
			time2=0;
		}else{
			//创建小飞机
	        var smallPlane = new EnemyPlane(286,-100,34,24,'image/enemy1_fly_1.png','image/小飞机爆炸.gif',3,100,1,100);
	        enemyArr.push(smallPlane);
		}
		
		//创建敌方飞机
		time1=0;
	}
	//敌方飞机的个数
	var enemyPlaneLength = enemyArr.length;
	//遍历敌机数组
	for (var i = 0;i<enemyPlaneLength;i++) {
		//取出敌机
		var enemyPlane = enemyArr[i];
		if (!enemyPlane.planeisdie) {
		//调用向下移动的方法
		enemyPlane.movePlane();
		}else {

			enemyPlane.dieBeginTime +=10;
			//如果开始死亡时间等于死亡时间则移除敌机
			if (enemyPlane.dieBeginTime==enemyPlane.dieTime){
			//飞机死亡,爆炸，移除敌机图片
			planeDiv.removeChild(enemyPlane.imgNode);
			enemyArr.splice(i,1);
			enemyPlaneLength--;
			}
		}
		//敌机超出边界则删除
		if (enemyPlane.imgNode.offsetTop >= 568){
			//移除此图片节点
			planeDiv.removeChild(enemyPlane.imgNode);
			//在敌方飞机数组里面移除此敌机对象
			enemyArr.splice(i,1);
			//数组个数减一
			enemyPlaneLength--;
		}
	}
	if(time1%5==0){
	//创建子弹
	var bullet = new Bullet(myPlane.imgNode.offsetLeft + 31,myPlane.imgNode.offsetTop-10);
	//将子弹放入子弹数组
	bulletArr.push(bullet);
	}
	//几颗子弹
	var bulletLength = bulletArr.length;
	for (var i=0;i<bulletLength;i++){
		//取出子弹
		var bullet1 = bulletArr[i];
		
		//移动
	
		bullet1.moveBullet();
		//超出边界删除子弹
		if (bullet1.bulletImage.offsetTop <=0){
			//移除子弹节点
		planeDiv.removeChild(bullet1.bulletImage);
		//数组里面移除对应的元素
		bulletArr.splice(i,1);
		bulletLength--;
		}
	}
	//碰撞判断
	//每一颗子弹都需要与每一架敌机进行碰撞判断
	for (var i=0;i<bulletLength;i++){
		for(var j=0; j<enemyPlaneLength;j++){
			//本方飞机和敌机的碰撞
			if (enemyArr[j].planeisdie==false){
				//飞机碰撞的代码
				if (myPlane.imgNode.offsetLeft <= enemyArr[j].imgNode.offsetLeft + enemyArr[j].planeWidth &&myPlane.imgNode.offsetLeft+myPlane.planeWidth>=enemyArr[j].imgNode.offsetLeft){
					if(myPlane.imgNode.offsetTop<=enemyArr[j].imgNode.offsetTop+enemyArr[j].planeHeight&&myPlane.imgNode.offsetTop+myPlane.planeHeight>=enemyArr[j].imgNode.offsetTop){
						//停止循环调用
						clearInterval(timer);
						//移除飞机移动事件
						removeEvent(planeDiv,'mousemove',moveAirPlane);
						//移除body的移动事件
						removeEvent(body,'mousemove',moveBoder);
						//移除点击事件
						
						removeEvent(myPlane.imgNode,'click',suspendPlane);
						//显示结束界面
						endDiv.style.display='block';
						//设置分数
						planeScore.innerHTML=plane_Score;
						//飞机爆炸
						myPlane.imgNode.src=myPlane.boomImgSrc;
					}
				}
				//接收每颗子弹
				var everyBullet = bulletArr[i].bulletImage;
				//接收每架敌机
				var everyEnemy = enemyArr[j].imgNode;
				//判断子弹和敌机的碰撞
				var x1=everyBullet.offsetLeft+6 >= everyEnemy.offsetLeft;
				var x2=everyBullet.offsetLeft<=everyEnemy.offsetLeft+enemyArr[j].planeWidth;
				var y1=everyBullet.offsetTop+14>=everyEnemy.offsetTop;
				var y2=everyBullet.offsetTop<=everyEnemy.offsetTop+enemyArr[j].planeHeight;
				if (x1&&x2){
					if(y1&&y2){
						//子弹和飞机碰撞
						//每次碰撞血量减一
						enemyArr[j].blood -=bulletArr[i].attack;
						if(enemyArr[j].blood==0){
							//敌机死亡
							plane_Score +=enemyArr[j].score;
							//改变左上角的分数
							scoreSpan.innerHTML = plane_Score;
							//敌方飞机的图片换成爆炸图片
							enemyArr[j].imgNode.src=enemyArr[j].boomImgSrc;
							//已经死亡状态
							enemyArr[j].planeisdie=true;
						}
						//删除子弹
						planeDiv.removeChild(everyBullet);
						//子弹数组元素个数减一
						bulletArr.splice(i,1);
						bulletLength--;
						//跳出遍历敌机循环
						break;
					}

				}
			}
		}
	}
}
	

//飞机的构造函数
function Plane(x,y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score) {
	//x,y,w,h
	this.planeX = x;
	this.planeY = y;
	this.planeWidth = width;
	this.planeHeight = height;
	//爆炸图片的地址
	this.boomImgSrc = boomImgSrc;
	//下降速度
	this.speed = speed;
	//死亡持续时间
	this.dieTime = dieTime;
	//死亡的开始时间
	this.dieBeginTime=0;
	//血量
	this.blood = blood;
	//分数
	this.score = score;
	//飞机的死亡状态
	this.planeisdie = false;
	//创建图片标签
	this.init = function () {
		//创建图片
		this.imgNode = document.createElement('img');
		//将图片路径给图片标签
		this.imgNode.src = imgSrc;
		//飞机显示在什么位置
		this.imgNode.style.top = this.planeY + 'px';
		this.imgNode.style.left = this.planeX + 'px';
		//添加子节点
		planeDiv.appendChild(this.imgNode);
	}
	//显示飞机的图片
	this.init();
	//自动往下移动(改变图片的top值)
	this.movePlane = function (){
		//this.imgnode.style.top:100px
		//this.imgNode.offsetTop:100
		this.imgNode.style.top = this.speed + this.imgNode.offsetTop + 'px';
	}

}
//创建本方飞机的构造函数
function MyPlane (x,y) {
	//冒充对象call(要冒充的对象，被冒充对象的构造函数的形参)
	Plane.call(this,x,y,66,80,'image/我的飞机.gif','image/本方飞机爆炸.gif',0,9999,1,1);
}
//创建敌方飞机的构造函数
function EnemyPlane (max,y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score) {

	Plane.call(this,random(max),y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score);
}
//求敌方飞机的随机数
function random (max){
	return Math.random() * max;
}
//子弹的构造函数
function Bullet (x,y) {
	//x,y,宽，高
	this.bulletX = x;
	this.bulletY = y;
	this.bulletWidth = 6;
	this.bulletHeight = 14;
	//攻击力
	this.attack = 1;
	//创建子弹图片
	this.init = function () {
		//飞机图片属性
		this.bulletImage=document.createElement('img');
		this.bulletImage.style.top = this.bulletY + 'px';
		this.bulletImage.style.left = this.bulletX + 'px';
		//设置图片路径
		this.bulletImage.src = 'image/bullet1.png';
		planeDiv.appendChild(this.bulletImage);

	}
	this.init();
	//子弹向上移动
	this.moveBullet = function () {
		this.bulletImage.style.top =this.bulletImage.offsetTop -20 + 'px';
	}
}
//跨浏览器添加事件
//obj:对象，给哪个对象添加事件  type：事件类型   fn:响应哪个函数或者方法
function addEvent (obj,type,fn){
	//w3c浏览器
	if (obj.addEventListener){
		//添加事件
		obj.addEventListener(type,fn,false);
	}else if (obj.attachEvent) {
		//IE浏览器添加事件
		obj.attachEvent('on'+type,fn);
	}
}

//跨浏览器移除事件
function removeEvent (obj,type,fn){
	if (obj.removeEventListener){
		//w3c浏览器移除事件
		obj.removeEventListener(type,fn,false);

	}else if(obj.detachEvent){
		//IE移除事件
		obj.detachEvent('on'+type,fn);
	}
}