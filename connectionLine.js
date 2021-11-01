function connectionLine({ selfNode, dataFromFuzzy, dataJson, dataset } = {}) {
    debugger;
    // parameters;
    if (dataJson.rank == "yes") {
        var categories = dataFromFuzzy.map((d) => d.name).reverse(); // the generated categories;
    } else {
        var categories = dataFromFuzzy.map((d) => d.name); // the generated categories;
    }

    var margin = { left: 15, top: 10, right: 0, bottom: 30 };
    var widthMatrixLeft = 40; // the width for labels in each set;
    var svg = d3
        .select(selfNode)
        .selectAll("#svg-connect-line")
        .data([1])
        .join("svg")
        .attr("id", "svg-connect-line")
        .attr("width", selfNode.getBoundingClientRect().width)
        .attr("height", selfNode.getBoundingClientRect().height); // the svg in selfNode;
    var width = selfNode.getBoundingClientRect().width; // the width of the svg;
    var height = selfNode.getBoundingClientRect().height; // the height of the svg;
    var heightLine = height * 0.7;
    var heightClickingRank = 30;
    // var widthAttribute = 100;

    var x_step = (svg.attr("width") - widthMatrixLeft - margin.left) / 4;
    var x_range = categories.map(
        (d, i) => margin.left + widthMatrixLeft + 0.5 * x_step + x_step * (3 - i)
    );
    var min = d3.min(
        dataJson.temporalAttributes.map((d) => d3.min(dataset.map((e) => +e[d])))
    ),
        max = d3.max(
            dataJson.temporalAttributes.map((d) => d3.max(dataset.map((e) => +e[d])))
        ); // the maximum and minimum value of the dataset;

    // create the x and y scales;
    var x = d3.scaleOrdinal().domain(categories).range(x_range); // x scale, it's same with the combination matrix;
    if (dataJson.rank == "yes") {
        var y = d3
            .scaleLinear()
            .domain([max, min])
            .range([heightLine - margin.bottom, margin.top]); // y scale, it's same with the line chart;
    } else {
        var y = d3
            .scaleLinear()
            .domain([min, max])
            .range([heightLine - margin.bottom, margin.top]); // y scale, it's same with the line chart;
    }

    if (dataJson.rank == "yes") {
        var path = (d) =>
            d3.line()([
                [x(d.name) + 0.5 * x_step, height],
                [x(d.name) + 0.5 * x_step, y(d.edgeMax)]
            ]); // the vertical line generator
    } else {
        var path = (d) =>
            d3.line()([
                [x(d.name) - 0.5 * x_step, height],
                [x(d.name) - 0.5 * x_step, y(d.edgeMax)]
            ]); // the vertical line generator
    }

    // ------------------------------------------------
    // visualize  the lines
    var inputData = dataFromFuzzy.slice(0, dataFromFuzzy.length - 1);
    svg
        .selectAll(".connect-line")
        .data(inputData)
        .join("path")
        .attr("class", "connect-line")
        .attr("d", path)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "3,3");

    if (dataJson.rank == "yes") {
        var pathHorizon = (d) =>
            d3.line()([
                [x(d.name) + 0.5 * x_step, y(d.edgeMax)],
                [width, y(d.edgeMax)]
            ]); // the horizontal linen generator
    } else {
        var pathHorizon = (d) =>
            d3.line()([
                [x(d.name) - 0.5 * x_step, y(d.edgeMax)],
                [width, y(d.edgeMax)]
            ]); // the horizontal linen generator
    }

    svg
        .selectAll(".connect-line-horizon")
        .data(inputData)
        .join("path")
        .attr("d", pathHorizon)
        .attr("class", "connect-line-horizon")
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "3,3");

    // -------------------------------
    // visualize the name of categories
    svg
        .selectAll("text.category")
        .data(dataFromFuzzy)
        .join("text")
        .text((d) => d.name)
        .attr("font-size", "12px")
        .attr("dominant-baseline", "middle")
        // .attr("x", (d) => x(d.name))
        // .attr("y", height - heightClickingRank)
        .attr("class", "category")
        .attr(
            "transform",
            (d) => `translate(${x(d.name)},${height - heightClickingRank})rotate(-90)`
        );

    // ----------------------------------------------------
    // connection areas
    var area = d3.line().curve(d3.curveLinearClosed);
    if (dataJson.rank == "yes") {
        var areaDatafunction = (d) => [
            [x(d.name) + 0.5 * x_step, height],
            [x(d.name) + 0.5 * x_step, y(d.edgeMax)],
            [width, y(d.edgeMax)],
            [width, y(d.edgeMin)],
            [x(d.name) - 0.5 * x_step, y(d.edgeMin)],
            [x(d.name) - 0.5 * x_step, height]
        ]; // the function to generate the area data;
    } else {
        var areaDatafunction = (d) => [
            [x(d.name) + 0.5 * x_step, height],
            [x(d.name) + 0.5 * x_step, y(d.edgeMin)],
            [width, y(d.edgeMin)],
            [width, y(d.edgeMax)],
            [x(d.name) - 0.5 * x_step, y(d.edgeMax)],
            [x(d.name) - 0.5 * x_step, height]
        ]; // the function to generate the area data;
    }

    // [
    //   [x(d.name) + 0.5 * x_step, height],
    //   [x(d.name) + 0.5 * x_step, y(d.edgeMin)],
    //   [width, y(d.edgeMin)],
    //   [width, y(d.edgeMax)],
    //   [x(d.name) - 0.5 * x_step, y(d.edgeMax)],
    //   [x(d.name) - 0.5 * x_step, height]
    // ]
    // .curve(d3.curveLinearClosed());
    svg
        .selectAll(".connect-area")
        .data(dataFromFuzzy)
        .join("path")
        .attr("class", "connect-area")
        .attr("d", (d) => area(areaDatafunction(d)))
        .attr("fill", "#dedede")
        .attr("stroke", "none")
        .attr("stroke-width", 0)
        .attr("opacity", 0)
        .on("mouseover", (d) => {
            // debugger;
            d3.select(d.currentTarget).attr("fill", "#dedede").attr("opacity", 0.3);
            d3.select(d.path[3])
                .select("#div-line")
                .selectAll(".connection-area")
                .selectAll("path")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("fill", "#dedede")
                .attr("opacity", 0.3); // highlight the connection area in line chart;

            d3.select(d.path[4])
                .select("#div-matrix")
                .select("#column-highlight")
                .selectAll("rect")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("fill", "#dedede")
                .attr("opacity", 0.3); // highlight the connection area in combination matrix
        })
        .on("mouseout", (d) => {
            // debugger;
            d3.select(d.currentTarget).attr("fill", "#dedede").attr("opacity", 0);
            d3.select(d.path[3])
                .select("#div-line")
                .selectAll(".connection-area")
                .selectAll("path")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("fill", "#dedede")
                .attr("opacity", 0); // Don't highlight the connection area in line chart;

            d3.select(d.path[4])
                .select("#div-matrix")
                .select("#column-highlight")
                .selectAll("rect")
                .filter((e) => e.name == d.currentTarget.__data__.name)
                .attr("fill", "#dedede")
                .attr("opacity", 0); // Don't highlight the connection area in combination matrix
        });
}