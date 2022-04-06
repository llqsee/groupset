
function dealDataJson(finalDataIndex,dataset) {
    if (finalDataIndex.json.temporalAttributes.length == 0) {
        var reg = new RegExp(
            finalDataIndex.json.attributes.filter((e) => e.type == "regExp")[0].name
        );
        finalDataIndex.json.temporalAttributes = Object.keys(dataset[0]).filter(
            (d) => reg.test(d) == true
        );
    }
    finalDataIndex.json.min = d3.min(
        finalDataIndex.json.temporalAttributes.map((d) =>
            d3.min(dataset.map((e) => +e[d]))
        )
    );

    finalDataIndex.json.max = d3.max(
        finalDataIndex.json.temporalAttributes.map((d) =>
            d3.max(dataset.map((e) => +e[d]))
        )
    );
    return finalDataIndex.json;
}


function get_random_color() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += sub.length == 1 ? "0" + sub : sub;
    }
    return "#" + color;
}


// var API_ENDPOINT = "https://file-server-liqun.herokuapp.com/files/";

// function get_random_color() {
//     var color = "";
//     for (var i = 0; i < 3; i++) {
//         var sub = Math.floor(Math.random() * 256).toString(16);
//         color += sub.length == 1 ? "0" + sub : sub;
//     }
//     return "#" + color;
// }

// async function datasetIndex(sets) {
//     const res = [];
//     for (const set of sets) {
//         const d = {},
//             r = await fetch(API_ENDPOINT + set)
//                 .then((d) => d.json())
//                 .catch((e) => ({ name: "", file: "", e }));

//         d.Title = r.name || `${set} (ERROR)`;
//         d.Item = r.name.replace(/\W/g, "_").replace(/^([0-9])/, "_$1");

//         if (!r.file) {
//             r.file = "__undefined__.csv";
//         }

//         d.dataUrl = r.file.match(/^https?:/) ? r.file : API_ENDPOINT + r.file;

//         d.json = r;

//         res.push(d);
//     }
//     return res;
// }






// // var index = datasetIndex(sets); 

// dataset.map((d) => (d.color = get_random_color()))