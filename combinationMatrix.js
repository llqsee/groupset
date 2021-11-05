// require('./colorscales');

function renderCombinationMatrix({
  dataFromFuzzy, // the data from fuzzycut
  orderCate, // the category that we are going to use it order the matrix
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
  filterPara      // the data for filtering something
} = {}) {
  //   ----------------------------------------
  //   remove the all elements except the ordering buttons
  // d3.select(node).selectAll(".class").remove();
  // d3.select(node).select("#bars").remove();
  // d3.select(node).select("#y-label").remove();
  // d3.select(node).selectAll(".set").remove();
  debugger;
  var width = Number(d3.select(node).attr("width")),
    margin = margin || { top: 10, left: 15, bottom: 20, right: 70 },
    dimension = dimension || 2,
    oneAttribute = oneAttribute || "Average",
    scrollWidth = 20,
    lineWidth = lineWidth || 3,
    brushedAttributes = brushedAttributes || attributesCut;

  var data = CalTreData({
    dataFromFuzzy: dataFromFuzzy,
    dataset: dataset,
    attributesCut: attributesCut,
    empty: empty,
    dataJson: dataJson,
    brushedAttributes: brushedAttributes,
    secondAggeragateAttribute: secondAggeragateAttribute,
    firstAggeragateAttribute: firstAggeragateAttribute,
    collapse:collapse
  }); // generate the tree data;

  // filter the treeData based on the degreess
var firstAggeragateValue = node.parentElement.parentElement.parentElement.parentElement.querySelector('#layout-left').querySelector('.parameter-first').querySelector('select').value;
  if(firstAggeragateValue == 'Category'){
    data = data.filter(d => +d.value[filterPara[0]] >= +filterPara[1] && +d.value[filterPara[0]] <= +filterPara[2])
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
    data.sort((a, b) => b.childNode.length - a.childNode.length);
  } else if (dataFromFuzzy.findIndex((d) => d.name == orderCate) != -1) {
    data.sort((a, b) => b.value[orderCate] - a.value[orderCate]); // re-order the treedata
  } else if (
    orderCate == "up" ||
    orderCate == "down" ||
    orderCate == "stable"
  ) {
    data.sort((a, b) => b.valueTrend[orderCate] - a.valueTrend[orderCate]); // re-order the treedata based on the trends
  }


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
      (d3.select(node).attr("width") * 0.15 - widthMatrixLeft - margin.left) /
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
      y_step * data.map((d) => d.childNode.length).reduce((a, b) => a + b)
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
      if(a.length == 0){
        translateDistance = 0;
      }else if(a.length != 0){
        var dis1 = a.length * heightFirst;
        var dis2 = a.map(d => d.expand == 'true'? d.childNode.length:0);
        if(dis2.length !=0){
          translateDistance = dis1 + dis2.reduce((a,b) => a+b) * heightSecond
        }else{
          translateDistance = dis1
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
      if(a.length == 0){
        translateDistance = heightFirst + array[1] * heightSecond;
      }else if(a.length != 0){
        var dis1 = a.length * heightFirst;
        var dis2 = a.map(d => d.expand == 'true'? d.childNode.length:0);
        if(dis2.length !=0){
          translateDistance = dis1 + dis2.reduce((a,b) => a+b) * heightSecond
          +heightFirst + array[1] * heightSecond;
        }else{
          translateDistance = dis1+heightSecond
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
        return `translate(${0},${CalculateTranslate(data, i, y_step_group, y_step, collapse) + margin.top
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
    svg.select("#vertical-line").remove();
    svg
      .append("g")
      .attr("id", "vertical-line")
      .selectAll("path")
      .data(brushedAttributes)
      .join("path")
      .attr("d", verticalLine)
      .attr("stroke-width", 1)
      .attr("stroke", "grey")
      .attr("opacity", 0.4)
      .attr("stroke-dasharray", "3,6");

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
      .attr("width", width - scrollWidth)
      .attr("height", y_step_group * 0.98)
      .attr('stroke-width',0)
      .attr("fill", "grey")
      .attr("id", "selected-rect-group")
      .attr("opacity", 0.6)
      .attr("rx", 8)
      .attr("stroke-width", 0);
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
    //   var outputData = d.currentTarget.__data__;
    //   d.path[2].value = outputData;
    //   d.path[2].dispatchEvent(new CustomEvent("input"));
    //   return d.path[2];
    // });

    // ---------------------------------------------------------------------
    // render the circles in combination matrix;
    if (firstAggeragateAttribute == "Category") {
      gRect.selectAll("#combination-matrix").selectAll(".name-matrix").remove();
      gRect
        .selectAll("#combination-matrix")
        .selectAll(".trend-matrix")
        .remove();

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
        Object.keys(d.value).map((e) => {
          var f = {};
          f.value = d.value[e];
          f.valueAll = Object.keys(d.value)
            .map((keys) => d.value[keys])
            .reduce((a, b) => a + b);
          f.set = d.name;
          f.cate = e;
          f.element = d.childNode;
          return f;
        })
      );

      var arcNum = categoryMatrix.selectAll(".combination-arc").data((d) =>
        Object.keys(d.value).map((e) => {
          var f = {};
          f.value = d.value[e];
          f.valueAll = Object.keys(d.value)
            .map((keys) => d.value[keys])
            .reduce((a, b) => a + b);
          f.set = d.name;
          f.cate = e;
          f.element = d.childNode;
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
    } else if (firstAggeragateAttribute == "Trend") {
      // we visualize the trend matrix
      gRect
        .selectAll("#combination-matrix")
        .selectAll(".category-matrix")
        .remove();
      gRect.selectAll("#combination-matrix").selectAll(".name-matrix").remove();
      var x_range_trend = ["up", "down", "stable"].map(
        (d, i) => margin.left + widthMatrixLeft + 0.5 * x_step + x_step * i * 3
      );
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

      trendMatrix
        .selectAll(".arrows-up")
        .data(["up"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-up")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleFirstTrend(d) - y_step_group * 0.7)
        .attr("y", 0.25 * y_step_group)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
          "href",
          "https://liqunliu1990.static.observableusercontent.com/files/5e93b3fd8f829f8e3e7e0382693decfc62538b5a3f4955300746197ffee3fbe6abc6ca519f9c52a98e2ba8b96c22896552e00f494be9ef25df29d67d852f8668?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27up-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=tWqUogU~oBGR0QlWp6BMMr4yVXPZ7-izP7BUxuHIdOTo-8H7Esfs7djLIUIqt0~-6YVH9SooA1RKp6D5hdI7BCenydb33oyTpUDp15wrygCKBkYzUsn~t-JuF2vMJrRtl6BQXDhTyAUI-~dHwjtBaQJej4Gv3C-zXVnrJCJrRGjawlT83rhnujSBUscDHJRlpJYo7UzvZvcVITsLhuQ6UyMq-JnYKAVFYng92UiHmgqg8ibNMzN4Ix3Ntrflgs24hPwAROIR3dDf0Dg3HYbIbH8YN~N7nOLx5YF1zV~A-s01F~UlyN4aObr92ZT9LFD~dlZuxU3OLuN~1b21G2QCYQ__"
        )
        .attr("height", y_step_group * 0.4)
        .attr("width", y_step_group * 0.4);

      trendMatrix
        .selectAll(".arrows-down")
        .data(["down"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-down")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleFirstTrend(d) - y_step_group * 0.7)
        .attr("y", 0.25 * y_step_group)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
          "href",
          "https://liqunliu1990.static.observableusercontent.com/files/a652469c555d44d9d9637ca26a1dbcb363a9a421656580b70e117653745303c83f781505b5a33b048b525a6d328ccd99ebc0e3e1e7f24432ad0dfde6ee7d5259?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27down-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=MlC~wYR7mChf8Fc71gKcypmnXrzXqADbLAlNf~hgxiMoK~9Mp7zT4nM0Nj~mJAsgjxWBIDH2w5cuWjTmD6xq48nzQ5E5lK3Pp8mICv91YIoF25Dvxv2ZGgeX5T8i06mZoeJvjN5AWJUCenpBPTztleCmAt7M4~tJgWiJtpTvenBmdIyB4x5EesS2b4WWvKRhBaYBmndVw9qFTexDM0mmNTj~2F-Ewv3-qZ9fmdIXywtlTBF2TPxh5f5dV2GEiqu4KY-WjtFISttUk3qOsZdjiGAe0LhF23bqlBjZ1nDUjxbz89cnweaiJcTnf-P7Sb0xGF8Ee2b-hI7cXhwlmoj3Xw__"
        )
        .attr("height", y_step_group * 0.4)
        .attr("width", y_step_group * 0.4);

      trendMatrix
        .selectAll(".arrows-stable")
        .data(["stable"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-stable")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleFirstTrend(d) - y_step_group * 0.7)
        .attr("y", 0.25 * y_step_group)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
          "href",
          "https://liqunliu1990.static.observableusercontent.com/files/9e220282e70b5e7e58f88ec573ae5b13bebc5dcbe7db4e184a7bf818a8b569b6a3fe49664cc1720d1e1ed0fc4ba6432b5ca9abbd1152ba71acf42830b10515e6?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27right-arrow-svgrepo-com%2520(1).svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=b~gqq44XavJ2wzGqrz4r8NPnroue5yZOvO4q8tIfpuMfDyN9DhwmKpzVO-c95PWHm2pl7sDSw6xM5Co4g6j0CrbqppEoeVS6AwRVna3eHo4XvHtKNnPGD52HLKSZwooqjBqlWEetUwVS7Q4YDzVhxm2e~QuvH9iQMmyDBfR1pctiTP80U4ltqq2SA8gOgxdfedF7nuPkKoVQdvaeVnwqM0fCaI5Or8RZKHIdP2ZYwaIyIukOFIHsdr3zjvGi5qjclT-TTW6SfOCq8Fkc7VG0kWneo6tLuK9MyCGVKxtGTAx44FdyfqAFzXbmg018pYkWzrEFIOwA6PSZjzalhK64oA__"
        )
        .attr("height", y_step_group * 0.4)
        .attr("width", y_step_group * 0.4);

      trendMatrix
        .selectAll("text.name-text")
        .data((d) => [
          { value: d.value["up"], trend: "up" },
          { value: d.value["down"], trend: "down" },
          { value: d.value["stable"], trend: "stable" }
        ])
        .join(
          (enter) =>
            enter
              .append("text")
              .text((d) => d.value)
              .attr("class", "name-text")
              .attr("x", (d) => xScaleFirstTrend(d.trend))
              .attr("y", 0.5 * y_step_group)
              .attr("dominant-baseline", "middle")
              .attr("font-size", "12px")
              .attr("text-anchor", "middle"),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .text((d) => d.value)
                .attr("class", "name-text")
                .attr("x", (d) => xScaleFirstTrend(d.trend))
                .attr("y", 0.5 * y_step_group)
            ),
          (exit) => exit.remove()
        );
    } else {
      gRect
        .selectAll("#combination-matrix")
        .selectAll(".category-matrix")
        .remove();

      gRect
        .selectAll("#combination-matrix")
        .selectAll(".trend-matrix")
        .remove();

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
        .attr("x", d3.select(node).attr("width") * 0.15 - x_step)
        .attr("y", 0.5 * y_step_group)
        .attr("dominant-baseline", "middle")
        .attr("text-anchor", "end")
        .text((d) => d.value)
        .attr("font-size", "16px")
        .attr("font-weight", "bolder");
    }

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
            .map((d) => d.childNode.map((e) => e.childNode.length))
            .reduce((a, b) => a.concat(b))
            .concat(
              data
                .map((d) => d.childNode.map((e) => e.childNode.length))
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
            .tickSizeInner([0])
            .tickSizeOuter([1])
        )
        .attr("transform", `translate(${0},${10})`);
    // // create the generator for cardinality axis
    svg
      .selectAll("#cardinality-axis")
      .data([1])
      .join(
        (enter) => enter.append("g").attr("id", "cardinality-axis").call(xAxis),
        (update) => update.call((update) => update.call(xAxis)),
        (exit) => exit.remove()
      );

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
              (d) => xCardinality(d.childNode.length) - xCardinality(0)
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
                (d) => xCardinality(d.childNode.length) - xCardinality(0)
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
            .text((d) => d.childNode.length)
            .attr("font-size", "12px")
            .attr("text-anchor", "start")
            .attr("dominant-baseline", "middle")
            .attr("x", (d) => xCardinality(d.childNode.length))
            .attr("y", 0.5 * y_step_group)
            .attr("dx", 3),
        (update) =>
          update
            .text((d) => d.childNode.length)
            .attr("id", "cardinality-text")
            .call((update) =>
              update
                .transition(t)
                .attr("font-size", "12px")
                .attr("text-anchor", "start")
                .attr("dominant-baseline", "middle")
                .attr("x", (d) => xCardinality(d.childNode.length))
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
      .data((d) => d.childNode)
      .join("g")
      .style('display', (d,i,s) => {if(s[0].parentElement.__data__.expand == 'false'){return 'none'}else{return 'inline'}})
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

      d.childNode.map(
        (e) => ((e.name = d.name), (e.groupMin = d.min), (e.groupMax = d.max))
      );
      return d.childNode;
    });
    var textSet = groupLineText.selectAll(".subset-text").data((d) => {

      d.childNode.map(
        (e) => ((e.name = d.name), (e.groupMin = d.min), (e.groupMax = d.max))
      );
      return d.childNode;
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
      .attr("width", width - scrollWidth - margin.left)
      .attr("height", y_step)
      .attr("fill", "white")
      // .attr("id", "selected-rect-group")
      .attr("opacity", 0)
      .attr("stroke-width", 0)
      .on("mouseover", (d) => {

        d3.select(d.currentTarget)
          .attr("fill", "#dedede")
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("opacity", 0.5);
        // d3.select(d.path[1]).selectAll(".set-text").attr("display", "inline"); // add the text with inline display;

        var selectName = d.path[1].__data__.childNode.map((d) => d[id]); // get the names of all elements in this set
        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll("path")
          .attr("stroke", "grey")
          .attr("opacity", 0.05); // make the global lines grey while mouseover the set

        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll("text")
          .attr("display", "none"); // make the global texts hidden while mouseover the set
      })
      .on("mouseleave", (d) => {
        d3.select(d.currentTarget)
          .attr("fill", "white")
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr("opacity", 0);
        // d3.select(d.path[1]).selectAll(".set-text").attr("display", "none");

        var selectName = d.path[1].__data__.childNode.map((d) => d[id]); // get the names of all elements in this set

        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll("path")
          .attr("stroke", (d) => d.color)
          .attr("opacity", 0.5); // make the global lines grey while mouseover the set

        d3.select(d.path[5])
          .select("#div-line")
          .selectAll(".line")
          .filter((d) => selectName.findIndex((e) => e == d[id]) == -1)
          .selectAll("text")
          .attr("display", "inline"); // make the global texts hidden while mouseover the set
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
        [d3.select(node).attr("width") * 0.15 + 0.5 * x_step, y_step],
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

              return xCardinality(d.childNode.length) - xCardinality(0);
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

                return xCardinality(d.childNode.length) - xCardinality(0);
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
            .text((d) => d.childNode.length)
            .attr("x", (d) => xCardinality(d.childNode.length))
            .attr("y", 0.5 * y_step)
            .attr("dominant-baseline", "middle")
            .attr("text-anchor", "start")
            .attr("font-size", "12px"),
        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("x", (d) => xCardinality(d.childNode.length))
              .attr("y", 0.5 * y_step)
              .text((d) => d.childNode.length)
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
    // render the names for each sub set

    if (secondAggeragateAttribute == "Trend") {
      var xRangeTrend = [
        d3.select(node).attr("width") * 0.15 - 0.5 * x_step,
        d3.select(node).attr("width") * 0.15 + x_step * 2.5
      ];
      var xScaleTrend = d3
        .scalePoint()
        .range(xRangeTrend)
        .domain(["up", "down", "stable"]);

      groupLineText
        .selectAll(".name-group")
        .selectAll(".just-name-group")
        .remove();

      groupLineText
        .selectAll(".name-group")
        .selectAll(".category-name-group")
        .remove();

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
        .selectAll("text.name-text")
        .data((d) => [
          { value: d.value["up"], trend: "up" },
          { value: d.value["down"], trend: "down" },
          { value: d.value["stable"], trend: "stable" }
        ])
        .join(
          (enter) =>
            enter
              .append("text")
              .text((d) => d.value)
              .attr("class", "name-text")
              .attr("x", (d) => xScaleTrend(d.trend))
              .attr("y", 0.5 * y_step)
              .attr("dominant-baseline", "middle")
              .attr("font-size", "12px")
              .attr("text-anchor", "middle"),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .text((d) => d.value)
                .attr("class", "name-text")
                .attr("x", (d) => xScaleTrend(d.trend))
                .attr("y", 0.5 * y_step)
            ),
          (exit) => exit.remove()
        );

      subSetName
        .selectAll(".arrows-up")
        .data(["up"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-up")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleTrend(d) - y_step_group * 0.7)
        .attr("y", 0.5 * y_step - 0.2 * y_step_group)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
          "href",
          "https://liqunliu1990.static.observableusercontent.com/files/5e93b3fd8f829f8e3e7e0382693decfc62538b5a3f4955300746197ffee3fbe6abc6ca519f9c52a98e2ba8b96c22896552e00f494be9ef25df29d67d852f8668?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27up-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=tWqUogU~oBGR0QlWp6BMMr4yVXPZ7-izP7BUxuHIdOTo-8H7Esfs7djLIUIqt0~-6YVH9SooA1RKp6D5hdI7BCenydb33oyTpUDp15wrygCKBkYzUsn~t-JuF2vMJrRtl6BQXDhTyAUI-~dHwjtBaQJej4Gv3C-zXVnrJCJrRGjawlT83rhnujSBUscDHJRlpJYo7UzvZvcVITsLhuQ6UyMq-JnYKAVFYng92UiHmgqg8ibNMzN4Ix3Ntrflgs24hPwAROIR3dDf0Dg3HYbIbH8YN~N7nOLx5YF1zV~A-s01F~UlyN4aObr92ZT9LFD~dlZuxU3OLuN~1b21G2QCYQ__"
        )
        .attr("height", y_step_group * 0.4)
        .attr("width", y_step_group * 0.4);

      subSetName
        .selectAll(".arrows-down")
        .data(["down"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-down")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleTrend(d) - y_step_group * 0.7)
        .attr("y", 0.5 * y_step - 0.2 * y_step_group)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
          "href",
          "https://liqunliu1990.static.observableusercontent.com/files/a652469c555d44d9d9637ca26a1dbcb363a9a421656580b70e117653745303c83f781505b5a33b048b525a6d328ccd99ebc0e3e1e7f24432ad0dfde6ee7d5259?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27down-arrow-svgrepo-com.svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=MlC~wYR7mChf8Fc71gKcypmnXrzXqADbLAlNf~hgxiMoK~9Mp7zT4nM0Nj~mJAsgjxWBIDH2w5cuWjTmD6xq48nzQ5E5lK3Pp8mICv91YIoF25Dvxv2ZGgeX5T8i06mZoeJvjN5AWJUCenpBPTztleCmAt7M4~tJgWiJtpTvenBmdIyB4x5EesS2b4WWvKRhBaYBmndVw9qFTexDM0mmNTj~2F-Ewv3-qZ9fmdIXywtlTBF2TPxh5f5dV2GEiqu4KY-WjtFISttUk3qOsZdjiGAe0LhF23bqlBjZ1nDUjxbz89cnweaiJcTnf-P7Sb0xGF8Ee2b-hI7cXhwlmoj3Xw__"
        )
        .attr("height", y_step_group * 0.4)
        .attr("width", y_step_group * 0.4);

      subSetName
        .selectAll(".arrows-stable")
        .data(["stable"])
        .join("image")
        // .text("abc")
        .attr("class", "arrows-stable")
        // .text((d) => "&euro")
        // .attr("font-size", "12px")
        .attr("x", (d) => xScaleTrend(d) - y_step_group * 0.7)
        .attr("y", 0.5 * y_step - 0.2 * y_step_group)
        // .attr("class", "fa-solid fa-up-right")
        .attr(
          "href",
          "https://liqunliu1990.static.observableusercontent.com/files/9e220282e70b5e7e58f88ec573ae5b13bebc5dcbe7db4e184a7bf818a8b569b6a3fe49664cc1720d1e1ed0fc4ba6432b5ca9abbd1152ba71acf42830b10515e6?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27right-arrow-svgrepo-com%2520(1).svg&Expires=1635249600000&Key-Pair-Id=APKAJCHFJLLLU4Y2WVSQ&Signature=b~gqq44XavJ2wzGqrz4r8NPnroue5yZOvO4q8tIfpuMfDyN9DhwmKpzVO-c95PWHm2pl7sDSw6xM5Co4g6j0CrbqppEoeVS6AwRVna3eHo4XvHtKNnPGD52HLKSZwooqjBqlWEetUwVS7Q4YDzVhxm2e~QuvH9iQMmyDBfR1pctiTP80U4ltqq2SA8gOgxdfedF7nuPkKoVQdvaeVnwqM0fCaI5Or8RZKHIdP2ZYwaIyIukOFIHsdr3zjvGi5qjclT-TTW6SfOCq8Fkc7VG0kWneo6tLuK9MyCGVKxtGTAx44FdyfqAFzXbmg018pYkWzrEFIOwA6PSZjzalhK64oA__"
        )
        .attr("height", y_step_group * 0.4)
        .attr("width", y_step_group * 0.4);

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
    } else if (secondAggeragateAttribute == "Category") {
      groupLineText
        .selectAll(".name-group")
        .selectAll(".trend-name-group")
        .remove();
      groupLineText
        .selectAll(".name-group")
        .selectAll(".just-name-group")
        .remove();
      var x_range_sub_name = categories.map(
        (d, i) => d3.select(node).attr("width") * 0.15 + x_step * (2.5 - i * 2)
      );
      var xScaleSubName = d3
        .scalePoint()
        .domain(categories)
        .range(x_range_sub_name);

      var subSetName = groupLineText
        .selectAll(".name-group")
        .data((d) => [d])
        .join("g")
        .attr("class", "name-group")
        .selectAll(".category-name-group")
        .data((d) => [d])
        .join("g")
        .attr("class", "category-name-group");

      var cirNum = subSetName.selectAll(".combination-circle").data((d) =>
        Object.keys(d.value).map((e) => {
          var f = {};
          f.value = d.value[e];
          f.valueAll = Object.keys(d.value)
            .map((keys) => d.value[keys])
            .reduce((a, b) => a + b);
          f.set = d.name;
          f.cate = e;
          f.element = d.childNode;
          return f;
        })
      );

      var arcNum = subSetName.selectAll(".combination-arc").data((d) =>
        Object.keys(d.value).map((e) => {
          var f = {};
          f.value = d.value[e];
          f.valueAll = Object.keys(d.value)
            .map((keys) => d.value[keys])
            .reduce((a, b) => a + b);
          f.set = d.name;
          f.cate = e;
          f.element = d.childNode;
          return f;
        })
      );
      // if (circleType == "circle") {
      cirNum.join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "combination-circle")
            .attr("cx", (d) => xScaleSubName(d.cate))
            .attr("cy", y_step * 0.5)
            .attr("r", d3.min([x_step, y_step_group]) * 0.45)
            .attr("stroke-width", 3)
            .attr("fill", "#dedede")
            .call((enter) => enter.transition(t)),

        (update) =>
          update.call((update) =>
            update
              .transition(t)
              .attr("cx", (d) => xScaleSubName(d.cate))
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
                "translate(" + xScaleSubName(d.cate) + "," + y_step * 0.5 + ")"
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
                  xScaleSubName(d.cate) +
                  "," +
                  y_step * 0.5 +
                  ")"
              )
          ),
        (exit) => exit.call((exit) => exit.transition(t)).remove()
      );
    } else {
      groupLineText
        .selectAll(".name-group")
        .selectAll(".category-name-group")
        .remove();
      groupLineText
        .selectAll(".name-group")
        .selectAll(".trend-name-group")
        .remove();

      var subSetName = groupLineText
        .selectAll(".name-group")
        .data((d) => [d])
        .join("g")
        .attr("class", "name-group")
        .selectAll(".just-name-group")
        .data((d) => [d])
        .join("g")
        .attr("class", "just-name-group");

      subSetName
        .selectAll("text")
        .data((d) => [d])
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("x", d3.select(node).attr("width") * 0.15 + x_step * 2.5)
              .attr("y", 0.5 * y_step)
              .attr("dominant-baseline", "middle")
              .attr("text-anchor", "end")
              .text((d) => d.value)
              .attr("font-size", "14px"),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .attr("x", d3.select(node).attr("width") * 0.15 + x_step * 2.5)
                .attr("y", 0.5 * y_step)
                .text((d) => d.value)
            ),
          (exit) => exit.remove()
        );
    }

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

    node.value = data;
    node.dispatchEvent(new CustomEvent("input"));
    return node;
  }else{
d3.select(node).selectAll('*').remove();
    node.value = data;
    node.dispatchEvent(new CustomEvent("input"));
    return node;
  }
}