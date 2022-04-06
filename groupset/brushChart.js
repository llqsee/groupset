function brushChart({ dataJson, node, data, n, isEmpty } = {}) {
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
    var x_step = ((d3.select(node).attr("width") / 0.85) * 0.15 - 40 - 15) / 4; // the step of the circles;
    var widthTrend = x_step * 3;

    var x = d3
        .scalePoint()
        .range([margin.left + widthTrend, width - margin.right - widthAttribute])
        .domain(dataJson.temporalAttributes); // create the scale for the brush
    var widthBar = d3.min([x.step(), 20])
    // -------------------------------------------------------------
    // visualize the brush rect
    function scalePointPositionX0({ xpos, xScale } = {}) {
        var xPos = xpos;
        var domain = xScale.domain();
        var range = xScale.range();
        var rangePoints = d3.range(range[0], range[1], xScale.step());
        var yPos = domain[d3.bisect(rangePoints, xPos) - 1];
        return yPos;
    } // equal to x.invert();
    function scalePointPositionX1({ xpos, xScale } = {}) {
        var xPos = xpos;
        var domain = xScale.domain();
        var range = xScale.range();
        var rangePoints = d3.range(range[0], range[1], xScale.step());
        var yPos = domain[d3.bisect(rangePoints, xPos)];
        return yPos;
    } // equal to x.invert();
    // var yBrush = d3
    //   .scaleLinear()
    //   .range([height - heightLine - heightBrush, heightLine])
    //   .domain([min, max]);
    var brushSvg = d3
        .select(node)
        .selectAll("#time-brush")
        .data([1])
        .join("g")
        .attr("id", "time-brush");
    // brushSvg
    //     .selectAll("rect")
    //     .data([1])
    //     .join("rect")
    //     .attr("x", margin.left + widthTrend)
    //     .attr(
    //         "width",
    //         width - margin.left - margin.right - widthAttribute - widthTrend
    //     )
    //     .attr("y", margin.top)
    //     .attr("height", heightLine+heightDistribution+30)
    //     .attr("fill", "#dedede")
    //     .attr("opacity", 0)
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 0)

    d3.select(node).select('#time-brush').raise();
    function brushstart(event) { }
    function brushing(event) {
        // debugger;
        const selection = event.selection;
        if (!event.sourceEvent || !selection) return;
        var x0 = scalePointPositionX0({ xpos: selection[0], xScale: x }),
            x1 = scalePointPositionX1({ xpos: selection[1], xScale: x });


        d3.select(this.parentElement)
            .selectAll('.text-left')
            .data([x0])
            .join('text')
            .attr('class', 'text-left')
            .attr('x', selection[0] + 5)
            .attr('y', margin.top)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'auto')
            .style('font-size', '15px')
            .style('color', 'black')
            .text(d => d)    // the left handle's text of the brush area

        d3.select(this.parentElement)
            .selectAll('.text-right')
            .data([x1])
            .join('text')
            .attr('class', 'text-right')
            .attr('x', selection[1] - 5)
            .attr('y', margin.top)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'auto')
            .style('font-size', '15px')
            .style('color', 'black')
            .text(d => d)

    }
    function brushed(event) {
        // ----------------------
        // reset the brush appearance
        const selection = event.selection;
        if (!event.sourceEvent || !selection) return;
        var x0 = scalePointPositionX0({ xpos: selection[0], xScale: x }),
            x1 = scalePointPositionX1({ xpos: selection[1], xScale: x });
        // const [x0, x1] = selection.map((d) =>
        //   scalePointPosition({ xpos: d, xScale: x })
        // );
        // d3.select(this)
        //   .transition()
        //   .call(
        //     brush.move,
        //     dataJson.temporalAttributes.findIndex((d) => d == x1) >
        //       dataJson.temporalAttributes.findIndex((d) => d == x0)
        //       ? [x0, x1].map(x)
        //       : null
        //   );
        // .call(brush.clear);

        var indexX0 = dataJson.temporalAttributes.findIndex((d) => d == x0),
            indexX1 = dataJson.temporalAttributes.findIndex((d) => d == x1); // get the index of x0 and x1
        var selectedAttributes = dataJson.temporalAttributes.filter(
            (d, i) => i >= indexX0 && i <= indexX1
        ); // extract the attributes

        brushedAttributes = selectedAttributes;   // update the selectedAttributes;

        d3.select(this).node().parentElement.value = selectedAttributes;
        d3.select(this)
            .node()
            .parentElement.dispatchEvent(new CustomEvent("input"));
    }

    var brush = d3
        .brushX()
        .extent([
            [margin.left + widthTrend, margin.top],
            [width - margin.right - widthAttribute, heightLine]
        ])
        // .extent([
        //     [margin.left + widthTrend, heightLine + heightDistribution],
        //     [width - margin.right - widthAttribute, heightLine + heightDistribution + heightBrush]
        // ])
        // .on("start", brushstart)
        .on("brush", brushing)
        .on("end", brushed);
    // .keyModifiers("False");

    brushSvg.append("g").call(brush);

    // ------------------------------------------
    // visualize the x-axis
    var xAxis = (g) => g.call(d3.axisBottom(x)); // create the generator of x-axis;

    if (d3.select(node).select("#x-brush-axis").node() == null) {
        d3.select(node)
            .append("g")
            .attr("id", "x-brush-axis")
            .attr("transform", `translate(0,${heightDistribution + heightLine + heightBrush})`)
            .call(xAxis);
    } else {
        d3.select(node)
            .select("#x-brush-axis")
            .attr("transform", `translate(0,${heightDistribution + heightLine + heightBrush})`)
            .call(xAxis);
    }

    // ---------------------------
    // output the value for time brush element 'g'
    brushSvg.node().value = dataJson.temporalAttributes;
    brushSvg.node().dispatchEvent(new CustomEvent("input"));
}