////////////////
/* validation */
////////////////
/* -----------------------------------------------------------------------------
execution example: validate.email('my@mail.com'); -> returns true
 ----------------------------------------------------------------------------- */
var validate = {
    dateDayLocation:0,
    dateMonthLocation:1,
    dateYearLocation:2,
    dateTimeSeperator:' ',
    dateSeperator:'/',
    timeSeperater:':',
    number:function(val,min,max){
        /* reverse the result from is not a number */
        if(!min && !max){
            return (isNaN(val)) ? false : true;
        }else if(val<min || val>max){
            return false;
        }
    },
    email:function(val){
        //return (val.match(/[\w\-]+@[\w\-]+\..+/)) ? true : false;// simple method replaced by improved + multiple addresses
        for(var i=0,arr=val.split(/,| |;/);i<arr.length;i++){
            if (arr[i] && !arr[i].match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
                return false;
            }
        }
        return true;
    },
    dateTime:function(val){
        var dateTimeArr=val.split(this.dateTimeSeperator);
        return (dateTimeArr.length==2 && this.date(dateTimeArr[0]) && this.time(dateTimeArr[1])) ? true : false;
    },
    date:function(val){
        var validDateFormat=/^\d{2}\/\d{2}\/\d{4}$/;
        if(!validDateFormat.test(val)){
            //return false;
        }
        var dateArr=val.split(this.dateSeperator);
        var dayobj = new Date(dateArr[this.dateYearLocation], dateArr[this.dateMonthLocation]-1, dateArr[this.dateDayLocation]);
        return (dayobj.getMonth()+1==dateArr[this.dateMonthLocation] && dayobj.getDate()==dateArr[this.dateDayLocation] && dayobj.getFullYear()==dateArr[this.dateYearLocation]) ? true : false;
    },
    time:function(val){
        var validTimeFormat=/^\d{1,2}:\d{2}([ap]m)?$/;
        var timeArr=val.split(this.timeSeperater);
        return (timeArr[0] && timeArr[0]>=0 && timeArr[0]<24 && timeArr[1] && timeArr[1]>=0 && timeArr[1]<60) ? true : false;
    }
}