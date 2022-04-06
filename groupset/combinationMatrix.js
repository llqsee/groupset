// var abc = require('./colorscales.js');

// const { join } = require("path");

function renderCombinationMatrix({
  dataFromFuzzy, // the data from fuzzycut
  orderCate, // the category that we are going to use it order the matrix
  orderSecond,      // the second time order;
  node,
  margin,
  dataset, // raw dataset
  dataJson, // dataJson
  attributesCut, // the all attributes that are as multi-variables
  degrees, // the filtered degrees;
  setMember, // the filtered set membership
  probability, // the filtered probability of each set membership
  id, // the id for each element
  circleType, // if it is number or pie
  type, // the type of categorical attribute
  empty, // if the tree data have the sets not including elements;
  brushedAttributes, // the parameters from brush, such as ['1','2','3','4']
  yHeight, // the height of the sets, a value such as 30, etc.
  oneAttribute, // the attribute column following the lines in each set
  lineWidth, // the width of lines in each set
  firstAggeragateAttribute, // the first aggeragate attribute
  secondAggeragateAttribute, // the second aggeragate attribute
  collapse,           // the collapse or expand;
  filterPara,      // the data for filtering something
  treeData,       // the default tree data
  attributeSelect   // the selected attributes to be visualized as box chart;
} = {}) {
  //   ----------------------------------------
  //   remove the all elements except the ordering buttons
  // d3.select(node).selectAll(".class").remove();
  // d3.select(node).select("#bars").remove();
  // d3.select(node).select("#y-label").remove();
  // d3.select(node).selectAll(".set").remove();
  debugger;
  var margin = margin || { top: 20, left: 15, bottom: 20, right: 70 },
    dimension = dimension || 2,
    oneAttribute = oneAttribute || "Average",
    scrollWidth = 20,
    lineWidth = lineWidth || 3,
    brushedAttributes = brushedAttributes || attributesCut,
    data = treeData,
    trendCate = ['up', 'down', 'stable'],
    width = Number(d3.select(node).attr("width")) * 0.8,
    x_range_trend,    // the scale of vertical rects in trend area;
    xRangeTrend,         // the range of vertical rects in trend area;
    xScaleTrend,        // the scale of vertical rects in trend area;
    xScaleTrend,        // the scale of vertical rects in trend area;
    xScaleMultiAttribute,  // the x scale for the multiple attribute view;
    multiAttributeSvg,      // the svg container for multiple attributes view;
    marginAttributeView = { left: 0, right: 0, top: 5, bottom: 5 },  // the margin of attribute view;
    stepAttributeView = (width / 0.8 - width - marginAttributeView.left - marginAttributeView.right - scrollWidth) / 3,   // the step of the attribute view;
    multiAttributeSubSetSvg   // the svg for the multiple attribute view in sub sets;

  // filter the treeData based on the degreess
  // var firstAggeragateValue = node.parentElement.parentElement.parentElement.parentElement.querySelector('#layout-left').querySelector('.parameter-first').querySelector('select').value;
  // if (firstAggeragateValue == 'Category') {
  //   data = data.filter(d => +d.value[filterPara[0]] >= +filterPara[1] && +d.value[filterPara[0]] <= +filterPara[2])
  // }

  for (var i of filterPara) {
    data = data.filter(d => d.categoryGroup[i.name] >= i.min && d.categoryGroup[i.name] <= i.max);
  }

  // var dataoutput = [];
  // var concatData = [];
  // for (var i = 0; i < degrees.length; i++) {
  //   concatData = concatData.concat(
  //     data.filter(
  //       (d) =>
  //         dataFromFuzzy
  //           .map((e) => e.name)
  //           .map((e, i, s) => s.indexOf(e) === i)
  //           .map((e) => d.value[e])
  //           .filter((f) => f != 0).length == +degrees[i]
  //     )
  //   ); // filter based on the degrees
  // }

  //--------------------
  //filter the data based on set membership and probability
  // for (var j = 0; j < setMember.length; j++) {
  //   concatData = concatData.filter((d) => d.value[setMember[j]] != 0); // filter based on the set membership
  //   concatData = concatData.filter(
  //     (d) =>
  //       d.value[setMember[j]] /
  //         dataFromFuzzy
  //           .map((e) => e.name)
  //           .map((e, i, s) => s.indexOf(e) === i)
  //           .map((e) => d.value[e])
  //           .reduce((a, b) => a + b) >=
  //         probability[j][0] &&
  //       d.value[setMember[j]] /
  //         dataFromFuzzy
  //           .map((e) => e.name)
  //           .map((e, i, s) => s.indexOf(e) === i)
  //           .map((e) => d.value[e])
  //           .reduce((a, b) => a + b) <=
  //         probability[j][1]
  //   ); // filter based on the probability
  // }
  // dataoutput = dataoutput.concat(concatData); // calculate the dataoutput

  // data = dataoutput;



  if (data.length != 0) {

    // -----------------------------------
    // Reorder the sets number
    if (orderCate == "cardinality") {
      data.sort((a, b) => b[1].length - a[1].length);
    } else if (dataFromFuzzy.findIndex((d) => 'degree-' + d.name == orderCate) != -1) {
      data.sort((a, b) => b.categoryGroup[orderCate.split('-')[1]] - a.categoryGroup[orderCate.split('-')[1]]); // re-order the treedata
    } else if (
      orderCate == "up" ||
      orderCate == "down" ||
      orderCate == "stable"
    ) {
      data.sort((a, b) => b.trendGroup[orderCate] - a.trendGroup[orderCate]); // re-order the treedata based on the trends
    }

    if (orderSecond == "cardinality") {
      data.map(d => {
        d[1].sort((a, b) => b[1].length - a[1].length)
        return d;
      })
      // data.sort((a, b) => b[1].length - a[1].length)
    } else if (dataFromFuzzy.findIndex((d) => 'degree-' + d.name == orderSecond) != -1) {
      data.map(d => {
        d[1].sort((a, b) => b.categoryGroup[orderSecond.split('-')[1]] - a.categoryGroup[orderSecond.split('-')[1]])
        return d;
      })
    } else if (
      orderSecond == "up" ||
      orderSecond == "down" ||
      orderSecond == "stable"
    ) {
      data.map(d => {
        d[1].sort((a, b) => b.trendGroup[orderSecond] - a.trendGroup[orderSecond])
        return d;
      })
    }

    // give the set and subset new id;
    data.map((d, i) => {
      d.id = i;
      d[1].map((e, j) => e.id = i + "_" + j)
    })


    // if the data.length is not 0, we visualize the combination matrix

    // create the UI of combination matrix;
    var svg = d3.select(node);
    var setId = data.map((d) => d.name);
    var widthMatrixLeft = 40; // this part is for y-labels (set 1)
    var widthAttribute = 100;
    var categories = dataFromFuzzy.map((d) => d.name);
    if (dataJson.rank == "yes") {
      categories = categories.reverse();
    }
    var x_step =
      (d3.select(node).attr("width") * 0.15 * 0.8 - widthMatrixLeft - margin.left) /
      4,
      y_step = yHeight || 30,
      y_step_group = 25;
    var widthTrend = x_step * 3;
    var widthDistribution =
      width -
      margin.right -
      margin.left -
      widthMatrixLeft -
      x_step * categories.length;
    var widthMultipleLine = width * 0.85;


    d3.select(node).attr(
      "height",
      y_step_group * data.length +
      y_step * data.map((d) => d[1].length).reduce((a, b) => a + b) + margin.top
    ); // calculate the height of svg node;
    var height = d3.select(node).attr("height");

    // create the x and y scales
    var x_range = categories.map(
      (d, i) => margin.left + widthMatrixLeft + 0.5 * x_step + x_step * (3 - i)
    );
    var y_range = setId.map((d, i) => margin.top + 0.5 * y_step + y_step * i);
    var x = d3.scaleOrdinal().domain(categories).range(x_range);
    var y = d3.scaleOrdinal().domain(setId).range(y_range);
    var xLine = d3
      .scalePoint()
      .range([
        90 + width * 0.15 + widthTrend,
        width - margin.right - widthAttribute
      ]) // the line charts' margin.left is equal to 90
      .domain(brushedAttributes);
    // .padding(0);
    var max_r = Math.min(x_step * 0.4, y_step_group * 0.4);

    // var maxRDomain = (function maxR() {
    //   function sumArray(arr) {
    //     var total = 0;
    //     for (var i of arr) {
    //       total = total + i;
    //     }
    //     return total;
    //   }
    //   var ab = data.map((d) => {
    //     var data = d.childNode.length;
    //     return data;
    //   });
    //   var j = [];
    //   for (var i of ab) {
    //     j.push(sumArray(i));
    //   }
    //   return d3.max(j);
    // })();
    // var r = d3.scaleLinear().domain([0, maxRDomain]).range([0, max_r]);

    // d3.select(node).selectAll(".circle").remove();

    // calculate the translate function;
    debugger;
    function CalculateTranslate(data, index, heightFirst, heightSecond, collapse) {
      var a = data.slice(0, index);   // this a represents the sets before the set we are calculating.
      var translateDistance;
      if (a.length == 0) {
        translateDistance = 0 + margin.top;
      } else if (a.length != 0) {
        var dis1 = a.length * heightFirst;
        var dis2 = a.map(d => d.expand == 'true' ? d[1].length : 0);
        if (dis2.length != 0) {
          translateDistance = dis1 + dis2.reduce((a, b) => a + b) * heightSecond + margin.top;
        } else {
          translateDistance = dis1 + margin.top;
        }
      }
      // if (collapse == 'expand') {
      //   if (a.length == 0) {
      //     translateDistance = 0;
      //   } else if (a.length != 0) {
      //     if(a.map(d => d.childNode.length).length != 0){
      //       translateDistance = a.length * heightFirst
      //       + a.map(d => d.childNode.length)
      //         .reduce((c, e) => c + e) * heightSecond
      //     }else{
      //       translateDistance = a.length * heightFirst 
      //     }
      //   }
      // } else if(collapse == 'collapse'){
      //   translateDistance = a.length * heightFirst
      // }
      return translateDistance;
    }


    // calculate the translate function for subsets;
    function CalculateTranslateSubSet(data, id, heightFirst, heightSecond) {
      var array = id.split("_").map((d) => Number(d));

      var translateDistance;
      if (a.length == 0) {
        translateDistance = heightFirst + array[1] * heightSecond + margin.top;
      } else if (a.length != 0) {
        var dis1 = a.length * heightFirst;
        var dis2 = a.map(d => d.expand == 'true' ? d[1].length : 0);
        if (dis2.length != 0) {
          translateDistance = dis1 + dis2.reduce((a, b) => a + b) * heightSecond
            + heightFirst + array[1] * heightSecond + margin.top
        } else {
          translateDistance = dis1 + heightSecond + margin.top;
        }
      }

      // var a = data.slice(0, array[0]);
      // a.length == 0
      //   ? (array[1] + 1) * heightSecond
      //   : a.lenght * heightFirst +
      //   a.map((d) => d.childNode.length).reduce((c, e) => c + e) *
      //   heightSecond +
      //   (array[1] + 1) * heightSecond;
    }

    // create the set-based 'g' elements;
    var gRect = d3
      .select(node)
      .selectAll("g.set")
      .data(data)
      .join("g")
      .attr("class", "set")
      .attr("transform", (d, i) => {
        return `translate(${0},${CalculateTranslate(data, i, y_step_group, y_step, collapse)
          })`;
      });
    var t = gRect.transition().duration(750);

    // -----------------------------------------------------
    // visualize the vertical lines for each time points
    var verticalLine = (d) =>
      d3.line()([
        [xLine(d), margin.top],
        [xLine(d), CalculateTranslate(data, data.length, y_step_group, y_step, collapse)]
      ]);
    var verticalSVG = svg.selectAll("#vertical-line").data([brushedAttributes]).join('g')
      .attr('id', 'vertical-line');

    verticalSVG
      .selectAll("path")
      .data(d => d)
      .join("path")
      .attr("d", verticalLine)
      .attr("stroke-width", 1)
      .attr("stroke", "grey")
      .attr("opacity", 0.4)
      .attr("stroke-dasharray", "3,6");

    verticalSVG.selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => xLine(d) - d3.min([xLine.step(), 25]) * 0.5)
      .attr('y', margin.top)
      .attr('width', d3.min([xLine.step(), 25]))
      .attr('height', CalculateTranslate(data, data.length, y_step_group, y_step, collapse))
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .attr('stroke-width', 0)
    //   .on('mouseenter', d => {
    //     debugger;
    //   })


    // var verticalData = attributesCut;
    // verticalData.numberSet = data.length;

    // svg
    //   .selectAll(".vertical-line-groups")
    //   .data([1])
    //   .join("g")
    //   .attr("class", "vertical-line-groups")
    //   .selectAll(".vertical-line")
    //   .data(attributesCut)
    //   .join("path")
    //   .attr("class", "vertical-line")
    //   .attr("d", verticalLine)
    //   .attr("stroke-width", 1)
    //   .attr("stroke", "grey")
    //   .attr("opacity", 0.4)
    //   .attr("stroke-dasharray", "3,6");
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------
    // render the rectangles for hover the specific sets;
    gRect
      .selectAll("#selected-rect-group")
      .data((d) => [d])
      .join("rect")
      .attr("id", "selected-rect-group");

    gRect
      .select("#selected-rect-group")
      .attr("x", 1)
      .attr('y', y_step_group * 0.01)
      // .attr("y", (d) => y(d.name) - d3.min([x_step, y_step]) * 0.45)
      // .attr("y", (d) => y(d.name) - y_step * 0.5)
      .attr("width", width / 0.8 - scrollWidth)
      .attr("height", y_step_group * 0.98)
      .attr('stroke-width', 0)
      .attr("fill", "grey")
      .attr("id", "selected-rect-group")
      .attr("opacity", 0.6)
      .attr("rx", 8)
      .attr("stroke-width", 0)
    // .on('click', d => {
    //   // debugger;
    //   d.currentTarget.__data__.expand == 'true' ? d.currentTarget.__data__.expand = 'false' : d.currentTarget.__data__.expand = 'true';
    //   d.currentTarget.parentElement.parentElement.dispatchEvent(new CustomEvent("input"));
    //   // d.currentTarget.__data__ == 
    //   //         var newTreData = d3.select(d.currentTarget.parentElement.parentElement.parentElement).selectAll('.set').data();
    // })
    // .on("mouseenter", (d) => {
    //   d3.select(d.currentTarget)
    //     .attr("fill", "#ededed")
    //     .attr("stroke", "none")
    //     .attr("stroke-width", 0);
    //   d3.select(d.path[1]).selectAll(".set-text").attr("display", "inline"); // add the text with inline display;

    //   var selectName = d3
    //     .select(d.path[1])
    //     .selectAll(".set-text")
    //     .data()
    //     .map((d) => d[id]); // get the names of all elements in this set
    //   d3.select(d.path[4])
    //     .select("#div-line")
    //     .selectAll(".line")
    //     .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
    //     .selectAll("path")
    //     .attr("stroke", "grey")
    //     .attr("opacity", 0.05); // make the global lines grey while mouseover the set

    //   d3.select(d.path[4])
    //     .select("#div-line")
    //     .selectAll(".line")
    //     .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
    //     .selectAll("text")
    //     .attr("display", "none"); // make the global texts hidden while mouseover the set
    // })
    // .on("mouseleave", (d) => {
    //   d3.select(d.currentTarget)
    //     .attr("fill", "white")
    //     .attr("stroke", "white")
    //     .attr("stroke-width", 0);
    //   // d3.select(d.path[1]).selectAll(".set-text").attr("display", "none");

    //   var selectName = d3
    //     .select(d.path[1])
    //     .selectAll(".set-text")
    //     .data()
    //     .map((d) => d[id]); // get the names of all elements in this set

    //   d3.select(d.path[4])
    //     .select("#div-line")
    //     .selectAll(".line")
    //     .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
    //     .selectAll("path")
    //     .attr("stroke", (d) => d.color)
    //     .attr("opacity", 0.5); // make the global lines grey while mouseover the set

    //   d3.select(d.path[4])
    //     .select("#div-line")
    //     .selectAll(".line")
    //     .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
    //     .selectAll("text")
    //     .attr("display", "inline"); // make the global texts hidden while mouseover the set
    // });
    // .on("click", (d) => {

    // var outputData = d.currentTarget.__data__;
    // d.path[2].value = outputData;
    // d.path[2].dispatchEvent(new CustomEvent("input"));
    // return d.path[2];
    // });
    // ----------------------------------------------------------------------

    // ---------------------------------------------------------------------
    // render the circles in combination matrix for first level set
    // if (firstAggeragateAttribute == "Category") {
    // gRect.selectAll("#combination-matrix").selectAll(".name-matrix").remove();
    // gRect
    //   .selectAll("#combination-matrix")
    //   .selectAll(".trend-matrix")
    //   .remove();

    var categoryMatrix = gRect
      .selectAll("#combination-matrix")
      .data((d) => [d])
      .join("g")
      .attr("id", "combination-matrix")
      .selectAll(".category-matrix")
      .data((d) => [d])
      .join("g")
      .attr("class", "category-matrix");

    var cirNum = categoryMatrix.selectAll(".combination-circle").data((d) =>
      Object.keys(d.categoryGroup).map((e) => {
        var f = {};
        f.value = d.categoryGroup[e];
        f.valueAll = Object.keys(d.categoryGroup)
          .map((keys) => d.categoryGroup[keys])
          .reduce((a, b) => a + b);
        f.set = d.name;
        f.cate = e;
        f.element = d[1];
        return f;
      })
    );

    var arcNum = categoryMatrix.selectAll(".combination-arc").data((d) =>
      Object.keys(d.categoryGroup).map((e) => {
        var f = {};
        f.value = d.categoryGroup[e];
        f.valueAll = Object.keys(d.categoryGroup)
          .map((keys) => d.categoryGroup[keys])
          .reduce((a, b) => a + b);
        f.set = d.name;
        f.cate = e;
        f.element = d[1];
        return f;
      })
    );
    // if (circleType == "circle") {
    cirNum.join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", "combination-circle")
          .attr("cx", (d) => x(d.cate))
          .attr("cy", y_step_group * 0.5)
          .attr("r", d3.min([x_step, y_step_group]) * 0.45)
          .attr("stroke-width", 3)
          .attr("fill", "#dedede")
          .call((enter) => enter.transition(t)),

      (update) =>
        update.call((update) =>
          update
            .transition(t)
            .attr("cx", (d) => x(d.cate))
            .attr("cy", y_step_group * 0.5)
            .attr("r", d3.min([x_step, y_step_group]) * 0.45)
            .attr("stroke-width", 3)
            .attr("fill", "#dedede")
        ),
      (exit) => exit.call((exit) => exit.transition(t)).remove()
    );

    var arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(d3.min([x_step, y_step_group]) * 0.45)
      .startAngle(0)
      .endAngle((d) => Math.PI * 2 * (d.value / d.valueAll));

    arcNum.join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "combination-arc")
          .attr("d", arc)
          .attr("fill", "black")
          .attr(
            "transform",
            (d) => "translate(" + x(d.cate) + "," + y_step_group * 0.5 + ")"
          )
          .call((enter) => enter.transition(t)),
      (update) =>
        update.call((update) =>
          update
            .transition(t)
            .attr("class", "combination-arc")
            .attr("d", arc)
            .attr("fill", "black")
            .attr(
              "transform",
              (d) => "translate(" + x(d.cate) + "," + y_step_group * 0.5 + ")"
            )
        ),
      (exit) => exit.call((exit) => exit.transition(t)).remove()
    );
    // } else if (firstAggeragateAttribute == "Trend") {

    // gRect
    //   .selectAll("#combination-matrix")
    //   .selectAll(".category-matrix")
    //   .remove();
    // gRect.selectAll("#combination-matrix").selectAll(".name-matrix").remove();

    // -----------------------------------------------------
    // we visualize the trend matrix for first level set

    var stackTrendFirst = d3.stack().keys(trendCate).value((data, key) => data.trendGroup[key]);

    var dataFortrendStack = stackTrendFirst(data);    // get the data for trend stack;

    x_range_trend = [
      d3.select(node).attr("width") * 0.15 * 0.8,
      d3.select(node).attr("width") * 0.15 * 0.8 + x_step * 3
    ];

    var xScaleFirstStackTrend = d3.scaleLinear().domain([0, brushedAttributes.length - 1]).range(x_range_trend);   // the x scale;

    var stackColorScale = d3.scaleOrdinal().range(['#0aa12d', '#a10a0a', '#bf8e08']).domain(trendCate)


    var xScaleFirstTrend = d3
      .scalePoint()
      .domain(["up", "down", "stable"])
      .range(x_range_trend);

    var trendMatrix = gRect
      .selectAll("#combination-matrix")
      .data((d) => [d])
      .join("g")
      .attr("id", "combination-matrix")
      .selectAll(".trend-matrix")
      .data((d) => [d])
      .join("g")
      .attr("class", "trend-matrix");

    // trendMatrix
    //   .selectAll("rect.stack-bar")
    //   .data((d) => [
    //     { value: [0, d.trendGroup["up"]], trend: "up" },
    //     { value: [d.trendGroup['up'], d.trendGroup['down'] + d.trendGroup['up']], trend: "down" },
    //     { value: [d.trendGroup['down'] + d.trendGroup['up'], brushedAttributes.length - 1], trend: "stable" }
    //   ])
    //   .join('rect')
    //   .attr('x', d => xScaleFirstStackTrend(d.value[0]))
    //   .attr('y', 0.1 * y_step_group)
    //   .attr('width', d => xScaleFirstStackTrend(d.value[1]) - xScaleFirstStackTrend(d.value[0]))
    //   .attr('height', y_step_group*0.8)
    //   .attr('fill', d => stackColorScale(d.trend))

    // trendMatrix.selectAll('.stack-bar').data(dataFortrendStack)
    // .join('g')
    // .attr('class', 'stack-bar')
    // .attr('fill', d => stackColorScale(d.key))
    // .selectAll('g')
    // .data(d => d)
    // .join('rect')
    // .attr('x', d => xScaleFirstStackTrend(d[0]))
    // .attr('y', 0)
    // .attr('height', y_step_group)
    // .attr('width', d => xScaleFirstStackTrend(d[1]) - xScaleFirstStackTrend(d[0]))

    trendMatrix
      .selectAll("rect.stack-bar")
      .data((d) => [
        { value: [0, d.trendGroup["up"]], trend: "up" },
        { value: [d.trendGroup['up'], d.trendGroup['down'] + d.trendGroup['up']], trend: "down" },
        { value: [d.trendGroup['down'] + d.trendGroup['up'], brushedAttributes.length - 1], trend: "stable" }
      ])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "stack-bar")
            .attr('x', d => xScaleFirstStackTrend(d.value[0]))
            .attr('y', 0.1 * y_step_group)
            .attr('width', d => xScaleFirstStackTrend(d.value[1]) - xScaleFirstStackTrend(d.value[0]))
            .attr('height', y_step_group * 0.8)
            .attr('fill', d => stackColorScale(d.trend)),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("class", "stack-bar")
              .attr('x', d => xScaleFirstStackTrend(d.value[0]))
              .attr('y', 0.1 * y_step_group)
              .attr('width', d => xScaleFirstStackTrend(d.value[1]) - xScaleFirstStackTrend(d.value[0]))
              .attr('height', y_step_group * 0.8)
              .attr('fill', d => stackColorScale(d.trend))
          ),
        (exit) => exit.remove()
      );

    // trendMatrix
    //   .selectAll("circle.name-circle")
    //   .data((d) => [
    //     { value: d.trendGroup["up"], trend: "up" },
    //     { value: d.trendGroup["down"], trend: "down" },
    //     { value: d.trendGroup["stable"], trend: "stable" }
    //   ])
    //   .join(
    //     (enter) =>
    //       enter
    //         .append("circle")
    //         .attr("cx", (d) => xScaleFirstTrend(d.trend))
    //         .attr("cy", 0.5 * y_step_group)
    //         .attr("r", d3.min([x_step, y_step_group]) * 0.4)
    //         .attr("stroke-width", "1px")
    //         .attr('class', 'name-circle')
    //         .attr("stroke", "black")
    //         .attr("fill", "none"),
    //     (update) =>
    //       update.call((update) =>
    //         update
    //           .transition(t)
    //           .attr("cx", (d) => xScaleFirstTrend(d.trend))
    //           .attr("cy", 0.5 * y_step_group)
    //           .attr("r", d3.min([x_step, y_step_group]) * 0.4)
    //           .attr("stroke-width", "1px")
    //           .attr('class', 'name-circle')
    //           .attr("stroke", "black")
    //           .attr("fill", "none")
    //       ),
    //     (exit) => exit.remove()
    //   );


    // ------------------------------------------------
    // Visualize the name of first set if they are not category or trend
    if (firstAggeragateAttribute != "Degree" && firstAggeragateAttribute != "Trend") {
      var textMatrix = gRect
        .selectAll("#combination-matrix")
        .data((d) => [d])
        .join("g")
        .attr("id", "combination-matrix")
        .selectAll(".name-matrix")
        .data((d) => [d])
        .join("g")
        .attr("class", "name-matrix");

      textMatrix
        .selectAll("text")
        .data((d) => [d])
        .join("text")
        .attr("x", margin.left + widthMatrixLeft)
        .attr("y", 0.5 * y_step_group)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "end")
        .text((d) => d.value)
        .attr("font-size", "16px")
        .attr("font-weight", "bolder");
    }

    // }

    // cirNum
    //   .join("path")
    //   .attr("d", arc)
    //   .attr("fill", "black")
    //   .attr(
    //     "transform",
    //     (d) => "translate(" + x(d.cate) + "," + y(d.set) + ")"
    //   );
    // } else {
    //   cirNum.join(
    //     (enter) =>
    //       enter
    //         .append("circle")
    //         .attr("cx", (d) => x(d.cate))
    //         .attr("cy", (d) => y(d.set))
    //         .attr("r", d3.min([x_step, y_step]) * 0.4)
    //         .attr("stroke", (d) => (d.value > 0 ? "black" : "#dedede"))
    //         .attr("stroke-width", 3)
    //         .attr("fill", (d) => (d.value > 0 ? "none" : "#dedede"))
    //         .call((enter) => enter.transition(t)),
    //     (update) =>
    //       update
    //         .attr("cx", (d) => x(d.cate))
    //         .attr("cy", (d) => y(d.set))
    //         .attr("r", d3.min([x_step, y_step]) * 0.4)
    //         .attr("stroke", (d) => (d.value > 0 ? "black" : "#dedede"))
    //         .attr("stroke-width", 3)
    //         .attr("fill", (d) => (d.value > 0 ? "none" : "#dedede"))
    //         .call((update) => update.transition(t)),
    //     (exit) => exit.call((exit) => exit.transition(t)).remove()
    //   );

    //   cirNum.join(
    //     (enter) =>
    //       enter
    //         .append("text")
    //         .text((d) => d.value)
    //         .attr("display", (d) => (d.value == 0 ? "none" : ""))
    //         .attr("x", (d) => x(d.cate))
    //         .attr("y", (d) => y(d.set))
    //         .attr("text-anchor", "middle")
    //         .attr("dominant-baseline", "middle")
    //         .style("font-size", max_r),
    //     (update) =>
    //       update
    //         .select("text")
    //         .text((d) => d.value)
    //         .attr("display", (d) => (d.value == 0 ? "none" : ""))
    //         .attr("x", (d) => x(d.cate))
    //         .attr("y", (d) => y(d.set))
    //         .attr("text-anchor", "middle")
    //         .attr("dominant-baseline", "middle")
    //         .style("font-size", max_r),
    //     (exit) => exit.remove()
    //   );
    // }

    // --------------------------------------------------------------------------
    // Visualize the cardinality
    var cardinalityGroups = gRect
      .selectAll("g#cardinality-bar-groups")
      .data((d) => [d])
      .join("g")
      .attr("id", "cardinality-bar-groups");
    var xCardinality = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data
            .map((d) => d[1].map((e) => e[1].length))
            .reduce((a, b) => a.concat(b))
            .concat(
              data
                .map((d) => d[1].map((e) => e[1].length))
                .map((d) => d.length)
            )
        ) * 1.2
      ])
      .range([width * 0.15 + 5 + widthTrend, width * 0.15 + 85 + widthTrend]);

    var xAxis = (g) =>
      g
        .call(
          d3
            .axisTop(xCardinality)
            .ticks(3, "s")
            .tickSizeInner([3])
            .tickSizeOuter([3])
        )
        .attr("transform", `translate(${0},${margin.top})`);   // create the generator for cardinality axis

    svg
      .selectAll("#cardinality-axis")
      .data([1])
      .join(
        (enter) => enter.append("g").attr("id", "cardinality-axis").call(xAxis),
        (update) => update.call((update) => update.call(xAxis)),
        (exit) => exit.remove()
      );

    // --------------------------------------------------
    // Visualize the cardinality;
    cardinalityGroups
      .selectAll("#cardinality-bar")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("id", "cardinality-bar")
            .attr("x", xCardinality(0))
            .attr("y", 0.1 * y_step_group)
            .attr(
              "width",
              (d) => xCardinality(d[1].length) - xCardinality(0)
            )
            .attr("height", 0.8 * y_step_group)
            .attr("fill", "#dedede")
            .attr("stroke", "none")
            .attr("troke-width", 0),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("id", "cardinality-bar")
              .attr("x", xCardinality(0))
              .attr("y", 0.1 * y_step_group)
              .attr(
                "width",
                (d) => xCardinality(d[1].length) - xCardinality(0)
              )
              .attr("height", 0.8 * y_step_group)
              .attr("fill", "#dedede")
              .attr("stroke", "none")
              .attr("troke-width", 0)
          ),
        (exit) => exit.remove()
      ); // visualize the rectangles of cardinality;

    cardinalityGroups
      .selectAll("#cardinality-text")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("id", "cardinality-text")
            .text((d) => d[1].length)
            .attr("font-size", "12px")
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .attr("x", (d) => xCardinality(d[1].length))
            .attr("y", 0.5 * y_step_group)
            .attr("dx", 3),
        (update) =>
          update
            .text((d) => d[1].length)
            .attr("id", "cardinality-text")
            .call((update) =>
              update
                .transition(t)
                .attr("font-size", "12px")
                .attr("text-anchor", "start")
                .attr("dominant-baseline", "middle")
                .attr("x", (d) => xCardinality(d[1].length))
                .attr("y", 0.5 * y_step_group)
            ),
        (exit) => exit.remove()
      ); // visualize the texts for each rectangles;

    // --------------------------------------------------------------------------
    // Visualize the oneAttribute column
    var oneAttributeGroups = gRect
      .selectAll("g#oneAttribute-bar-groups")
      .data((d) => [d])
      .join("g")
      .attr("id", "oneAttribute-bar-groups");

    var xOneAttribute = d3
      .scaleLinear()
      .domain([0, d3.max(data.map((d) => d.Average)) * 1.9])
      .range([width - widthAttribute, width - scrollWidth]);

    var xAxis = (g) =>
      g
        .call(
          d3
            .axisTop(xOneAttribute)
            .ticks(3, "s")
            .tickSizeInner([0])
            .tickSizeOuter([1])
        )
        .attr("transform", `translate(${width - widthAttribute},${10})`);
    // // create the generator for cardinality axis
    svg
      .selectAll("#oneAttribute-axis")
      .data([1])
      .join(
        (enter) =>
          enter.append("g").attr("id", "oneAttribute-axis").call(xAxis),
        (update) => update.call((update) => update.call(xAxis)),
        (exit) => exit.remove()
      );

    oneAttributeGroups
      .selectAll("#oneAttribute-bar")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("id", "oneAttribute-bar")
            .attr("x", xOneAttribute(0))
            .attr("y", 0.1 * y_step_group)
            .attr("width", (d) => xOneAttribute(d.Average) - xOneAttribute(0))
            .attr("height", 0.8 * y_step_group)
            .attr("fill", "#dedede")
            .attr("stroke", "none")
            .attr("troke-width", 0),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("id", "oneAttribute-bar")
              .attr("x", xOneAttribute(0))
              .attr("y", 0.1 * y_step_group)
              .attr("width", (d) => xOneAttribute(d.Average) - xOneAttribute(0))
              .attr("height", 0.8 * y_step_group)
              .attr("fill", "#dedede")
              .attr("stroke", "none")
              .attr("troke-width", 0)
          ),
        (exit) => exit.remove()
      ); // visualize the rectangles of cardinality;

    oneAttributeGroups
      .selectAll("#oneAttribute-text")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("id", "oneAttribute-text")
            .text((d) => d.Average.toFixed(2))
            .attr("font-size", "12px")
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .attr("x", (d) => xOneAttribute(d.Average))
            .attr("y", 0.5 * y_step_group)
            .attr("dx", 3),
        (update) =>
          update
            .text((d) => d.Average.toFixed(2))
            .attr("id", "oneAttribute-text")
            .call((update) =>
              update
                .transition(t)
                .attr("font-size", "12px")
                .attr("text-anchor", "start")
                .attr("dominant-baseline", "middle")
                .attr("x", (d) => xOneAttribute(d.Average))
                .attr("y", 0.5 * y_step_group)
            ),
        (exit) => exit.remove()
      ); // visualize the texts for each rectangles;

      var xAxisOneAttr = (g) =>
      g
        .call(
          d3
            .axisTop(xOneAttribute)
            .ticks(3, "s")
            .tickSizeInner([3])
            .tickSizeOuter([3])
        )
        .attr("transform", `translate(${0},${margin.top})`);   // create the generator for cardinality axis

    svg
      .selectAll("#oneattr-axis")
      .data([1])
      .join(
        (enter) => enter.append("g").attr("id", "oneattr-axis").call(xAxisOneAttr),
        (update) => update.call((update) => update.call(xAxisOneAttr)),
        (exit) => exit.remove()
      );


    // ---------------------------------------------------
    // render the lines in each sub set;
    // var subYScale = d3
    //   .scaleLinear()
    //   .range([0.45 * y_step, -0.45 * y_step])
    //   .domain([dataJson.min, dataJson.max]);
    // var maxMin = data[0].map(e => {var a = {}; var array = brushedAttributes.map(f => e[f]) a.min = d3.min(array); a.max = d3.max(array); });
    //    var min = d3.min(maxMin.map(d => d.min));
    //     var max = d3.max(maxMin.map(d => d.max));
    if (dataJson.rank == "yes") {
      var subYScale1 = (min, max) =>
        d3
          .scaleLinear()
          .range([0.8 * y_step, 0.2 * y_step])
          .domain([max, min]);
    } else {
      var subYScale1 = (min, max) =>
        d3
          .scaleLinear()
          .range([0.8 * y_step, 0.2 * y_step])
          .domain([min, max]);
    }

    var path1 = (p, min, max) =>
      d3.line()(
        brushedAttributes.map((d) => [xLine(d), subYScale1(min, max)(p[d])])
      );
    // debugger;
    var groupLineText = gRect
      .selectAll(".subset-line-text")
      .data((d) => d[1])
      .join("g")
      .style('display', (d, i, s) => { if (s[0].parentElement.__data__.expand == 'false') { return 'none' } else { return 'inline' } })
      .attr(
        "transform",
        (d) =>
          `translate(0,${y_step_group + Number(d.id.split("_")[1] * y_step)})`
      )
      // .attr("transform", (d) => {

      //   return `translate(0,${(Number(d.id.split("_")[1]) + 1) * y_step})`;
      // })
      .attr("class", "subset-line-text");

    // if (gRect.select(".set-line-text").node() == null) {
    //   gRect.append("g").attr("class", "set-line-text");
    // }

    // Visualize the rects for each subset
    // var rectSet = groupLineText
    //   .selectAll(".subset-rect")
    //   .data((d) => [d])
    //   .join("rect")
    //   .attr("width", width * 0.85)
    //   .attr("height", y_step)
    //   .attr("x", d3.select(node).attr("width") * 0.15 + 0.5 * x_step)
    //   .attr("y", 0)
    //   .attr("fill", "red");

    var lineSet = groupLineText.selectAll(".subset-line").data((d) => {

      d[1].map(
        (e) => ((e.name = d.name), (e.groupMin = d.min), (e.groupMax = d.max))
      );
      return d[1];
    });
    var textSet = groupLineText.selectAll(".subset-text").data((d) => {

      d[1].map(
        (e) => ((e.name = d.name), (e.groupMin = d.min), (e.groupMax = d.max))
      );
      return d[1];
    });

    lineSet.join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "subset-line")
          .attr("d", (d, i, s) => {

            return path1(d, d.groupMin, d.groupMax);
          })
          .attr("stroke", (d) => d.color)
          .attr("stroke-width", lineWidth)
          .attr('opacity', 0.5)
          .attr("fill", "none"),
      // .attr("transform", (d) => `translate(0,${y(d.name)})`)
      (update) =>
        update.call(
          (update) =>
            update
              .transition(t)
              .attr("class", "subset-line")
              .attr("d", (d, i, s) => {

                return path1(d, d.groupMin, d.groupMax);
              })
              .attr("stroke", (d) => d.color)
              .attr('opacity', 0.5)
              .attr("stroke-width", lineWidth)
              .attr("fill", "none")
          // .attr("transform", (d) => `translate(0,${y(d.name)})`)
        ),
      (exit) => exit.remove()
    );

    textSet.join(
      (enter) =>
        enter
          .append("text")
          .text((d) => d[id])
          .style("font-size", 8)
          .attr("class", "subset-text")
          // .attr("display", "none")
          .attr("text-anchor", "start")
          // .attr("x", xLine(attributesCut[attributesCut.length - 1]))
          .attr("dx", 3)
          // .attr("y", 0)
          .attr(
            "transform",
            (d, i, s) =>
              `translate(${xLine(
                brushedAttributes[brushedAttributes.length - 1]
              )},${subYScale1(
                d.groupMin,
                d.groupMax
              )(d[brushedAttributes[brushedAttributes.length - 1]])})`
          ),
      (update) =>
        update
          .text((d) => d[id])
          .style("font-size", 8)
          .attr("class", "subset-text")
          // .attr("display", "none")
          .attr("text-anchor", "start")
          // .attr("x", xLine(attributesCut[attributesCut.length - 1]))
          .attr("dx", 3)
          // .attr("y", 0)
          .attr(
            "transform",
            (d, i, s) =>
              `translate(${xLine(
                brushedAttributes[brushedAttributes.length - 1]
              )},${subYScale1(
                d.groupMin,
                d.groupMax
              )(d[brushedAttributes[brushedAttributes.length - 1]])})`
          ),
      // .text((d) => d[id])
      // .style("font-size", 8)
      // .attr("class", "set-text")
      // .attr("display", "none")
      // .attr("text-anchor", "start")
      // // .attr("x", xLine(attributesCut[attributesCut.length - 1]))
      // .attr("dx", 3)
      // // .attr("y", 0)
      // .attr(
      //   "transform",
      //   (d, i) =>
      //     `translate(${xLine(attributesCut[attributesCut.length - 1])},${
      //       y(d.name) +
      //       // y_step +
      //       //                   0.5 * y_step
      //       subYScale(d[attributesCut[attributesCut.length - 1]])
      //     })`
      // )
      (exit) => exit.remove()
    );

    // gRect
    //   .selectAll("g.set-line")
    //   .data((d) => {
    //     d.childNode.map((e) => (e.name = d.name));
    //     return d.childNode;
    //   })
    //   .join(
    //     (enter) => {
    //       var bothEnter = enter.append("g").attr("class", "set-line");
    //       bothEnter
    //         .append("path")
    //         .attr("d", path)
    //         .attr("stroke", (d) => d.color)
    //         .attr("stroke-width", "2px")
    //         .attr("fill", "none")
    //         .attr("class", "set-line")
    //         .attr("transform", (d) => `translate(0,${y(d.name)})`);

    //       bothEnter
    //         .append("text")
    //         .text((d) => d[id])
    //         .style("font-size", 8)
    //         // .attr("stroke", "black")
    //         .attr("text-anchor", "start")
    //         // .attr("x", xLine(attributesCut[attributesCut.length - 1]))
    //         .attr("dx", 3)
    //         // .attr("y", 0)
    //         .attr(
    //           "transform",
    //           (d, i) =>
    //             `translate(${xLine(attributesCut[attributesCut.length - 1])},${
    //               y_step * i - y_step
    //               // +
    //               //                   0.5 * y_step
    //               // subYScale(d[attributesCut[attributesCut.length - 1]])
    //             })`
    //         );
    //     },
    //     (update) => {
    //       update
    //         .select("path")
    //         .attr("d", path)
    //         .attr("stroke", (d) => d.color)
    //         .attr("stroke-width", "2px")
    //         .attr("class", "set-line")
    //         .attr("fill", "none");

    //       update
    //         .select("text")
    //         .style("font-size", 8)
    //         // .attr("stroke", "black")
    //         .attr("text-anchor", "start")
    //         // .attr("x", xLine(attributesCut[attributesCut.length - 1]))
    //         .attr("dx", 3)
    //         // .attr("y", 0)
    //         .attr(
    //           "transform",
    //           (d, i) =>

    //             `translate(${xLine(attributesCut[attributesCut.length - 1])},${
    //               y_step * i + y_step
    //               // -
    //               //                   0.5 * y_step +
    //               //                   subYScale(d[attributesCut[attributesCut.length - 1]])
    //             })`
    //         );
    //     },
    //     (exit) => exit.remove()
    //   );

    // --------------------------------------------------------------------------------
    // Add the rects to hover the subsets
    groupLineText
      .selectAll(".selected-rect-group-subset")
      .data((d) => [d])
      .join("rect")
      .attr("class", "selected-rect-groupsubset");

    groupLineText
      .selectAll("rect")
      .data((d) => [d])
      .join("rect")
      .attr("x", margin.left)
      // .attr("y", (d) => y(d.name) - d3.min([x_step, y_step]) * 0.45)
      .attr("y", 0)
      .attr("width", width / 0.8 - scrollWidth - margin.left)
      .attr("height", y_step)
      .attr("fill", "white")
      // .attr("id", "selected-rect-group")
      .attr("opacity", 0)
      .attr("stroke-width", 0)
      .on("mousemove", (d) => {
        debugger;
        d3.select(d.currentTarget)
          .attr("fill", "#dedede")
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("opacity", 0.5);
        // d3.select(d.path[1]).selectAll(".set-text").attr("display", "inline"); // add the text with inline display;

        var selectName = d.path[1].__data__[1].map((d) => d[id]); // get the names of all elements in this set
        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".global-line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll(".line")
          .attr("stroke", "grey")
          .attr("opacity", 0.05); // make the global lines grey while mouseover the set

        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".global-line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll("text")
          .attr("display", "none"); // make the global texts hidden while mouseover the set

        if (dataJson.name == "MNIST") {
          var selectDigit = d.path[1].__data__[1].map((d) => [d[id], d['label'], d['pred'], d['eval']]).filter(d => d[3] != 'True');
          d3.select(elementNode)
            .selectAll('.image-element')
            .data(selectDigit)
            .join('img')
            .attr('class', 'image-element')
            .attr('width', 40)
            .attr('height', 40)
            .attr('src', d => 'https://file-server-liqun.herokuapp.com/files/mnist/images/input_'
              + d[0] + '_pred_' + d[2] + '_label_' + d[1] + '.jpg')

        }  // visualiz the pictures of digits number if the dataset is MNIST;

        function scalePointPositionX1({ xpos, xScale } = {}) {
          var xPos = xpos;
          var domain = xScale.domain();
          var range = xScale.range();
          var rangePoints = d3.range(range[0] - xScale.step() * 0.5, range[1] + xScale.step() * 0.5, xScale.step());
          var yPos = domain[d3.bisect(rangePoints, xPos) - 1];
          if (range[1] + xScale.step() * 0.5 < xPos || range[0] - xScale.step() > xPos) {
            return null
          } else {
            return yPos;
          }
        } // equal to x.invert();

        var attributeXPosition = scalePointPositionX1({ xpos: d.pageX - width * 0.15, xScale: xLine });     // calculate the x position

        if (attributeXPosition != null) {   // if we hover in the 
          d3.select(
            d.currentTarget
              .parentElement
              .parentElement
              .parentElement
              .querySelector('#vertical-line')
          )
            .selectAll('rect')
            .filter(d => d == attributeXPosition)
            .attr('fill', '#dedede')
            .attr('opacity', 0.5) // find the related vertical rects and highlight it;

          d3.select(
            d.currentTarget
              .parentElement
              .parentElement
              .parentElement
              .querySelector('#vertical-line')
          )
            .selectAll('rect')
            .filter(d => d != attributeXPosition)
            .attr('fill', 'white')
            .attr('opacity', 0) // find the not related vertical rects and not highlight it;

          // d3.select(d.currentTarget.parentElement.parentElement.parentElement)
          //   .select('#vertical-line')

          // d3.select(d.currentTarget.parentElement.parentElement.parentElement)
          //   .selectAll('.set')

          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
              .querySelector("#vertical-line-global")
          )
            .selectAll('rect')
            .filter(d => d == attributeXPosition)
            .attr('fill', '#dedede')
            .attr('opacity', 0.5)  // highlight the rects in the global line charts

          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
              .querySelector("#vertical-line-global")
          )
            .selectAll('rect')
            .filter(d => d != attributeXPosition)
            .attr('fill', 'white')
            .attr('opacity', 0)  // don't highlight the rects that are not hovered


          // -----------------------------------------------
          //Render the connection areas while hoving the subsets;

          // find out the elements;
          var selectionElements = d3.select(d.path[5])
            .select("#div-line")
            .selectAll(".global-line")
            .selectAll('.line')
            // .selectAll('path')
            .filter((d) => selectName.findIndex((e) => e == d[id]) != -1);

          // get the data of elements;
          var selectionElementsData = selectionElements.data();

          // extract the data in the hovering time point; 
          var selectionDataTime = selectionElementsData.map(d => +d[attributeXPosition]);

          // get the category data
          var categoryDataHovering = d3.select(d.path[5])
            .select("#div-line").node().value;

          // get the array containing the categories it belongs to;
          var arrayCategory = selectionDataTime.map(
            d => categoryDataHovering
              .find(
                e => e.edgeMin <= d && e.edgeMax >= d
              ).name)
            .filter((d, i, s) => s.indexOf(d) === i)

          // Find out the connection area in line chart and make it highlighted
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
          )
            .selectAll('.connection-area')
            .filter(d => arrayCategory.findIndex(e => e != d.name))
            .selectAll('path')
            .attr('fill', '#dedede')
            .attr('opacity', 0.5)

          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
          )
            .selectAll('.connection-area')
            .filter(d => arrayCategory.findIndex(e => e == d.name))
            .selectAll('path')
            .attr('fill', 'white')
            .attr('opacity', 0)


          // find out the connection area in the connection area and make it highlighted;
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#layout-right-top-left')
              .querySelector('svg')
          )
            .selectAll('.connect-area')
            .filter(d => arrayCategory.findIndex(e => e != d.name))
            .attr('fill', '#dedede')
            .attr('opacity', 0.5)

          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#layout-right-top-left')
              .querySelector('svg')
          )
            .selectAll('.connect-area')
            .filter(d => arrayCategory.findIndex(e => e == d.name))
            .attr('fill', 'white')
            .attr('opacity', 0)

          // find out the row area in combination matrix and highlighted
          d3.select(d.path[3]).select('#column-highlight').selectAll('rect')
            .filter(d => arrayCategory.findIndex(e => e != d.name))
            .attr('fill', '#dedede')
            .attr('opacity', 0.5);

          d3.select(d.path[3]).select('#column-highlight').selectAll('rect')
            .filter(d => arrayCategory.findIndex(e => e == d.name))
            .attr('fill', 'white')
            .attr('opacity', 0);

        } else {

          // Don't highlight the vertical rects
          // when leave from the time points area
          d3.select(
            d.currentTarget
              .parentElement
              .parentElement
              .parentElement
              .querySelector('#vertical-line')
          )
            .selectAll('rect')
            // .filter(d => d == attributeXPosition)
            .attr('fill', '#dedede')
            .attr('opacity', 0)

          // Don't highlight the rects in the global line charts
          // when the mouse leave from time points area
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
              .querySelector("#vertical-line-global")
          )
            .selectAll('rect')
            // .filter(d => d == attributeXPosition)
            .attr('fill', '#dedede')
            .attr('opacity', 0)

          // Don't highlight the rects of connection in global
          // line chart
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
          )
            .selectAll('.connection-area')
            // .filter(d => arrayCategory.findIndex(e => e != d.name))
            .selectAll('path')
            .attr('fill', '#dedede')
            .attr('opacity', 0)

          //Don't highlight connection area in the connection area;
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#layout-right-top-left')
              .querySelector('svg')
          )
            .selectAll('.connect-area')
            // .filter(d => arrayCategory.findIndex(e => e != d.name))
            .attr('fill', '#dedede')
            .attr('opacity', 0)

          // DOn't highlight the row area in combination matrix and highlighted
          d3.select(d.path[3]).select('#column-highlight').selectAll('rect')
            // .filter(d => arrayCategory.findIndex(e => e != d.name))
            .attr('fill', '#dedede')
            .attr('opacity', 0);

        }
        // --------------------------------------------------
        // high light the vertical highlight in trend while hovering subsets in this area

        // we loop the trend categories[up, down ,stable]
        // and calculate the which column-highlight we should 
        // and which lines in subsets we should highlight
        for (var dt of ['up', 'down', 'stable']) {
          if (d.pageX - width * 0.15 <= xScaleTrend(dt) + xScaleTrend.step() * 0.5 &&
            d.pageX - width * 0.15 >= xScaleTrend(dt) - xScaleTrend.step() * 0.5) {

            // highlight the vertical rect in the corresponding trend
            // don't highlight the vertical rects if it's not corresponding to trends
            d3.select(d.path[3].querySelector('#column-highlight-trend'))
              .selectAll('rect')
              .filter(d => d == dt)
              .attr('opacity', 0.5)

            d3.select(d.path[3].querySelector('#column-highlight-trend'))
              .selectAll('rect')
              .filter(d => d != dt)
              .attr('opacity', 0)



            // --------------------------------------------
            // highlight the up, down, and stable line segments
            d3.select(d.currentTarget.parentElement.querySelector('#container-segment-line'))
              .selectAll('.line-groups')
              .selectAll('path')
              .filter(d => d.value == dt)
              .attr('opacity', 1)   // filter the line segments and highlight them


            // --------------------------------------
            // Highlight the segment lines in global line chart

            d3.select(d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg'))
              .selectAll('.global-line')
              .filter((f) => selectName.findIndex((e) => e == f[id]) != -1)
              .selectAll('#segment-line')
              // .selectAll('path')
              // .filter(f => f.value == dt)
              .raise();          // raise the #segment-line

            d3.select(d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg'))
              .selectAll('.global-line')
              .filter((f) => selectName.findIndex((e) => e == f[id]) != -1)
              .selectAll('#segment-line')
              .selectAll('path')
              .filter(f => f.value == dt)
              .attr('opacity', 1)



            d3.select(d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg'))
              .selectAll('.global-line')
              .filter((f) => selectName.findIndex((e) => e == f[id]) != -1)
              .selectAll('#segment-line')
              .selectAll('path')
              .filter(f => f.value != dt)
              .attr('opacity', 0)  // don't highlight the line segments in the same subset

            d3.select(d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg'))
              .selectAll('.global-line')
              .filter((f) => selectName.findIndex((e) => e == f[id]) == -1)
              .selectAll('#segment-line')
              .selectAll('path')
              // .filter(f => f.value == dt)
              .attr('opacity', 0)  // don't highlight the line segment in other subsets

          } else {
            // don't highlight any vertical in trends
            d3.select(d.path[3].querySelector('#column-highlight-trend'))
              .selectAll('rect')
              .filter(d => d == dt)
              .attr('opacity', 0)

            d3.select(d.currentTarget.parentElement.querySelector('#container-segment-line'))
              .selectAll('.line-groups')
              .selectAll('path')
              .filter(d => d.value == dt)
              .attr('opacity', 0)   // don't highlight the segment lines

            d3.select(d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg'))
              .selectAll('.global-line')
              .filter((f) => selectName.findIndex((e) => e == f[id]) != -1)
              .selectAll('#segment-line')
              .selectAll('path')
              .filter(f => f.value == dt)
              .attr('opacity', 0)  // don't highlight the segment lines in global line chart

          }

        }

      })
      .on("mouseleave", (d) => {

        if (dataJson.name == "MNIST") {
          // var selectDigit = d.path[1].__data__[1].map((d) => [d[id], d['label'], d['pred']]);
          d3.select(elementNode)
            .selectAll('.image-element')
            .remove();

        }  // visualiz the pictures of digits number if the dataset is MNIST;

        debugger;
        d3.select(d.currentTarget)
          .attr("fill", "white")
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("opacity", 0);
        // d3.select(d.path[1]).selectAll(".set-text").attr("display", "none");

        var selectName = d.path[1].__data__[1].map((d) => d[id]); // get the names of all elements in this set

        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".global-line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll(".line")
          .attr("stroke", (d) => d.color)
          .attr("opacity", 0.5); // make the global lines grey while mouseover the set

        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".global-line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll("text")
          .attr("display", "inline"); // make the global texts hidden while mouseover the set

        function scalePointPositionX1({ xpos, xScale } = {}) {
          var xPos = xpos;
          var domain = xScale.domain();
          var range = xScale.range();
          var rangePoints = d3.range(range[0], range[1], xScale.step());
          var yPos = domain[d3.bisect(rangePoints, xPos)];
          return yPos;
        } // equal to x.invert();

        var attributeXPosition = scalePointPositionX1({ xpos: d.pageX - (90 + width * 0.15 + widthTrend), xScale: xLine });     // calculate the x position


        if (attributeXPosition != null) {   // if we hover in the time points area
          d3.select(
            d.currentTarget.parentElement.parentElement.parentElement
              .querySelector('#vertical-line')
          )
            .selectAll('rect')
            .attr('fill', 'none')
            .attr('opacity', 0) // Don't highlight the vertical rects in global line charts
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
              .querySelector("#vertical-line-global")
          )
            .selectAll('rect')
            // .filter(d => d == attributeXPosition)
            .attr('fill', 'white')
            .attr('opacity', 0)  // highlight the rects in the global line charts

          // -----------------------------------------------
          //Render the connection areas while hoving the subsets;

          // find out the elements;
          var selectionElements = d3.select(d.path[5])
            .select("#div-line")
            .selectAll(".global-line")
            .selectAll('.line')
            // .selectAll('path')
            .filter((d) => selectName.findIndex((e) => e == d[id]) != -1);

          // get the data of elements;
          var selectionElementsData = selectionElements.data();

          // extract the data in the hovering time point; 
          var selectionDataTime = selectionElementsData.map(d => +d[attributeXPosition]);

          // get the category data
          var categoryDataHovering = d3.select(d.path[5])
            .select("#div-line").node().value;

          // get the array containing the categories it belongs to;
          var arrayCategory = selectionDataTime.map(
            d => categoryDataHovering
              .find(
                e => e.edgeMin <= d && e.edgeMax >= d
              ).name)
            .filter((d, i, s) => s.indexOf(d) === i)

          // Find out the connection area in line chart and make it in-visible
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#div-line')
              .querySelector('svg')
          )
            .selectAll('.connection-area')
            .filter(d => arrayCategory.findIndex(e => e != d.name))
            .selectAll('path')
            .attr('fill', 'white')
            .attr('opacity', 0)

          // find out the connection area in the connection area and make it in-visible;
          d3.select(
            d.path[5]
              .querySelector('#layout-right-top')
              .querySelector('#layout-right-top-left')
              .querySelector('svg')
          )
            .selectAll('.connect-area')
            .filter(d => arrayCategory.findIndex(e => e != d.name))
            .attr('fill', 'white')
            .attr('opacity', 0)

          // find out the row area in combination matrix and highlighted
          d3.select(d.path[3]).select('#column-highlight').selectAll('rect')
            .filter(d => arrayCategory.findIndex(e => e != d.name))
            .attr('fill', 'white')
            .attr('opacity', 0)
        } else {

        }

        // d3.select(d.path[5]
        //   .querySelector('#layout-right-top')
        //   .querySelector('#div-line')
        //   .querySelector('svg'))
        //   .selectAll('.line')
        //   .filter((f) => selectName.findIndex((e) => e == f[id]) == -1)
        //   .selectAll('#segment-line')
        //   .selectAll('path')
        //   .attr('opacity',0)     // don't highlight the segment lines in subsets

        d3.select(d.path[1].querySelector("#container-segment-line"))
          .selectAll('.line-groups')
          .selectAll('path')
          .attr('opacity', 0)

        d3.select(d.path[5]
          .querySelector('#layout-right-top')
          .querySelector('#div-line')
          .querySelector('svg'))
          .selectAll('.global-line')
          .filter((f) => selectName.findIndex((e) => e == f[id]) != -1)
          .selectAll('#segment-line')
          .lower();          // lower the all #segment-line
      });
    // .on("click", (d) => {
    //   var outputData = d.currentTarget.__data__;
    //   d.path[2].value = outputData;
    //   d.path[2].dispatchEvent(new CustomEvent("input"));
    //   return d.path[2];
    // });

    // --------------------------------------------------------------------------
    // visualize the dashed line for each subset
    var subSetDashLine = (d) =>
      d3.line()([
        [margin.left, y_step],
        [xLine(brushedAttributes[brushedAttributes.length - 1]), y_step]
      ]);

    groupLineText
      .selectAll(".dashed-line")
      .data((d) => [d])
      .join("path")
      .attr("class", "dashed-line")
      .attr("d", subSetDashLine)
      .attr("stroke-width", 2)
      .attr("stroke", "#dedede")
      .attr("stroke-dasharray", "3,6");


    // ------------------------------------------------
    // visualize the cardinality for each subset;

    var cardinalitySubSet = groupLineText
      .selectAll(".cardinality-bar-groups-subset")
      .data((d) => [d])
      .join("g")
      .attr("class", "cardinality-bar-groups-subset");

    cardinalitySubSet
      .selectAll("rect")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", xCardinality(0))
            .attr("y", y_step * 0.5 - 0.5 * 0.8 * y_step_group)
            .attr("width", (d) => {

              return xCardinality(d[1].length) - xCardinality(0);
            })
            .attr("height", y_step_group * 0.8)
            .attr("fill", "#dedede"),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", xCardinality(0))
              .attr("y", y_step * 0.5 - 0.5 * 0.8 * y_step_group)
              .attr("width", (d) => {

                return xCardinality(d[1].length) - xCardinality(0);
              })
          ),
        (exit) => exit.remove()
      );

    cardinalitySubSet
      .selectAll("text")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("text")
            .text((d) => d[1].length)
            .attr("x", (d) => xCardinality(d[1].length))
            .attr("y", 0.5 * y_step)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "start")
            .attr("font-size", "12px"),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xCardinality(d[1].length))
              .attr("y", 0.5 * y_step)
              .text((d) => d[1].length)
          ),
        (exit) => exit.remove()
      );

    // ------------------------------------------------
    // visualize the one attribute for each subset;
    var subSetOneAttribute = groupLineText
      .selectAll(".one-attribute-groups")
      .data((d) => [d])
      .join("g")
      .attr("class", "one-attribute-groups");

    subSetOneAttribute
      .selectAll("rect")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("x", (d) => xOneAttribute(0))
            .attr("y", y_step * 0.5 - 0.5 * 0.8 * y_step_group)
            .attr("width", (d) => xOneAttribute(d.Average) - xOneAttribute(0))
            .attr("height", y_step_group * 0.8)
            .attr("fill", "#dedede"),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xOneAttribute(0))
              .attr("y", y_step * 0.5 - 0.5 * 0.8 * y_step_group)
              .attr("width", (d) => xOneAttribute(d.Average) - xOneAttribute(0))
          ),
        (exit) => exit.remove()
      );

    subSetOneAttribute
      .selectAll("text")
      .data((d) => [d])
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d) => xOneAttribute(d.Average))
            .attr("y", 0.5 * y_step)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "start")
            .attr("font-size", "12px")
            .text((d) => d.Average.toFixed(2)),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xOneAttribute(d.Average))
              .attr("y", 0.5 * y_step)
              .text((d) => d.Average.toFixed(2))
          ),
        (exit) => exit.remove()
      );

    // ---------------------------------------------------------------------
    // render the trends for each sub set

    // if (secondAggeragateAttribute == "Trend") {
    xRangeTrend = [
      d3.select(node).attr("width") * 0.15 * 0.8 + 0.5 * x_step,
      d3.select(node).attr("width") * 0.15 * 0.8 + x_step * 2.5
    ];
    xScaleTrend = d3
      .scalePoint()
      .range(xRangeTrend)
      .domain(["up", "down", "stable"]);

    // groupLineText
    //   .selectAll(".name-group")
    //   .selectAll(".just-name-group")
    //   .remove();

    // groupLineText
    //   .selectAll(".name-group")
    //   .selectAll(".category-name-group")
    //   .remove();

    var subSetName = groupLineText
      .selectAll(".name-group")
      .data((d) => [d])
      .join("g")
      .attr("class", "name-group")
      .selectAll(".trend-name-group")
      .data((d) => [d])
      .join("g")
      .attr("class", "trend-name-group");

    subSetName
      .selectAll("rect.subset-stack-bar")
      .data((d) => [
        { value: [0, d.trendGroup["up"]], trend: "up" },
        { value: [d.trendGroup['up'], d.trendGroup['down'] + d.trendGroup['up']], trend: "down" },
        { value: [d.trendGroup['down'] + d.trendGroup['up'], brushedAttributes.length - 1], trend: "stable" }
      ])
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "subset-stack-bar")
            .attr('x', d => xScaleFirstStackTrend(d.value[0]))
            .attr('y', (y_step - y_step_group) / 2 + 0.1 * y_step_group)
            .attr('width', d => xScaleFirstStackTrend(d.value[1]) - xScaleFirstStackTrend(d.value[0]))
            .attr('height', y_step_group * 0.8)
            .attr('fill', d => stackColorScale(d.trend)),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("class", "subset-stack-bar")
              .attr('x', d => xScaleFirstStackTrend(d.value[0]))
              .attr('y', (y_step - y_step_group) / 2 + 0.1 * y_step_group)
              .attr('width', d => xScaleFirstStackTrend(d.value[1]) - xScaleFirstStackTrend(d.value[0]))
              .attr('height', y_step_group * 0.8)
              .attr('fill', d => stackColorScale(d.trend))
          ),
        (exit) => exit.remove()
      );

    // subSetName.selectAll('circle.name-circle')
    //   .data((d) => [
    //     { value: d.value["up"], trend: "up" },
    //     { value: d.value["down"], trend: "down" },
    //     { value: d.value["stable"], trend: "stable" }
    //   ]).join(
    //     (enter) =>
    //       enter
    //         .append("circle")
    //         .attr("cx", (d) => xScaleTrend(d.trend))
    //         .attr("cy", 0.5 * y_step)
    //         .attr("r", d3.min([x_step, y_step_group]) * 0.4)
    //         .attr("stroke-width", "1px")
    //         .attr('class', 'name-circle')
    //         .attr("stroke", "black")
    //         .attr("fill", "none"),
    //     (update) =>
    //       update.call((update) =>
    //         update
    //           .transition(t)
    //           .attr("cx", (d) => xScaleTrend(d.trend))
    //           .attr("cy", 0.5 * y_step)
    //           .attr("r", d3.min([x_step, y_step_group]) * 0.4)
    //           .attr("stroke-width", "1px")
    //           .attr('class', 'name-circle')
    //           .attr("stroke", "black")
    //           .attr("fill", "none")
    //       ),
    //     (exit) => exit.remove()
    //   );


    // subSetName
    //   .selectAll(".arrows-up")
    //   .data(["up"])
    //   .join("image")
    //   // .text("abc")
    //   .attr("class", "arrows-up")
    //   // .text((d) => "&euro")
    //   // .attr("font-size", "12px")
    //   .attr("x", (d) => xScaleTrend(d) - y_step_group * 0.7)
    //   .attr("y", 0.5 * y_step - 0.2 * y_step_group)
    //   // .attr("class", "fa-solid fa-up-right")
    //   .attr(
    //     "href",
    //     "https://liqunliu1990.static.observableusercontent.com/files/5e93b3fd8f829f8e3e7e0382693decfc62538b5a3f4955300746197ffee3fbe6abc6ca519f9c52a98e2ba8b96c22896552e00f494be9ef25df29d67d852f8668?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27up-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=tWqUogU~oBGR0QlWp6BMMr4yVXPZ7-izP7BUxuHIdOTo-8H7Esfs7djLIUIqt0~-6YVH9SooA1RKp6D5hdI7BCenydb33oyTpUDp15wrygCKBkYzUsn~t-JuF2vMJrRtl6BQXDhTyAUI-~dHwjtBaQJej4Gv3C-zXVnrJCJrRGjawlT83rhnujSBUscDHJRlpJYo7UzvZvcVITsLhuQ6UyMq-JnYKAVFYng92UiHmgqg8ibNMzN4Ix3Ntrflgs24hPwAROIR3dDf0Dg3HYbIbH8YN~N7nOLx5YF1zV~A-s01F~UlyN4aObr92ZT9LFD~dlZuxU3OLuN~1b21G2QCYQ__"
    //   )
    //   .attr("height", y_step_group * 0.4)
    //   .attr("width", y_step_group * 0.4);

    // subSetName
    //   .selectAll(".arrows-down")
    //   .data(["down"])
    //   .join("image")
    //   // .text("abc")
    //   .attr("class", "arrows-down")
    //   // .text((d) => "&euro")
    //   // .attr("font-size", "12px")
    //   .attr("x", (d) => xScaleTrend(d) - y_step_group * 0.7)
    //   .attr("y", 0.5 * y_step - 0.2 * y_step_group)
    //   // .attr("class", "fa-solid fa-up-right")
    //   .attr(
    //     "href",
    //     "https://liqunliu1990.static.observableusercontent.com/files/a652469c555d44d9d9637ca26a1dbcb363a9a421656580b70e117653745303c83f781505b5a33b048b525a6d328ccd99ebc0e3e1e7f24432ad0dfde6ee7d5259?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27down-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=MlC~wYR7mChf8Fc71gKcypmnXrzXqADbLAlNf~hgxiMoK~9Mp7zT4nM0Nj~mJAsgjxWBIDH2w5cuWjTmD6xq48nzQ5E5lK3Pp8mICv91YIoF25Dvxv2ZGgeX5T8i06mZoeJvjN5AWJUCenpBPTztleCmAt7M4~tJgWiJtpTvenBmdIyB4x5EesS2b4WWvKRhBaYBmndVw9qFTexDM0mmNTj~2F-Ewv3-qZ9fmdIXywtlTBF2TPxh5f5dV2GEiqu4KY-WjtFISttUk3qOsZdjiGAe0LhF23bqlBjZ1nDUjxbz89cnweaiJcTnf-P7Sb0xGF8Ee2b-hI7cXhwlmoj3Xw__"
    //   )
    //   .attr("height", y_step_group * 0.4)
    //   .attr("width", y_step_group * 0.4);

    // subSetName
    //   .selectAll(".arrows-stable")
    //   .data(["stable"])
    //   .join("image")
    //   // .text("abc")
    //   .attr("class", "arrows-stable")
    //   // .text((d) => "&euro")
    //   // .attr("font-size", "12px")
    //   .attr("x", (d) => xScaleTrend(d) - y_step_group * 0.7)
    //   .attr("y", 0.5 * y_step - 0.2 * y_step_group)
    //   // .attr("class", "fa-solid fa-up-right")
    //   .attr(
    //     "href",
    //     "https://liqunliu1990.static.observableusercontent.com/files/9e220282e70b5e7e58f88ec573ae5b13bebc5dcbe7db4e184a7bf818a8b569b6a3fe49664cc1720d1e1ed0fc4ba6432b5ca9abbd1152ba71acf42830b10515e6?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27right-arrow-svgrepo-com%2520(1).svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=b~gqq44XavJ2wzGqrz4r8NPnroue5yZOvO4q8tIfpuMfDyN9DhwmKpzVO-c95PWHm2pl7sDSw6xM5Co4g6j0CrbqppEoeVS6AwRVna3eHo4XvHtKNnPGD52HLKSZwooqjBqlWEetUwVS7Q4YDzVhxm2e~QuvH9iQMmyDBfR1pctiTP80U4ltqq2SA8gOgxdfedF7nuPkKoVQdvaeVnwqM0fCaI5Or8RZKHIdP2ZYwaIyIukOFIHsdr3zjvGi5qjclT-TTW6SfOCq8Fkc7VG0kWneo6tLuK9MyCGVKxtGTAx44FdyfqAFzXbmg018pYkWzrEFIOwA6PSZjzalhK64oA__"
    //   )
    //   .attr("height", y_step_group * 0.4)
    //   .attr("width", y_step_group * 0.4);

    // var trendGroups = gRect
    //   .selectAll(".combination-matrix-trend-group")
    //   .data((d) => [d])
    //   .join("g")
    //   .attr("class", "combination-matrix-trend-group")
    //   .attr("transform", (d) => `translate(0,${y(d.name)})`);
    // // var ttrend = trendGroups.transition().duration(750);

    // trendGroups
    //   .selectAll(".combination-matrix-number")
    //   .data((d) => [
    //     { value: d.valueTrend["up"], trend: "up" },
    //     { value: d.valueTrend["down"], trend: "down" },
    //     { value: d.valueTrend["stable"], trend: "stable" }
    //   ])
    //   .join(
    //     (enter) =>
    //       // enter.call((enter) =>
    //       enter
    //         // .transition(t)
    //         .append("text")
    //         .attr("text-anchor", "middle")
    //         .attr("dominant-baseline", "middle")
    //         .attr("font-size", "12px")
    //         .attr("class", "combination-matrix-number")
    //         .attr("x", (d) => xScaleTrend(d.trend))
    //         .text((d) => d.value)
    //         .call((enter) => enter.transition(t)),
    //     // )
    //     (update) =>
    //       update.call((update) =>
    //         update
    //           .transition(t)
    //           .attr("x", (d) => xScaleTrend(d.trend))
    //           .text((d) => d.value)
    //       ),
    //     (exit) => exit.remove()
    //   );

    // trendGroups
    //   .selectAll(".combination-matrix-trend-circle")
    //   .data((d) => [
    //     { value: d.valueTrend["up"], trend: "up" },
    //     { value: d.valueTrend["down"], trend: "down" },
    //     { value: d.valueTrend["stable"], trend: "stable" }
    //   ])
    //   .join("circle")
    //   .attr("class", "combination-matrix-trend-circle")
    //   .attr("cx", (d) => xScaleTrend(d.trend))
    //   .attr("cy", 0)
    //   .attr("r", d3.min([x_step, y_step]) * 0.4)
    //   .attr("stroke-width", "1px")
    //   .attr("stroke", "black")
    //   .attr("fill", "none");

    // } else if (secondAggeragateAttribute == "Category") {
    // groupLineText
    //   .selectAll(".name-group")
    //   .selectAll(".trend-name-group")
    //   .remove();
    // groupLineText
    //   .selectAll(".name-group")
    //   .selectAll(".just-name-group")
    //   .remove();

    // ---------------------------------------------------------------------
    // render the pie + circle for each sub set

    var subSetCategoryName = groupLineText
      .selectAll(".name-group")
      .data((d) => [d])
      .join("g")
      .attr("class", "name-group")
      .selectAll(".category-name-group")
      .data((d) => [d])
      .join("g")
      .attr("class", "category-name-group");

    var cirNum = subSetCategoryName.selectAll(".combination-circle").data((d) =>
      Object.keys(d.categoryGroup).map((e) => {
        var f = {};
        f.value = d.categoryGroup[e];
        f.valueAll = Object.keys(d.categoryGroup)
          .map((keys) => d.categoryGroup[keys])
          .reduce((a, b) => a + b);
        f.set = d.name;
        f.cate = e;
        f.element = d[1];
        return f;
      })
    );

    var arcNum = subSetCategoryName.selectAll(".combination-arc").data((d) =>
      Object.keys(d.categoryGroup).map((e) => {
        var f = {};
        f.value = d.categoryGroup[e];
        f.valueAll = Object.keys(d.categoryGroup)
          .map((keys) => d.categoryGroup[keys])
          .reduce((a, b) => a + b);
        f.set = d.name;
        f.cate = e;
        f.element = d[1];
        return f;
      })
    );
    // if (circleType == "circle") {
    cirNum.join(
      (enter) =>
        enter
          .append("circle")
          .attr("class", "combination-circle")
          .attr("cx", (d) => x(d.cate))
          .attr("cy", y_step * 0.5)
          .attr("r", d3.min([x_step, y_step_group]) * 0.45)
          .attr("stroke-width", 3)
          .attr("fill", "#dedede")
          .call((enter) => enter.transition(t)),

      (update) =>
        update.call((update) =>
          update
            .transition(t)
            .attr("cx", (d) => x(d.cate))
            .attr("cy", y_step * 0.5)
            .attr("r", d3.min([x_step, y_step_group]) * 0.45)
            .attr("stroke-width", 3)
            .attr("fill", "#dedede")
        ),
      (exit) => exit.call((exit) => exit.transition(t)).remove()
    );

    var arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(d3.min([x_step, y_step_group]) * 0.45)
      .startAngle(0)
      .endAngle((d) => Math.PI * 2 * (d.value / d.valueAll));

    arcNum.join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "combination-arc")
          .attr("d", arc)
          .attr("fill", "black")
          .attr(
            "transform",
            (d) =>
              "translate(" + x(d.cate) + "," + y_step * 0.5 + ")"
          )
          .call((enter) => enter.transition(t)),
      (update) =>
        update.call((update) =>
          update
            .transition(t)
            .attr("class", "combination-arc")
            .attr("d", arc)
            .attr("fill", "black")
            .attr(
              "transform",
              (d) =>
                "translate(" +
                x(d.cate) +
                "," +
                y_step * 0.5 +
                ")"
            )
        ),
      (exit) => exit.call((exit) => exit.transition(t)).remove()
    );
    // } else {

    // -----------------------------------------------------
    // Visualize the names of sub sets
    if (secondAggeragateAttribute != "Degree"
      && secondAggeragateAttribute != "Trend") {
      //   groupLineText
      //   .selectAll(".name-group")
      //   .selectAll(".category-name-group")
      //   .remove();
      // groupLineText
      //   .selectAll(".name-group")
      //   .selectAll(".trend-name-group")
      //   .remove();

      var subSetJustName = groupLineText
        .selectAll(".name-group")
        .data((d) => [d])
        .join("g")
        .attr("class", "name-group")
        .selectAll(".just-name-group")
        .data((d) => [d])
        .join("g")
        .attr("class", "just-name-group");

      subSetJustName
        .selectAll("text")
        .data((d) => [d])
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("x", margin.left + widthMatrixLeft)
              .attr("y", 0.5 * y_step)
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", "end")
              .text((d) => d.value)
              .attr("font-size", "14px"),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .attr("x", margin.left + widthMatrixLeft)
                .attr("y", 0.5 * y_step)
                .text((d) => d.value)
            ),
          (exit) => exit.remove()
        );
    } else {
      groupLineText
        .selectAll(".name-group")
        .selectAll(".just-name-group")
        .remove();
    }

    // }

    // -------------------------------------------------------------
    // render the dashed lines for each set;
    // var pathDotLine = (d) =>
    //   d3.line()([
    //     [0, y_step_group],
    //     [xLine(brushedAttributes[brushedAttributes.length - 1]), y_step_group]
    //   ]);

    // gRect
    //   .selectAll("#horizon-line")
    //   .data((d) => [d])
    //   .join("path")
    //   .attr("id", "horizon-line");
    // // if (gRect.select("#dot-line").node() == null) {
    // //   gRect.append("path").attr("id", "dot-line");
    // // }
    // gRect
    //   // .selectAll(".dot-line")
    //   .select("#horizon-line")
    //   .attr("d", pathDotLine)
    //   .attr("stroke", "black")
    //   .attr("fill", "none")
    //   .attr("id", "horizon-line")
    //   // .style("stroke-dasharray", "3, 6")
    //   // .attr("transform", (d, i) => `translate(0,${y_step_group})`)
    //   .attr("stroke-width", 1);

    var xMatrixRightRange = [
      width - margin.right - widthDistribution + 10,
      width - margin.right * 3
    ];

    // ------------------------------------------------------------
    // visualize the highlighted columns
    svg
      .selectAll("g#column-highlight")
      .data([1])
      .join("g")
      .attr("id", "column-highlight")
      .selectAll("rect")
      .data(dataFromFuzzy)
      .join("rect")
      .attr("x", (d) => x(d.name) - 0.5 * x_step)
      .attr("width", x_step)
      .attr("y", 0)
      .attr("height", height)
      .attr("fill", "#dedede")
      .attr("opacity", 0);
    d3.select(node).selectAll('g#column-highlight').lower();
    // .on("mouseenter", (d) => {

    //   d3.select(d.currentTarget).attr("opcacity", 0.3);
    // })
    // .on("mouseout", (d) => {
    //   d3.select(d.currentTarget).attr("opcacity", 0);
    // });

    // ---------------------------------------------------------------------------
    // visualize the labels on the left of combination matrix;

    // svg.selectAll("#y-label").remove();
    // svg.append("g").attr("id", "y-label");

    // // if (svg.select("#y-label").node() == null) {
    // //   svg.append("g").attr("id", "y-label");
    // // }
    // var y_labels = svg.select("#y-label");
    // y_labels
    //   .selectAll("text.class")
    //   .data(setId)
    //   .join(
    //     (enter) =>
    //       enter
    //         .append("text")
    //         .attr("class", "class")
    //         .attr("x", margin.left + widthMatrixLeft - 3)
    //         .attr("y", (d) => y(d))
    //         .attr("font-size", "12px")
    //         .attr("stroke", "black")
    //         .attr("fill", "black")
    //         .attr("dominant-baseline", "middle")
    //         .attr("text-anchor", "end")
    //         .text((d) => d),
    //     (update) =>
    //       update.call((update) =>
    //         update
    //           .transition(t)
    //           .attr("x", margin.left + widthMatrixLeft - 3)
    //           .attr("y", (d) => y(d))
    //           .attr("font-size", "12px")
    //           .attr("stroke", "black")
    //           .attr("fill", "black")
    //           .attr("text-anchor", "end")
    //           .attr("dominant-baseline", "middle")
    //           .text((d) => d)
    //       ),
    //     (exit) => exit.call((exit) => exit.transition(t).remove())
    //   );


    // ------------------------------------------------------------
    // highlighted columns of trends
    svg
      .selectAll("g#column-highlight-trend")
      .data([1])
      .join("g")
      .attr("id", "column-highlight-trend")
      .selectAll("rect")
      .data(['up', 'down', 'stable'])
      .join("rect")
      .attr("x", (d) => xScaleTrend(d) - 0.5 * x_step)
      .attr("width", x_step)
      .attr("y", margin.top)
      .attr("height", height)
      .attr("fill", "#dedede")
      .attr("opacity", 0)
      .lower()
    d3.select(node).selectAll('g#column-highlight-trend').lower();


    // --------------------------------------------------------------
    // Visualize the container-segment-line in subset

    // function generateData(d) {
    //   return d.timeTrend.map((e, i) => {
    //     var key = e.name;
    //     var value = e.value;
    //     var outputData = [
    //       [key, d[key]], [
    //         d.timeTrend.length - 1 > i
    //           ? d.timeTrend[i + 1].name
    //           : brushedAttributes[brushedAttributes.length - 1]
    //         , d.timeTrend.length - 1 > i
    //         ? d[d.timeTrend[i + 1].name]
    //         : d[brushedAttributes[brushedAttributes.length - 1]]]
    //     ]
    //     outputData.trend = value
    //     return outputData
    //   })
    // }  // generate the segment line data
    var pathSegment = (d, min, max) => d3.line()([
      [xLine(d.point[0][0]), subYScale1(min, max)(d.point[0][1])]
      , [xLine(d.point[1][0]), subYScale1(min, max)(d.point[1][1])]
    ]) // create the path generator
    groupLineText.selectAll('#container-segment-line')
      .data(d => [d])
      .join('g')
      .attr('id', 'container-segment-line')
      .selectAll('g')
      .data(d => {
        return d[1].map(e => { e.timeTrend.map(f => { f.min = d.min; return f }); e.timeTrend.map(f => f.max = d.max); return e })
        // d[1].min = d.min; d[1].max = d.max; return d[1]
      })
      .join('g')
      .attr('class', 'line-groups')
      .selectAll('.line')
      .data(d => d.timeTrend)
      .join('path')
      .attr('class', 'line')
      .attr('d', d => pathSegment(d, d.min, d.max))
      .attr('stroke', d => jumpColorScale(d.jumpValue))
      .attr('stroke-width', lineWidth)
      .attr('opacity', 0)


    // ------------------------------------------------
    // Visualize the multiple attribute view;
    RenderAttributes();
    function RenderAttributes() {

      for (let i = 0; i < attributeSelect.length; i++) {

        var minAttribute = d3.min(data.map(e => e[attributeSelect[i].name].min));
        var maxAttribute = d3.max(data.map(e => e[attributeSelect[i].name].max));
        var pathVertical   // the path generator;
        var pathHorizon  // the path generator for horizontal line;
        var pathVerticalSubSet  // the path generator for vertical line of sub sets;
        var pathHorizonSubSet   // the path generator for horizontal line of sub sets;
        let gapWidthAttr = 10;   // the gap width of every attributes;

        xScaleMultiAttribute = d3.scaleLinear()
          .domain([minAttribute, maxAttribute])
          .range([width + stepAttributeView * i, width + stepAttributeView * (i + 1) - gapWidthAttr]);

          let xAxisAttr = (g) =>
          g
            .call(
              d3
                .axisTop(xScaleMultiAttribute)
                .ticks(4, "s")
                .tickSizeInner([3])
                .tickSizeOuter([3])
            )
            .attr("transform", `translate(${0},${margin.top})`);   // create the generator for cardinality axis
              
    
            // svg.selectAll('#attr-axis-'+i).remove();
        svg
          .selectAll(".attr-axis-" + i)
          .data([1])
          .join(
            (enter) => enter.append("g").attr("class", "attr-axis-" + i).call(xAxisAttr),
            (update) => update.call((update) => update.call(xAxisAttr)),
            (exit) => exit.remove()
          );
      

        multiAttributeSvg = gRect
          .selectAll("g#multi-attribute-groups" + '-' + i)
          .data((d) => [d])
          .join("g")
          // .attr('class','set-attribute')
          .attr("id", "multi-attribute-groups" + '-' + i);       // the svg of multiple attributes for first level sets;

        multiAttributeSubSetSvg = groupLineText
          .selectAll(".attributes-subset" + '-' + i)
          .data((d) => [d])
          .join("g")
          .attr("class", "attributes-subset" + '-' + i);    // the svg of multiple attributes for subsets

        if (attributeSelect[i].type == 'quantitative') {
          // --------------------------------------------------
          // Visualize the attributes in the first level set;
          // multiAttributeSvg
          //   .selectAll("#multiple-attribute-points")
          //   .data((d) => d[attributeSelect[i].name])
          //   .join(
          //     (enter) =>
          //       enter
          //         .append("circle")
          //         .attr("id", "multiple-attribute-points")
          //         .attr("cx", d => xScaleMultiAttribute(d))
          //         .attr("cy", d => Math.random() * y_step_group * 0.8 + y_step_group * 0.1)
          //         .attr('r', 1)
          //         // .attr("width", (d) => xScaleMultiAttribute(d.Average) - xScaleMultiAttribute(0))
          //         // .attr("height", 0.8 * y_step_group)
          //         .attr("fill", "#75160d")
          //         .attr("stroke", "none")
          //         .attr("troke-width", 0),
          //     (update) =>
          //       update.call((update) =>
          //         update
          //           .transition(t)
          //           .attr("id", "multiple-attribute-points")
          //           .attr("cx", d => xScaleMultiAttribute(d))
          //           .attr("cy", d => Math.random() * y_step_group * 0.8 + y_step_group * 0.1)
          //           .attr('r', 1)
          //           .attr("fill", "#75160d")
          //           .attr("stroke", "none")
          //           .attr("troke-width", 0)
          //       ),
          //     (exit) => exit.remove()
          //   ); // visualize the points of the multiple attributes;

          pathVertical = d => d3.line()([[xScaleMultiAttribute(d), 0.2 * y_step_group], [xScaleMultiAttribute(d), y_step_group * 0.8]])

          multiAttributeSvg
            .selectAll("#multiple-attribute-verticallines")
            .data((d) => [d[attributeSelect[i].name].min, d[attributeSelect[i].name].max])
            .join('path')
            .attr('id', 'multiple-attribute-verticallines')
            .attr('d', d => pathVertical(d))
            .attr('stroke-width', 0.8)
            .attr('fill', 'none')
            .attr('stroke', 'black')

          multiAttributeSvg
            .selectAll("#multiple-attribute-rect")
            .data((d) => [d[attributeSelect[i].name].quantile])
            .join('rect')
            .attr('id', 'multiple-attribute-rect')
            .attr('x', d => xScaleMultiAttribute(d[0]))
            .attr('width', d => xScaleMultiAttribute(d[2]) - xScaleMultiAttribute(d[0]))
            .attr('y', 0.2 * y_step_group)
            .attr('height', 0.6 * y_step_group)
            .attr('stroke-width', 0.8)
            .attr('fill', 'none')
            .attr('stroke', 'black')

          pathHorizon = d => d3.line()([[xScaleMultiAttribute(d[0]), 0.5 * y_step_group], [
            xScaleMultiAttribute(d[1]), 0.5 * y_step_group
          ]])
          multiAttributeSvg
            .selectAll("#multiple-attribute-horizonlines")
            .data((d) => [[d[attributeSelect[i].name].min, d[attributeSelect[i].name].max]])
            .join('path')
            .attr('id', 'multiple-attribute-horizonlines')
            .attr('d', d => pathHorizon(d))
            .attr('stroke-width', 0.8)
            .attr('fill', 'none')
            .attr('stroke', 'black')


          // multiAttributeSvg
          //   .selectAll("#multiple-attribute-text")
          //   .data((d) => [d])
          //   .join(
          //     (enter) =>
          //       enter
          //         .append("text")
          //         .attr("id", "multiple-attribute-text")
          //         .text((d) => d.Average.toFixed(2))
          //         .attr("font-size", "12px")
          //         .attr("text-anchor", "start")
          //         .attr("dominant-baseline", "middle")
          //         .attr("x", (d) => xScaleMultiAttribute(d.Average))
          //         .attr("y", 0.5 * y_step_group)
          //         .attr("dx", 3),
          //     (update) =>
          //       update
          //         .text((d) => d.Average.toFixed(2))
          //         .attr("id", "multiple-attribute-text")
          //         .call((update) =>
          //           update
          //             .transition(t)
          //             .attr("font-size", "12px")
          //             .attr("text-anchor", "start")
          //             .attr("dominant-baseline", "middle")
          //             .attr("x", (d) => xScaleMultiAttribute(d.Average))
          //             .attr("y", 0.5 * y_step_group)
          //         ),
          //     (exit) => exit.remove()
          //   ); // visualize the texts for each rectangles;


          // -----------------------------------------------
          // visualize the attributes view in the sub sets;
          pathVerticalSubSet = d => d3.line()([[xScaleMultiAttribute(d), 0.5 * y_step - 0.3 * y_step_group], [xScaleMultiAttribute(d), 0.5 * y_step + 0.3 * y_step_group]])
          pathHorizonSubSet = d => d3.line()([[xScaleMultiAttribute(d[0]), 0.5 * y_step], [
            xScaleMultiAttribute(d[1]), 0.5 * y_step
          ]])

          multiAttributeSubSetSvg
            .selectAll("#multiple-attribute-subset-verticallines")
            .data((d) => [d[attributeSelect[i].name].range[0], d[attributeSelect[i].name].range[1]])
            .join('path')
            .attr('id', 'multiple-attribute-subset-verticallines')
            .attr('d', d => pathVerticalSubSet(d))
            .attr('stroke-width', 0.8)
            .attr('fill', 'none')
            .attr('stroke', 'black')

          multiAttributeSubSetSvg
            .selectAll("#multiple-attribute-subset-rect")
            .data((d) => [d[attributeSelect[i].name].quantile])
            .join('rect')
            .attr('id', 'multiple-attribute-subset-rect')
            .attr('x', d => xScaleMultiAttribute(d[0]))
            .attr('width', d => xScaleMultiAttribute(d[2]) - xScaleMultiAttribute(d[0]))
            .attr('y', 0.5 * y_step - 0.3 * y_step_group)
            .attr('height', 0.6 * y_step_group)
            .attr('stroke-width', 0.8)
            .attr('fill', 'none')
            .attr('stroke', 'black')

          // pathHorizon = d => d3.line()([[xScaleMultiAttribute(d[0]), 0.5 * y_step_group], [
          //   xScaleMultiAttribute(d[1]), 0.5 * y_step_group
          // ]])

          multiAttributeSubSetSvg
            .selectAll("#multiple-attribute-subset-horizonlines")
            .data((d) => [[d[attributeSelect[i].name].range[0], d[attributeSelect[i].name].range[1]]])
            .join('path')
            .attr('id', 'multiple-attribute-subset-horizonlines')
            .attr('d', d => pathHorizonSubSet(d))
            .attr('stroke-width', 0.8)
            .attr('fill', 'none')
            .attr('stroke', 'black')


          // multiAttributeSubSetSvg
          //   .selectAll("rect")
          //   .data((d) => [d])
          //   .join(
          //     (enter) =>
          //       enter
          //         .append("rect")
          //         .attr("x", (d) => xScaleMultiAttribute(0))
          //         .attr("y", y_step * 0.5 - 0.5 * 0.8 * y_step_group)
          //         .attr("width", (d) => xScaleMultiAttribute(d.Average) - xScaleMultiAttribute(0))
          //         .attr("height", y_step_group * 0.8)
          //         .attr("fill", "#dedede"),
          //     (update) =>
          //       update.call((update) =>
          //         update
          //           .transition(t)
          //           .attr("x", (d) => xScaleMultiAttribute(0))
          //           .attr("y", y_step * 0.5 - 0.5 * 0.8 * y_step_group)
          //           .attr("width", (d) => xScaleMultiAttribute(d.Average) - xScaleMultiAttribute(0))
          //       ),
          //     (exit) => exit.remove()
          //   );

          // multiAttributeSubSetSvg
          //   .selectAll("text")
          //   .data((d) => [d])
          //   .join(
          //     (enter) =>
          //       enter
          //         .append("text")
          //         .attr("x", (d) => xScaleMultiAttribute(d.Average))
          //         .attr("y", 0.5 * y_step)
          //         .attr("dominant-baseline", "middle")
          //         .attr("text-anchor", "start")
          //         .attr("font-size", "12px")
          //         .text((d) => d.Average.toFixed(2)),
          //     (update) =>
          //       update.call((update) =>
          //         update
          //           .transition(t)
          //           .attr("x", (d) => xScaleMultiAttribute(d.Average))
          //           .attr("y", 0.5 * y_step)
          //           .text((d) => d.Average.toFixed(2))
          //       ),
          //     (exit) => exit.remove()
          //   );
        } else {    // when the type of attribute is categorical;

        }
      }
    }


    // ---------------------------------------
    // We delet all the elements if the firstAggregate is equal to 'No aggregate'
    if (firstAggeragateAttribute == 'No aggregate') {
      d3.select(node).selectAll('.set').select('#selected-rect-group').remove();

      d3.select(node).selectAll('.set').select('#combination-matrix').remove();

      d3.select(node).selectAll('.set').select('#cardinality-bar-groups').remove();

      d3.select(node).selectAll('.set').select('#oneAttribute-bar-groups').remove();

      d3.select(node).selectAll('.set').select('#multi-attribute-groups-0').remove();

      d3.select(node).selectAll('.set').select('#multi-attribute-groups-1').remove();

      d3.select(node).selectAll('.set').select('#multi-attribute-groups-2').remove();

      d3.select(node).selectAll('.set').select('#oneAttribute-bar-groups').remove();

      d3.select(node).selectAll('.set').attr('transform', `translate(0,${-y_step_group + margin.top})`);
    }

    // -------------------------------------


    // ------------------------------------------------
    // Order the elements of vertical lines and sets
    d3.select(node).select('#vertical-line').lower()

    node.value = data;
    node.dispatchEvent(new CustomEvent("input"));
    return node;
  } else {
    d3.select(node).selectAll('*').remove();
    node.value = data;
    node.dispatchEvent(new CustomEvent("input"));
    return node;
  }
}