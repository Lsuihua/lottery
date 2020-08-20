(function(){
    var Lottery = window.Lottery = function(){
        // 获得抽奖主体内容容器
        this.contentBox = $('.lottery-content');
        this.width = $('.lottery-content').width();
        console.log(this.width);
        this.config = {
            "rows": 3,
            "col" : 3
        };
        this.marginPd = 10;

        this.lotteryData = null;

        // 抽奖结果
        this.lotteryResult = null;

        this.init(function(){
            console.log("初始化完成");
        });
    };

    // 数据初始化
    Lottery.prototype.init = function(callBack){
        var self = this;
        // 加载异步资源
        var t = setTimeout(function(){
            // var num = self.config.rows * self.config.col -1;
            // for(let i =0;i<num; i++){
            //     self.lotteryData.push({
            //         "key":i+1,
            //         "title":`奖品${i+1}`,
            //         "img":''
            //     })
            // };
            self.lotteryData = [
                {
                    "key":1,
                    "title":'奖品1',
                    "img":''
                },
                {
                    "key":2,
                    "title":'奖品2',
                    "img":''
                },
                {
                    "key":3,
                    "title":'奖品3',
                    "img":''
                },
                {
                    "key":4,
                    "title":'奖品4',
                    "img":''
                },
                {
                    "key":5,
                    "title":'奖品5',
                    "img":''
                },
                {
                    "key":6,
                    "title":'奖品6',
                    "img":''
                },
                {
                    "key":7,
                    "title":'奖品7',
                    "img":''
                },
                {
                    "key":8,
                    "title":'奖品8',
                    "img":''
                }
            ];
            self.layout();

            callBack && callBack();
            clearInterval(t);
        },1000)
    };
    
    // 抽奖内容布局
    Lottery.prototype.layout = function(){
        // 计算每项 得宽度 边距
        // 单个奖品尺寸 ====> 总宽度 - 间距  / 列数
        var singleSize = (this.width - (this.config.col + 1) * this.marginPd) / this.config.rows;
        // 盒子高度 ===> 行数* singleSize + 间距 * row +1
        var boxSize = this.config.rows * singleSize + this.marginPd *(this.config.rows +1);
        $('.lottery-content').css({"height":boxSize + 'px'});


        this.lotteryData.map((item,index) => {
            var lotteryItem = document.createElement('li');
            console.log(lotteryItem);
            $(lotteryItem).addClass(`lottery-item lottery-item-${index+1}`).html(item.title);
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
                    "bottom":this.marginPd * (this.lotteryData.length - index+1) + singleSize * (this.lotteryData.length - index),
                    "left":this.marginPd
                });
            }

            
            $('.lottery-content').append(lotteryItem);
        })
    };

    // 抽奖结果
    Lottery.prototype.result = function(){
        var self = this;
        var t = setTimeout(function(){
            self.lotteryResult = {
                "key":1,
                "title":'奖品1',
                "img":''
            };
            clearInterval(t);
        },2000)
    };

    // 开始抽奖动画
    Lottery.prototype.run = function(){
        
    };
})();