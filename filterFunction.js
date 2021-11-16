function AddFilterPanel(category, node, brushedAttributes) {
    debugger;
    var insertTag = node.parentElement
        .parentElement
        .parentElement
        .parentElement
        .querySelector('#layout-left')
        .querySelector('.parameter-filter')    // the parent element we will insert the selection

    // Calculate the width of parameter-filter
    // var width = d3.select(node.parentElement
    //     .parentElement
    //     .parentElement
    //     .parentElement
    //     .querySelector('#layout-left')
    //     .querySelector('.parameter-filter')).attr('width')
    d3.select(insertTag).style('background-color', '#dedede')

    // ------------------------------------------
    // Visualize the category selection

    
    var CategorySelector = d3.select(insertTag)
        .selectAll('#filter-form')
        .data([category])
        .join('form')
        .attr('id', 'filter-form')       // create a div for insert the category selection

    CategorySelector.selectAll('div')
        .data(d => [d])
        .join('div')
        .style('font-weight', 'bold')
        .style('margin-top', '1em')
        .style('font-size', '12px')
        .text('Select filtering category')

    CategorySelector.selectAll('select')
        .data(d => [d])
        .join('select')
        .selectAll('option')
        .data(d => d)
        .join('option')
        .attr('value', d => d.name)
        .text(d => d.name)

    CategorySelector.select('select').on('input', d => {
        // debugger;
        insertTag.value = [d.currentTarget.value
            , minValue.node().value
            , maxValue.node().value]
        insertTag.dispatchEvent(new CustomEvent("input"));
    })            // we change the group values of filter function while change the category;

    // --------------------------------------
    // visualize the minimum value

    var MinForm = d3.select(insertTag)
        .selectAll('#min-selector')
        .data([category])
        .join('form')
        .attr('id', 'min-selector')

    MinForm.selectAll('div')
        .data(d => [d])
        .join('div')
        .style('font-weight', 'bold')
        .style('margin-top', '1em')
        .style('font-size', '12px')
        .text('Minimum value')

    var minValue = MinForm.selectAll('input')
        .data(d => [d])
        .join('input')
        .attr('type', 'number')
        .attr('value', 0)
        .attr('min', 0)
        .attr('max', brushedAttributes.length)

    minValue.on('input', d => {
        insertTag.value = [CategorySelector.select('select').node().value
            , d.currentTarget.value
            , maxValue.node().value]
        insertTag.dispatchEvent(new CustomEvent("input"));
    })       // we change the group values of filter function while changing the mimum value

    // -----------------------------
    // visualize the maximum value
    var MaxForm = d3.select(insertTag)
        .selectAll('#max-selector')
        .data([category])
        .join('form')
        .attr('id', 'max-selector')

    MaxForm.selectAll('div')
        .data(d => [d])
        .join('div')
        .style('font-weight', 'bold')
        .style('margin-top', '1em')
        .style('font-size', '12px')
        .text('Maximum value')

    var maxValue = MaxForm.selectAll('input')
        .data(d => [d])
        .join('input')
        .attr('type', 'number')
        .attr('value', brushedAttributes.length)
        .attr('min', 0)
        .attr('max', brushedAttributes.length)

    maxValue.on('input', d => {
        insertTag.value = [CategorySelector.select('select').node().value
            , minValue.node().value
            , d.currentTarget.value]
        insertTag.dispatchEvent(new CustomEvent("input"));
    })   // we change the group values of filter function while changing the maximum value


    insertTag.value = [CategorySelector.select('select').node().value
        , minValue.node().value
        , maxValue.node().value]
    insertTag.dispatchEvent(new CustomEvent("input"));

}