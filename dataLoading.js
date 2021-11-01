async function datasetIndex(sets) {
    const res = [];
    for (const set of sets) {
        const d = {},
            r = await fetch(API_ENDPOINT + set)
                .then((d) => d.json())
                .catch((e) => ({ name: "", file: "", e }));

        d.Title = r.name || `${set} (ERROR)`;
        d.Item = r.name.replace(/\W/g, "_").replace(/^([0-9])/, "_$1");

        if (!r.file) {
            r.file = "__undefined__.csv";
        }

        d.dataUrl = r.file.match(/^https?:/) ? r.file : API_ENDPOINT + r.file;

        d.json = r;

        res.push(d);
    }
    return res;
}


const sets = d3
    .json("https://file-server-liqun.herokuapp.com/files/index.json")
    .then((d) => d)

const API_ENDPOINT = "https://file-server-liqun.herokuapp.com/files/";

const index = datasetIndex(sets);

