// require('./filterFunction');

function LineChart({
    data, // the data for the linechart
    dataJson, // the json data for the linechart
    node, // the node for the linechart
    n, // the number of categories
    brushedAttributes,
    oneAttribute, // the attribute column such as 'average'
    lineWidth, // the width of lines that we can adjust
    colorCategory,      // the color for categories;
    firstAggeragateAttribute, // the first aggeragate attribute
    secondAggeragateAttribute // the second aggeragate attribute
}) {
    // -------------------------------------------------------------
    // parse the input data and nodes' parameters;
    debugger;
    var min = d3.min(
        dataJson.temporalAttributes.map((d) => d3.min(dataset.map((e) => +e[d])))
    ),
        max = d3.max(
            dataJson.temporalAttributes.map((d) => d3.max(dataset.map((e) => +e[d])))
        ),
        margin = { left: 90, right: 70, bottom: 30, top: 10 },
        width = d3.select(node).attr("width"),
        height = d3.select(node).attr("height"),
        t = d3.select(node).transition().duration(750),
        heightLine = height * 0.6,
        heightDistribution = height * 0.15,
        heightBrush = height * 0.1;
    var widthAttribute = 100;
    var oneAttribute = oneAttribute || "Average";
    var lineWidth = lineWidth || 2;
    var x_step = ((d3.select(node).attr("width") / 0.85) * 0.15 - 40 - 15) / 4;
    var widthTrend = x_step * 3;

    // var x_step = (svg.attr("width") - widthMatrixLeft - margin.left) / 4;

    // -------------------------------------------------------------
    // create the x scale and y scale;
    var x = d3
        .scalePoint()
        .range([margin.left + widthTrend, width - margin.right - widthAttribute])
        .domain(brushedAttributes);

    if (dataJson.rank == "yes") {
        var y = d3
            .scaleLinear()
            .range([heightLine - margin.bottom, margin.top])
            .domain([max, min]);
    } else {
        var y = d3
            .scaleLinear()
            .range([heightLine - margin.bottom, margin.top])
            .domain([min, max]);
    }

    // -------------------------------------------------------------
    // create the line generator;
    var path = (p) => d3.line()(brushedAttributes.map((d) => [x(d), y(p[d])]));

    // -------------------------------------------------------------
    // draw lines;
    d3.select(node)
        .selectAll("g.line")
        .data(data)
        // .join("path")
        .join(
            (enter) => {
                var bothEnter = enter.append("g").attr("class", "line");
                bothEnter
                    .append("path")
                    .attr("d", path)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("class", "line")
                    .attr("opacity", 0.5)
                    .attr("stroke-width", lineWidth)
                    .attr("stroke", (d) => d.color)
                    .call((enter) => enter.transition(t))
                    .on("mouseover", (d) => {

                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("path")
                            .filter(
                                (e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id]
                            )
                            .attr("stroke", "#dedede"); // show the line

                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("text")
                            .filter(
                                (e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id]
                            )
                            .attr("display", "none"); // don't display the text if it's not responding to the line

                        // d3.select(
                        //   d.path[5].querySelector("#div-matrix").querySelector("svg")
                        // )
                        //   .selectAll(".set")
                        //   .filter((e) => e.name != d.currentTarget.__data__.name)
                        //   .selectAll(".set-line-text")
                        //   .selectAll("path")
                        //   .attr("stroke", "#dedede"); // the set lines become grey;

                        // d3.select(
                        //   d.path[5].querySelector("#div-matrix").querySelector("svg")
                        // )
                        //   .selectAll(".set")
                        //   .filter((e) => e.name == d.currentTarget.__data__.name)
                        //   .selectAll(".set-line-text")
                        //   .selectAll("text")
                        //   .attr("display", "inline"); // the texts shows up when the texts in sets are corresponding to the line

                        // d3.select(
                        //   d.path[5].querySelector("#div-matrix").querySelector("svg")
                        // )
                        //   .selectAll(".set")
                        //   .filter((e) => e.name != d.currentTarget.__data__.name)
                        //   .selectAll(".set-line-text")
                        //   .selectAll("text")
                        //   .attr("display", "none"); // the texts shows off it the texts in sets are not corresponding to the line
                    })
                    .on("mouseout", (d) => {
                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("path")
                            .filter(
                                (e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id]
                            )
                            .attr("stroke", (e) => e.color);

                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("text")
                            .filter(
                                (e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id]
                            )
                            .attr("display", "inline");

                        // d3.select(
                        //   d.path[5].querySelector("#div-matrix").querySelector("svg")
                        // )
                        //   .selectAll(".set")
                        //   .filter((e) => e.name != d.currentTarget.__data__.name)
                        //   .selectAll(".set-line-text")
                        //   .selectAll("path")
                        //   .attr("stroke", (e) => e.color); // the set lines become grey;

                        // d3.select(
                        //   d.path[5].querySelector("#div-matrix").querySelector("svg")
                        // )
                        //   .selectAll(".set")
                        //   // .filter((e) => e.name == d.currentTarget.__data__.name)
                        //   .selectAll(".set-line-text")
                        //   .selectAll("text")
                        //   .attr("display", "inline"); // the texts disappear
                        // debugger;
                    });

                bothEnter
                    .append("text")
                    .text((d) => d[dataJson.id])
                    // .attr("display", "none")
                    .style("font-size", 8)
                    // .attr("stroke", "black")
                    // .attr("color", "green")
                    .attr("text-anchor", "start")
                    .attr("x", width - margin.right - widthAttribute)
                    .attr("dx", 3)
                    .attr("y", (d) =>
                        y(d[brushedAttributes[brushedAttributes.length - 1]])
                    )
                    .on("mouseover", (d) => {
                        debugger;
                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("path")
                            .filter((e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id])
                            .attr("stroke", "#dedede"); // show the line

                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("text")
                            .filter((e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id])
                            .attr("display", "none"); // don't display the text if it's not responding to the line

                        d3.select(
                            d.path[5].querySelector("#div-matrix").querySelector("svg")
                        )
                            .selectAll(".set")
                            .filter((e) => e[dataJson.id] != d.currentTarget.__data__[dataJson.id])
                            .selectAll(".set-line-text")
                            .selectAll("path")
                            .attr("stroke", "#dedede"); // the set lines become grey;

                        d3.select(
                            d.path[5].querySelector("#div-matrix").querySelector("svg")
                        )
                            .selectAll(".set")
                            .filter((e) => e.name == d.currentTarget.__data__[dataJson.id])
                            .selectAll(".set-line-text")
                            .selectAll("text")
                            .attr("display", "inline"); // the texts shows up when the texts in sets are corresponding to the line

                        d3.select(
                            d.path[5].querySelector("#div-matrix").querySelector("svg")
                        )
                            .selectAll(".set")
                            .filter((e) => e.name != d.currentTarget.__data__[dataJson.id])
                            .selectAll(".set-line-text")
                            .selectAll("text")
                            .attr("display", "none"); // the texts shows off it the texts in sets are not corresponding to the line
                    })
                    .on("mouseout", (d) => {
                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("path")
                            .filter((e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id])
                            .attr("stroke", (e) => e.color);

                        d3.select(d.currentTarget.parentElement.parentElement)
                            .selectAll(".line")
                            .selectAll("text")
                            .filter((e) => d.currentTarget.__data__[dataJson.id] != e[dataJson.id])
                            .attr("display", "inline");

                        d3.select(
                            d.path[5].querySelector("#div-matrix").querySelector("svg")
                        )
                            .selectAll(".set")
                            .filter((e) => e.name != d.currentTarget.__data__[dataJson.id])
                            .selectAll(".set-line-text")
                            .selectAll("path")
                            .attr("stroke", (e) => e.color); // the set lines become grey;

                        d3.select(
                            d.path[5].querySelector("#div-matrix").querySelector("svg")
                        )
                            .selectAll(".set")
                            // .filter((e) => e.name == d.currentTarget.__data__.name)
                            .selectAll(".set-line-text")
                            .selectAll("text")
                            .attr("display", "inline"); // the texts disappear
                    });
            },
            (update) => {
                update
                    .select("path")

                    .call((update) =>
                        update
                            .transition(t)
                            .attr("d", path)
                            .attr("opacity", 0.5)
                            .attr("class", "line")
                            .attr("stroke", (d) => d.color)
                            .attr("stroke-width", lineWidth)
                    );
                update.select("text").call((update) =>
                    update
                        .transition(t)
                        .text((d) => d[dataJson.id])
                        // .attr("display", "none")
                        .style("font-size", 8)
                        // .attr("stroke", "black")
                        .attr("text-anchor", "start")
                        .attr("x", width - margin.right - widthAttribute)
                        .attr("dx", 3)
                        .attr("y", (d) =>
                            y(d[brushedAttributes[brushedAttributes.length - 1]])
                        )
                );
            },
            (exit) => {
                // debugger;
                exit.call((exit) => exit.transition(t)).remove();
            }
        );

    // -------------------------------------------------------------
    // visualize the x-axis and y-axis;
    var yAxis = (g) => g.call(d3.axisLeft(y).ticks(4, "s")); // create the generator of x-axis

    if (d3.select(node).select("#y-axis").node() == null) {
        d3.select(node)
            .append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left + widthTrend},0)`)
            .call(yAxis);
    } else {
        d3.select(node)
            .select("#y-axis")
            .attr("transform", `translate(${margin.left + widthTrend},0)`)
            .call(yAxis);
    }

    var xAxis = (g) => g.call(d3.axisBottom(x)); // create the generator of x-axis;

    if (d3.select(node).select("#x-axis").node() == null) {
        d3.select(node)
            .append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(${0},${heightLine - margin.bottom})`)
            .call(xAxis);
    } else {
        d3.select(node)
            .select("#x-axis")
            .attr("transform", `translate(${0},${heightLine - margin.bottom})`)
            .call(xAxis);
    }

    // create the category data like 'high', 'middle' and 'low';
    debugger;
    if (node.parentElement.value == null) {
        if (dataJson.config.length == 0) {
            // var min = dataJson.min,
            //     max = dataJson.max,
            var step = (max - min) / +n;
            if (n == 2) {
                var categoryData = [
                    { edgeMin: min, edgeMax: min + step * 1, name: "Low" },
                    { edgeMin: min + step * 1, edgeMax: min + step * 2, name: "Middle" }
                    // { edgeMin: min + step * 2, edgeMax: min + step * 3, name: "High" },
                    // { edgeMin: min + step * 3, edgeMax: min + step * 4, name: "Very high" }
                ];
            } else if (n == 3) {
                var categoryData = [
                    { edgeMin: min, edgeMax: min + step * 1, name: "Low" },
                    { edgeMin: min + step * 1, edgeMax: min + step * 2, name: "Middle" },
                    { edgeMin: min + step * 2, edgeMax: min + step * 3, name: "High" }
                    // { edgeMin: min + step * 3, edgeMax: min + step * 4, name: "Very high" }
                ];
            } else {
                var categoryData = [
                    { edgeMin: min, edgeMax: min + step * 1, name: "Low" },
                    { edgeMin: min + step * 1, edgeMax: min + step * 2, name: "Middle" },
                    { edgeMin: min + step * 2, edgeMax: min + step * 3, name: "High" },
                    {
                        edgeMin: min + step * 3,
                        edgeMax: min + step * 4,
                        name: "Very high"
                    }
                ];
            }
        } else {
            var categoryData = dataJson.config.filter((d) => d.n == n)[0].category;
        }
    } else {
        if (n != node.parentElement.value.length) {
            if (dataJson.config.length == 0) {
                // var min = dataJson.min,
                //     max = dataJson.max,
                var step = (max - min) / +n;
                if (n == 2) {
                    var categoryData = [
                        { edgeMin: min, edgeMax: min + step * 1, name: "Low" },
                        { edgeMin: min + step * 1, edgeMax: min + step * 2, name: "Middle" }
                        // { edgeMin: min + step * 2, edgeMax: min + step * 3, name: "High" },
                        // { edgeMin: min + step * 3, edgeMax: min + step * 4, name: "Very high" }
                    ];
                } else if (n == 3) {
                    var categoryData = [
                        { edgeMin: min, edgeMax: min + step * 1, name: "Low" },
                        {
                            edgeMin: min + step * 1,
                            edgeMax: min + step * 2,
                            name: "Middle"
                        },
                        { edgeMin: min + step * 2, edgeMax: min + step * 3, name: "High" }
                        // { edgeMin: min + step * 3, edgeMax: min + step * 4, name: "Very high" }
                    ];
                } else {
                    var categoryData = [
                        { edgeMin: min, edgeMax: min + step * 1, name: "Low" },
                        {
                            edgeMin: min + step * 1,
                            edgeMax: min + step * 2,
                            name: "Middle"
                        },
                        { edgeMin: min + step * 2, edgeMax: min + step * 3, name: "High" },
                        {
                            edgeMin: min + step * 3,
                            edgeMax: min + step * 4,
                            name: "Very high"
                        }
                    ];
                }
            } else {
                var categoryData = dataJson.config.filter((d) => d.n == n)[0].category;
            }
        } else {
            var categoryData = node.parentElement.value;
        }
    }


    // ----------------------------------------------
    // Add the filter selection and input 
    var firstAggeragateValue = node.parentElement.parentElement.parentElement.parentElement.querySelector('#layout-left').querySelector('.parameter-first').querySelector('select').value;
    if (firstAggeragateValue == 'Category') {
        AddFilterPanel(categoryData, node, brushedAttributes)
    } else {
        var leftLayout = node.parentElement.parentElement.parentElement.parentElement.querySelector('#layout-left');
        d3.select(leftLayout).select('.parameter-filter').selectAll('*').remove();
    }

    // -------------------------------------------------
    // Add the options to sort method dropdown
    debugger;
    parameterSort.selectAll('option').data(
        ['cardinality', 'up', 'down', 'stable'].concat(
            categoryData.map(d => d.name))
    )
        .join('option')
        .attr('value', d => d)
        .text(d => d)
        .style('dont-size', '12px')

    parameterSortSecond.selectAll('option').data(
        ['cardinality', 'up', 'down', 'stable'].concat(
            categoryData.map(d => d.name))
    )
        .join('option')
        .attr('value', d => d)
        .text(d => d)
        .style('dont-size', '12px')

    // --------------------------------------------------------------
    // Add the vertical rects
    d3.select(node).selectAll('#vertical-line-global').data([brushedAttributes])
        .join('g')
        .attr('id', 'vertical-line-global')
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => x(d) - d3.min([x.step(), 20]) * 0.5)
        .attr('y', margin.top)
        .attr('width', d3.min([x.step(), 20]))
        .attr('height', heightLine - margin.bottom - margin.top)
        .attr('fill', 'white')
        .attr('opacity', 0)

    d3.select(node).select('#vertical-line-global').lower();    // put the vertical rects in the background

    // -------------------------------------------------------------
    // Visualize the distribution in the brushed area
    var data4Dis = [];
    dataJson.temporalAttributes.map(d => {
        var e = {};
        e.name = d;
        // categoryData.map(f => e[f.name] = []);
        categoryData.map(f => e[f.name] = []);
        data4Dis.push(e);
        return e;
    })            // init the data4Dis


    dataset.map(d => {
        dataJson.temporalAttributes.map(e => {
            var category = categoryData.find((f, i) => i < (categoryData.length - 1)
                ? +d[e] >= +f.edgeMin && +d[e] < +f.edgeMax : +d[e] > +f.edgeMin)
            if (category != null) {
                // data4Dis.find(f => f.name == e)[category.name].push(d[e]);
                data4Dis.find(f => f.name == e)[category.name] = +data4Dis.find(f => f.name == e)[category.name] + 1
            }

        })
    })    // Add the values into data4Dis;

    var stack = d3.stack().keys(categoryData.map(d => d.name))
        .value((data, key) => data[key])
    // .order(d3.stackOrderAscending)
    // .offset(d3.stackOffsetNone);

    var distributionData = stack(data4Dis)
    //  .value((data4Dis, key) => data4Dis[key])
    distributionData.map((d, i) => {

        if (distributionData.length == 2) {
            if (colorCategory == null) {
                d.color = colorbrewer.YlGn[3][i]
            } else {
                d.color = colorbrewer[colorCategory][3][i];
            }
        } else {
            if (colorCategory == null) {
                d.color = colorbrewer.YlGn[distributionData.length][i]
            } else {
                d.color = colorbrewer[colorCategory][distributionData.length][i]
            }
        }

        return d
        // d.color = distributionData.length == 2 ? colorbrewer[colorCategory][3][i] || colorbrewer.YlGn[3][i]: colorbrewer[colorCategory][distributionData.length][i] || colorbrewer.YlGn[distributionData.length][i]
    })
    var xBrush = d3
        .scalePoint()
        .range([margin.left + widthTrend, width - margin.right - widthAttribute])
        .domain(dataJson.temporalAttributes); // create the scale for the brush

    var yBrush = d3.scaleLinear().domain([0, dataset.length])
        .range([heightLine + heightDistribution, heightLine]);

    if (d3.select(node).select('#distribution').node() == null) {
        d3.select(node).append('g').attr('id', 'distribution')
    }

    function get_random_color() {
        var color = "";
        for (var i = 0; i < 3; i++) {
            var sub = Math.floor(Math.random() * 256).toString(16);
            color += sub.length == 1 ? "0" + sub : sub;
        }
        return "#" + color;
    }
    var widthBar = d3.min([xBrush.step(), 20])
    d3.select(node)
        .select('#distribution')
        .selectAll('.distribution-group')
        .data(distributionData)
        .join('g')
        // .attr('opacity', 0.4)
        .attr('fill', d => d.color)
        .attr('class', 'distribution-group')
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('stroke-width', 0)
        .attr('x', d => xBrush(d.data.name) - widthBar / 2)
        .attr('width', widthBar)
        .attr('y', d => yBrush(d[1]))
        .attr('height', d => yBrush(d[0]) - yBrush(d[1]))

    var legendStep = heightDistribution / distributionData.length;
    var legendData = categoryData.map((d, i) => {
        var e = {};
        e.value = d.name;
        e.index = i;
        if (distributionData.length == 2) {
            if (colorCategory == null) {
                e.color = colorbrewer.YlGn[3][i]
            } else {
                e.color = colorbrewer[colorCategory][3][i];
            }
        } else {
            if (colorCategory == null) {
                e.color = colorbrewer.YlGn[distributionData.length][i]
            } else {
                e.color = colorbrewer[colorCategory][distributionData.length][i]
            }
        }
        return e
    })
    var widthLegend = d3.min([legendStep * 0.8, 20]);
    d3.select(node)
        .select("#distribution")
        .selectAll('.legend')
        .data(legendData)
        .join('g')
        .attr('class', 'legend')
        .selectAll('rect')
        .data(d => [d])
        .join('rect')
        .attr('x', d => xBrush(dataJson.temporalAttributes[0]) - widthBar * 0.5 - 30)
        .attr('y', d => heightLine + legendStep * (categoryData.length - 1 - d.index))
        .attr('width', widthLegend)
        .attr('height', widthLegend)
        .attr('stroke-width', 0)
        .attr('fill', d => d.color) // visualize the legend

    d3.select(node)
        .select("#distribution")
        .selectAll('.legend')
        .data(legendData)
        .join('g')
        .attr('class', 'legend')
        .selectAll('text')
        .data(d => [d])
        .join('text')
        .attr("x", d => xBrush(dataJson.temporalAttributes[0]) - widthBar * 0.5 - 33)
        .attr('y', d => heightLine + legendStep * (categoryData.length - 1 - d.index) + widthLegend / 2)
        .attr('font-size', '12px')
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'end')
        .text(d => d.value)   // visualize the text of legend;


    // -------------------------------------------------------------
    // Add category lines (the lines to display the categories' range)
    function DragStart(event) {
        debugger;
    }
    function Dragging() { }
    function Draged(event) {
        debugger;
    }

    var drag = d3
        .drag()
        .on("start", DragStart)
        .on("drag", Dragging)
        .on("end", Draged);

    var categoryDataDeletOneElement = categoryData.slice(
        0,
        categoryData.length - 1
    );
    var pathCateLine = (d) =>
        d3.line()([
            [0, y(d.edgeMax)],
            [width - margin.right - widthAttribute, y(d.edgeMax)]
        ]);
    d3.select(node)
        .selectAll(".category-line")
        .data(categoryDataDeletOneElement)
        .join(
            (enter) =>
                enter
                    .append("path")
                    .attr("d", pathCateLine)
                    .attr("class", "category-line")
                    .attr("stroke-dasharray", "3,3")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1),
            (update) =>
                update
                    .attr("d", pathCateLine)
                    .attr("class", "category-line")
                    .attr("stroke-dasharray", "3,3")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1),
            (exit) => exit.remove()
        )
        .on("mouseover", (d) => {
            // d3.select(d.currentTarget).attr("stroke-width", 4);
        })
        .on("mouseout", (d) => {
            // d3.select(d.currentTarget).attr("stroke-width", 2);
        })
        .call(drag);

    // ------------------------------------------------------
    // Visualize the connection areas
    var pathArea = d3.line().curve(d3.curveLinearClosed); // generator of the path
    d3.select(node)
        .selectAll("g.connection-area")
        .data(categoryData)
        .join("g")
        .attr("class", "connection-area")
        .selectAll("path")
        .data((d) => [d])
        .join("path")
        .attr("d", (d) =>
            pathArea([
                [0, y(d.edgeMin)],
                [width - margin.right - widthAttribute, y(d.edgeMin)],
                [width - margin.right - widthAttribute, y(d.edgeMax)],
                [0, y(d.edgeMax)]
            ])
        )
        .attr("fill", "#dedede")
        .attr("opacity", 0)
        // .attr("stroke", "none")
        // .attr("stroke-width", 0)
        .on("mouseover", (d) => {
            debugger;
            d3.select(d.currentTarget).attr("opacity", 0.3);
            d3.select(d.path[4])
                .select("#svg-connect-line")
                .selectAll(".connect-area")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("opacity", 0.3); // highlight the connection area in connection div
            d3.select(d.path[5])
                .select("#div-matrix")
                .select("#column-highlight")
                .selectAll("rect")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("opacity", 0.3); // highlight the connection area in combination matrix
        })
        .on("mouseout", (d) => {
            debugger;
            d3.select(d.currentTarget).attr("opacity", 0);
            d3.select(d.path[4])
                .select("#svg-connect-line")
                .selectAll(".connect-area")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("opacity", 0);

            d3.select(d.path[5])
                .select("#div-matrix")
                .select("#column-highlight")
                .selectAll("rect")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("opacity", 0); // Don't highlight the connection area in combination matrix
        })
        .on("click", (d) => { });

    // ----------------------------------------------------------------
    // Visualize the symbols of trends;
    // if (secondAggeragateAttribute == "Trend") {
    var xTrendRange = [0.5 * x_step, 2.5 * x_step];
    var xTrendDomain = ["up", "down", "stable"];
    var xScaleTrend = d3.scalePoint().domain(xTrendDomain).range(xTrendRange);

    var trendGroups = d3
        .select(node)
        .selectAll(".trend-groups")
        .data([1])
        .join("g")
        .attr("class", "trend-groups");

    trendGroups
        .selectAll(".arrows-up")
        .data(["up"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-up")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleTrend(d) - 7.5)
        .attr("y", height - 15)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
            "href",
            "https://liqunliu1990.static.observableusercontent.com/files/5e93b3fd8f829f8e3e7e0382693decfc62538b5a3f4955300746197ffee3fbe6abc6ca519f9c52a98e2ba8b96c22896552e00f494be9ef25df29d67d852f8668?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27up-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=tWqUogU~oBGR0QlWp6BMMr4yVXPZ7-izP7BUxuHIdOTo-8H7Esfs7djLIUIqt0~-6YVH9SooA1RKp6D5hdI7BCenydb33oyTpUDp15wrygCKBkYzUsn~t-JuF2vMJrRtl6BQXDhTyAUI-~dHwjtBaQJej4Gv3C-zXVnrJCJrRGjawlT83rhnujSBUscDHJRlpJYo7UzvZvcVITsLhuQ6UyMq-JnYKAVFYng92UiHmgqg8ibNMzN4Ix3Ntrflgs24hPwAROIR3dDf0Dg3HYbIbH8YN~N7nOLx5YF1zV~A-s01F~UlyN4aObr92ZT9LFD~dlZuxU3OLuN~1b21G2QCYQ__"
        )
        .attr("height", 15)
        .attr("width", 15);
    // .on("mouseover", (d) => {
    //   debugger;
    // })
    // .on("mouseout", (d) => {
    //   debugger;
    // });

    trendGroups
        .selectAll(".arrows-down")
        .data(["down"])
        .join("image")
        .attr("class", "arrows-down")
        // .attr("class", "fas fa-band-aid")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        // .attr("x", (d) => xScaleTrend(d) - 7.5)
        // .attr("y", height - 15)
        .attr(
            "transform",
            (d) => `translate(${xScaleTrend(d) - 7.5},${height - 15})`
        )
        .attr(
            "href",
            "https://liqunliu1990.static.observableusercontent.com/files/a652469c555d44d9d9637ca26a1dbcb363a9a421656580b70e117653745303c83f781505b5a33b048b525a6d328ccd99ebc0e3e1e7f24432ad0dfde6ee7d5259?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27down-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=MlC~wYR7mChf8Fc71gKcypmnXrzXqADbLAlNf~hgxiMoK~9Mp7zT4nM0Nj~mJAsgjxWBIDH2w5cuWjTmD6xq48nzQ5E5lK3Pp8mICv91YIoF25Dvxv2ZGgeX5T8i06mZoeJvjN5AWJUCenpBPTztleCmAt7M4~tJgWiJtpTvenBmdIyB4x5EesS2b4WWvKRhBaYBmndVw9qFTexDM0mmNTj~2F-Ewv3-qZ9fmdIXywtlTBF2TPxh5f5dV2GEiqu4KY-WjtFISttUk3qOsZdjiGAe0LhF23bqlBjZ1nDUjxbz89cnweaiJcTnf-P7Sb0xGF8Ee2b-hI7cXhwlmoj3Xw__"
        )
        .attr("height", 15)
        .attr("width", 15);
    // .on("mouseover", (d) => {
    //   debugger;
    // })
    // .on("mouseout", (d) => {
    //   debugger;
    // });

    trendGroups
        .selectAll(".arrows-stable")
        .data(["stable"])
        .join("image")
        .attr("class", "arrows-stable")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        // .attr("x", (d) => xScaleTrend(d) - 7.5)
        // .attr("y", height - 15)
        .attr(
            "transform",
            (d) => `translate(${xScaleTrend(d) - 7.5},${height - 15})`
        )
        .attr(
            "href",
            "https://liqunliu1990.static.observableusercontent.com/files/9e220282e70b5e7e58f88ec573ae5b13bebc5dcbe7db4e184a7bf818a8b569b6a3fe49664cc1720d1e1ed0fc4ba6432b5ca9abbd1152ba71acf42830b10515e6?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27right-arrow-svgrepo-com%2520(1).svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=b~gqq44XavJ2wzGqrz4r8NPnroue5yZOvO4q8tIfpuMfDyN9DhwmKpzVO-c95PWHm2pl7sDSw6xM5Co4g6j0CrbqppEoeVS6AwRVna3eHo4XvHtKNnPGD52HLKSZwooqjBqlWEetUwVS7Q4YDzVhxm2e~QuvH9iQMmyDBfR1pctiTP80U4ltqq2SA8gOgxdfedF7nuPkKoVQdvaeVnwqM0fCaI5Or8RZKHIdP2ZYwaIyIukOFIHsdr3zjvGi5qjclT-TTW6SfOCq8Fkc7VG0kWneo6tLuK9MyCGVKxtGTAx44FdyfqAFzXbmg018pYkWzrEFIOwA6PSZjzalhK64oA__"
        )
        .attr("height", 15)
        .attr("width", 15)
        .on("mouseover", (d) => {
            debugger;
        })
        .on("mouseout", (d) => {
            debugger;
        });
    // } else {
    //     d3
    //         .select(node)
    //         .selectAll(".trend-groups").selectAll('*').remove();
    // }


    // ---------------------------------------------------
    // add the cardinality buttons
    d3.select(node)
        .selectAll("#cardinality-button")
        .data([1])
        .join("rect")
        .attr("id", "cardinality-button")
        .attr("x", 5 + widthTrend)
        .attr("y", height - 20)
        .attr("width", 80)
        .attr("height", 18)
        .attr("fill", "#dedede")
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .on("mouseover", (d) => {
            d3.select(d.currentTarget).attr("fill", "grey");
        })
        .on("mouseout", (d) => {
            d3.select(d.currentTarget).attr("fill", "#dedede");
        });
    d3.select(node)
        .selectAll("#cardinality-button-text")
        .data([1])
        .join("text")
        .text("Cardinalty")
        .attr("id", "cardinality-button-text")
        .attr("x", 45 + widthTrend)
        .attr("y", height - 10)
        .attr("font-size", "12px")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");

    // ---------------------------------------------------
    // add the attribute
    var scrollWidth = 20;
    d3.select(node)
        .selectAll("#attribute-button")
        .data([1])
        .join("rect")
        .attr("id", "attribute-button")
        .attr("x", width - widthAttribute)
        .attr("y", height - 20)
        .attr("width", widthAttribute - scrollWidth)
        .attr("height", 18)
        .attr("fill", "#dedede")
        .attr("stroke", "black")
        .attr("stroke-width", 0)
        .on("mouseover", (d) => {
            d3.select(d.currentTarget).attr("fill", "grey");
        })
        .on("mouseout", (d) => {
            d3.select(d.currentTarget).attr("fill", "#dedede");
        });
    d3.select(node)
        .selectAll("#attribute-button-text")
        .data([1])
        .join("text")
        .text(oneAttribute)
        .attr("id", "attribute-button-text")
        .attr("x", width - widthAttribute / 2 - scrollWidth / 2)
        .attr("y", height - 10)
        .attr("font-size", "12px")
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "middle");

    d3.select(node).selectAll('.connection-area').lower(); // put the connection area in the background

    node.parentElement.value = categoryData;
    node.parentElement.dispatchEvent(new CustomEvent("input"));
}