function CalTreData({
    dataFromFuzzy, // the data from fuzzyCut, which is the dataset of overlapData;
    dataset, // the raw dataset;
    attributesCut, //  this one is to get the attributes in dataset for multiple dimensional combination matrix
    empty, // if we should filter the sets not including the elements;
    dataJson, // the dataJson
    brushedAttributes, // the attributes selected from brush
    firstAggeragateAttribute, // the first aggeragate attribute;
    secondAggeragateAttribute, // the second aggeragate attribute;
    collapse             // if it is collapse or expand;
} = {}) {
    var keys = brushedAttributes; // extract the attributes that are going to be calculated, like ['time1', 'time2',...,'time24']
    var timeLength = keys.length; // calculate the length of time points
    debugger;
    //   loop the dataset with map, calculate the every attributes we extracted to give them a corresponding categories;
    var dataCategories = dataFromFuzzy
        .map((d) => d.name)
        .filter((d, i, s) => s.indexOf(d) === i); //   create an array to put all categories generated such as ['low','high','middle']
    var dataTrend = ["up", "down", "stable"];

    // ------------------------------------------------------------
    // add the category and trend attributes to elements
    // if (
    //     firstAggeragateAttribute == "Trend" ||
    //     firstAggeragateAttribute == "Category" ||
    //     secondAggeragateAttribute == "Trend" ||
    //     secondAggeragateAttribute == "Category"
    // ) {
    dataset.map((d) => {
        var dataForFinal = {};
        for (var i of dataCategories) {
            dataForFinal[i] = 0;
        } // init the category attribute;

        var dataForTrend = {};
        for (var j of dataTrend) {
            dataForTrend[j] = 0;
        } // init the Trend attribute;

        // create a oject to save the trend
        d.timeTrend = [];

        d.Trend = dataForTrend;
        for (var n = 0; n < keys.length - 1; n++) {
            if (dataJson.rank == "yes") {
                if (
                    (d[keys[n + 1]] - d[keys[n]]) / (dataJson.max - dataJson.min) <
                    -0.02
                ) {
                    d.Trend["up"] = d.Trend["up"] + 1;
                    d.timeTrend.push({point: [[keys[n],d[keys[n]]],[keys[n+1],d[keys[n+1]]]],name:keys[n],value:'up'})
                } else if (
                    (d[keys[n + 1]] - d[keys[n]]) / (dataJson.max - dataJson.min) >
                    0.02
                ) {
                    d.Trend["down"] = d.Trend["down"] + 1;
                    d.timeTrend.push({point: [[keys[n],d[keys[n]]],[keys[n+1],d[keys[n+1]]]],name:keys[n],value:'down'})
                } else {
                    d.Trend["stable"] = d.Trend["stable"] + 1;
                    d.timeTrend.push({point: [[keys[n],d[keys[n]]],[keys[n+1],d[keys[n+1]]]],name:keys[n],value:'stable'})
                }
            } else {
                if (
                    (d[keys[n + 1]] - d[keys[n]]) / (dataJson.max - dataJson.min) >
                    0.02
                ) {
                    d.Trend["up"] = d.Trend["up"] + 1;
                    d.timeTrend.push({point: [[keys[n],d[keys[n]]],[keys[n+1],d[keys[n+1]]]],name:keys[n],value:'up'})
                } else if (
                    (d[keys[n + 1]] - d[keys[n]]) / (dataJson.max - dataJson.min) <
                    -0.02
                ) {
                    d.Trend["down"] = d.Trend["down"] + 1;
                    d.timeTrend.push({point: [[keys[n],d[keys[n]]],[keys[n+1],d[keys[n+1]]]],name:keys[n],value:'down'})
                } else {
                    d.Trend["stable"] = d.Trend["stable"] + 1;
                    d.timeTrend.push({point: [[keys[n],d[keys[n]]],[keys[n+1],d[keys[n+1]]]],name:keys[n],value:'stable'})
                }
            }
        }

        d.Category = dataForFinal;
        for (var key of keys) {
            for (var i = 0; i < dataFromFuzzy.length; i++) {
                var cate = dataFromFuzzy[i];
                if (
                    i < dataFromFuzzy.length - 1 &&
                    +d[key] >= +cate.edgeMin &&
                    +d[key] < +cate.edgeMax
                ) {
                    d.Category[cate.name] = d.Category[cate.name] + 1;
                } else if (
                    i == dataFromFuzzy.length - 1 &&
                    +d[key] >= +cate.edgeMin
                ) {
                    d.Category[cate.name] = d.Category[cate.name] + 1;
                }
            } // calculate which categories that this element should belong to based on the value of 'key'
        }
    }); // add two attribute to dataset like {low:3,middle:5,hight:5} and {up:3,down:5,stable:7}
    // } // we determine if the there is aggeragate by trend or category and then, we add the attributes to elements

    

    // ------------------------------------------------
    // We re-struct the dataset with d3.group();

    // create a function to judge if a number is integer
    function isInteger(obj) {
        return typeof obj === 'number' && obj % 1 === 0
    }

    // Create the treeDataPlus
    dataset.map(d => {
        d.jsonCate = JSON.stringify(d.Category);
        d.jsonTrend = JSON.stringify(d.Trend);
        return d
    });
    if (firstAggeragateAttribute == "Degree") {
        var trueValue = 'jsonCate';

    } else if (firstAggeragateAttribute == "Trend") {
        var trueValue = 'jsonTrend';
    } else {
        var trueValue = firstAggeragateAttribute;
    }

    if (secondAggeragateAttribute == "Degree") {
        var trueValue1 = 'jsonCate';

    } else if (secondAggeragateAttribute == "Trend") {
        var trueValue1 = 'jsonTrend';
    } else if(secondAggeragateAttribute == 'No aggregate'){
        var trueValue1 = dataJson.id;
    } else {
        var trueValue1 = secondAggeragateAttribute;
    }
    var treeDataPlus = d3.groups(dataset, d => d[trueValue], d => d[trueValue1]);

    // Add the id, name, and other attributes for each first level group;
    treeDataPlus.map((d, i) => {
        if (firstAggeragateAttribute == "Degree" || firstAggeragateAttribute == "Trend") {
            d.value = JSON.parse(d[0])
        } else {
            d.value = d[0];
        }
        d.name = "Set " + i;
        d.id = i;
        d.expand = collapse == 'expand' ? 'true' : 'false';
        d.categoryGroup = {};
        d.trendGroup = {};

        // calculate the average categoryGroup values and add the categoryGroup attribute
        for (var value of dataCategories) {
            d.categoryGroup[value] = 0;
        }
        for (var index = 0; index < dataCategories.length; index++) {
            // debugger;
            var valueCategory = d[1].map(e => e[1]).reduce((a, b) => a.concat(b)).map(f => dataCategories.map(e => f.Category[e]))
                .map(e => e[index]).reduce((a, b) => a + b) / (d[1].map(e => e[1]).reduce((a, b) => a.concat(b)).length);
            // debugger;
            if (isInteger(valueCategory) == true) {
                d.categoryGroup[dataCategories[index]] = valueCategory;
            } else {
                d.categoryGroup[dataCategories[index]] = Number(valueCategory.toFixed(1));
            }
        }

        // calculate the average trendGroup values and add the trendGroup attribute
        for (var value of dataTrend) {
            d.trendGroup[value] = 0;
        }
        for (var index = 0; index < dataTrend.length; index++) {
            // debugger;
            var valueTrend = d[1].map(e => e[1]).reduce((a, b) => a.concat(b)).map(f => dataTrend.map(e => f.Trend[e]))
                .map(e => e[index]).reduce((a, b) => a + b) / (d[1].map(e => e[1]).reduce((a, b) => a.concat(b)).length);
            // debugger;
            if (isInteger(valueTrend) == true) {
                d.trendGroup[dataTrend[index]] = valueTrend;
            } else {
                d.trendGroup[dataTrend[index]] = Number(valueTrend.toFixed(1));
            }
        }

        // Calcualte the id of second level
        d[1][0].id = i + "_" + d[1][0][1].length;

        // Calculate the value of second level
        if (secondAggeragateAttribute == "Degree" || secondAggeragateAttribute == "Trend") {
            // d.value = JSON.parse(d[0])
            d[1].map(e => e.value = JSON.parse(e[0]));
            // d[1][0].value = JSON.parse(d[1][0][0]);
        } else {
            d[1].map(e => e.value = e[0])
            // d[1][0].value = d[1][0][0];
        }

        // calculate the categoryGroup of second level
        d[1].map(e => {
            e.categoryGroup = {};

            for (var index = 0; index < dataCategories.length; index++) {
                // debugger;
                
                var valueCategory = e[1].map(f =>f['Category'][dataCategories[index]])
                .reduce((a,b) => a + b)/e[1].length;

                // debugger;
                if (isInteger(valueCategory) == true) {
                    e.categoryGroup[dataCategories[index]] = valueCategory;
                } else {
                    e.categoryGroup[dataCategories[index]] = Number(valueCategory.toFixed(1));
                }
            }
        })

        // calculate the trendGroup of second level
        d[1].map(e => {
            e.trendGroup = {};

            for (var index = 0; index < dataTrend.length; index++) {
                // debugger;
                
                var valueTrend = e[1].map(f =>f['Trend'][dataTrend[index]])
                .reduce((a,b) => a + b)/e[1].length;

                // debugger;
                if (isInteger(valueTrend) == true) {
                    e.trendGroup[dataTrend[index]] = valueTrend;
                } else {
                    e.trendGroup[dataTrend[index]] = Number(valueTrend.toFixed(1));
                }
            }
        })

        // calcualte the maximum values and minimum values;
        d[1].map(e => {
            // debugger;
            e.max = d3.max(
                e[1]
                    .map((f) => {
                        var a = {};
                        var array = brushedAttributes.map((g) => +f[g]);
                        a.min = d3.min(array);
                        a.max = d3.max(array);
                        return a;
                    })
                    .map((e) => e.max)
            );

            e.min = d3.min(
                e[1]
                    .map((f) => {
                        var a = {};
                        var array = brushedAttributes.map((g) => +f[g]);
                        a.min = d3.min(array);
                        a.max = d3.max(array);
                        return a;
                    })
                    .map((e) => e.min)
            );
        })



        // -----------------------------------------------
        // Add the average attribute of each set
        d["Average"] = 0;
        var a = []; // init the all teams in a set
        d[1].map((e) => {
            // e is the subset;
            // debugger;
            // var arrayForEachE = brushedAttributes.map((f) => e[f]); // calculate the average values for each e (sub sets)

            var valueSubSet = []; // init the array to save the average values for all teams in each subset
            // add the average values for each e (sub sets)
            for (var i of e[1]) {

                // e[0][1] is the team;
                a.push(i);
                valueSubSet.push(
                    brushedAttributes.map((f) => i[f]).reduce((m, n) => +m + +n)
                ); // get the average values array for all teams in each subset
            }
            e.Average =
                valueSubSet.reduce((m, n) => m + n) /
                (brushedAttributes.length * e[1].length);
            return e;
        }); // extract all teams in the set;
        var arrayFinal = a.map((e) => {
            var array = brushedAttributes.map((f) => e[f]); // array are the all values for different time points of a teams
            e.Average = array.reduce((m, n) => +m + +n) / brushedAttributes.length; // add the average attributes for each team
            return e.Average;
        }); // calculate the average for each team
        d.Average = arrayFinal.reduce((a, b) => a + b) / arrayFinal.length; // calculate the final average
    });




    // --------------------------------------------------------------
    // Create the tree data with the first level set
    // if (firstAggeragateAttribute == "Category") {
    //     // create the all first level sets like [{low:3,middle:5,hight:5},{low:4,middle:5,hight:4},{low:2,middle:5,hight:6}]

    //     if (dataCategories.length == 2) {
    //         // if data categories' length are 2
    //         var treeData1 = []; // init the treeData
    //         for (var i = 0; i <= timeLength; i++) {
    //             var treeSmall = {};
    //             treeSmall[dataCategories[0]] = i;
    //             treeSmall[dataCategories[1]] = timeLength - i;
    //             treeData1.push(treeSmall);
    //             // for(var j = 0; j<= timeLength - i; j++){
    //             //   treeData1.push({})
    //             // }
    //         }
    //     } else if (dataCategories.length == 3) {
    //         var treeData1 = [];
    //         for (var i = 0; i <= timeLength; i++) {
    //             for (var j = 0; j <= timeLength - i; j++) {
    //                 var treeSmall = {};
    //                 treeSmall[dataCategories[0]] = i;
    //                 treeSmall[dataCategories[1]] = j;
    //                 treeSmall[dataCategories[2]] = timeLength - i - j;
    //                 treeData1.push(treeSmall);
    //             }
    //         }
    //     } else if (dataCategories.length == 4) {
    //         var treeData1 = [];
    //         for (var i = 0; i <= timeLength; i++) {
    //             for (var j = 0; j <= timeLength - i; j++) {
    //                 for (var z = 0; z <= timeLength - i - j; z++) {
    //                     var treeSmall = {};
    //                     treeSmall[dataCategories[0]] = i;
    //                     treeSmall[dataCategories[1]] = j;
    //                     treeSmall[dataCategories[2]] = z;
    //                     treeSmall[dataCategories[3]] = timeLength - i - j - z;
    //                     treeData1.push(treeSmall);
    //                 }
    //             }
    //         }
    //     }

    //     treeData1 = treeData1.map((d, i) => {
    //         var e = {};
    //         e.value = d;
    //         e.categoryGroup = d;
    //         // e.valueTrend = null;
    //         e.childNode = [];
    //         e.name = "Set " + i;
    //         e.id = i;
    //         e.expand = collapse == 'expand' ? 'true' : 'false';
    //         return e;
    //     }); //   create the tree data
    // } else if (firstAggeragateAttribute == "Trend") {
    //     // if the first aggeragate is the trend
    //     var treeData1 = [];
    //     for (var i = 0; i <= timeLength - 1; i++) {
    //         for (var j = 0; j <= timeLength - 1 - i; j++) {
    //             var treeSmall = {};
    //             treeSmall["up"] = i;
    //             treeSmall["down"] = j;
    //             treeSmall["stable"] = timeLength - 1 - i - j;
    //             treeData1.push(treeSmall);
    //         }
    //     }
    //     treeData1 = treeData1.map((d, i) => {
    //         var e = {};
    //         e.value = d;
    //         // e.valueTrend = null;
    //         e.childNode = [];
    //         e.name = "Set " + i;
    //         e.id = i;
    //         e.expand = collapse == 'expand' ? 'true' : 'false';
    //         return e;
    //     }); //   create the tree data
    // } else {

    //     var arrayForUnique = dataset.map((d) => d[firstAggeragateAttribute]);
    //     var uniqueArray = arrayForUnique.filter(
    //         (d, i) => arrayForUnique.findIndex((e) => e == d) == i
    //     );
    //     var treeData1 = uniqueArray.map((d, i) => {
    //         var e = {};
    //         e.value = d;
    //         // e.valueTrend = null;
    //         e.childNode = [];
    //         e.name = "Set " + i;
    //         e.id = i;
    //         e.expand = collapse == 'expand' ? 'true' : 'false';
    //         return e;
    //     }); //   create the tree data
    // }

    // --------------------------------------------------------------------
    // We create the second level set
    // for (var datum of dataset) {
    //     for (var tree of treeData1) {
    //         //  we determine if there is a tree can cater the datum;
    //         if (
    //             JSON.stringify(datum[firstAggeragateAttribute]) ==
    //             JSON.stringify(tree.value) ||
    //             datum[firstAggeragateAttribute] == tree.value
    //         ) {
    //             // determine if there is a subset can cater the datum;
    //             if (
    //                 tree.childNode.find(
    //                     (d) =>
    //                         JSON.stringify(d.value) ==
    //                         JSON.stringify(datum[secondAggeragateAttribute])
    //                 ) != null ||
    //                 tree.childNode.find(
    //                     (d) => d.value == datum[secondAggeragateAttribute]
    //                 ) != null
    //             ) {
    //                 // we push the datum in the related set

    //                 tree.childNode
    //                     .find(
    //                         (d) =>
    //                             JSON.stringify(d.value) ==
    //                             JSON.stringify(datum[secondAggeragateAttribute]) ||
    //                             d.value == datum[secondAggeragateAttribute]
    //                     )
    //                     .childNode.push(datum);
    //                 // we change the id of subsets;
    //                 // tree.childNode.find(
    //                 //   (d) => JSON.stringify(d.value) == JSON.stringify(datum.trend)
    //                 // ).childNode.id = 1;
    //             } else {
    //                 // if there is no subset can cater the datum, we create a new one;

    //                 tree.childNode.push({
    //                     id: tree.id + "_" + tree.childNode.length,
    //                     value: datum[secondAggeragateAttribute],
    //                     childNode: [datum]
    //                 });
    //             }
    //         }
    //     }
    // }

    // for (var datum of dataset) {

    //   var isTrueSet = treeData1.filter(
    //     (d) => JSON.stringify(d.value) == JSON.stringify(datum.category)
    //   );
    //   // if (isTrueSet == null) {

    //   // }
    //   if (isTrueSet != null) {

    //     var iIndex = 0;
    //     var thisSet = isTrueSet.find(
    //       (d) => JSON.stringify(d.valueTrend) == JSON.stringify(datum.trend)
    //     );

    //     if (thisSet != null) {

    //       // var thisIndex = thisSet.indexOf(treeData1);
    //       treeData1 = treeData1.map((d) => {
    //         if (
    //           JSON.stringify(d.value) == JSON.stringify(datum.category) &&
    //           JSON.stringify(d.valueTrend) == JSON.stringify(datum.trend)
    //         ) {
    //           d.childNode.push(datum);
    //           d.valueTrend = datum.trend;
    //         }
    //         return d;
    //       });
    //       // theSet.childNode.push(datum);
    //       // theSet.valueTrend = datum.trend;
    //     } else if (thisSet == null) {
    //       var thisIndex = treeData1.findIndex(
    //         (d) => JSON.stringify(d.value) == JSON.stringify(isTrueSet[0].value)
    //       );
    //       // if (thisIndex == -1) {

    //       // }

    //       var newSet = {
    //         value: isTrueSet[0].value,
    //         valueTrend: datum.trend,
    //         childNode: [datum],
    //         name: isTrueSet[0].name + isTrueSet.length
    //       };
    //       treeData1 = treeData1
    //         .slice(0, thisIndex)
    //         .concat(newSet)
    //         .concat(treeData1.slice(thisIndex, treeData1.length));
    //     }
    //     // for(var set of isTrueSet){

    //     //   // if(JSON.stringify(set.dataForTrend) == JSON.stringify(datum.valueTrend)){
    //     //   //   set.childNode.push(datum);
    //     //   // }
    //     // }
    //   }

    //   //   if (
    //   //     isTrueSet != null &&
    //   //   //   JSON.stringify(isTrueSet.dataForTrend) == JSON.stringify(datum.valueTrend)
    //   //   // ) {
    //   //   //   isTrueSet.childNode.push(datum);
    //   //   // } else if (
    //   //   //   isTrueSet != null &&
    //   //   //   JSON.stringify(isTrueSet.dataForTrend) != JSON.stringify(datum.valueTrend)
    //   //   // ) {

    //   //   //   var index = isTrueSet.indexOf(treeData1);
    //   //   //   var newSet = {
    //   //   //     value: isTrueSet.value,
    //   //   //     valueTrend: datum.valueTrend,
    //   //   //     childNode: [datum],
    //   //   //     name: isTrueSet.name
    //   //   //   };
    //   //   //   treeData1 = [
    //   //   //     treeData1.slice(0, index),
    //   //   //     newSet,
    //   //   //     treeData1.slice(index, treeData1.length - 1)
    //   //   //   ];
    //   //   // }
    // }

    // Add the maximum value and minimum value of tree data;
    // treeData1.map((d) => {
    //     d.childNode.map((e) => {
    //         e.max = d3.max(
    //             e.childNode
    //                 .map((f) => {
    //                     var a = {};
    //                     var array = brushedAttributes.map((g) => +f[g]);
    //                     a.min = d3.min(array);
    //                     a.max = d3.max(array);
    //                     return a;
    //                 })
    //                 .map((e) => e.max)
    //         );
    //         e.min = d3.min(
    //             e.childNode
    //                 .map((f) => {
    //                     var a = {};
    //                     var array = brushedAttributes.map((g) => +f[g]);
    //                     a.min = d3.min(array);
    //                     a.max = d3.max(array);
    //                     return a;
    //                 })
    //                 .map((e) => e.min)
    //         );
    //         return e;
    //     });
    //     return d;
    // });

    // treeData1.map((d) => {
    //   d.max = d3.max(
    //     d.childNode
    //       .map((e) => {
    //         var a = {};
    //         var array = brushedAttributes.map((f) => +e[f]);
    //         a.min = d3.min(array);
    //         a.max = d3.max(array);
    //         return a;
    //       })
    //       .map((e) => e.max)
    //   );
    //   d.min = d3.min(
    //     d.childNode
    //       .map((e) => {
    //         var a = {};
    //         var array = brushedAttributes.map((f) => +e[f]);
    //         a.min = d3.min(array);
    //         a.max = d3.max(array);
    //         return a;
    //       })
    //       .map((e) => e.min)
    //   );
    //   return d;
    // });

    // delete the empty sets in tree data;
    // if (empty == "empty") {
    //     treeData1 = treeData1.filter((d) => d.childNode.length != 0);
    // }

    if (empty == 'empty') {
        treeDataPlus = treeDataPlus.filter(d => d[1].length != 0)
    };



    // we fix the id after delete the empty sets;
    // treeData1.map((d, i) => {
    //     d.id = i;
    //     d.childNode.map((e, j) => (e.id = i + "_" + j));
    //     return d;
    // });

    treeDataPlus.map((d, i) => {
        d.id = i;
        d[1].map((e, j) => e.id = i + "_" + j)
    })

    debugger;
    // calculate the Average attributes for each set
    // treeData1.map((d) => {
    //     d["Average"] = 0;
    //     var a = []; // init the all teams in a set
    //     d.childNode.map((e) => {
    //         // e is the subset;
    //         var arrayForEachE = brushedAttributes.map((f) => e[f]); // calculate the average values for each e (sub sets)

    //         var valueSubSet = []; // init the array to save the average values for all teams in each subset
    //         // add the average values for each e (sub sets)
    //         for (var i of e.childNode) {

    //             // e.childNode is the team;
    //             a.push(i);
    //             valueSubSet.push(
    //                 brushedAttributes.map((f) => i[f]).reduce((m, n) => +m + +n)
    //             ); // get the average values array for all teams in each subset
    //         }
    //         e.Average =
    //             valueSubSet.reduce((m, n) => m + n) /
    //             (brushedAttributes.length * e.childNode.length);
    //         return e;
    //     }); // extract all teams in the set;
    //     var arrayFinal = a.map((e) => {
    //         var array = brushedAttributes.map((f) => e[f]); // array are the all values for different time points of a teams
    //         e.Average = array.reduce((m, n) => +m + +n) / brushedAttributes.length; // add the average attributes for each team
    //         return e.Average;
    //     }); // calculate the average for each team
    //     d.Average = arrayFinal.reduce((a, b) => a + b) / arrayFinal.length; // calculate the final average
    //     return d;
    // });













    // treeData1.map((d) => {
    //   d["Average"] = 0;
    //   d.childNode.map((e) => {
    //     e["Average"] = 0;
    //     for (var i = 0; i < attributesCut.length; i++) {
    //       e["Average"] = +e[attributesCut[i]] + e["Average"];
    //     }
    //     e["Average"] = e["Average"] / attributesCut.length;
    //     return e;
    //   });
    //   var array = d.childNode.map((d) => d["Average"]);
    //   for (var i = 0; i < array.length; i++) {
    //     d["Average"] = d["Average"] + +array[i];
    //   }
    //   d["Average"] = d["Average"] / i;
    //   return d;
    // });

    return treeDataPlus;
    // return treeData1;
}