(function(){
    var Lottery = window.Lottery = function(){
        // 获得抽奖主体内容容器
        this.contentBox = $('.lottery-content');
        this.size ={
            "width": 0,
            "height":0,
        };
        // 行列布局个数
        this.config = {
            "rows": 3,
            "col" : 3
        };
        this.marginPd = 6; // 每个奖品间距
        this.light = 31;   //灯带数量
        this.lightSize = 10;  // 灯带尺寸

        // 动画周期属性配置
        this.timer = null;
        this.index = -1;  // 当前转动到哪个位置，起点位置
        this.timer = 0;  // 每次转动定时器
        this.speed = 200;  // 初始转动速度
        this.times = 0;    // 转动次数
        this.cycle = 50; // 转动基本次数：即至少需要转动多少次再进入抽奖环节
        this.prizeIndex = -1;   // 中奖位置
        this.showToast = false; //显示中奖弹窗      
        this.onGoing = false;  //抽奖状态
        this.count = 3; //抽奖次数

        // 奖品数据、dom节点数据
        this.lotteryData = null;
        this.prizeDomData = null;

        // 抽奖结果
        this.lotteryResult = null;
        this.init();
    };

    // 数据初始化
    Lottery.prototype.init = function(callBack){
        var self = this;
        // 加载异步资源
        var t = setTimeout(function(){
            self.lotteryData = [
                {
                    "key":1,
                    "title":'小米10',
                    "img":'./imgs/mi10.png'
                },
                {
                    "key":2,
                    "title":'mackbook14',
                    "img":'./imgs/mackbook.png'
                },
                {
                    "key":3,
                    "title":'nova7',
                    "img":'./imgs/nova7.png'
                },
                {
                    "key":4,
                    "title":'手气真差',
                    "img":'./imgs/null.png'
                },
                {
                    "key":5,
                    "title":'华为P40',
                    "img":'./imgs/p40.png'
                },
                {
                    "key":6,
                    "title":'phoneX',
                    "img":'./imgs/phone11.png'
                },
                {
                    "key":7,
                    "title":'红包',
                    "img":'./imgs/red_package.png'
                },
                {
                    "key":8,
                    "title":'华为手环',
                    "img":'./imgs/wristband.png'
                }
            ];
            self.layout();

            callBack && callBack();
            clearInterval(t);
        },500);
    };
    
    // 抽奖内容布局
    Lottery.prototype.layout = function(){
        // 计算每项 得宽度 边距
        // 单个奖品尺寸 ====> 总宽度 - 间距  / 列数
        var boxWidth = $('.lottery-box').width() - this.lightSize * 4;
        var singleSize = (boxWidth - (this.config.col + 1) * this.marginPd) / this.config.col;
        // 盒子高度 ===> 行数* singleSize + 间距 * row +1
        var boxHeight = this.config.rows * singleSize + this.marginPd * (this.config.rows +1);
        this.size.height = boxHeight;
        this.size.width = boxWidth;
        $('.lottery-content').css({
            "width":boxWidth + 'px',
            "height":boxHeight + 'px',
            "margin":this.lightSize * 2
        });

        // 奖品顺时针布局
        this.lotteryData.map((item,index) => {
            var lotteryItem = document.createElement('li');
            var _dom = `<div class="prize-box">
                        <img class="pic" src="${item.img}"/>
                        <p class="text">${item.title}</p>
                    </div>`;
            $(lotteryItem).addClass(`lottery-item lottery-item-${index+1}`).html(_dom);
            // 默认第一个选中
            if(index == 0){
                $(lotteryItem).addClass('active');
            }
            if((index + 1) <= this.config.col ){
                $(lotteryItem).css({
                    "width":singleSize,
                    "height":singleSize,
                    "top":this.marginPd,
                    "left":this.marginPd  * (index+1) + singleSize * index
                });
            }else if((index + 1)>this.config.col && (index + 1) < this.config.col + this.config.rows){
                $(lotteryItem).css({
                    "width":singleSize,
                    "height":singleSize,
                    "top":this.marginPd  * (index - this.config.col + 2) + singleSize * (index - this.config.col + 1),
                    "right":this.marginPd
                });
            }else if((index + 1)>(this.config.col + this.config.rows -1 ) && (index + 1) < this.config.col*2 + this.config.rows -1){
                $(lotteryItem).css({
                    "width":singleSize,
                    "height":singleSize,
                    "bottom":this.marginPd,
                    "right":this.marginPd  * (index - this.config.col - this.config.rows + 3) + singleSize * (index - this.config.col - this.config.rows + 2)
                });
            }else{
                $(lotteryItem).css({
                    "width":singleSize,
                    "height":singleSize,
                    "top":this.marginPd * (this.lotteryData.length - index+1) + singleSize * (this.lotteryData.length - index),
                    "left":this.marginPd
                });
            }
            $('.lottery-content').append(lotteryItem);
        });
        // 中间按钮区域
        var btnControl = document.createElement('li');
        $(btnControl).addClass('btn-control').html('开始抽奖');
        $(btnControl).css({
            "width":this.size.width - singleSize *2 - this.marginPd * 4,
            "height":boxHeight - singleSize *2 - this.marginPd * 4,
            "top":singleSize + this.marginPd * 2,
            "left":singleSize + this.marginPd * 2
        });
        $('.lottery-content').append(btnControl);
        // 获取奖品dom节点
        this.prizeDomData = document.querySelectorAll('.lottery-item');

        // 外围灯带 布局
        //每个灯得距离 ===> 周长 - 总数量长度  / （数量-1）

        var _lightW = $('.lottery-box').width() - this.lightSize,
            _lightH = $('.lottery-box').height() - this.lightSize;
        var l = _lightW * 2 + _lightH * 2;
        var thanL = l - this.light * this.lightSize;  // 间距长度
        var lightPd = Number((thanL / (this.light -1)).toFixed(2));  //原点间距
        for(var i=0;i<this.light;i++){
            // 最后一个不渲染
            if(i == this.light - 1)return;
            var lightItem = document.createElement('li');
            $(lightItem).addClass('light-item');
            // 灯带奇数偶数颜色
            if(i%2 == 0){
                $(lightItem).addClass('light-item-even');
            }else{
                $(lightItem).addClass('light-item-odd');
            }
            var len = Number((i * lightPd + (i+1) * this.lightSize).toFixed(2));
            if(len <= _lightW){
                $(lightItem).css({
                    "width":this.lightSize,
                    "height":this.lightSize,
                    "top":this.lightSize /2,
                    "left": len
                });
            }else if(len > _lightW && len <= _lightW + _lightH){
                $(lightItem).css({
                    "width":this.lightSize,
                    "height":this.lightSize,
                    "top":len - _lightW + this.lightSize /2,
                    "right":this.lightSize /2
                });
            }else if(len > _lightW + _lightH && len <= 2 * _lightW + _lightH){
                $(lightItem).css({
                    "width":this.lightSize,
                    "height":this.lightSize,
                    "bottom":this.lightSize /2,
                    "right": len - _lightW - _lightH + this.lightSize /2
                });
            }else if(len > 2 * _lightW + _lightH){
                $(lightItem).css({
                    "width":this.lightSize,
                    "height":this.lightSize,
                    "bottom":len - 2 * _lightW - _lightH + this.lightSize /2,
                    "left": this.lightSize /2
                });
            }
            $('.light-content').append(lightItem);
        }
    };

    // 抽奖结果
    Lottery.prototype.requestRes = function(){
        var self = this;
        // 随机获得一个中奖位置 || 中奖位置,可由后台返回 
        var index = parseInt(Math.random() * 10, 0) || 0;  
        index > 7 ? self.prizeIndex = 7 : self.prizeIndex = index;
        console.log(self.prizeIndex);
        self.lotteryData.map(function(item,k){
            if(item.key == index + 1){
                self.lotteryResult = item;
            }
        });
        self.onGoing = true;
        self.count --;
        self.animation();
    };

    Lottery.prototype.updataed = function(){
        this.times ++;
        for(var i =0;i<this.prizeDomData.length;i++){
            if($(this.prizeDomData[i]).hasClass('active')){
                if(i == this.prizeDomData.length-1){
                    i = -1;
                }
                $(this.prizeDomData[i+1]).addClass('active').siblings().removeClass('active');
                this.index = i+1;
                break;
            }
        }
    }

    Lottery.prototype.animation = function(){
        var self = this;
        self.updataed();
        // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
        if (self.times > self.cycle + 10 && self.prizeIndex === self.index) {
            clearTimeout(self.timer);
            $('.dialog').addClass('dialog-show');
            var _html = `<p class="title">${self.lotteryResult.title}</p>
                        <img class="pic" src="${self.lotteryResult.img}"/>`;
            $('.dialog-content').html(_html);
            self.onGoing = false;
            self.prizeIndex = -1;
            self.times = 0;
            self.speed = 200;             
        }else{
            if (self.times < self.cycle) {
                self.speed -= 20;
            }else if (self.times > self.cycle + 10 && ((self.prizeIndex === 0 && self.index === 7) || self.prizeIndex === self.index + 1)) {
                self.speed += 110;
            } else {
                self.speed += 20;
            }      
            if (self.speed < 40) {self.speed = 40}
            self.timer = setTimeout(() => {
                clearTimeout(self.timer);
                self.animation();
            }, self.speed);
        }
    };

    // 开始抽奖动画
    Lottery.prototype.run = function(){
        if(!this.onGoing && this.count > 0){
            this.requestRes();
        }
    };  
})();