<<<<<<< HEAD
import { Component, ComponentInterface, h, Element, Prop } from "@stencil/core";
import $ from "jquery";
import * as d3 from "d3";
import _ from "underscore";
=======
import {
  Component,
  ComponentInterface,
  h,
  Element,
  Prop,
  Watch,
  Host,
} from "@stencil/core";
import * as d3 from "d3";
import _ from "underscore";
import { main } from "../../js/main";
import { setting } from "../../js/setting";
import { myServicee } from "../../services/my-service";
>>>>>>> features
@Component({
  tag: "parallel-coordinates",
  styleUrl: "parallel-coordinates.css",
  shadow: true,
})
export class ParallelCoordinates implements ComponentInterface {
  @Prop()
  singleData: string;
<<<<<<< HEAD
  @Element() element: HTMLElement;
  yscale: any = {};
  completedata: Array<Object> = [];
  componentDidLoad() {
    this.buildChart();
  }
  buildChart() {
    debugger;

    let dimensions = [];
    let m = [40, 60, 10, 10];
    let width = $("#Maincontent").width() - 10;
    let height = d3.max([document.body.clientHeight - 150, 300]);
    let w = width - m[1] - m[3];
    let yscale = this.yscale;
    let foreground: any = this.element.shadowRoot.querySelectorAll(
      "#foreground"
    )[0];
    let highlighted: any = this.element.shadowRoot.querySelectorAll(
      "#highlight"
    )[0];
    let background: any = this.element.shadowRoot.querySelectorAll(
      "#background"
    )[0];
    let h = height - m[0] - m[2];
    let xscale = d3.scalePoint().range([0, w]).padding(0.3);
    let axis = d3.axisLeft().ticks(1 + height / 50); // vertical axis with the scale
    // Scale chart and canvas height
    let chart = d3
      .select(this.element.shadowRoot.querySelectorAll("#chart")[0])
      .style("height", h + m[0] + m[2] + "px");

    chart
      .selectAll("canvas")
      .attr("width", w)
      .attr("height", h)
      .style("padding", m.join("px ") + "px");

    // Foreground canvas for primary view
    foreground = foreground.getContext("2d");
    foreground.globalCompositeOperation = "destination-over";
    foreground.strokeStyle = "rgba(0,100,160,0.1)";
    foreground.lineWidth = 1.7;
    // foreground.fillText("Loading...",w/2,h/2);

    // Highlight canvas for temporary interactions
    highlighted = highlighted.getContext("2d");
    highlighted.strokeStyle = "rgba(0,100,160,1)";
    highlighted.lineWidth = 4;

    // Background canvas
    background = background.getContext("2d");
    background.strokeStyle = "rgba(0,100,160,0.1)";
    background.lineWidth = 1.7;

    let svg = d3
      .select(this.element.shadowRoot.querySelectorAll("#chart")[0])
      .select("svg")
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
    let data: any = [
      {
        "CPU1 Temp": 62,
        "CPU2 Temp": 49,
        "Inlet Temp": 17,
        "Job load": null,
        "Memory usage": 6.565,
        "Fan1 speed": 10080,
        "Fan2 speed": 10080,
        "Fan3 speed": 10080,
        "Fan4 speed": 10080,
        "Power consumption": 149,
        Time: "2020-02-17T18:00:00.000Z",
        rack: "Rack 1",
        compute: "compute-1-1",
        group: "Rack 1",
        Cluster: 0,
        name: "compute-1-1, February 17 2020 23:30",
        id: "compute-1-1-0",
      },
    ];
    data[0].Time = new Date(
      d3.timeFormat("%a %b %d %X CDT %Y")(
        new Date(+data[0].Time ? +data[0].Time : data[0].Time.replace("Z", ""))
      )
    );
    // let service_custom_added = [{text:'Time',id:-1,enable:true,isDate:true,class:"sorting_disabled"},{text:'Cluster',id:-2,enable:false,hide:true,
    //     color:colorCluster,
    //     axisCustom:{ticks:0,tickFormat:d=> `Group ${cluster_info[d].orderG+1}`,tickInvert:d=> cluster_info.find(c=>c.name===d).index}}];
    // let serviceFullList_withExtra = _.flatten([service_custom_added,serviceFullList]);
    let serviceFullList_withExtra = [
      {
        text: "Time",
        id: -1,
        enable: true,
        isDate: true,
        class: "sorting_disabled",
      },
      {
        text: "Cluster",
        id: -2,
        enable: false,
        hide: true,
        axisCustom: { ticks: 0 },
      },
      {
        text: "CPU1 Temp",
        id: 0,
        enable: true,
        idroot: 0,
        angle: 5.834386356666759,
        range: [3, 98],
      },
      {
        text: "CPU2 Temp",
        id: 1,
        enable: true,
        idroot: 0,
        angle: 0,
        range: [3, 98],
      },
      {
        text: "Inlet Temp",
        id: 2,
        enable: true,
        idroot: 0,
        angle: 0.4487989505128276,
        range: [3, 98],
      },
      {
        text: "Job load",
        id: 0,
        enable: true,
        idroot: 1,
        angle: 1.2566370614359172,
        range: [0, 10],
      },
      {
        text: "Memory usage",
        id: 0,
        enable: true,
        idroot: 2,
        angle: 1.8849555921538759,
        range: [0, 99],
      },
      {
        text: "Fan1 speed",
        id: 0,
        enable: true,
        idroot: 3,
        angle: 2.4751942119192307,
        range: [1050, 17850],
      },
      {
        text: "Fan2 speed",
        id: 1,
        enable: true,
        idroot: 3,
        angle: 2.9239931624320583,
        range: [1050, 17850],
      },
      {
        text: "Fan3 speed",
        id: 2,
        enable: true,
        idroot: 3,
        angle: 3.372792112944886,
        range: [1050, 17850],
      },
      {
        text: "Fan4 speed",
        id: 3,
        enable: true,
        idroot: 3,
        angle: 3.8215910634577135,
        range: [1050, 17850],
      },
      {
        text: "Power consumption",
        id: 0,
        enable: true,
        idroot: 4,
        angle: 4.71238898038469,
        range: [0, 200],
      },
    ];

    xscale.domain(
      (dimensions = serviceFullList_withExtra
        .filter(function (s) {
          let k = s.text;
          let xtempscale =
            (_.isDate(data[0][k]) &&
              (yscale[k] = d3
                .scaleTime()
                .domain(
                  d3.extent(data, function (d) {
                    return d[k];
                  })
                )
                .range([h, 0]))) ||
            (_.isNumber(data[0][k]) &&
              (yscale[k] = d3
                .scaleLinear()
                // .domain(d3.extent(data, function (d) {
                //     return +d[k];
                // }))
                .domain(
                  serviceFullList_withExtra.find((d) => d.text === k).range || [
                    0,
                    0,
                  ]
                )
                .range([h, 0])));
          if (s.axisCustom) xtempscale.axisCustom = s.axisCustom;
          return s.enable ? xtempscale : false;
        })
        .map((s) => s.text))
    );

    this.updateDimension(svg, xscale, axis);

    let dta: any = this.singleData;
    dta.Time = new Date(
      d3.timeFormat("%a %b %d %X CDT %Y")(
        new Date(+dta.Time ? +dta.Time : dta.Time.replace("Z", ""))
      )
    );
    let color = {
      h: 47.18749999999999,
      l: 0.6078431372549019,
      opacity: 0.05786516357883376,
      s: 0.9600000000000002,
    };

    //   this.brush(false);
    this.path(dta, foreground, color, xscale, dimensions);
  }
  path(d, ctx, color, xscale, dimensions) {
    debugger;
    let yscale = this.yscale;

    if (color) ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.setLineDash([]);
    var x0 = xscale(dimensions[0]) - 15,
      y0 = yscale[dimensions[0]](d[dimensions[0]]); // left edge
    ctx.moveTo(x0, y0);
    let valid = true;
    dimensions.map(function (p) {
      var x = xscale(p),
        y = yscale[p](d[p]);
      if (y === undefined) {
        if (valid) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.setLineDash([5, 15]);
        }
        valid = false;
      } else if (valid) {
        var cp1x = x - 0.5 * (x - x0);
        var cp1y = y0;
        var cp2x = x - 0.5 * (x - x0);
        var cp2y = y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        x0 = x;
        y0 = y;
      } else {
        var cp1x = x - 0.5 * (x - x0);
        var cp1y = y0;
        var cp2x = x - 0.5 * (x - x0);
        var cp2y = y;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(x, y);
        valid = true;
        x0 = x;
        y0 = y;
      }
    });
    ctx.lineTo(x0 + 15, y0); // right edge
    ctx.stroke();
  }

  updateDimension(svg, xscale, axis) {
    let dimensions = [
      "Time",
      "CPU1 Temp",
      "CPU2 Temp",
      "Inlet Temp",
      "Memory usage",
      "Fan1 speed",
      "Fan2 speed",
      "Fan3 speed",
      "Fan4 speed",
      "Power consumption",
    ];
    let getScale = this.getScale;
    let yscale = this.yscale;
    svg
      .selectAll(".dimension")
      .data(dimensions, (d) => d)
      .join(
        (enter) => {
          const new_dim = enter
            .append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function (d) {
              return "translate(" + xscale(d) + ")";
            })
            .call(
              d3.drag()
              // .on("start", this.dragstart)
              // .on("drag", this.dragged)
              // .on("end", this.dragend)
            );
          // Add an axis and title.
          new_dim
            .append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(0,0)")
            .each(function (d) {
              return d3.select(this).call(getScale(d, axis, yscale));
            })
            .append("svg:text")
            .attr("text-anchor", "start")
            .style("transform", "rotate(-15deg) translate(-5px,-6px)")
            // .attr("y", function(d,i) { return i%2 == 0 ? -14 : -30 } )
            .attr("y", -14)
            .attr("x", 0)
            .attr("class", "label")
            .text(String)
            .append("title")
            .text("Click to invert. Drag to reorder");
          // Add violinplot holder
          new_dim
            .append("svg:g")
            .attr("class", "plotHolder")
            .attr("transform", "translate(0,0)");
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

          new_dim
            .selectAll(".extent")
            .append("title")
            .text("Drag or resize this filter");
          return new_dim;
        },
        (update) => {
          // Add an axis and title.
          update
            .select(".axis")
            .attr("transform", "translate(0,0)")
            .each(function (d) {
              return d3.select(this).call(getScale(d, axis, yscale));
            });
          // update.select().select('.background')
          return update.attr("transform", function (d) {
            return "translate(" + xscale(d) + ")";
          });
        },
        (exit) => exit.remove()
      );
  }

  getScale(d, axis, yscale) {
    let axisrender = axis.scale(yscale[d]);
    let height = d3.max([document.body.clientHeight - 150, 300]);
    if (yscale[d].axisCustom) {
      if (yscale[d].axisCustom.ticks)
        axisrender = axisrender.ticks(yscale[d].axisCustom.ticks);
      if (yscale[d].axisCustom.tickFormat)
        axisrender = axisrender.tickFormat(yscale[d].axisCustom.tickFormat);
    } else {
      axisrender = axisrender.ticks(1 + height / 50);
      axisrender = axisrender.tickFormat(undefined);
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
=======
  @Prop()
  completedata: Array<Object>;
  @Element() element: HTMLElement;

  yscale: any = {};
  mains = main();
  settings = setting();

  @Watch("completedata")
  watchHandler(newValue) {
    let elementsObj = myServicee.setCanvusElements(this.element);
    if (newValue != undefined) {
      let serviceFullList_withExtra = this.settings.getServiceFLE();
      this.mains.initFunc(newValue, serviceFullList_withExtra, elementsObj);
    }
  }

  componentDidLoad() {
    let fulldata = this;
    d3.csv("./data/sampleData.csv").then(function (data) {
      data = data.slice(0, 66);

      data.forEach((d) => {
        d.Time = new Date(
          d3.timeFormat("%a %b %d %X CDT %Y")(
            new Date(+d.Time ? +d.Time : d.Time.replace("Z", ""))
          )
        );
        for (const property in d) {
          if (
            property != "Time" &&
            property != "compute" &&
            property != "group" &&
            property != "id" &&
            property != "name" &&
            property != "rack"
          )
            d[property] = JSON.parse(d[property]);
        }
      });
      fulldata.completedata = data;
    });
  }
  componentWillLoad() {
    this.watchHandler(this.completedata);
  }
  render() {
    return (
      <Host>
        <div id="chart">
          <canvas id="background"></canvas>
          <canvas id="foreground"></canvas>
          <canvas id="highlight"></canvas>
          <svg width="900" height="300"></svg>
        </div>
        <div>
          <label> Show: </label>
          <select id="overlayPlot">
            <option value="none">None</option>
            <option value="tick" selected>
              ticks
            </option>
            <option value="violin">Violin plots</option>
            <option value="violin+tick">Violin plots + ticks</option>
          </select>
        </div>
      </Host>
>>>>>>> features
    );
  }
}
