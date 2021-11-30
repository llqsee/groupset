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
        selectSvg

    // ----------------------------------
    // Visualize the attribute view

    if (attributes.length >= 3) {
        selectSvg = d3.select(node)
            .selectAll('select')
            .data([1, 2, 3])
            .join('select')
            .attr('id', (d, i) => i)
            .attr('x', (d, i) => margin.left + i * (width - margin.left - margin.right) / 3)
            .attr('y', height - heightAttribute)
            .style('width', ((+width - margin.left - margin.right) / 3) + 'px')
            .style('height', heightAttribute + 'px')
            .selectAll('option')
            .data(attributes)
            .join('option')
            .attr('value', d => d.name)
            .text(d => d.name)
    } else {
        selectSvg = d3.select(node)
            .selectAll('select')
            .data(d3.range(attributes.length))
            .join('select')
            .attr('id', (d, i) => i)
            .attr('x', (d, i) => margin.left + i * (width - margin.left - margin.right) / 3)
            .attr('y', height - heightAttribute)
            .style('width', ((+width - margin.left - margin.right) / 3) + 'px')
            .style('height', heightAttribute + 'px')
            .selectAll('option')
            .data(attributes)
            .join('option')
            .attr('value', d => d.name)
            .text(d => d.name)
    }

    if (attributes.length >= 3) {
        multiAttribute = [attributes[0],attributes[0],attributes[0]];
    } else {
        multiAttribute = d3.range(attributes.length).map(d => attributes[0]);
    }

    // selectSvg = svgForeign.append('select').attr('class','attribute-selection')

    // selectSvg
    //     .selectAll('option').data([1, 2, 3])
    //     .join('option')
    //     .attr('value', d => d)
    //     .text(d => d)

}