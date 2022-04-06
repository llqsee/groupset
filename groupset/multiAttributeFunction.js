function RenderAttributeSelection(
    {
        attributes,
        node
    }
) {
    // debugger;
    // -----------------------------
    // variables
    var scrollWidth = 20,
        width = node.getBoundingClientRect().width - 20,
        height = node.getBoundingClientRect().height,
        margin = { left: 0, right: 0, top: 5, bottom: 5 },
        heightAttribute = 20,
        selectSvg,
        gapWidthAttr = 0;

    // ----------------------------------
    // Visualize the attribute view

    if (attributes.length >= 3) {
        selectSvg = d3.select(node)
            .selectAll('.select-attribute')
            .data([1, 2, 3])
            .join('select')
            .attr('class', 'select-attribute')
            .attr('id', (d, i) => i)
            .attr('x', (d, i) => margin.left + i * (width - margin.left - margin.right) / 3)
            .attr('y', height - heightAttribute)
            .style('width', ((+width - margin.left - margin.right) / 3 - gapWidthAttr) + 'px')
            .style('height', heightAttribute + 'px')
            .on('input', d => {
                debugger;
                multiAttribute[d.currentTarget.__data__].name = d.currentTarget.value;  // update the multiAttribute

                // multiAttribute.map((e,i) => {
                //     if(i == d.currentTarget.__data__){
                //         e.name = d.currentTarget.value;
                //     };
                //     return e;
                // })

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
                });         // update the combination matrix;
                // addClickToSet();
            })
            .selectAll('option')
            .data(attributes)
            .join('option')
            // .property("selected", (d,i) => d == attributes[i].name)
            .attr('value', d => d.name)
            .text(d => d.name)

    } else {
    //     let dataAttribute = d3.range(attributes.length).map((d,i) => {let e = {}; 
    //     e.options = attributes;
    //     e.index = i;
    //     return e;
    // })
        selectSvg = d3.select(node)
            .selectAll('.select-attribute')
            .data(attributes)
            // .data(d3.range(attributes.length))
            .join('select')
            .attr('class','select-attribute')
            .attr('id', (d, i) => i)
            .attr('x', (d, i) => margin.left + i * (width - margin.left - margin.right) / 3)
            .attr('y', height - heightAttribute)
            .style('width', ((+width - margin.left - margin.right) / 3 - gapWidthAttr) + 'px')
            .style('height', heightAttribute + 'px')
            .on('input', d => {
                debugger;
                multiAttribute[d.currentTarget.__data__].name = d.currentTarget.value;  // update the multiAttribute

                // multiAttribute.map((e,i) => {
                //     if(i == d.currentTarget.__data__){
                //         e.name = d.currentTarget.value;
                //     };
                //     return e;
                // })
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
                });         // update the combination matrix;
                // addClickToSet();
            })
            .selectAll('option')
            // .data(attributes)
            .data(d => [d])
            .join('option')
            .attr('value', d => d.name)
            // .property('selected', d => d.name)
            .text(d => d.name)
            // .property("selected", (d,i) => d.name === attributes[d.options.index].name)

    }

    if (attributes.length >= 3) {
        multiAttribute = [attributes[0], attributes[1], attributes[2]];
    } else {
        multiAttribute = d3.range(attributes.length).map((d,i) => attributes[i]);
    }

    // selectSvg = svgForeign.append('select').attr('class','attribute-selection')

    // selectSvg
    //     .selectAll('option').data([1, 2, 3])
    //     .join('option')
    //     .attr('value', d => d)
    //     .text(d => d)

}
