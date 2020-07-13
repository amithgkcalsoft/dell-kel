import * as d3 from 'd3';
import { setting } from '../js/setting'
import { serviceFunc } from '../js/serviceFunc'
import _ from 'underscore';
export function loadData(Dataset) {
    debugger;
    console.log("104 loaddata"); 
    let settings = setting();
    let serviceFuncs = serviceFunc();
    let srcpathRoot ="./";
    let sampleS;
    let tsnedata;
    let db;
    let processResult;
    let processData;
    let Loaddata = {
        data:{}
    }; 
    let first = true; 
    let init = true;
    Loaddata.reset = function(hard) {
        Loaddata.data = Dataset.currentDataset;
    };
    function loadFile(){
        debugger;
        
        const choice = Loaddata.data;
        let loadclusterInfo = false;
        var promiseQueue;

            if (first||(db === 'csv'&& choice.category==='hpcc')) { //reload hostlist
                promiseQueue = d3.json(srcpathRoot+'data/hotslist_Quanah.json').then(function (data) {

                         settings.hostList = data;
                        settings.systemFormat();
                        settings.inithostResults(undefined,data);
                        settings.formatService(true);
                        // MetricController.axisSchema(serviceFullList, true).update();
                });
                first = false;
            }else{
                promiseQueue = new Promise(function(resolve, reject){
                    resolve();
                });
            }

            serviceFuncs.dataInformation.filename = choice.name;
            if(choice.category==='hpcc')
                setTimeout(() => {
                    console.time("totalTime:");
                    promiseQueue.then(d3.json(choice.url).then(function(data) {
                            console.timeEnd("totalTime:");

                            loadata1(data);

                    }));
                }, 0);
            else
                readFilecsv(choice.url,choice.separate,choice)

        function loadata1(data){
debugger;
            data['timespan'] = data.timespan.map(d=>new Date(d3.timeFormat('%a %b %d %X CDT %Y')(new Date(+d?+d:d.replace('Z','')))));
            _.without(Object.keys(data),'timespan').forEach(h=>{
                delete data[h].arrCPU_load;
                settings.serviceLists.forEach((s,si)=>{
                    if (data[h][settings.serviceListattr[si]])
                        data[h][settings.serviceListattr[si]] = data.timespan.map((d,i)=>
                            data[h][settings.serviceListattr[si]][i]? data[h][settings.serviceListattr[si]][i].slice(0,s.sub.length).map(e=>e?e:undefined):d3.range(0,s.sub.length).map(e=>undefined));
                    else
                        data[h][settings.serviceListattr[si]] = data.timespan.map(d=>d3.range(0,s.sub.length).map(e=>null));
                })
            });
            serviceFuncs.updateDatainformation(data['timespan']);
            // console.log(data["compute-1-26"].arrFans_health[0])
             sampleS = data;

            // make normalize data
            tsnedata = {};
            settings.hosts.forEach(h => {
                tsnedata[h.name] = sampleS.timespan.map((t, i) => {
                    let array_normalize = _.flatten(settings.serviceLists.map(a => d3.range(0, a.sub.length).map(vi => {
                        let v = sampleS[h.name][settings.serviceListattr[a.id]][i][vi];
                        return d3.scaleLinear().domain(a.sub[0].range)(v === null ? undefined: v) || 0})));
                    array_normalize.name = h.name;
                    array_normalize.timestep =i;
                    return array_normalize;
                })});

            if (choice.url.includes('influxdb')){
                processResult = settings.processResult_influxdb;
                db = "influxdb";
                realTimesetting(false,"influxdb",true,sampleS);
            }else {
                db = "nagios";
                processResult = processResult_old;
                realTimesetting(false,undefined,true,sampleS);
            }


            if (!init)
                resetRequest();
            else
                initFunc();
            init = false;
           
        }
        function realTimesetting (option,db,init){
            let isRealtime = option;
            // getDataWorker.postMessage({action:'isRealtime',value:option,db: db});
            if (option){
                processData = eval('processData_'+db);
            }else{
                processData = db?settings[eval('processData_'+db)]:processData_old;
            }
            // if(!init)
            //     resetRequest();
        }
        function processData_influxdb(result, serviceName) {
            const serviceAttribute = serviceQuery[db][serviceName];
            const query_return = d3.keys(serviceAttribute);
            if (result) {
                let val = result.results;
                return d3.merge(query_return.map((s, i) => {
                    if (val[i].series) // no error
                    {
                        const subob = _.object(val[i].series[0].columns, val[i].series[0].values[0]);
                        if (subob.error === "None" || subob.error === null || serviceAttribute[s].type==='object')
                            return d3.range(serviceAttribute[s].numberOfEntries).map(d => {
                                let localVal,key;
                                try {
                                    localVal = subob[serviceAttribute[s].format2(d + 1)];
                                    key = serviceAttribute[s].format2(d + 1);
                                }catch(e){
                                    localVal = subob[serviceAttribute[s].format(d + 1)];
                                    key = serviceAttribute[s].format(d + 1);
                                }
                                if (localVal != null && localVal !== undefined) {
                                    if (serviceAttribute[s].type==='object') {
                                        let result_temp = string2JSON(localVal);
                                        if (result_temp.length)
                                            result_temp = d3.nest().key(function(uD){return uD[serviceAttribute[s].mainkey]}).entries( result_temp).map(u=>u.values[0]);
                                        return result_temp
                                    }
                                    return localVal * (serviceAttribute[s].rescale || 1);
                                }
                                else return undefined;
                            });
                        else
                            return d3.range(serviceAttribute[s].numberOfEntries).map(d => undefined);
                    } else {
                        return d3.range(serviceAttribute[s].numberOfEntries).map(d => undefined);
                    }
                }));
            }
            return d3.merge(query_return.map((s, i) => {
                    return d3.range(serviceAttribute[s].numberOfEntries).map(d => undefined);
            }));
        }
    }
 
    Loaddata.reset();
    Dataset.onUpdateFinish.push(function() {
        Loaddata.reset(true);
        console.log(Dataset.currentDataset);
        if (Loaddata.data.name)
        debugger;
            loadFile(Dataset.currentDataset);
    });
    return Loaddata;


}