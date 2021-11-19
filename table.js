function tableFun(x,rows,node) {
    // console.log(x)
    // debugger
    var x = x.slice(0,50);

    d3.select(node).selectAll('*').remove();

    table = d3.select(node).append('table')
        .style("border-collapse", "collapse")
        .style("border", "2px black solid");

    // headers
    table.append("thead").append("tr")
        .selectAll("th")
        .data(rows)
        .enter().append("th")
        .text(function (d) { return d; })
        .style("border", "1px black solid")
        .style("padding", "1px")
        .style("background-color", "lightgray")
        .style("font-weight", "bold")
        .style("font-size","7px")
        .style("text-transform", "uppercase");
    // debugger
    // data
    table.append("tbody")
        .selectAll("tr").data(x, d => d)
        .enter().append("tr")
        .on("mouseover", function () {
            d3.select(this).style("background-color", "powderblue");
        })
        .on("mouseout", function () {
            d3.select(this).style("background-color", "white");
        })
        .selectAll("td")
        .data(e => transfertoArray(e, rows))
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "1px")
        .text(function (d) { return d; })
        .style("font-size", "7px");
};

function transfertoArray(y, rows) {
    myArray = [];
    for (var i = 0; i < rows.length; i++) {
        myArray.push(y[rows[i]]);
    };
    return myArray;

};