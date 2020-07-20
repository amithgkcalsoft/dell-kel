import $ from "jquery";
import * as d3 from "d3";
import { setting } from "../js/setting";
import { myServicee } from "../services/my-service";
import _ from "underscore";
import { viiolinplot } from "../js/violinChart";

export function main() {
  let width, height;
  let settings = setting();
  let m = [40, 60, 10, 10],
    w,
    h,
    xscale,
    yscale = {},
    dragging = {},
    line = d3.line(),
    axis,
    data,
    foreground,
    foreground_opacity = 1,
    background,
    highlighted,
    dimensions,
    legend,
    render_speed = 50,
    brush_count = 0,
    excluded_groups = [],
    svg,
    g,
    listMetric;

  //legend prt
  let violiin_chart;
  let axisPlot;
  let isTick = true;
  let isChangeData = false;
  var levelStep = 4;
  let arrThresholds;
  var selectedService = "CPU1 Temp";
  var orderLegend;
  var svgLengend;
  let timel;
  let shuffled_data = [];
  let selected = [];
  //read file
  var thresholds = [
    [3, 98],
    [0, 10],
    [0, 99],
    [1050, 17850],
    [0, 200],
  ];
  var chosenService = 0;
  var conf = {};
  conf.serviceList = settings.serviceList;
  conf.serviceLists = settings.serviceLists;
  conf.serviceListattr = settings.serviceListattr;
  conf.serviceListattrnest = settings.serviceListattrnest;

  //   let foreground = this.element.shadowRoot.querySelectorAll("#foreground")[0];
  //   let highlighted = this.element.shadowRoot.querySelectorAll("#highlight")[0];
  //   let background = this.element.shadowRoot.querySelectorAll("#background")[0];

  let undefinedValue = undefined;
  let undefinedColor = "#666";
  let colorscale = d3.scaleOrdinal(d3.schemeCategory10);
  let colors = d3.scaleOrdinal();
  let color, opa;
  /// drawLegend *****************************************************************
  let legendw = 80;
  let legendh = 20;
  let barw = 300;
  let barScale = d3.scaleLinear();
  let db = "nagios";

  let dataInformation = {
    filename: "",
    size: 0,
    timerange: [],
    interval: "",
    totalstep: 0,
    hostsnum: 0,
    datanum: 0,
  };

  //var arrColor = ['#00c', '#1a9850','#fee08b', '#d73027'];
  // var arrColor = ['#110066','#4400ff', '#00cccc', '#00dd00','#ffcc44', '#ff0000', '#660000'];
  // let arrColor = colorScaleList.customFunc('rainbow');
  // let arrColor = colorScaleList.d3colorChosefunc('Greys');
  let arrColor = [
    "#000066",
    "#0000ff",
    "#1a9850",
    "#ddee00",
    "#ffcc44",
    "#ff0000",
    "#660000",
  ];
  let colorCluster = d3.scaleOrdinal().range(d3.schemeCategory10);

  let service_custom_added = [];
  let serviceFullList_withExtraa = [];

  function object2Data(ob) {
    return d3.entries(ob).filter((d) => d.key !== "timespan");
  }

  function object2DataPrallel(ob) {
    let temp = object2Data(ob);
    let count = 0;
    let newdata = [];
    let comlength = ob.timespan.length;
    temp.forEach((com) => {
      let namet = com.key.split("-");
      let rack, host;
      let ishpcc = true;
      if (namet.length > 1) {
        rack = namet[1];
        host = namet[2];
      } else {
        namet = com.key.split("."); // IP?
        if (namet.length > 1) {
          rack = namet[2];
          host = namet[3];
        } else {
          rack = com.key;
          host = com.key;
          ishpcc = false;
        }
      }
      for (let i = 0; i < comlength; i++) {
        let eachIn = {};
        let validkey = true;
        settings.serviceListattrnest.forEach((s) => {
          s.sub.forEach((sub, sj) => {
            eachIn[sub] = com.value[s.key][i][sj];
          });
        });
        if (validkey) {
          eachIn[settings.stickKey] =
            settings.stickKey === settings.TIMEKEY
              ? ob.timespan[i]
              : ob.timespan.length - 1 - i;
          eachIn.rack = ishpcc ? "Rack " + rack : rack;
          eachIn.compute = com.key;
          eachIn.group = ishpcc ? "Rack " + rack : rack;
          eachIn.Cluster = com.value["arrcluster"]
            ? com.value["arrcluster"][i]
            : 0;
          eachIn.name =
            com.key + ", " + settings.stickKeyFormat(eachIn[settings.stickKey]);
          eachIn.id = com.key + "-" + count;
          count++;
          newdata.push(eachIn);
        }
      }
    });
    return newdata;
  }

  function getBrush(d) {
    return d3
      .brushY(yscale[d])
      .extent([
        [-10, 0],
        [10, h],
      ])
      .on("brush", () => {
        brush(true);
      })
      .on("end", () => {
        brush();
      });
  }
  function dragstart(d) {
    let allElem = myServicee.getCanvusElements();
    dragging[d] = this.__origin__ = xscale(d);
    this.__dragged__ = false;
    d3.select(allElem.foreground).style("opacity", "0.35");
  }

  function dragged(d) {
    dragging[d] = Math.min(w, Math.max(0, (this.__origin__ += d3.event.dx)));

    dimensions.sort(function (a, b) {
      return position(a) - position(b);
    });
    xscale.domain(dimensions);
    // reorderDimlist();
    svg.selectAll(".dimension").attr("transform", function (d) {
      return "translate(" + position(d) + ")";
    });
    this.__dragged__ = true;
    //brush();
    // Feedback for axis deletion if dropped
    if (dragging[d] < 12 || dragging[d] > w - 12) {
      d3.select(this).select(".background").style("fill", "#b00");
    } else {
      d3.select(this).select(".background").style("fill", null);
    }
  }
  function position(d) {
    var v = dragging[d];
    return v == null ? xscale(d) : v;
  }
  function dragend(d) {
    let allElem = myServicee.getCanvusElements();
    if (!this.__dragged__) {
      // no movement, invert axis
      var extent = invert_axis(d, this);
    } else {
      // reorder axes
      d3.select(this)
        .transition()
        .attr("transform", "translate(" + xscale(d) + ")");

      // var extent = yscale[d].brush.extent();
      var extent = d3.brushSelection(this);
      if (extent) extent = extent.map(yscale[d].invert).sort((a, b) => a - b);
    }

    // remove axis if dragged all the way left
    if (dragging[d] < 12 || dragging[d] > w - 12) {
      remove_axis(d, g);
    }

    // TODO required to avoid a bug
    xscale.domain(dimensions);
    update_ticks(d, extent);

    // reorderDimlist();
    // rerender
    d3.select(allElem.foreground).style("opacity", foreground_opacity);
    brush();
    delete this.__dragged__;
    delete this.__origin__;
    delete dragging[d];
  }
  function remove_axis(d, g) {
    const target = serviceFullList_withExtraa.find((e) => e.text === d);

    target.enable = false;
    dimensions = _.difference(dimensions, [d]);
    xscale.domain(dimensions);
    g = g.data(dimensions, (d) => d);
    g.attr("transform", function (p) {
      return "translate(" + position(p) + ")";
    });
    g.exit().remove();
    update_ticks();
  }
  function reorderDimlist() {
    // reorder list
    let pre = 0;
    let next = 0;
    dimensions.find((dim) => {
      const pos = _.indexOf(listMetric.toArray(), dim);
      next = pos != -1 ? pos : next;
      if (next < pre) return true;
      else pre = next;
      return false;
    });
    if (next < pre) {
      let order_list = listMetric.toArray();
      swap(order_list, pre, next);
      listMetric.sort(order_list);
    }
  }
  function invert_axis(d) {
    // save extent before inverting
    var extent;
    svg
      .selectAll(".brush")
      .filter((ds) => ds === d)
      .filter(function (ds) {
        yscale[ds].brushSelectionValue = d3.brushSelection(this);
        return d3.brushSelection(this);
      })
      .each(function (d) {
        // Get extents of brush along each active selection axis (the Y axes)
        extent = d3.brushSelection(this).map(yscale[d].invert);
      });

    if (yscale[d].inverted == true) {
      yscale[d].range([h, 0]);
      d3.selectAll(".label")
        .filter(function (p) {
          return p == d;
        })
        .style("text-decoration", null);
      yscale[d].inverted = false;
    } else {
      yscale[d].range([0, h]);
      d3.selectAll(".label")
        .filter(function (p) {
          return p == d;
        })
        .style("text-decoration", "underline");
      yscale[d].inverted = true;
    }
    return extent;
  }
  function getScale(d) {
    let axisrender = axis.scale(yscale[d]);
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
  function updateDimension() {
    g = svg
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
              d3
                .drag()
                .on("start", dragstart)
                .on("drag", dragged)
                .on("end", dragend)
            );
          // Add an axis and title.
          new_dim
            .append("svg:g")
            .attr("class", "axis")
            .attr("transform", "translate(0,0)")
            .each(function (d) {
              return d3.select(this).call(getScale(d));
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

          // .append('rect')
          // .attr('class','background')
          // .style('fill','rgba(255,255,255,0.38)')
          // .style('transform','translate(-50%,0)')
          // .attrs({width:violiin_chart.graphicopt().width,height:violiin_chart.graphicopt().height});
          // Add and store a brush for each axis.
          new_dim
            .append("svg:g")
            .attr("class", "brush")
            .each(function (d) {
              d3.select(this).call((yscale[d].brush = getBrush(d)));
            })
            .selectAll("rect")
            .style("visibility", null)
            .attr("x", -23)
            .attr("width", 36)
            .append("title")
            .text("Drag up or down to brush along this axis");

          new_dim
            .selectAll(".extent")
            .append("title")
            .text("Drag or resize this filter");
          return new_dim;
        },
        (update) => {
          isChangeData = true;
          // Add an axis and title.
          update
            .select(".axis")
            .attr("transform", "translate(0,0)")
            .each(function (d) {
              return d3.select(this).call(getScale(d));
            });
          // update.select().select('.background')
          return update.attr("transform", function (d) {
            return "translate(" + xscale(d) + ")";
          });
        },
        (exit) => exit.remove()
      );
  }
  function hide_ticks(allElementsObj) {
    d3.selectAll(
      allElementsObj.element.shadowRoot.querySelectorAll(".dimension .axis g")
    ).style("display", "none");
    //d3.selectAll(".axis path").style("display", "none");
    d3.selectAll(
      allElementsObj.element.shadowRoot.querySelectorAll(".background")
    ).style("visibility", "hidden");
    d3.selectAll("#hide-ticks").attr("disabled", "disabled");
    d3.selectAll("#show-ticks").attr("disabled", null);
    isTick = false;
  }
  function show_ticks(allElementsObj) {
    d3.selectAll(
      allElementsObj.element.shadowRoot.querySelectorAll(".dimension .axis g")
    ).style("display", null);
    //d3.selectAll(".axis path").style("display", null);
    d3.selectAll(
      allElementsObj.element.shadowRoot.querySelectorAll(".background")
    ).style("visibility", null);
    d3.selectAll("#show-ticks").attr("disabled", "disabled");
    d3.selectAll("#hide-ticks").attr("disabled", null);
    isTick = true;
  }
  function plotViolin(allElementsObj) {
    debugger;
    selected = shuffled_data;
    let cluster_info = [];
    let violin_w = Math.min(
      w / dimensions.length / (cluster_info.length || 1),
      50
    );
    violiin_chart.graphicopt({
      width: violin_w * (cluster_info.length || 1),
      height: h,
      single_w: Math.max(violin_w, 50),
    });
    setTimeout(() => {
      let dimGlobal = [0, 0];
      let dimensiondata = {};
      let vMax;
      dimensions.forEach((d) => {
        let s = settings.serviceFullList.find((s) => s.text === d);
        let color = () => "#ffffff";
        if (s) {
          let value = [];
          if (cluster_info.length) {
            let cs = {};
            cluster_info.forEach((c, ci) => (cs[ci] = []));
            selected.forEach((e) => cs[e.Cluster].push(e[d]));
            value = cluster_info.map((c, ci) =>
              settings.axisHistogram(c.name, s.range, cs[ci])
            );
            vMax = d3.max(value, (d) => d[1]);
            dimGlobal[1] = Math.max(vMax, dimGlobal[1]);
            color = colorCluster;
          } else {
            value = [
              settings.axisHistogram(
                s.text,
                s.range,
                selected.map((e) => e[d])
              ),
            ];
            vMax = d3.max(value[0], (d) => d[1]);
            dimGlobal[1] = Math.max(vMax, dimGlobal[1]);
          }
          dimensiondata[d] = { key: s, value: value, color: color };
        }
      });
      let dims = d3
        .selectAll(
          allElementsObj.element.shadowRoot.querySelectorAll(
            ".dimension > .plotHolder"
          )
        )
        .each(function (d) {
          if (dimensiondata[d]) {
            let s = dimensiondata[d].key;
            violiin_chart
              .graphicopt({
                customrange: s.range,
                rangeY: dimGlobal,
                color: dimensiondata[d].color,
              })
              .data(dimensiondata[d].value)
              .draw(d3.select(this), allElementsObj);
          }
        });
    }, 0);
  }
  function onChangeOfShow(allElementsObj) {
    debugger;
    axisPlot = d3.select(allElementsObj.overlayPlot).on("change", function () {
      debugger;
      switch ($(this).val()) {
        case "none":
          d3.selectAll(
            allElementsObj.element.shadowRoot.querySelectorAll(
              ".dimension .plotHolder"
            )
          )
            .selectAll("*")
            .remove();
          d3.select(this).on("plot", () => {});
          hide_ticks(allElementsObj);
          foreground_opacity = 1;
          break;
        case "tick":
          d3.selectAll(
            allElementsObj.element.shadowRoot.querySelectorAll(
              ".dimension .plotHolder"
            )
          )
            .selectAll("*")
            .remove();
          d3.select(this).on("plot", () => {});
          show_ticks(allElementsObj);
          foreground_opacity = 1;
          break;
        case "violin":
          violiin_chart.graphicopt({ isStack: false });
          d3.select(this).on("plot", plotViolin(allElementsObj));
          hide_ticks(allElementsObj);
          foreground_opacity = 0.5;
          break;
        case "violin+tick":
          violiin_chart.graphicopt({ isStack: false });
          d3.select(this).on("plot", plotViolin(allElementsObj));
          show_ticks(allElementsObj);
          foreground_opacity = 0.5;
          break;
      }
      d3.select(this).dispatch("plot");
      d3.select(allElementsObj.foreground).style("opacity", foreground_opacity);
    });
  }

  function initFunc(sampleS, serviceFullList_withExtra, allElementsObj) {
    debugger;
    // d3.viiolinplot = viiolinplot;
    violiin_chart = viiolinplot().graphicopt({
      width: 160,
      height: 25,
      opt: { dataformated: true },
      stroke: "white",
      isStack: false,
      midleTick: false,
      tick: false,
      showOutlier: false,
      direction: "v",
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      middleAxis: { "stroke-width": 0 },
      ticks: { "stroke-width": 0.5 },
      tick: { visibile: false },
    });
    serviceFullList_withExtraa = serviceFullList_withExtra;
    let allElem = myServicee.getCanvusElements();
    drawFiltertable(serviceFullList_withExtra);
    onChangeOfShow(allElementsObj);
    setColorsAndThresholds("CPU1 Temp", serviceFullList_withExtra);
    dimensions = [];
    timel;
    if (timel) timel.stop();
    width = $("#Maincontent").width() - 10;
    height = d3.max([document.body.clientHeight - 150, 300]);
    w = width - m[1] - m[3];
    h = height - m[0] - m[2];
    xscale = d3.scalePoint().range([0, w]).padding(0.3);
    axis = d3.axisLeft().ticks(1 + height / 50); // vertical axis with the scale
    // Scale chart and canvas height
    let chart = d3
      .select(allElem.chart)
      .style("height", h + m[0] + m[2] + "px");

    chart
      .selectAll("canvas")
      .attr("width", w)
      .attr("height", h)
      .style("padding", m.join("px ") + "px");

    // Foreground canvas for primary view
    // let foreground = document.querySelector("#foreground").getContext("2d");
    foreground = allElem.foreground;
    foreground = foreground.getContext("2d");
    foreground.globalCompositeOperation = "destination-over";
    foreground.strokeStyle = "rgba(0,100,160,0.1)";
    foreground.lineWidth = 1.7;
    // foreground.fillText("Loading...",w/2,h/2);

    // Highlight canvas for temporary interactions
    let highlighted = allElem.highlighted;
    highlighted = highlighted.getContext("2d");
    highlighted.strokeStyle = "rgba(0,100,160,1)";
    highlighted.lineWidth = 4;

    // Background canvas
    let background = allElem.background;
    background = background.getContext("2d");
    background.strokeStyle = "rgba(0,100,160,0.1)";
    background.lineWidth = 1.7;

    // svgLengend = d3.select('#colorContinuos').append('div').append('svg')
    //     .attr("class", "legendView")
    //     .attr("width", 0)
    //     .attr("height", 0)
    //     .style('display','none');
    // SVG for ticks, labels, and interactions
    svg = d3
      .select(allElem.chart)
      .select("svg")
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    // svg.selectAll("*").remove();
    // Load the data and visualization

    // Load the data and visualization

    // Convert quantitative scales to floats
    // data = object2DataPrallel(sampleS);
    data = sampleS;
    console.log("sampleS");
    console.log(sampleS);
    console.log(data);
    // Extract the list of numerical dimensions and create a scale for each.
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

    d3.select("#search").attr(
      "placeholder",
      `Search host e.g ${data[0].compute}`
    );
    // Add a group element for each dimension.
    updateDimension();

    // legend = create_legend(colors, brush);
    if (!settings.serviceFullList.find((d) => d.text === selectedService))
      selectedService = settings.serviceFullList[0].text;
    // const selecteds = d3
    //   .select("#axisSetting")
    //   .select("tbody")
    //   .selectAll("tr")
    //   .filter((d) => d.arr === selectedService)
    //   .select('input[type="radio"]')
    //   .property("checked", true);
    // _.bind(selecteds.on("change"), selecteds.node())();

    // changeVar(d3.select("#axisSetting").selectAll('tr').data().find(d=>d.arr==selectedService));
    // Render full foreground
    brush();
    console.log("---init---");
  }
  function brush(isreview) {
    var actives = [],
      extents = [];

    svg
      .selectAll(".brush")
      .filter(function (d) {
        yscale[d].brushSelectionValue = d3.brushSelection(this);
        return d3.brushSelection(this);
      })
      .each(function (d) {
        // Get extents of brush along each active selection axis (the Y axes)
        actives.push(d);
        extents.push(
          d3
            .brushSelection(this)
            .map(yscale[d].invert)
            .sort((a, b) => a - b)
        );
      });
    // hack to hide ticks beyond extent
    var b = d3
      .selectAll(".dimension")
      .nodes()
      .forEach(function (element, i) {
        var dimension = d3.select(element).data()[0];
        if (_.include(actives, dimension)) {
          var extent = extents[actives.indexOf(dimension)];
          d3.select(element)
            .selectAll("text")
            .style("font-weight", "bold")
            .style("font-size", "13px")
            .style("display", function () {
              var value = d3.select(this).data()[0];
              return extent[0] <= value && value <= extent[1] ? null : "none";
            });
        } else {
          d3.select(element)
            .selectAll("text")
            .style("font-size", null)
            .style("font-weight", null)
            .style("display", null);
        }
        d3.select(element).selectAll(".label").style("display", null);
      });
    // bold dimensions with label
    d3.selectAll(".label").style("font-weight", function (dimension) {
      if (_.include(actives, dimension)) return "bold";
      return null;
    });

    // Get lines within extents
    var selected = [];
    data.forEach(function (d) {
      if (!excluded_groups.find((e) => e === d.group))
        !actives.find(function (p, dimension) {
          return extents[dimension][0] > d[p] || d[p] > extents[dimension][1];
        })
          ? selected.push(d)
          : null;
    });
    // free text search
    // var query = d3.select("#search").node().value;
    // if (query.length > 0) {
    //   selected = search(selected, query);
    // }

    // if (selected.length < data.length && selected.length > 0) {
    //   d3.select("#keep-data").attr("disabled", null);
    //   d3.select("#exclude-data").attr("disabled", null);
    // } else {
    //   d3.select("#keep-data").attr("disabled", "disabled");
    //   d3.select("#exclude-data").attr("disabled", "disabled");
    // }

    // total by food group
    var tallies = _(selected).groupBy(function (d) {
      return d.group;
    });

    // include empty groups
    _(colors.domain()).each(function (v, k) {
      tallies[v] = tallies[v] || [];
    });
    if (!isreview) {
      complex_data_table_render = true;
      complex_data_table(selected);
      // myComps.selectedRange = selected;
      // MyComponent.todoCompletedHandler(selected);
      // let pc = new ParallelCoordinates();
      // mySec.todoCompletedHandler(selected);
    }
    redraw(selected);
    // Loadtostore();
  }

  let complex_data_table_render = false;
  function complex_data_table(sample, render) {
    if (
      complex_data_table_render &&
      (render || !d3.select(".searchPanel.active").empty())
    ) {
      var samplenest = d3
        .nest()
        .key((d) => d.rack)
        .sortKeys(collator.compare)
        .key((d) => d.compute)
        .sortKeys(collator.compare)
        .sortValues((a, b) => a.Time - b.Time)
        .entries(sample);
      let instance = M.Collapsible.getInstance("#compute-list");
      if (instance) instance.destroy();
      d3.select("#compute-list").html("");
      var table = d3
        .select("#compute-list")
        .attr("class", "collapsible rack")
        .selectAll("li")
        .data(samplenest, (d) => d.value);
      var ulAll = table.join((enter) => {
        let lir = enter.append("li").attr("class", "rack");
        lir
          .append("div")
          .attr("class", "collapsible-header")
          .text((d) => d.key);
        const lic = lir
          .append("div")
          .attr("class", "collapsible-body")
          .append("div")
          .attr("class", "row marginBottom0")
          .append("div")
          .attr("class", "col s12 m12")
          .append("ul")
          .attr("class", "collapsible compute")
          .datum((d) => d.values)
          .selectAll("li")
          .data((d) => d)
          .enter()
          .append("li")
          .attr("class", "compute");
        lic
          .append("div")
          .attr("class", "collapsible-header")
          .text((d) => d.key);
        const lit = lic
          .append("div")
          .attr("class", "collapsible-body")
          .append("div")
          .attr("class", "row marginBottom0")
          .append("div")
          .attr("class", "col s12 m12")
          .styles({ "overflow-y": "auto", "max-height": "400px" })
          .append("ul")
          .datum((d) => d.values);
        return lir;
      });
      function updateComtime(p) {
        let lit = p
          .select("ul")
          .datum((d) => d.values)
          .selectAll("li")
          .data((d) => d)
          .enter()
          .append("li")
          .attr("class", "comtime")
          .on("mouseover", highlight)
          .on("mouseout", unhighlight);

        lit
          .append("span")
          .attr("class", "color-block")
          .style("background", function (d) {
            return color(
              selectedService == null ? d.group : d[selectedService]
            );
          })
          .style("opacity", 0.85);
        lit.append("span").text(function (d) {
          return stickKeyFormat(d[stickKey]);
        });
        return p;
      }
      $("#compute-list.collapsible,#compute-list .collapsible").collapsible({
        onOpenStart: function (evt) {
          if (d3.select(evt).classed("compute"))
            d3.select(evt).call(updateComtime);
        },
      });
      complex_data_table_render = false;
    }
  }

  function redraw(selected) {
    if (selected.length < data.length && selected.length > 0) {
      d3.select("#keep-data").attr("disabled", null);
      d3.select("#exclude-data").attr("disabled", null);
    } else {
      d3.select("#keep-data").attr("disabled", "disabled");
      d3.select("#exclude-data").attr("disabled", "disabled");
    }

    // total by food group
    var tallies = _(selected).groupBy(function (d) {
      return d.group;
    });

    // include empty groups
    _(colors.domain()).each(function (v, k) {
      tallies[v] = tallies[v] || [];
    });

    // Render selected lines
    paths(selected, foreground, brush_count, true);
  }
  function paths(selected, ctx, count) {
    var n = selected.length,
      i = 0,
      opacity = d3.min([2 / Math.pow(n, 0.3), 1]),
      timer = new Date().getTime();

    // selection_stats(opacity, n, data.length);

    //shuffled_data = _.shuffle(selected);

    // complex_data_table(shuffled_data.slice(0,20));
    shuffled_data = selected;
    complex_data_table_render = true;
    ctx.clearRect(0, 0, w + 1, h + 1);

    // render all lines until finished or a new brush event
    function animloop() {
      if (i >= n || count < brush_count) {
        timel.stop();
        return true;
      }
      var max = d3.min([i + render_speed, n]);
      render_range(shuffled_data, i, max, opacity);
      render_stats(max, n, render_speed);
      i = max;
      timer = optimize(timer); // adjusts render_speed
    }
    if (timel) timel.stop();
    timel = d3.timer(animloop);
    if (isChangeData) axisPlot.dispatch("plot", selected);
  }
  function optimize(timer) {
    var delta = new Date().getTime() - timer;
    render_speed = Math.max(Math.ceil((render_speed * 30) / delta), 8);
    render_speed = Math.min(render_speed, 300);
    return new Date().getTime();
  }

  function render_range(selection, i, max, opacity) {
    selection.slice(i, max).forEach(function (d) {
      path(
        d,
        foreground,
        colorCanvas(
          selectedService == null ? d.group : d[selectedService],
          opacity
        )
      );
      // if (animationtime){
      //     timel.stop();
      //     animationtime = false;
      //     return true
      // }
    });
  }
  function colorCanvas(d, a) {
    var c = d3.hsl(color(d));
    c.opacity = a;
    return c;
  }
  function render_stats(i, n, render_speed) {
    d3.select("#rendered-count").text(i);
    d3.select("#rendered-bar").style("width", (100 * i) / n + "%");
    d3.select("#render-speed").text(render_speed);
  }
  function path(d, ctx, color) {
    if (color) ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.setLineDash([]);
    var x0 = xscale(dimensions[0]) - 15,
      y0 = yscale[dimensions[0]](d[dimensions[0]]); // left edge
    ctx.moveTo(x0, y0);
    let valid = true;
    dimensions.map(function (p, i) {
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

  let listOption = [];
  function drawFiltertable(serviceFullList_withExtra) {
    listOption = serviceFullList_withExtra.map((e, ei) => {
      return {
        service: e.text,
        arr: e.text,
        order: ei,
        id: e.id,
        text: e.text,
        enable: e.enable,
        hide: e.hide,
      };
    });

    // let table = d3.select("#axisSetting").select("tbody");
    // table
    //   .selectAll("tr")
    //   .data(listOption)
    //   .join(
    //     (enter) => {
    //       const tr = enter.append("tr");
    //       tr.attr("data-id", (d) => d.arr);
    //       tr.classed("hide", (d) => d.hide);
    //       tr.each(function (d) {
    //         d.tableObj = d3.select(this);
    //       });
    //       const alltr = tr
    //         .selectAll("td")
    //         .data((d) => [
    //           { key: "enable", value: d, type: "checkbox" },
    //           {
    //             key: "colorBy",
    //             value: false,
    //             type: "radio",
    //           },
    //           { key: "text", value: d.text },
    //         ])
    //         .enter()
    //         .append("td");
    //       alltr
    //         .filter((d) => d.type === "radio")
    //         .append("input")
    //         .attrs(function (d, i) {
    //           const pdata = d3.select(this.parentElement.parentElement).datum();
    //           return {
    //             type: "radio",
    //             name: "colorby",
    //             value: pdata.service,
    //           };
    //         })
    //         .on("change", function (d) {
    //           debugger;
    //           d3.select("tr.axisActive").classed("axisActive", false);
    //           d3.select(this.parentElement.parentElement).classed(
    //             "axisActive",
    //             true
    //           );
    //           console.log("radio changed");
    //           changeVar(d3.select(this.parentElement.parentElement).datum());
    //           brush();
    //         });
    //       alltr
    //         .filter((d) => d.key === "enable")
    //         .append("input")
    //         .attrs(function (d, i) {
    //           return {
    //             type: "checkbox",
    //             checked: serviceFullList_withExtra[d.value.order].enable
    //               ? "checked"
    //               : null,
    //           };
    //         })
    //         .on("adjustValue", function (d) {
    //           d3.select(this).attr(
    //             "checked",
    //             serviceFullList_withExtra[d.value.order].enable
    //               ? "checked"
    //               : null
    //           );
    //         })
    //         .on("change", function (d) {
    //           debugger;
    //           filterAxisbyDom.call(this, d);
    //           xscale.domain(dimensions);
    //           d3.select("#foreground").style("opacity", foreground_opacity);
    //           brush();
    //         });
    //       alltr.filter((d) => d.type === undefined).text((d) => d.value);
    //     },
    //     (update) => {
    //       const tr = update;
    //       tr.classed("hide", (d) => d.hide);
    //       tr.each(function (d) {
    //         d.tableObj = d3.select(this);
    //       });
    //       tr.attr("data-id", (d) => d.arr);
    //       const alltr = tr.selectAll("td").data((d) => [
    //         { key: "enable", value: d, type: "checkbox" },
    //         {
    //           key: "colorBy",
    //           value: false,
    //           type: "radio",
    //         },
    //         { key: "text", value: d.text },
    //       ]);
    //       alltr.filter((d) => d.type === undefined).text((d) => d.value);
    //       alltr
    //         .filter((d) => d.key === "enable")
    //         .select("input")
    //         .each(function (d) {
    //           this.checked = serviceFullList_withExtra[d.value.order].enable;
    //         });
    //     }
    //   );
    // listMetric = Sortable.create($("tbody")[0], {
    //   animation: 150,
    //   sort: true,
    //   dataIdAttr: "data-id",
    //   filter: ".disable",
    //   onStart: function (/**Event*/ evt) {
    //     evt.oldIndex; // element index within parent
    //     const currentAxis = d3.select(evt.item).datum();
    //     const chosenAxis = svg
    //       .selectAll(".dimension")
    //       .filter((d) => d == currentAxis.arr);
    //     _.bind(dragstart, chosenAxis.node(), chosenAxis.datum())();
    //   },
    //   onEnd: function (/**Event*/ evt) {
    //     var itemEl = evt.item; // dragged HTMLElement
    //     evt.to; // target list
    //     evt.from; // previous list
    //     evt.oldIndex; // element's old index within old parent
    //     evt.newIndex; // element's new index within new parent
    //     evt.clone; // the clone element
    //     evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
    //     const currentAxis = d3.select(itemEl).datum();
    //     const chosenAxis = svg
    //       .selectAll(".dimension")
    //       .filter((d) => d == currentAxis.arr);
    //     _.bind(dragend, chosenAxis.node(), chosenAxis.datum())();
    //   },
    //   onMove: function (/**Event*/ evt, /**Event*/ originalEvent) {
    //     // Example: https://jsbin.com/nawahef/edit?js,output
    //     evt.dragged; // dragged HTMLElement
    //     evt.draggedRect; // DOMRect {left, top, right, bottom}
    //     evt.related; // HTMLElement on which have guided
    //     evt.relatedRect; // DOMRect
    //     evt.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
    //     originalEvent.clientY; // mouse position
    //     // return false; — for cancel
    //     // return -1; — insert before target
    //     // return 1; — insert after target
    //     // console.log(originalEvent);
    //     // console.log(d3.event);
    //     const currentAxis = d3.select(evt.dragged).datum();
    //     const relatedtAxis = d3.select(evt.related).datum();
    //     const chosenAxis = svg
    //       .selectAll(".dimension")
    //       .filter((d) => d === currentAxis.arr);

    //     // d3.event = {};
    //     // // d3.event.dx = originalEvent.clientY - this.pre; // simulate the drag behavior
    //     // d3.event.dx = position(relatedtAxis.arr) - position(currentAxis.arr);
    //     // // simulate the drag behavior
    //     // d3.event.dx = d3.event.dx + (d3.event.dx > 0 ? 1 : -1);
    //     // if (!isNaN(d3.event.dx))
    //     //   _.bind(dragged, chosenAxis.node(), chosenAxis.datum())();
    //   },
    // });
  }
  function update_ticks(d, extent) {
    // update brushes
    if (d) {
      var brush_el = d3.selectAll(".brush").filter(function (key) {
        return key == d;
      });
      // single tick
      if (extent) {
        // restore previous extent
        console.log(extent);
        brush_el.call((yscale[d].brush = getBrush(d))).call(
          yscale[d].brush.move,
          extent.map(yscale[d]).sort((a, b) => a - b)
        );
      } else {
        brush_el.call((yscale[d].brush = getBrush(d)));
      }
    } else {
      // all ticks
      d3.selectAll(".brush").each(function (d) {
        d3.select(this).call((yscale[d].brush = getBrush(d)));
      });
    }
    // if (isTick) show_ticks();

    // update axes
    d3.selectAll(".dimension .axis").each(function (d, i) {
      // hide lines for better performance
      d3.select(this).selectAll("line").style("display", "none");

      // transition axis numbers
      d3.select(this).transition().duration(720).call(getScale(d));

      // bring lines back
      d3.select(this)
        .selectAll("line")
        .transition()
        .delay(800)
        .style("display", null);

      d3.select(this)
        .selectAll("text")
        .style("font-weight", null)
        .style("font-size", null)
        .style("display", null);
    });
  }

  function changeVar(d) {
    // $('#groupName').text(d.text);
    if (d.arr === "rack") {
      selectedService = null;
      // svgLengend.style('display','none');
      d3.selectAll(".dimension.axisActive").classed("axisActive", false);
      changeGroupTarget(d.arr);
      //legend = create_legend(colors,brush);
    } else {
      try {
        legend.remove();
      } catch (e) {}
      selectedService = d.arr;
      setColorsAndThresholds(d.service);
      changeGroupTarget(d.arr);
      //legend = drawLegend(d.service, arrThresholds, arrColor, dif);
      // svgLengend.style('display',null);
      d3.selectAll(".dimension.axisActive").classed("axisActive", false);
      d3.selectAll(".dimension")
        .filter((e) => e === selectedService)
        .classed("axisActive", true);
    }
  }
  function setColorsAndThresholds(sin, serviceFullList_withExtra) {
    let s = serviceFullList_withExtra.find((d) => d.text === sin);
    if (s.idroot === undefined) {
      s.range =
        stickKey !== TIMEKEY
          ? [yscale[stickKey].domain()[1], yscale[stickKey].domain()[0]]
          : yscale[stickKey].domain();
      const dif = (s.range[1] - s.range[0]) / levelStep;
      const mid = +s.range[0] + (s.range[1] - s.range[0]) / 2;
      let left = +s.range[0] - dif;
      if (stickKey === TIMEKEY) {
        arrThresholds = [
          new Date(left),
          s.range[0],
          new Date(+s.range[0] + dif),
          new Date(+s.range[0] + 2 * dif),
          new Date(+s.range[0] + 3 * dif),
          s.range[1],
          new Date(+s.range[1] + dif),
        ];
        opa = d3
          .scaleTime()
          .domain([
            new Date(left),
            s.range[0],
            new Date(mid),
            s.range[1],
            new Date(s.range[1] + dif),
          ])
          .range([1, 1, 0.1, 1, 1]);
      } else {
        arrThresholds = [
          left,
          s.range[0],
          s.range[0] + dif,
          s.range[0] + 2 * dif,
          s.range[0] + 3 * dif,
          s.range[1],
          s.range[1] + dif,
        ];
        opa = d3
          .scaleLinear()
          .domain([left, s.range[0], mid, s.range[1], s.range[1] + dif])
          .range([1, 1, 0.1, 1, 1]);
      }
    } else {
      const dif = (s.range[1] - s.range[0]) / levelStep;
      const mid = s.range[0] + (s.range[1] - s.range[0]) / 2;
      let left = s.range[0] - dif;
      arrThresholds = [
        left,
        s.range[0],
        s.range[0] + dif,
        s.range[0] + 2 * dif,
        s.range[0] + 3 * dif,
        s.range[1],
        s.range[1] + dif,
      ];
      opa = d3
        .scaleLinear()
        .domain([left, s.range[0], mid, s.range[1], s.range[1] + dif])
        .range([1, 1, 0.1, 1, 1]);
    }
    if (s.color) {
      color = s.color.copy();
      color.domain(s.color.domain().map((c) => s.axisCustom.tickInvert(c)));
    } else
      color = d3
        .scaleLinear()
        .domain(arrThresholds)
        .range(arrColor)
        .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb
  }
  let main = {
    initFunc,
    drawFiltertable,
  };
  return main;
}
