function ChangeParameter() {
    // ------------------------------------------------------------------------
    // change the width of lines

    // dataIndex.select('select').node().addEventListener('input', d=> {

    //     d.currentTarget;
    // })


    lineWidth.node().addEventListener("input", (d) => {
        debugger;
        var inputValue = d.currentTarget.querySelector("input").value;
        d.currentTarget.querySelector("label").innerText = inputValue;
        LineChart({
            data: dataset,
            dataJson: dataJson,
            node: svgLine.node(),
            n: +nPara.select("input").node().value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            lineWidth: inputValue
        }); // visualize the line chart

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: null,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
            // degrees: [1, 2, 3],
            // setMember: [],
            // probability: [],
            dataJson: dataJson,
            circleType: "circle",
            type: "percentage",
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            yHeight: +setHeight.select("input").node().value,
            lineWidth: inputValue,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate.select("select").node()
                .value
        }); // visualize the combination sets
    });

    // -----------------------------------------------------------------
    // change the parameters to update the related visualizations;
    nPara.node().addEventListener("input", (e) => {
        debugger;
        var inputValue = e.currentTarget.querySelector("input").value;
        e.currentTarget.querySelector("label").innerText = inputValue;
        // h = e.target.value;
        LineChart({
            data: dataset,
            dataJson: dataJson,
            node: svgLine.node(),
            n: +inputValue,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            lineWidth: +lineWidth.select("input").node().value
        });
        debugger;
        connectionLine({
            selfNode: svgLine
                .node()
                .parentElement.parentElement.querySelector("#layout-right-top-left"),
            dataFromFuzzy: svgLine.node().parentElement.value,
            dataJson: dataJson,
            dataset: dataset
        }); // visualize the connected lines

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: svgLine.node().parentElement.value[0].name,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
            // degrees: [1, 2, 3],
            // setMember: [],
            // probability: [],
            dataJson: dataJson,
            circleType: "circle",
            type: "percentage",
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            yHeight: +setHeight.select("input").node().value,
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate.select("select").node()
                .value
        });

        d3.select("#layout-right-top-left")
            .selectAll(".connect-area")
            .on("click", (d) => {
                debugger;
                renderCombinationMatrix({
                    node: svgMatrix.node(),
                    dataFromFuzzy: svgLine.node().parentElement.value,
                    orderCate: d.currentTarget.__data__.name,
                    dataset: dataset,
                    id: dataJson.id,
                    attributesCut: dataJson.temporalAttributes,
                    // degrees: [1, 2, 3],
                    // setMember: [],
                    // probability: [],
                    dataJson: dataJson,
                    circleType: "circle",
                    type: "percentage",
                    empty: isEmpty.selectAll('input')._groups[0][1].checked
                        ? isEmpty.selectAll('input')._groups[0][1].value
                        : isEmpty.selectAll('input')._groups[0][0].value,
                    brushedAttributes: svgLine.select("#time-brush").node().value,
                    yHeight: +setHeight.select("input").node().value,
                    lineWidth: +lineWidth.select("input").node().value,
                    secondAggeragateAttribute: secondAggeragate
                        .select("select")
                        .node().value,
                    firstAggeragateAttribute: firstAggeragate.select("select").node()
                        .value
                });
            }); // when click the connection-line to order the sets
    });

    setHeight.node().addEventListener("input", (d) => {
        debugger;
        d.currentTarget.querySelector(
            "label"
        ).innerText = d.currentTarget.querySelector("input").value;

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: svgLine.node().parentElement.value[0].name,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
            // degrees: [1, 2, 3],
            // setMember: [],
            // probability: [],
            dataJson: dataJson,
            circleType: "circle",
            type: "percentage",
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            yHeight: +d.currentTarget.querySelector("input").value,
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate.select("select").node()
                .value
        }); // visualize the combination matrix
    });

    // -----------------------------------------------------------------
    // change the selection if the empty value is empyt or non-empty
    isEmpty.node().addEventListener("input", (d) => {
        var emptyValue;
        if (d3.select(d.currentTarget).selectAll("input")._groups[0][0].checked) {
            emptyValue = d3.select(d.currentTarget).selectAll("input")._groups[0][0]
                .value;
        } else {
            emptyValue = d3.select(d.currentTarget).selectAll("input")._groups[0][1]
                .value;
        }
        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: svgLine.node().parentElement.value[0].name,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
            // degrees: [1, 2, 3],
            // setMember: [],
            // probability: [],
            dataJson: dataJson,
            circleType: "circle",
            type: "percentage",
            empty: emptyValue,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            yHeight: +setHeight.select("input").node().value,
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate.select("select").node()
                .value
        }); // visualize the combination matrix
    });

    // -----------------------------------------------------------------
    // When we brush the time period;
    // debugger;
    svgLine
        .select("#time-brush")
        .node()
        .addEventListener("input", (d) => {
            // debugger;
            LineChart({
                data: dataset,
                dataJson: dataJson,
                node: svgLine.node(),
                n: +nPara.select('input').node().value,
                brushedAttributes: d.currentTarget.value,
                lineWidth: +lineWidth.select("input").node().value
            }); // visualize the line chart
            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                dataset: dataset,
                id: dataJson.id,
                attributesCut: dataJson.temporalAttributes,
                dataJson: dataJson,
                circleType: "circle",
                type: "percentage",
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                brushedAttributes: d.currentTarget.value,
                yHeight: +setHeight.select("input").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: firstAggeragate.select("select").node()
                    .value
            }); // visualize the combination matrix
        }); // when we brush

    svgLine.select("#cardinality-button").on("click", (d) => {
        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: "cardinality",
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
            circleType: "circle",
            dataJson: dataJson,
            type: "percentage",
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            yHeight: +setHeight.select("input").node().value,
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate.select("select").node()
                .value
        }); // visualize the combination matrix
        // d3.select(d.path[4].querySelector("#div-matrix").querySelector("svg"))
        //   .selectAll(".set")
        //   .sort((a, b) => a.childNode.length - b.childNode.length);
    }); // when click the cardinality button

    d3.select(".trend-groups")
        .selectAll("image")
        .on("click", (d) => {
            debugger;
            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: d.currentTarget.__data__,
                dataset: dataset,
                id: dataJson.id,
                attributesCut: dataJson.temporalAttributes,
                circleType: "circle",
                dataJson: dataJson,
                type: "percentage",
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                brushedAttributes: svgLine.select("#time-brush").node().value,
                yHeight: +setHeight.select("input").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: firstAggeragate.select("select").node()
                    .value
            }); // visualize the combination matrix
            // debugger;
        }); // when click the trend buttons;

    d3.select("#layout-right-top-left")
        .selectAll(".connect-area")
        .on("click", (d) => {
            // var inputValue = d.currentTarget.value;
            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: d.currentTarget.__data__.name,
                dataset: dataset,
                id: dataJson.id,
                attributesCut: dataJson.temporalAttributes,
                // degrees: [1, 2, 3],
                // setMember: [],
                // probability: [],
                dataJson: dataJson,
                circleType: "circle",
                type: "percentage",
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                brushedAttributes: svgLine.select("#time-brush").node().value,
                yHeight: +setHeight.select("input").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: firstAggeragate.select("select").node()
                    .value
            });
        }); // when click the connection-line to order the sets

    firstAggeragate
        .select("select").node()
        .addEventListener("input", (d) => {
            var inputValue = d.currentTarget.value;
            debugger;
            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                dataset: dataset,
                id: dataJson.id,
                attributesCut: dataJson.temporalAttributes,
                // degrees: [1, 2, 3],
                // setMember: [],
                // probability: [],
                dataJson: dataJson,
                circleType: "circle",
                type: "percentage",
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                brushedAttributes: svgLine.select("#time-brush").node().value,
                yHeight: +setHeight.select("input").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: inputValue
            });
        }); // when we click the second aggeragate option;

    secondAggeragate
        .select("select").node()
        .addEventListener("input", (d) => {
            var inputValue = d.currentTarget.value;
            debugger;
            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                dataset: dataset,
                id: dataJson.id,
                attributesCut: dataJson.temporalAttributes,
                // degrees: [1, 2, 3],
                // setMember: [],
                // probability: [],
                dataJson: dataJson,
                circleType: "circle",
                type: "percentage",
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                brushedAttributes: svgLine.select("#time-brush").node().value,
                yHeight: +setHeight.select("input").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: inputValue,
                firstAggeragateAttribute: firstAggeragate.select("select").node()
                    .value
            });
        }); // when we click the second aggeragate option;

    collapse.node().addEventListener("input", d => {

        var inputValue = d3.select(d.currentTarget).selectAll('input')._groups[0][1].checked
            ? d3.select(d.currentTarget).selectAll('input')._groups[0][1].value
            : d3.select(d.currentTarget).selectAll('input')._groups[0][0].value

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: svgLine.node().parentElement.value[0].name,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
            // degrees: [1, 2, 3],
            // setMember: [],
            // probability: [],
            dataJson: dataJson,
            circleType: "circle",
            type: "percentage",
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            yHeight: +setHeight.select("input").node().value,
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate.select("select").node()
                .value,
            firstAggeragateAttribute: firstAggeragate.select("select").node()
                .value,
            collapse: inputValue
        });
    })
}

