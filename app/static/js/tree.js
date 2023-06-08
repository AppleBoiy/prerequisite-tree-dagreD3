function convertSpreadsheetToJson() {
  return new Promise(async (resolve, reject) => {
      try {

          // get link input >> https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit#gid=0
          // short link >> https://cmu.to/UP5em
          const spreadsheetLinkInput = "https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit#gid=0";

          // build list of array rows from spreadsheet to jsonData
          const response = await fetch(spreadsheetLinkInput);
          const data = await response.arrayBuffer();
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
          // Define the range of rows and columns
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          range.s.r = 1; // Start from the first row
          range.e.r = 21; // End at the 20th row
          range.s.c = 1; // Start from the first column
          range.e.c = 9; // End at the 8th column
          // import data in list from to jsonData
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
          //console.log(jsonData);

          // Convert the jsonData into an array of objects
          const result = [];
          for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              const obj = {};
              for (let j = 0; j < row.length; j++) {
              const headerCell = jsonData[0][j];
                  obj[headerCell] = row[j];
              }
              result.push(obj);
          }
          // console.log(result);
          resolve(result);
      } catch (error) {
        reject(error);
      }
  });
}

async function handleHover() {
  // new data from spreadsheet
  const rawData = await convertSpreadsheetToJson();
  // build rawdata to correct format
  for (const element of rawData) {
      element.code = (element.code).toString();
      element.parent = (element.parent).toString();
      element.children = (element.children).toString();
      if (element.parent === "None") {
          element.parent = [];
      } else {
          element.parent = element.parent.split(", ");
      }
      if (element.children === "None") {
          element.children = [];
      } else {
          element.children = element.children.split(", ");
      }
  }
    //console.log(rawData)
  return rawData;
}

const rawData = handleHover();
//console.log(rawData)

const abbrDict = {
  "204":"CS",
  "206":"Math",
  "208":"Stat"
}

const rectTag = document.getElementsByTagName("rect");
const textTagArray = document.getElementsByTagName("text");

let course = {};
let rectDict = {};

let graphlib = dagreD3.graphlib;
let render = dagreD3.render();
let PADDING = 120;

let g = new graphlib.Graph();

// Set up an SVG group so that we can translate the final graph.
let svg = d3.select("svg");
let svgGroup = svg.append("g");

// Center the graph
let offset = PADDING / 2;


async function enroll() {
  // create dictionary that abbr is key
  rawData.then(data => {
    data.forEach(
      (e) => {
        course[e.abbr] = e;
      }
    )
  });


  // filter to get only text tag that contains label tag and store to course dictionary
  for (const textTag of textTagArray) {
    if (textTag.parentNode.classList[0] !== "label") {
      let abbr = textTag.childNodes[0]?.innerHTML;
      course[abbr]["innerText"] = textTag;
    }
  }

  for (const rect of rectTag) {
    const abbr = rect.parentNode.id;
    course[abbr]["rectTag"] = rect;
    rectDict[abbr] = rect;
  }
  console.log(course)
  for (const abbr in course) {
    let childNode = [];
    let parentNode = [];

    // get subject parent list
    const parent = course[abbr].parent;
    // get subject child list
    const child = course[abbr].children;

    if (parent.length > 0) {
      parent.forEach(
          (e) => {
            if (!Array.isArray(e)) {
              console.log(` ${abbr} :  ${abbrDict[e.slice(0, 3)]}${e.slice(3)}`)
            }
          }
      )
    }
    if (child.length > 0) {
      child.forEach(
          (e) => {
            if (!Array.isArray(e)) {
              console.log(` ${abbr} : ${abbrDict[e.slice(0, 3)]}${e.slice(3)}`)
            }
          }
      )
    }
  }

  for (let path of document.getElementsByClassName("edgePath")) {
    const parent = path.classList[1].split("-");
    console.log(parent)
  }

}

async function drawGraph() {
  await enroll();

  // Set an object for the graph label
  g.setGraph({"ranksep": 100,});

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(
      () => {
        return {};
      }
  );
}

async function setNodes() {
  await drawGraph();
  rawData.then((data) => {

    for (const subject of data) {
      g.setNode(
        subject.code, {
            label: subject.abbr,
            width: 50,
            height: 30,
            id: subject.abbr,
            class: `y${subject.year}`
          }
      );
    }

    // Round the corners of the nodes
    g.nodes().forEach(
        (v) => {
          let node = g.node(v);
          node.rx = node.ry = 10;
        }
    );

  });

}

async function setEdge() {
  await setNodes();

  g.setEdge("204111", "204114", {class: "CS111-CS114"});
  g.setEdge("206183", "204451", {class: "Math183-CS451"});
  g.setEdge("208269", "204271", {class: "Stat269-CS271"});
  g.setEdge("204252", "204271", {class: "CS252-CS271"});
  g.setEdge("204252", "204451", {class: "CS252-CS451"});
  g.setEdge("204252", "204321", {class: "CS252-CS321"});
  g.setEdge("204114", "204203", {class: "CS114-CS203"});
  g.setEdge("204114", "204212", {class: "CS114-CS212"});
  g.setEdge("204114", "204231", {class: "CS114-CS231"});
  g.setEdge("204114", "204232", {class: "CS114-CS232"});
  g.setEdge("204114", "204252", {class: "CS114-CS252"});
  g.setEdge("204212", "204315", {class: "CS212-CS315"});
  g.setEdge("204212", "204361", {class: "CS212-CS361"});
  g.setEdge("204231", "204341", {class: "CS231-CS341"});
  g.setEdge("204232", "204390", {class: "CS232-CS390"});
  g.setEdge("204321", "204390", {class: "CS321-CS390"});
  g.setEdge("204341", "204390", {class: "CS341-CS390"});
  g.setEdge("204361", "204390", {class: "CS361-CS390"});
}

async function renderGraph() {// Run the renderer. This is what draws the final graph.
  await setEdge();
  rawData.then(() => {
    render(d3.select("svg g"), g);
    
    // Size the container to the graph
    svg.attr("width", g.graph().width + PADDING);
    svg.attr("height", g.graph().height + PADDING);

    svgGroup.attr("transform", "translate(" + offset + ", " + offset + ")");
  });
}

renderGraph().then(
    () => console.log("Tree view generated")
)