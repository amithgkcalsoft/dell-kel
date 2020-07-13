import { Component, ComponentInterface, h , Element, Prop } from '@stencil/core';
import $ from "jquery";
import * as d3 from 'd3';
import _ from 'underscore';
// import { serviceLib } from '../../js/serviceLib';
import { serviceFunc } from '../../js/serviceFunc';
import { loadData } from '../../js/loadData';
import { Dataset } from '../../js/Dataset';
import { Config } from '../../js/config';

@Component({
  tag: 'page-component',
  styleUrl: 'page-component.css',
  shadow: true,
})
export class PageComponent implements ComponentInterface {
    @Prop()
    singleData: string;
  @Element() element: HTMLElement;
   yscale : any = {};
   completedata : Array<Object> = [];
   dataSetVal = Dataset();
    config = Config();
    loadAllData = loadData(this.dataSetVal);
  componentDidLoad(){
      debugger;  
    // console.log("Single data");
    // console.log(this.singleData);  
     console.log(serviceFunc);  
     console.log(this.loadAllData);  
    // this.loadData();
    let dataset = this.dataSetVal.dataset;
    let config = this.config;
    this.dataSetVal.update(this.dataSetVal.dataset).then(function() {
        debugger;
        config.updateDataset(dataset);
                })
  }
 
  loadData() {
    d3.json("./data/influxdb17Feb_2020_withoutJobLoad.json").then(function(response){
        debugger;
        console.log(response)
        this.completedata = response;
        this.loadata1(response);
    });
        
  }  

//   loadata1(data){
//     debugger;
//                 data['timespan'] = data.timespan.map(d=>new Date(d3.timeFormat('%a %b %d %X CDT %Y')(new Date(+d?+d:d.replace('Z','')))));
//                 _.without(Object.keys(data),'timespan').forEach(h=>{
//                     delete data[h].arrCPU_load;
//                     serviceLib.serviceLists.forEach((s,si)=>{
//                         if (data[h][serviceLib.serviceListattr[si]])
//                             data[h][serviceLib.serviceListattr[si]] = data.timespan.map((d,i)=>
//                                 data[h][serviceLib.serviceListattr[si]][i]? data[h][serviceLib.serviceListattr[si]][i].slice(0,s.sub.length).map(e=>e?e:undefined):d3.range(0,s.sub.length).map(e=>undefined));
//                         else
//                             data[h][serviceLib.serviceListattr[si]] = data.timespan.map(d=>d3.range(0,s.sub.length).map(e=>null));
//                     })
//                 });
//                 serviceFunc.updateDatainformation(data['timespan']);
//                 // console.log(data["compute-1-26"].arrFans_health[0])
//                 let sampleS = data;
    
//                 // make normalize data
//                 let tsnedata = {};
//                 hosts.forEach(h => {
//                     tsnedata[h.name] = sampleS.timespan.map((t, i) => {
//                         let array_normalize = _.flatten(serviceLib.serviceLists.map(a => d3.range(0, a.sub.length).map(vi => {
//                             let v = sampleS[h.name][serviceLib.serviceListattr[a.id]][i][vi];
//                             return d3.scaleLinear().domain(a.sub[0].range)(v === null ? undefined: v) || 0})));
//                         array_normalize.name = h.name;
//                         array_normalize.timestep =i;
//                         return array_normalize;
//                     })});
    
//                 if (choice.url.includes('influxdb')){
//                     processResult = processResult_influxdb;
//                     db = "influxdb";
//                     realTimesetting(false,"influxdb",true,sampleS);
//                 }else {
//                     db = "nagios";
//                     processResult = processResult_old;
//                     realTimesetting(false,undefined,true,sampleS);
//                 }
    
    
//                 if (!init)
//                     resetRequest();
//                 else
//                 this.buildChart();
//                 init = false;
//                 preloader(false)
//                 firstTime = false;
//             }
   
  buildChart() {
    debugger;
 
let dimensions=[];
let m = [40, 60, 10, 10];
let width = $("#Maincontent").width()-10;
let height = d3.max([document.body.clientHeight-150, 300]);
let w = width - m[1] - m[3];
let yscale = this.yscale;
let foreground : any = this.element.shadowRoot.querySelectorAll("#foreground")[0];
let highlighted : any = this.element.shadowRoot.querySelectorAll("#highlight")[0]; 
let background : any = this.element.shadowRoot.querySelectorAll("#background")[0];  
   let h = height - m[0] - m[2];
    let xscale = d3.scalePoint().range([0, w]).padding(0.3);
    let axis = d3.axisLeft().ticks(1+height/50); // vertical axis with the scale
    // Scale chart and canvas height  
    let chart = d3.select(this.element.shadowRoot.querySelectorAll("#chart")[0])
        .style("height", (h + m[0] + m[2]) + "px");

    chart.selectAll("canvas")
        .attr("width", w)
        .attr("height", h)
        .style("padding", m.join("px ") + "px");

        // Foreground canvas for primary view
    foreground = foreground.getContext('2d');
    foreground.globalCompositeOperation = "destination-over";
    foreground.strokeStyle = "rgba(0,100,160,0.1)";
    foreground.lineWidth = 1.7;
    // foreground.fillText("Loading...",w/2,h/2);

// Highlight canvas for temporary interactions
    highlighted = highlighted.getContext('2d');
    highlighted.strokeStyle = "rgba(0,100,160,1)";
    highlighted.lineWidth = 4;

// Background canvas
    background = background.getContext('2d');
    background.strokeStyle = "rgba(0,100,160,0.1)";
    background.lineWidth = 1.7;
    
    let svg = d3.select(this.element.shadowRoot.querySelectorAll("#chart")[0]).select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
    // let colorCluster  = d3.scaleOrdinal().range(d3.schemeCategory10);
    // var serviceLists = [{"text":"Temperature","id":0,"enable":true,"sub":[{"text":"CPU1 Temp","id":0,"enable":true,"idroot":0,"angle":5.834386356666759,"range":[3,98]},{"text":"CPU2 Temp","id":1,"enable":true,"idroot":0,"angle":0,"range":[3,98]},{"text":"Inlet Temp","id":2,"enable":true,"idroot":0,"angle":0.4487989505128276,"range":[3,98]}]},{"text":"Job_load","id":1,"enable":true,"sub":[{"text":"Job load","id":0,"enable":true,"idroot":1,"angle":1.2566370614359172,"range":[0,10]}]},{"text":"Memory_usage","id":2,"enable":true,"sub":[{"text":"Memory usage","id":0,"enable":true,"idroot":2,"angle":1.8849555921538759,"range":[0,99]}]},{"text":"Fans_speed","id":3,"enable":true,"sub":[{"text":"Fan1 speed","id":0,"enable":true,"idroot":3,"angle":2.4751942119192307,"range":[1050,17850]},{"text":"Fan2 speed","id":1,"enable":true,"idroot":3,"angle":2.9239931624320583,"range":[1050,17850]},{"text":"Fan3 speed","id":2,"enable":true,"idroot":3,"angle":3.372792112944886,"range":[1050,17850]},{"text":"Fan4 speed","id":3,"enable":true,"idroot":3,"angle":3.8215910634577135,"range":[1050,17850]}]},{"text":"Power_consum","id":4,"enable":true,"sub":[{"text":"Power consumption","id":0,"enable":true,"idroot":4,"angle":4.71238898038469,"range":[0,200]}]}];
    // var serviceFullList = serviceLists2serviceFullList(serviceLists);
    // function serviceLists2serviceFullList (serviceLists){
    //     let temp = [];
    //     serviceLists.forEach(s=>s.sub.forEach(sub=>{
    //         sub.idroot = s.id;
    //         sub.enable = s.enable&&(sub.enable===undefined?true:sub.enable);
    //         temp.push(sub);}));
    //     return temp;
    // }
let data : any = [
    {"CPU1 Temp":62,"CPU2 Temp":49,"Inlet Temp":17,"Job load":null,"Memory usage":6.565,"Fan1 speed":10080,"Fan2 speed":10080,"Fan3 speed":10080,"Fan4 speed":10080,"Power consumption":149,"Time":"2020-02-17T18:00:00.000Z","rack":"Rack 1","compute":"compute-1-1","group":"Rack 1","Cluster":0,"name":"compute-1-1, February 17 2020 23:30","id":"compute-1-1-0"}
];
data[0].Time = new Date(d3.timeFormat('%a %b %d %X CDT %Y')(new Date(+data[0].Time?+data[0].Time:data[0].Time.replace('Z',''))))
// let service_custom_added = [{text:'Time',id:-1,enable:true,isDate:true,class:"sorting_disabled"},{text:'Cluster',id:-2,enable:false,hide:true,
//     color:colorCluster,
//     axisCustom:{ticks:0,tickFormat:d=> `Group ${cluster_info[d].orderG+1}`,tickInvert:d=> cluster_info.find(c=>c.name===d).index}}];
// let serviceFullList_withExtra = _.flatten([service_custom_added,serviceFullList]);
let serviceFullList_withExtra = [{"text":"Time","id":-1,"enable":true,"isDate":true,"class":"sorting_disabled"},{"text":"Cluster","id":-2,"enable":false,"hide":true,"axisCustom":{"ticks":0}},{"text":"CPU1 Temp","id":0,"enable":true,"idroot":0,"angle":5.834386356666759,"range":[3,98]},{"text":"CPU2 Temp","id":1,"enable":true,"idroot":0,"angle":0,"range":[3,98]},{"text":"Inlet Temp","id":2,"enable":true,"idroot":0,"angle":0.4487989505128276,"range":[3,98]},{"text":"Job load","id":0,"enable":true,"idroot":1,"angle":1.2566370614359172,"range":[0,10]},{"text":"Memory usage","id":0,"enable":true,"idroot":2,"angle":1.8849555921538759,"range":[0,99]},{"text":"Fan1 speed","id":0,"enable":true,"idroot":3,"angle":2.4751942119192307,"range":[1050,17850]},{"text":"Fan2 speed","id":1,"enable":true,"idroot":3,"angle":2.9239931624320583,"range":[1050,17850]},{"text":"Fan3 speed","id":2,"enable":true,"idroot":3,"angle":3.372792112944886,"range":[1050,17850]},{"text":"Fan4 speed","id":3,"enable":true,"idroot":3,"angle":3.8215910634577135,"range":[1050,17850]},{"text":"Power consumption","id":0,"enable":true,"idroot":4,"angle":4.71238898038469,"range":[0,200]}];
   
    xscale.domain(dimensions = serviceFullList_withExtra.filter(function (s) {
      let k = s.text;
      let xtempscale = (((_.isDate(data[0][k])) && (yscale[k] = d3.scaleTime()
          .domain(d3.extent(data, function (d) {
              return d[k];
          }))
          .range([h, 0])) || (_.isNumber(data[0][k])) && (yscale[k] = d3.scaleLinear()
          // .domain(d3.extent(data, function (d) {
          //     return +d[k];
          // }))
          .domain(serviceFullList_withExtra.find(d=>d.text===k).range||[0,0])
          .range([h, 0]))));
      if(s.axisCustom)
          xtempscale.axisCustom = s.axisCustom;
      return s.enable?xtempscale:false;
  }).map(s=>s.text));

  this.updateDimension(svg , xscale , axis);

  let dta : any = this.singleData;
dta.Time = new Date(d3.timeFormat('%a %b %d %X CDT %Y')(new Date(+dta.Time?+dta.Time:dta.Time.replace('Z',''))))
let color = {
    h: 47.18749999999999,
l: 0.6078431372549019,
opacity: 0.05786516357883376,
s: 0.9600000000000002,
}

this.loadData();
//   this.brush(false);
this.path(dta, foreground, color,xscale ,dimensions);
  }
    
  
  

//    brush(isreview) {
//     debugger;
//     var actives = [],
//         extents = [];

//     svg.selectAll(".brush")
//         .filter(function(d) {
//             yscale[d].brushSelectionValue = d3.brushSelection(this);
//             return d3.brushSelection(this);
//         })
//         .each(function(d) {
//             // Get extents of brush along each active selection axis (the Y axes)
//             actives.push(d);
//             extents.push(d3.brushSelection(this).map(yscale[d].invert).sort((a,b)=>a-b));
//         });
//     // hack to hide ticks beyond extent
//     var b = d3.selectAll('.dimension').nodes()
//         .forEach(function(element, i) {
//             var dimension = d3.select(element).data()[0];
//             if (_.include(actives, dimension)) {
//                 var extent = extents[actives.indexOf(dimension)];
//                 d3.select(element)
//                     .selectAll('text')
//                     .style('font-weight', 'bold')
//                     .style('font-size', '13px')
//                     .style('display', function() {
//                         var value = d3.select(this).data()[0];
//                         return extent[0] <= value && value <= extent[1] ? null : "none"
//                     });
//             } else {
//                 d3.select(element)
//                     .selectAll('text')
//                     .style('font-size', null)
//                     .style('font-weight', null)
//                     .style('display', null);
//             }
//             d3.select(element)
//                 .selectAll('.label')
//                 .style('display', null);
//         });
//     ;

//     // bold dimensions with label
//     d3.selectAll('.label')
//         .style("font-weight", function(dimension) {
//             if (_.include(actives, dimension)) return "bold";
//             return null;
//         });

//     // Get lines within extents
//     var selected = [];
//     data
//         .forEach(function(d) {
//             if(!excluded_groups.find(e=>e===d.group))
//                 !actives.find(function(p, dimension) {
//                     return extents[dimension][0] > d[p] || d[p] > extents[dimension][1];
//                 }) ? selected.push(d) : null;
//         });
//     // free text search
//     var query = d3.select("#search").node().value;
//     if (query.length > 0) {
//         selected = search(selected, query);
//     }

//     if (selected.length < data.length && selected.length > 0) {
//         d3.select("#keep-data").attr("disabled", null);
//         d3.select("#exclude-data").attr("disabled", null);
//     } else {
//         d3.select("#keep-data").attr("disabled", "disabled");
//         d3.select("#exclude-data").attr("disabled", "disabled");
//     };

//     // total by food group
//     var tallies = _(selected)
//         .groupBy(function(d) { return d.group; });

//     // include empty groups
//         _(colors.domain()).each(function(v,k) {tallies[v] = tallies[v] || []; });
//     if(!isreview) {
//         complex_data_table_render = true;
//         complex_data_table(selected);
//     }
//     this.redraw(selected);
//     // Loadtostore();
// }

//  redraw(selected) {
//     if (selected.length < data.length && selected.length > 0) {
//         d3.select("#keep-data").attr("disabled", null);
//         d3.select("#exclude-data").attr("disabled", null);
//     } else {
//         d3.select("#keep-data").attr("disabled", "disabled");
//         d3.select("#exclude-data").attr("disabled", "disabled");
//     };

//     // total by food group
//     var tallies = _(selected)
//         .groupBy(function (d) {
//             return d.group;
//         });

//     // include empty groups
//     _(colors.domain()).each(function (v, k) {
//         tallies[v] = tallies[v] || [];
//     });

// debugger;
//     // Render selected lines
//     this.paths(selected, foreground, brush_count, true);
// }

//  paths(selected, ctx, count) {
//     debugger;
//         var n = selected.length,
//             i = 0,
//             opacity = d3.min([2/Math.pow(n,0.3),1]),
//             timer = (new Date()).getTime();
    
//         selection_stats(opacity, n, data.length);
    
//         //shuffled_data = _.shuffle(selected);
    
//         // complex_data_table(shuffled_data.slice(0,20));
//         shuffled_data = selected;
//         complex_data_table_render = true;
//         ctx.clearRect(0,0,w+1,h+1);
    
//         // render all lines until finished or a new brush event
//         function animloop(){
//             if (i >= n || count < brush_count) {
//                 timel.stop();
//                 return true;
//             }
//             var max = d3.min([i+render_speed, n]);
//             this.render_range(shuffled_data, i, max, opacity);
//             this.render_stats(max,n,render_speed);
//             i = max;
//             timer = optimize(timer);  // adjusts render_speed
//         };
//         if (timel)
//             timel.stop();
//         timel = d3.timer(animloop);
//         if(isChangeData)
//             axisPlot.dispatch('plot',selected);
//     }

//     render_range(selection, i, max, opacity) {
//         selection.slice(i,max).forEach(function(d) {
//             path(d, foreground, colorCanvas(selectedService==null?d.group:d[selectedService],opacity));
//             // if (animationtime){
//             //     timel.stop();
//             //     animationtime = false;
//             //     return true
//             // }
//         });
//     };

//      render_stats(i,n,render_speed) {
//         d3.select("#rendered-count").text(i);
//         d3.select("#rendered-bar")
//             .style("width", (100*i/n) + "%");
//         d3.select("#render-speed").text(render_speed);
//     }

     path(d, ctx, color,xscale,dimensions) {
        debugger;
        let yscale = this.yscale;

        if (color) ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.setLineDash([]);
        var x0 = xscale(dimensions[0])-15,
            y0 = yscale[dimensions[0]](d[dimensions[0]]);   // left edge
        ctx.moveTo(x0,y0);
        let valid = true;
        dimensions.map(function(p) {
            var x = xscale(p),
                y = yscale[p](d[p]);
            if (y===undefined) {
                if (valid) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x0,y0);
                    ctx.setLineDash([5, 15]);
                }
                valid = false;
            }else if (valid) {
                var cp1x = x - 0.5 * (x - x0);
                var cp1y = y0;
                var cp2x = x - 0.5 * (x - x0);
                var cp2y = y;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                x0 = x;
                y0 = y;
            }else {
                var cp1x = x - 0.5 * (x - x0);
                var cp1y = y0;
                var cp2x = x - 0.5 * (x - x0);
                var cp2y = y;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(x,y);
                valid = true;
                x0 = x;
                y0 = y;
            }
        });
        ctx.lineTo(x0+15, y0);                               // right edge
        ctx.stroke();
    };

   updateDimension(svg,xscale , axis) {
     let dimensions = ["Time","CPU1 Temp","CPU2 Temp","Inlet Temp","Memory usage","Fan1 speed","Fan2 speed","Fan3 speed","Fan4 speed","Power consumption"];
     let getScale = this.getScale;
     let yscale = this.yscale;
   svg.selectAll(".dimension")
        .data(dimensions,d=>d).join(enter => {
            const new_dim = enter.append("svg:g")
                .attr("class", "dimension")
                .attr("transform", function (d) {
                    return "translate(" + xscale(d) + ")";
                })
                .call(d3.drag()
                    // .on("start", this.dragstart)
                    // .on("drag", this.dragged)
                    // .on("end", this.dragend)
                    );
                // Add an axis and title.
                new_dim.append("svg:g")
                .attr("class", "axis")
                .attr("transform", "translate(0,0)")
                .each(function (d) {
                    return d3.select(this).call(getScale(d, axis , yscale));
                })
                .append("svg:text")
                    .attr("text-anchor", "start")
                    .style('transform','rotate(-15deg) translate(-5px,-6px)')
                // .attr("y", function(d,i) { return i%2 == 0 ? -14 : -30 } )
                .attr("y", -14)
                .attr("x", 0)
                .attr("class", "label")
                .text(String)
                .append("title")
                .text("Click to invert. Drag to reorder");
            // Add violinplot holder
                new_dim.append("svg:g")
                    .attr("class", "plotHolder")
                    .attr("transform", "translate(0,0)")
            // Add and store a brush for each axis.
                // new_dim.append("svg:g")
                // .attr("class", "brush")
                // .each(function (d) {
                //     d3.select(this).call(yscale[d].brush = this.getBrush(d));
                // })
                // .selectAll("rect")
                // .style("visibility", null)
                // .attr("x", -23)
                // .attr("width", 36)
                // .append("title")
                // .text("Drag up or down to brush along this axis");

                new_dim.selectAll(".extent")
                .append("title")
                .text("Drag or resize this filter");
                return new_dim;
            },
            update =>{
                // Add an axis and title.
                update.select(".axis")
                    .attr("transform", "translate(0,0)")
                    .each(function (d) {
                        return d3.select(this).call(getScale(d , axis ,yscale));
                    });
                // update.select().select('.background')
            return  update.attr("transform", function (d) {
                return "translate(" + xscale(d) + ")";});
            },exit => exit.remove());
}

 getScale(d , axis , yscale) {
  let axisrender =  axis.scale(yscale[d]);
  let height = d3.max([document.body.clientHeight-150, 300]);
  if(yscale[d].axisCustom) {
      if (yscale[d].axisCustom.ticks)
          axisrender = axisrender.ticks(yscale[d].axisCustom.ticks)
      if (yscale[d].axisCustom.tickFormat)
          axisrender = axisrender.tickFormat(yscale[d].axisCustom.tickFormat)
  }else{
      axisrender = axisrender.ticks(1 + height / 50);
      axisrender = axisrender.tickFormat(undefined)
  }
  return axisrender;
}

  render() {
    return (
    
         <div id="chart">
        <canvas id="background"></canvas>
        <canvas id="foreground"></canvas>
        <canvas id="highlight"></canvas>
        <svg></svg>
    </div>
   
    );
  }

}
