new Vue({
    el: ".result-page",
    data: {
        searchInfo: [],
        keyWord: '',
        showList: [],
        total: 0,
        selectIndex: -1,
        currentPage: 1,
        useTime:0
    },
    watch:{
        keyWord: function(value){
            if(document.activeElement.id === 'text'){
                var reg = /^\s*\s*$/g;
                value = value.replace(reg, "");
                if(value){
                    this.reqInfo(value);
                }
            }
        },
        currentPage: function(value){
            var time = new Date().getTime();
            var url = "https://www.thc666.cn:8080/search?s_str=" + this.keyWord + "&page=" + value;
            this.$http.get(url, {"id": this.keyWord+"&page="+value}).then(function(res){
                var newTime = new Date().getTime();
                this.useTime = newTime - time;
                console.log(time, newTime)
                this.showList = res.body.searchList;
            });
        }
    },
    mounted:function(){
        this.$nextTick(function(){
            this.displayTime();
            var parmas = this.urlParse();      
            this.keyWord = parmas.s_str;
            var url = "https://www.thc666.cn:8080/search?s_str=" + parmas.s_str;
            var time = new Date().getTime();
            this.$http.get(url, {"id": parmas.s_str}).then(function(res){
                var newTime = new Date().getTime();
                this.useTime = newTime - time;
                console.log(time, newTime)
                this.showList = res.body.searchList;
                this.total = res.body.resultNum;
            });
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
        enterEvent: function(){
            if(this.selectIndex >= 0 && this.selectIndex <= this.searchInfo.length - 1){
                window.open(this.searchInfo[this.selectIndex].href)
            }
        },
        displayTime: function(){
            var time = new Date();
            var timeSpan = document.querySelector(".time");
            var weekDay = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];

            if(timeSpan){
                timeSpan.innerHTML = '<span>'+(time.getMonth()+1) + '月' + this.padLeftZero(time.getDate()+'') + '日' + this.padLeftZero(time.getHours()+'') + ':' + this.padLeftZero(time.getMinutes()+'') + ' <i>' + weekDay[time.getDay()] + '</i>' + '</span>';
                setTimeout(this.displayTime,1000)
            }
        },
        padLeftZero:function(str){
            return ('00'+str).substr(str.length);
        },
        urlParse: function(){
            let url = window.location.search;
            let obj = {};
            let reg = /[?&][^?&]+=[^?&]+/g;
            let arr = url.match(reg);
            // ['?id=12345','&a=b']
            if (arr){
                arr.forEach(function(item){
                    let tempArr = item.substring(1).split('=');
                    let key = decodeURIComponent(tempArr[0]);
                    let val = decodeURIComponent(tempArr[1]);
                    obj[key] = val
                })
            }
            return obj
        },
        showKeyWord: function(val){
            var reg = new RegExp(this.keyWord,'g');
            val = val.replace(reg, "<span style='color:#f60'>"+this.keyWord+"</span>");
            return val;
        }
    }
})