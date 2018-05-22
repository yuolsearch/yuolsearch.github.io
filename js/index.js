new Vue({
    el:'#container',
    data:{
        searchInfo: [],
        keyWord: '',
        selectIndex: -1,
    },
    watch:{
        keyWord: function(value){
            var reg = /^\s*\s*$/g;
            value = value.replace(reg, "");
            if(value){
                this.reqInfo(value);
            }
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            this.displayTime();
        })
    },
    methods: {
        reqInfo: function(value) {
            var _this = this;
            var url = "https://www.thc666.cn:8080/words?s_str=" + value;
            this.$http.get(url,{"id": value}).then(function(res){
                _this.searchInfo = res.body;
            })
        },
        select: function(change){
            if(this.selectIndex >= -1 && this.selectIndex <= this.searchInfo.length){
                this.selectIndex += change;
            }
            if(this.selectIndex < -1){
                this.selectIndex = -1;
            }
            if(this.selectIndex > this.searchInfo.length){
                this.selectIndex = this.searchInfo.length;
            }
        },
        enterEvent: function(e){
            if(this.selectIndex >= 0 && this.selectIndex <= this.searchInfo.length - 1){
                window.open(this.searchInfo[this.selectIndex].href)
                e.preventDefault();
            }
        },
        displayTime: function(){
            var time = new Date();
            var timeSpan = document.querySelector(".time");
            var weekDay = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];

            timeSpan.innerHTML = '<span>'+(time.getMonth()+1) + '月' + this.padLeftZero(time.getDate()+'') + '日' + this.padLeftZero(time.getHours()+'') + ':' + this.padLeftZero(time.getMinutes()+'') + ' <i>' + weekDay[time.getDay()] + '</i>' + '</span>';
            setTimeout(this.displayTime,1000)
        },
        padLeftZero:function(str){
            return ('00'+str).substr(str.length);
        },
        showKeyWord: function(val){
            var reg = new RegExp(this.keyWord,'g');
            val = val.replace(reg, "<span style='color:#f60'>"+this.keyWord+"</span>");
            return val;
        }
    }
})