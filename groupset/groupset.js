// const { toNamespacedPath } = require("path");

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
            lineWidth: inputValue,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            classMethod: classMethod.selectAll('input')._groups[0][1].checked
                ? classMethod.selectAll('input')._groups[0][1].value
                : classMethod.selectAll('input')._groups[0][0].value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value
        }); // visualize the line chart
        // addClickToSort();

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: parameterSort.node().value,
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        }); // visualize the combination sets
        addClickToSet();
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
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            classMethod: classMethod.selectAll('input')._groups[0][1].checked
                ? classMethod.selectAll('input')._groups[0][1].value
                : classMethod.selectAll('input')._groups[0][0].value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value
        });
        // addClickToSort();
        debugger;
        connectionLine({
            selfNode: svgLine
                .node()
                .parentElement.parentElement.querySelector("#layout-right-top-left"),
            dataFromFuzzy: svgLine.node().parentElement.value,
            dataJson: dataJson,
            dataset: dataset
        }); // visualize the connected lines

        treeData = CalTreData({
            dataFromFuzzy: categoryData,
            dataset: dataset,
            attributesCut: dataJson.temporalAttributes,
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            dataJson: dataJson,
            brushedAttributes: brushedAttributes,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            attributeSelect: multiAttribute
        }); // generate the tree data;

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: parameterSort.node().value,
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();

        d3.select("#layout-right-top-left")
            .selectAll(".connect-area")
            .on("click", (d) => {
                debugger;
                renderCombinationMatrix({
                    node: svgMatrix.node(),
                    dataFromFuzzy: svgLine.node().parentElement.value,
                    orderCate: d.currentTarget.__data__.name,
                    orderSecond: parameterSortSecond.node().value,
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
                        .value,
                    collapse: collapse.selectAll('input')._groups[0][1].checked
                        ? collapse.selectAll('input')._groups[0][1].value
                        : collapse.selectAll('input')._groups[0][0].value,
                    filterPara: filterElement.node().value,
                    treeData: treeData,
                    attributeSelect: multiAttribute
                });
            }); // when click the connection-line to order the sets
        addClickToSet();
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
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        }); // visualize the combination matrix
        addClickToSet();
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
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        }); // visualize the combination matrix
        addClickToSet();
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
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                classMethod: classMethod.selectAll('input')._groups[0][1].checked
                    ? classMethod.selectAll('input')._groups[0][1].value
                    : classMethod.selectAll('input')._groups[0][0].value,
                firstAggeragateAttribute: firstAggeragate
                    .select("select")
                    .node().value
            }); // visualize the line chart

            treeData = CalTreData({
                dataFromFuzzy: categoryData,
                dataset: dataset,
                attributesCut: dataJson.temporalAttributes,
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                dataJson: dataJson,
                brushedAttributes: brushedAttributes,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: firstAggeragate
                    .select("select")
                    .node().value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                attributeSelect: multiAttribute
            }); // generate the tree data;

            // addClickToSort();
            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                orderSecond: parameterSortSecond.node().value,
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
                    .value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                filterPara: filterElement.node().value,
                treeData: treeData,
                attributeSelect: multiAttribute
            }); // visualize the combination matrix
            addClickToSet();

            tableFun({ x: dataset, rows: [dataJson.id].concat(d.currentTarget.value), node: table.node() }); // visualize the table
        }); // when we brush

    svgLine.select("#cardinality-button").on("click", (d) => {
        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: "cardinality",
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        }); // visualize the combination matrix
        addClickToSet();
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
                orderSecond: parameterSortSecond.node().value,
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
                    .value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                filterPara: filterElement.node().value,
                treeData: treeData,
                attributeSelect: multiAttribute
            }); // visualize the combination matrix
            addClickToSet();
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
                orderSecond: parameterSortSecond.node().value,
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
                    .value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                filterPara: filterElement.node().value,
                treeData: treeData,
                attributeSelect: multiAttribute
            });
            addClickToSet();
        }); // when click the connection-line to order the sets

    firstAggeragate
        .select("select").node()
        .addEventListener("input", (d) => {
            var inputValue = d.currentTarget.value;
            debugger;
            LineChart({
                data: dataset,
                dataJson: dataJson,
                node: svgLine.node(),
                n: +nPara.select('input').node().value,
                brushedAttributes: svgLine.select("#time-brush").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                classMethod: classMethod.selectAll('input')._groups[0][1].checked
                    ? classMethod.selectAll('input')._groups[0][1].value
                    : classMethod.selectAll('input')._groups[0][0].value,
                firstAggeragateAttribute: inputValue
            }); // visualize the line chart
            // addClickToSort();

            treeData = CalTreData({
                dataFromFuzzy: categoryData,
                dataset: dataset,
                attributesCut: dataJson.temporalAttributes,
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                dataJson: dataJson,
                brushedAttributes: brushedAttributes,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: inputValue,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                attributeSelect: multiAttribute
            }); // generate the tree data;

            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                orderSecond: parameterSortSecond.node().value,
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
                firstAggeragateAttribute: inputValue,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                filterPara: filterElement.node().value,
                treeData: treeData,
                attributeSelect: multiAttribute
            });
            addClickToSet();
        }); // when we click the second aggeragate option;

    secondAggeragate
        .select("select").node()
        .addEventListener("input", (d) => {
            var inputValue = d.currentTarget.value;

            // Visualize the Linechart when the second agregation is the trend;
            LineChart({
                data: dataset,
                dataJson: dataJson,
                node: svgLine.node(),
                n: +nPara.select('input').node().value,
                brushedAttributes: svgLine.select("#time-brush").node().value,
                lineWidth: +lineWidth.select("input").node().value,
                secondAggeragateAttribute: inputValue,
                // secondAggeragateAttribute: secondAggeragate
                //     .select("select")
                //     .node().value,
                classMethod: classMethod.selectAll('input')._groups[0][1].checked
                    ? classMethod.selectAll('input')._groups[0][1].value
                    : classMethod.selectAll('input')._groups[0][0].value,
                firstAggeragateAttribute: firstAggeragate
                    .select("select")
                    .node().value
            }); // visualize the line chart
            // addClickToSort();

            treeData = CalTreData({
                dataFromFuzzy: categoryData,
                dataset: dataset,
                attributesCut: dataJson.temporalAttributes,
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                dataJson: dataJson,
                brushedAttributes: brushedAttributes,
                secondAggeragateAttribute: inputValue,
                firstAggeragateAttribute: firstAggeragate
                    .select("select")
                    .node().value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                attributeSelect: multiAttribute
            }); // generate the tree data;

            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                orderSecond: parameterSortSecond.node().value,
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
                    .value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                filterPara: filterElement.node().value,
                treeData: treeData,
                attributeSelect: multiAttribute
            });
            addClickToSet();
        }); // when we click the second aggeragate option;

    collapse.node().addEventListener("input", d => {
        debugger;
        var inputValue = d3.select(d.currentTarget).selectAll('input')._groups[0][1].checked
            ? d3.select(d.currentTarget).selectAll('input')._groups[0][1].value
            : d3.select(d.currentTarget).selectAll('input')._groups[0][0].value


            treeData = CalTreData({
                dataFromFuzzy: categoryData,
                dataset: dataset,
                attributesCut: dataJson.temporalAttributes,
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                dataJson: dataJson,
                brushedAttributes: brushedAttributes,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: firstAggeragate
                    .select("select")
                    .node().value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                attributeSelect: multiAttribute
            }); // generate the tree data;

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: svgLine.node().parentElement.value[0].name,
            orderSecond: parameterSortSecond.node().value,
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
            collapse: inputValue,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();
    })

    filterElement.on('input', d => {
        debugger;
        treeData = CalTreData({
            dataFromFuzzy: categoryData,
            dataset: dataset,
            attributesCut: dataJson.temporalAttributes,
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            dataJson: dataJson,
            brushedAttributes: brushedAttributes,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            attributeSelect: multiAttribute
        }); // generate the tree data;

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: svgLine.node().parentElement.value[0].name,
            orderSecond: parameterSortSecond.node().value,
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
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: d.currentTarget.value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();
    })

    addClickToSet();
    function addClickToSet() {
        svgMatrix.selectAll('.set').selectAll('#selected-rect-group').on('click', d => {
            debugger;
            d.currentTarget.__data__.expand == 'true' ? d.currentTarget.__data__.expand = 'false' : d.currentTarget.__data__.expand = 'true';
            // d.currentTarget.__data__ == 
            var newTreData = d3.select(d.currentTarget.parentElement.parentElement.parentElement).selectAll('.set').data();

            treeData = CalTreData({
                dataFromFuzzy: categoryData,
                dataset: dataset,
                attributesCut: dataJson.temporalAttributes,
                empty: isEmpty.selectAll('input')._groups[0][1].checked
                    ? isEmpty.selectAll('input')._groups[0][1].value
                    : isEmpty.selectAll('input')._groups[0][0].value,
                dataJson: dataJson,
                brushedAttributes: brushedAttributes,
                secondAggeragateAttribute: secondAggeragate
                    .select("select")
                    .node().value,
                firstAggeragateAttribute: firstAggeragate
                    .select("select")
                    .node().value,
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                attributeSelect: multiAttribute
            }); // generate the tree data;

            renderCombinationMatrix({
                node: svgMatrix.node(),
                dataFromFuzzy: svgLine.node().parentElement.value,
                orderCate: svgLine.node().parentElement.value[0].name,
                orderSecond: parameterSortSecond.node().value,
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
                collapse: collapse.selectAll('input')._groups[0][1].checked
                    ? collapse.selectAll('input')._groups[0][1].value
                    : collapse.selectAll('input')._groups[0][0].value,
                filterPara: filterElement.node().value,
                treeData: treeData,
                attributeSelect: multiAttribute
            });
            addClickToSet();
        }) // when we click the collapse and expand sets (first level sets)
    }


    // colorScale.on('input', d => {
    //     debugger;
    //     LineChart({
    //         data: dataset,
    //         dataJson: dataJson,
    //         node: svgLine.node(),
    //         n: +nPara.select('input').node().value,
    //         brushedAttributes: svgLine.select("#time-brush").node().value,
    //         lineWidth: +lineWidth.select("input").node().value,
    //         colorCategory: d.currentTarget.value,
    //         secondAggeragateAttribute: secondAggeragate
    //             .select("select")
    //             .node().value,
    //         classMethod: classMethod.selectAll('input')._groups[0][1].checked
    //             ? classMethod.selectAll('input')._groups[0][1].value
    //             : classMethod.selectAll('input')._groups[0][0].value
    //     }); // visualize the line chart
    //     // debugger;
    // })// when we change the color scales;

    // When we sort the combination matrix while clicking the sort dropdown
    // addClickToSort();
    // function addClickToSort() {
    parameterSort.on('input', d => {
        debugger;
        // Define the parameters upated in this interaction, new sorting values
        var sortValue = d.currentTarget.querySelector('select').value

        // Get the saved tree data;
        var newTreData = d.path[3]
            .querySelector('#layout-right')
            .querySelector('#div-matrix')
            .querySelector('svg')
            .value

        treeData = CalTreData({
            dataFromFuzzy: categoryData,
            dataset: dataset,
            attributesCut: dataJson.temporalAttributes,
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            dataJson: dataJson,
            brushedAttributes: brushedAttributes,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            attributeSelect: multiAttribute
        }); // generate the tree data;
        // re-draw the combinatiom matrix based on the new sorting input
        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: sortValue,
            orderSecond: parameterSortSecond.node().value,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
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
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();

    });

    // When we sort the subsets;
    parameterSortSecond.on('input', d => {
        debugger;
        // Define the parameters upated in this interaction, new sorting values
        var sortValue = d.currentTarget.querySelector('select').value
        // Get the saved tree data;
        var newTreData = d.path[3]
            .querySelector('#layout-right')
            .querySelector('#div-matrix')
            .querySelector('svg')
            .value


        treeData = CalTreData({
            dataFromFuzzy: categoryData,
            dataset: dataset,
            attributesCut: dataJson.temporalAttributes,
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            dataJson: dataJson,
            brushedAttributes: brushedAttributes,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            attributeSelect: multiAttribute
        }); // generate the tree data;
        // re-draw the combinatiom matrix based on the new sorting input
        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: parameterSort.node().value,
            orderSecond: sortValue,
            dataset: dataset,
            id: dataJson.id,
            attributesCut: dataJson.temporalAttributes,
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
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();
    })

    // }

    divLine.node().addEventListener('input', d => {
        debugger;

        connectionLine({
            selfNode: svgLine
                .node()
                .parentElement.parentElement.querySelector("#layout-right-top-left"),
            dataFromFuzzy: svgLine.node().parentElement.value,
            dataJson: dataJson,
            dataset: dataset
        });  // visualize the connection area in connection node;

        treeData = CalTreData({
            dataFromFuzzy: categoryData,
            dataset: dataset,
            attributesCut: dataJson.temporalAttributes,
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            dataJson: dataJson,
            brushedAttributes: brushedAttributes,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            attributeSelect: multiAttribute
        }); // generate the tree data;

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: parameterSort.node().value,
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();
    })  // when we change drag the diamond;

    classMethod.node().addEventListener("input", (d) => {
        debugger;
        var clusterValue;
        if (d3.select(d.currentTarget).selectAll("input")._groups[0][0].checked) {
            clusterValue = d3.select(d.currentTarget).selectAll("input")._groups[0][0]
                .value;
        } else {
            clusterValue = d3.select(d.currentTarget).selectAll("input")._groups[0][1]
                .value;
        }

        LineChart({
            data: dataset,
            dataJson: dataJson,
            node: svgLine.node(),
            n: +nPara.select('input').node().value,
            brushedAttributes: svgLine.select("#time-brush").node().value,
            lineWidth: +lineWidth.select("input").node().value,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            classMethod: clusterValue,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value
        }); // visualize the line chart
        // addClickToSort();

        treeData = CalTreData({
            dataFromFuzzy: categoryData,
            dataset: dataset,
            attributesCut: dataJson.temporalAttributes,
            empty: isEmpty.selectAll('input')._groups[0][1].checked
                ? isEmpty.selectAll('input')._groups[0][1].value
                : isEmpty.selectAll('input')._groups[0][0].value,
            dataJson: dataJson,
            brushedAttributes: brushedAttributes,
            secondAggeragateAttribute: secondAggeragate
                .select("select")
                .node().value,
            firstAggeragateAttribute: firstAggeragate
                .select("select")
                .node().value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            attributeSelect: multiAttribute
        }); // generate the tree data;

        renderCombinationMatrix({
            node: svgMatrix.node(),
            dataFromFuzzy: svgLine.node().parentElement.value,
            orderCate: parameterSort.node().value,
            orderSecond: parameterSortSecond.node().value,
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
                .value,
            collapse: collapse.selectAll('input')._groups[0][1].checked
                ? collapse.selectAll('input')._groups[0][1].value
                : collapse.selectAll('input')._groups[0][0].value,
            filterPara: filterElement.node().value,
            treeData: treeData,
            attributeSelect: multiAttribute
        });
        addClickToSet();

    })

    nameCategory.node().addEventListener('input', d => {
        debugger;
    })  // when we change the name of categories

    attributeSelectNode.addEventListener('input', d => {
        debugger;
    })
}