export function main() {

    function initFunc() {
        debugger;
        console.log("Initialization first");
        dimensions=[]
        handle_clusterinfo ();
        if(timel)
            timel.stop();
        width = $("#Maincontent").width()-10;
        height = d3.max([document.body.clientHeight-150, 300]);
        w = width - m[1] - m[3];
        h = height - m[0] - m[2];
        xscale = d3.scalePoint().range([0, w]).padding(0.3);
        axis = d3.axisLeft().ticks(1+height/50); // vertical axis with the scale
        // Scale chart and canvas height
        let chart = d3.select("#chart")
            .style("height", (h + m[0] + m[2]) + "px");
    
        chart.selectAll("canvas")
            .attr("width", w)
            .attr("height", h)
            .style("padding", m.join("px ") + "px");
    
    
    // Foreground canvas for primary view
        foreground = document.getElementById('foreground').getContext('2d');
        foreground.globalCompositeOperation = "destination-over";
        foreground.strokeStyle = "rgba(0,100,160,0.1)";
        foreground.lineWidth = 1.7;
        // foreground.fillText("Loading...",w/2,h/2);
    
    // Highlight canvas for temporary interactions
        highlighted = document.getElementById('highlight').getContext('2d');
        highlighted.strokeStyle = "rgba(0,100,160,1)";
        highlighted.lineWidth = 4;
    
    // Background canvas
        background = document.getElementById('background').getContext('2d');
        background.strokeStyle = "rgba(0,100,160,0.1)";
        background.lineWidth = 1.7;
    
        // svgLengend = d3.select('#colorContinuos').append('div').append('svg')
        //     .attr("class", "legendView")
        //     .attr("width", 0)
        //     .attr("height", 0)
        //     .style('display','none');
    // SVG for ticks, labels, and interactions
        svg = d3.select("#chart").select("svg")
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
            
        svg.selectAll('*').remove()
        // Load the data and visualization
        isinit = false;
    // Load the data and visualization
    
        // Convert quantitative scales to floats
        data = object2DataPrallel(sampleS);
        console.log("sampleS");
        console.log(sampleS);
        console.log(data);
        // Extract the list of numerical dimensions and create a scale for each.
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
        
        d3.select('#search').attr('placeholder',`Search host e.g ${data[0].compute}`);
        // Add a group element for each dimension.
        updateDimension();
    
    
        // legend = create_legend(colors, brush);
        if (!serviceFullList.find(d=>d.text===selectedService))
            selectedService = serviceFullList[0].text;
        const selecteds = d3.select("#axisSetting")
            .select('tbody') 
            .selectAll('tr')
            .filter(d=>d.arr===selectedService).select('input[type="radio"]').property("checked", true);
        _.bind(selecteds.on("change"),selecteds.node())();
    
        // changeVar(d3.select("#axisSetting").selectAll('tr').data().find(d=>d.arr==selectedService));
        // Render full foreground
        brush();
        console.log('---init---');
    }
    function brush(isreview) {
        debugger;
        var actives = [],
            extents = [];
    
        svg.selectAll(".brush")
            .filter(function(d) {
                yscale[d].brushSelectionValue = d3.brushSelection(this);
                return d3.brushSelection(this);
            })
            .each(function(d) {
                // Get extents of brush along each active selection axis (the Y axes)
                actives.push(d);
                extents.push(d3.brushSelection(this).map(yscale[d].invert).sort((a,b)=>a-b));
            });
        // hack to hide ticks beyond extent
        var b = d3.selectAll('.dimension').nodes()
            .forEach(function(element, i) {
                var dimension = d3.select(element).data()[0];
                if (_.include(actives, dimension)) {
                    var extent = extents[actives.indexOf(dimension)];
                    d3.select(element)
                        .selectAll('text')
                        .style('font-weight', 'bold')
                        .style('font-size', '13px')
                        .style('display', function() {
                            var value = d3.select(this).data()[0];
                            return extent[0] <= value && value <= extent[1] ? null : "none"
                        });
                } else {
                    d3.select(element)
                        .selectAll('text')
                        .style('font-size', null)
                        .style('font-weight', null)
                        .style('display', null);
                }
                d3.select(element)
                    .selectAll('.label')
                    .style('display', null);
            });
        ;
    
        // bold dimensions with label
        d3.selectAll('.label')
            .style("font-weight", function(dimension) {
                if (_.include(actives, dimension)) return "bold";
                return null;
            });
    
        // Get lines within extents
        var selected = [];
        data
            .forEach(function(d) {
                if(!excluded_groups.find(e=>e===d.group))
                    !actives.find(function(p, dimension) {
                        return extents[dimension][0] > d[p] || d[p] > extents[dimension][1];
                    }) ? selected.push(d) : null;
            });
        // free text search
        var query = d3.select("#search").node().value;
        if (query.length > 0) {
            selected = search(selected, query);
        }
    
        if (selected.length < data.length && selected.length > 0) {
            d3.select("#keep-data").attr("disabled", null);
            d3.select("#exclude-data").attr("disabled", null);
        } else {
            d3.select("#keep-data").attr("disabled", "disabled");
            d3.select("#exclude-data").attr("disabled", "disabled");
        };
    
        // total by food group
        var tallies = _(selected)
            .groupBy(function(d) { return d.group; });
    
        // include empty groups
            _(colors.domain()).each(function(v,k) {tallies[v] = tallies[v] || []; });
        if(!isreview) {
            complex_data_table_render = true;
            complex_data_table(selected);
        }
        redraw(selected);
        // Loadtostore();
    }
    function redraw(selected) {
        if (selected.length < data.length && selected.length > 0) {
            d3.select("#keep-data").attr("disabled", null);
            d3.select("#exclude-data").attr("disabled", null);
        } else {
            d3.select("#keep-data").attr("disabled", "disabled");
            d3.select("#exclude-data").attr("disabled", "disabled");
        };
    
        // total by food group
        var tallies = _(selected)
            .groupBy(function (d) {
                return d.group;
            });
    
        // include empty groups
        _(colors.domain()).each(function (v, k) {
            tallies[v] = tallies[v] || [];
        });
    
    debugger;
        // Render selected lines
        paths(selected, foreground, brush_count, true);
    }
    function paths(selected, ctx, count) {
        debugger;
            var n = selected.length,
                i = 0,
                opacity = d3.min([2/Math.pow(n,0.3),1]),
                timer = (new Date()).getTime();
        
            selection_stats(opacity, n, data.length);
        
            //shuffled_data = _.shuffle(selected);
        
            // complex_data_table(shuffled_data.slice(0,20));
            shuffled_data = selected;
            complex_data_table_render = true;
            ctx.clearRect(0,0,w+1,h+1);
        
            // render all lines until finished or a new brush event
            function animloop(){
                if (i >= n || count < brush_count) {
                    timel.stop();
                    return true;
                }
                var max = d3.min([i+render_speed, n]);
                render_range(shuffled_data, i, max, opacity);
                render_stats(max,n,render_speed);
                i = max;
                timer = optimize(timer);  // adjusts render_speed
            };
            if (timel)
                timel.stop();
            timel = d3.timer(animloop);
            if(isChangeData)
                axisPlot.dispatch('plot',selected);
        }    
        function render_range(selection, i, max, opacity) {
            selection.slice(i,max).forEach(function(d) {
                path(d, foreground, colorCanvas(selectedService==null?d.group:d[selectedService],opacity));
                // if (animationtime){
                //     timel.stop();
                //     animationtime = false;
                //     return true
                // }
            });
        };
        function render_stats(i,n,render_speed) {
            d3.select("#rendered-count").text(i);
            d3.select("#rendered-bar")
                .style("width", (100*i/n) + "%");
            d3.select("#render-speed").text(render_speed);
        }

}