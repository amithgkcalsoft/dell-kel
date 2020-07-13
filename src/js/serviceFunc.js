import * as d3 from 'd3';
import { setting } from '../js/setting'
import _ from 'underscore';
export function serviceFunc() {
    let settings = setting();
    let dataInformation= {filename:'',size:0,timerange:[],interval:'',totalstep:0,hostsnum:0,datanum:0};
let hostList;
    function updateDatainformation(timearray,filename){
        dataInformation.size = bytesToString(dataInformation.size);
        dataInformation.hostsnum = settings.hosts.length;
        dataInformation.timerange = millisecondsToStr(_.last(timearray)-timearray[0]);
        dataInformation.interval = millisecondsToStr(timearray[1] - timearray[0]);
        dataInformation.totalstep = timearray.length;
        dataInformation.datanum = d3.format(",.0f")(dataInformation.totalstep*dataInformation.hostsnum);
        // let dataholder = d3.select('#datainformation');
        // for (key in dataInformation)
        //     dataholder.select(`.${key}`).text(dataInformation[key]);
        // if(sampleS)
        //     d3.select(".currentDate")
        //         .text("" + (sampleS['timespan'][0]).toDateString());
    }
    function bytesToString (bytes) {
        // One way to write it, not the prettiest way to write it.
    
        var fmt = d3.format('.0f');
        if (bytes < 1024) {
            return fmt(bytes) + 'B';
        } else if (bytes < 1024 * 1024) {
            return fmt(bytes / 1024) + 'kB';
        } else if (bytes < 1024 * 1024 * 1024) {
            return fmt(bytes / 1024 / 1024) + 'MB';
        } else {
            return fmt(bytes / 1024 / 1024 / 1024) + 'GB';
        }
    }
    function millisecondsToStr (milliseconds) {
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();
    
        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }
    
        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        var str = '';
        if (years) {
            str+= years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks?
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            str+= days + ' day' + numberEnding(days)+' ';
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            str+= hours + ' hour' + numberEnding(hours)+' ';
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            str+= minutes + ' minute' + numberEnding(minutes)+' ';
        }
        var seconds = temp % 60;
        if (seconds) {
            str+= seconds + ' second' + numberEnding(seconds)+' ';
        }
        if(str==='')
            return Math.round(milliseconds)+' ms' ; //'just now' //or other string you like;
        else
            return str;
    }
    let serviceFunc = {
        dataInformation,
        updateDatainformation
    }
    return serviceFunc;
}