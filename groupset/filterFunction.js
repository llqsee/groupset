function AddFilterPanel(category, node, brushedAttributes) {
    var textSize = '12px';
    var textSizeSmall = '10px'
    debugger;
    var insertTag = node.parentElement
        .parentElement
        .parentElement
        .parentElement
        .querySelector('#layout-left')
        .querySelector('.parameter-filter')    // the parent element we will insert the selection

    // Calculate the width of parameter-filter
    var width = d3.select(node.parentElement
        .parentElement
        .parentElement
        .parentElement
        .querySelector('#layout-left')
    ).node().getBoundingClientRect().width;

    // Create the container for filter form;
    d3.select(insertTag)
        .style('background-color', '#dedede')
        .attr('float', 'left')
        .style('width', '150px')
        .selectAll('.filter-form')
        .data(category)
        .join('form')
        .attr('class', 'filter-form')
        .attr('id', (d, i) => 'filter-form-' + i)

    // we loop the category to create the minimum and maximum values
    var outputData = []
    category.map((dt, i) => {

        d3.select(insertTag).select('#' + 'filter-form-' + i)
            .selectAll('#filter-method')
            .data([category])
            .join('div')
            .attr('id', 'filter-method')
            .text(d => 'Filter by ' + category[i].name)
            .style('font-weight', 'bold')
            .style('margin-top', '1em')
            .style('font-size', textSize)


        // visualize the minimum value
        var minTag = d3.select(insertTag).select('#' + 'filter-form-' + i)
            .selectAll('#filter-form-' + i + '-min')
            .data([category])
            .join('form')
            .attr('id', 'filter-form-' + i + '-min')

        // minTag.selectAll('div')
        // .data(d => [d])
        // .join('div')
        // .style('font-weight', 'bold')
        // .style('margin-top', '1em')
        // .style('font-size', '12px')
        // .text('Filter by' +" "+ category[i].name)

        minTag.selectAll('input')
            .data(d => [d])
            .join('input')
            // .attr('id', 'filter-form-' + i + 'min')
            .attr('type', 'number')
            .attr('value', 0)
            .attr('min', 0)
            .attr('max', brushedAttributes.length)
            .on('input', d => {
                debugger;
                var inputValue = +d.currentTarget.value;
                outputData.find(e => e.name == category[i].name).min = inputValue;
                insertTag.value = outputData;
                insertTag.dispatchEvent(new CustomEvent("input"));
            })

        minTag.selectAll('label')
            .data(d => [d])
            .join('label')
            .text('Minimum value')
            .style('margin-top', '1em')
            .style('font-size', textSizeSmall)

        // visualize the maximum value
        var maxTag = d3.select(insertTag).select('#' + 'filter-form-' + i)
            .selectAll('#filter-form-' + i + '-max')
            .data([category])
            .join('form')
            .attr('id', 'filter-form-' + i + '-max')

        maxTag.selectAll('input')
            .data(d => [d])
            .join('input')
            .attr('type', 'number')
            .attr('value', brushedAttributes.length)
            .attr('min', 0)
            .attr('max', brushedAttributes.length)
            .on('input', d => {
                var inputValue = +d.currentTarget.value;
                outputData.find(e => e.name == category[i].name).max = inputValue;
                insertTag.value = outputData;
                insertTag.dispatchEvent(new CustomEvent("input"));
            })


        maxTag.selectAll('label')
            .data(d => [d])
            .join('label')
            .text('Maximum value')
            .style('margin-top', '1em')
            .style('font-size', textSizeSmall)

        var smallData = { name: category[i].name, min: +minTag.node().querySelector('input').value, max: +maxTag.node().querySelector('input').value };
        outputData.push(smallData)
    })



    // // ------------------------------------------
    // // Visualize the category selection


    // var CategorySelector = d3.select(insertTag)
    //     .selectAll('.filter-form')
    //     .data(category)
    //     .join('form')
    //     .attr('class', 'filter-form')
    //     .attr('id', d => d.name)       // create a div for insert the category selection

    // // CategorySelector.selectAll('div')
    // //     .data(d => [d])
    // //     .join('div')
    // //     .style('font-weight', 'bold')
    // //     .style('margin-top', '1em')
    // //     .style('font-size', '12px')
    // //     .text('Select filtering category')

    // CategorySelector.selectAll('select')
    //     .data(d => [d])
    //     .join('select')
    //     .selectAll('option')
    //     .data(d => d)
    //     .join('option')
    //     .attr('value', d => d.name)
    //     .text(d => d.name)

    // CategorySelector.select('select').on('input', d => {
    //     // debugger;
    //     insertTag.value = [d.currentTarget.value
    //         , minValue.node().value
    //         , maxValue.node().value]
    //     insertTag.dispatchEvent(new CustomEvent("input"));
    // })            // we change the group values of filter function while change the category;

    // // --------------------------------------
    // // visualize the minimum value

    // var MinForm = d3.select(insertTag)
    //     .selectAll('#min-selector')
    //     .data([category])
    //     .join('form')
    //     .attr('id', 'min-selector')

    // MinForm.selectAll('div')
    //     .data(d => [d])
    //     .join('div')
    //     .style('font-weight', 'bold')
    //     .style('margin-top', '1em')
    //     .style('font-size', '12px')
    //     .text('Minimum value')

    // var minValue = MinForm.selectAll('input')
    //     .data(d => [d])
    //     .join('input')
    //     .attr('type', 'number')
    //     .attr('value', 0)
    //     .attr('min', 0)
    //     .attr('max', brushedAttributes.length)

    // minValue.on('input', d => {
    //     insertTag.value = [CategorySelector.select('select').node().value
    //         , d.currentTarget.value
    //         , maxValue.node().value]
    //     insertTag.dispatchEvent(new CustomEvent("input"));
    // })       // we change the group values of filter function while changing the mimum value

    // // -----------------------------
    // // visualize the maximum value
    // var MaxForm = d3.select(insertTag)
    //     .selectAll('#max-selector')
    //     .data([category])
    //     .join('form')
    //     .attr('id', 'max-selector')

    // MaxForm.selectAll('div')
    //     .data(d => [d])
    //     .join('div')
    //     .style('font-weight', 'bold')
    //     .style('margin-top', '1em')
    //     .style('font-size', '12px')
    //     .text('Maximum value')

    // var maxValue = MaxForm.selectAll('input')
    //     .data(d => [d])
    //     .join('input')
    //     .attr('type', 'number')
    //     .attr('value', brushedAttributes.length)
    //     .attr('min', 0)
    //     .attr('max', brushedAttributes.length)

    // maxValue.on('input', d => {
    //     insertTag.value = [CategorySelector.select('select').node().value
    //         , minValue.node().value
    //         , d.currentTarget.value]
    //     insertTag.dispatchEvent(new CustomEvent("input"));
    // })   // we change the group values of filter function while changing the maximum value


    insertTag.value = outputData;
    insertTag.dispatchEvent(new CustomEvent("input"));

}