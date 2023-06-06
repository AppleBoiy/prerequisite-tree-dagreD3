const raw_data = [
  {
    "abbr": "CS111",
    "parent": [],
    "children": ["204114"],
    "code": "204111",
    "credit": 3,
    "full Name": "Fundamentals of Programming",
    "year": 1,
    "term": 1
  },
  {
    "code": "206183",
    "parent": [],
    "children": ["204451"],
    "credit": 3,
    "full Name": "Discrete Structure",
    "year": 1,
    "abbr": "Math183",
    "term": 1
  },
  {
    "code": "204114",
    "parent": ["204111"],
    "children": ["204203", "204212", "204231", "204232", "204252"],
    "credit": 3,
    "full Name": "Introduction to Object-oriented Programming",
    "year": 1,
    "abbr": "CS114",
    "term": 2
  },
  {
    "code": "204203",
    "parent": ["204114"],
    "children": [],
    "credit": 3,
    "full Name": "Computer Science Technology",
    "year": 2,
    "abbr": "CS203",
    "term": 1
  },
  {
    "code": "204212",
    "parent": ["204114"],
    "children": ["204315", "204361"],
    "credit": 3,
    "full Name": "Modern Application Development",
    "year": 2,
    "abbr": "CS212",
    "term": 2
  },
  {
    "code": "204231",
    "parent": ["204114"],
    "children": ["204341"],
    "credit": 3,
    "full Name": "Computer Organization and Architecture",
    "year": 2,
    "abbr": "CS231",
    "term": 1
  },
  {
    "code": "204232",
    "parent": ["204114"],
    "children": ["204390"],
    "credit": 3,
    "full Name": "Computer Networks and Protocols",
    "year": 2,
    "abbr": "CS232",
    "term": 2
  },
  {
    "code": "204252",
    "parent": ["204114"],
    "children": ["204271", "204321", "204451"],
    "credit": 3,
    "full Name": "Data Structures and Analysis",
    "year": 2,
    "abbr": "CS252",
    "term": 1
  },
  {
    "code": "208269",
    "parent": [],
    "children": ["204271"],
    "credit": 3,
    "full Name": "Statistics for Computer Science",
    "year": 2,
    "abbr": "Stat269",
    "term": 1
  },
  {
    // special characters
    "code": "204271",
    "parent": ["204252", "208269"],
    "children": [],
    "credit": 3,
    "full Name": "Introduction to Artificial Intelligence",
    "year": 2,
    "abbr": "CS271",
    "term": 2
  },
  {
    "code": "204306",
    "parent": [],
    "children": [],
    "credit": 1,
    "full Name": "Ethics for Computer Professionals",
    "year": 3,
    "abbr": "CS306",
    "term": 2,
    "conditions": "Third year standing"
  },
  {
    "code": "204315",
    "parent": ["204212"],
    "children": [],
    "credit": 3,
    "full Name": "Organization of Programming Languages",
    "year": 3,
    "abbr": "CS315",
    "term": 2
  },
  {
    "code": "204321",
    "parent": ["204251"],
    "children": [],
    "credit": 3,
    "full Name": "Database Systems",
    "year": 3,
    "abbr": "CS321",
    "term": 1
  },
  {
    "code": "204341",
    "parent": ["204231"],
    "children": ["204390"],
    "credit": 3,
    "full Name": "Operating Systems",
    "year": 3,
    "abbr": "CS341",
    "term": 1
  },
  {
    "code": "204361",
    "parent": ["204212"],
    "children": ["204390"],
    "credit": 3,
    "full Name": "Software Engineering",
    "year": 3,
    "abbr": "CS361",
    "term": 1
  },
  {
    "code": "204451",
    "parent": ["204252",["206183", "206281"]],
    "children": [],
    "credit": 3,
    "full Name": "Algorithm Design and Analysis",
    "year": 3,
    "abbr": "CS451",
    "term": 1
  },
  {
    "code": "204490",
    "parent": [],
    "children": [],
    "credit": 3,
    "full Name": "Research in Computer Science",
    "year": 3,
    "abbr": "CS490",
    "term": 2,
    "conditions": "Consent of the department"
  },
  {
    "code": "204390",
    "parent": ["204232", "204321", "204341", "204361"],
    "children": [],
    "credit": 1,
    "full Name": "Computer Job Training",
    "year": 4,
    "abbr": "CS390",
    "term": 1
  },
  {
    "code": "204496",
    "parent": [],
    "children": [],
    "credit": 6,
    "full Name": "Cooperative Education",
    "year": 4,
    "abbr": "CS496",
    "term": 1,
    "conditions": "Fourth year standing and Consent of the department"
  },
  {
    "code": "204497",
    "parent": [],
    "children": [],
    "credit": 1,
    "full Name": "Seminar in Computer Science",
    "year": 4,
    "abbr": "CS497",
    "term": 2,
    "conditions": "Consent of the department"
  }
]
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


function enroll() {
  // create dictionary that abbr is key
  raw_data.forEach(
      (e) => {
        course[e.abbr] = e;
      }
  )

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

  for (const abbr in course) {
    let childNode = [];
    let parentNode = [];

    // get subject parent list
    const parent = course[abbr].parent;
    // get subject child list
    const child = course[abbr].children;

    // if (parent.length > 0) {
    //   parent.forEach(
    //       (e) => {
    //         if (!Array.isArray(e)) {
    //           console.log(` ${abbr} :  ${abbrDict[e.slice(0, 3)]}${e.slice(3)}`)
    //         }
    //       }
    //   )
    // }
    // if (child.length > 0) {
    //   child.forEach(
    //       (e) => {
    //         if (!Array.isArray(e)) {
    //           console.log(` ${abbr} : ${abbrDict[e.slice(0, 3)]}${e.slice(3)}`)
    //         }
    //       }
    //   )
    // }
  }

  for (let path of document.getElementsByClassName("edgePath")) {
    const parent = path.classList[1].split("-");
  }

}

function drawGraph() {
  enroll();

  // Set an object for the graph label
  g.setGraph({"ranksep": 100,});

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(
      () => {
        return {};
      }
  );
}

function setNodes() {
  drawGraph();

  for (const subject of raw_data) {
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


}

function setEdge() {
  setNodes();

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

function renderGraph() {// Run the renderer. This is what draws the final graph.
  setEdge();

  render(d3.select("svg g"), g);

  // Size the container to the graph
  svg.attr("width", g.graph().width + PADDING);
  svg.attr("height", g.graph().height + PADDING);

  svgGroup.attr("transform", "translate(" + offset + ", " + offset + ")");

}

renderGraph();