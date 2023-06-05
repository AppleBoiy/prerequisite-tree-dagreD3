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
    "abbr": "CS252",
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
    "parent": "Third year standing",
    "children": "None",
    "credit": 1,
    "full Name": "Ethics for Computer Professionals",
    "year": 3,
    "abbr": "CS306",
    "term": 2
  },
  {
    "code": "204315",
    "parent": ["204212"],
    "children": "None",
    "credit": 3,
    "full Name": "Organization of Programming Languages",
    "year": 3,
    "abbr": "CS315",
    "term": 2
  },
  {
    "code": "204321",
    "parent": ["204251"],
    "children": "None",
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
    // special characters
    "code": "204451",
    "parent": ["204251", ("206183", "206281")],
    "children": "None",
    "credit": 3,
    "full Name": "Algorithm Design and Analysis",
    "year": 3,
    "abbr": "CS451",
    "term": 1
  },
  {
    "code": "204490",
    "parent": [],
    "children": "None",
    "credit": 3,
    "full Name": "Research in Computer Science",
    "year": 3,
    "abbr": "CS490",
    "term": 2,
    "condition": "Consent of the department"
  },
  {
    "code": "204390",
    "parent": ["204232", "204321", "204341", "204361"],
    "children": "None",
    "credit": 1,
    "full Name": "Computer Job Training",
    "year": 4,
    "abbr": "CS390",
    "term": 1
  },
  {
    "code": "204496",
    "parent": "Fourth year standing and Consent of the department",
    "children": "None",
    "credit": 6,
    "full Name": "Cooperative Education",
    "year": 4,
    "abbr": "CS496",
    "term": 1
  },
  {
    "code": "204497",
    "parent": "Consent of the department",
    "children": "None",
    "credit": 1,
    "full Name": "Seminar in Computer Science",
    "year": 4,
    "abbr": "CS497",
    "term": 2
  }
]
var dict = {};

const graphGen = () => {
  let graphlib = dagreD3.graphlib;
  let render = dagreD3.render();
  let PADDING = 120;

// Create a new directed graph
  let g = new graphlib.Graph();

// Set an object for the graph label
  g.setGraph({"ranksep": 100,});

// Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(
      () => {
        return {};
      }
  );

  g.setNode("204111", {
    label: "CS111",
    width: 50,
    height: 30,
    id: "CS111",
    class: "y1",
  });
  g.setNode("204114", {
    label: "CS114",
    width: 50,
    height: 30,
    id: "CS114",
    class: "y1",
  });
  g.setNode("204203", {
    label: "CS203",
    width: 50,
    height: 30,
    id: "CS203",
    class: "y2",
  });
  g.setNode("204212", {
    label: "CS212",
    width: 50,
    height: 30,
    id: "CS212",
    class: "y2",
  });
  g.setNode("204231", {
    label: "CS231",
    width: 50,
    height: 30,
    id: "CS231",
    class: "y2",
  });
  g.setNode("204232", {
    label: "CS232",
    width: 50,
    height: 30,
    id: "CS232",
    class: "y2",
  });
  g.setNode("204252", {
    label: "CS252",
    width: 50,
    height: 30,
    id: "CS252",
    class: "y2",
  });
  g.setNode("208269", {
    label: "Stat269",
    width: 50,
    height: 30,
    id: "Stat269",
    class: "y2",
  });
  g.setNode("206183", {
    label: "Math183",
    width: 50,
    height: 30,
    id: "Math183",
    class: "y1",
  });
  g.setNode("204271", {
    label: "CS271",
    width: 50,
    height: 30,
    id: "CS271",
    class: "y2",
  });
  g.setNode("204321", {
    label: "CS321",
    width: 50,
    height: 30,
    id: "CS321",
    class: "y3",
  });
  g.setNode("204341", {
    label: "CS341",
    width: 50,
    height: 30,
    id: "CS341",
    class: "y3",
  });
  g.setNode("204361", {
    label: "CS361",
    width: 50,
    height: 30,
    id: "CS361",
    class: "y3",
  });
  g.setNode("204451", {
    label: "CS451",
    width: 50,
    height: 30,
    id: "CS451",
    class: "y3",
  });
  g.setNode("204315", {
    label: "CS315",
    width: 50,
    height: 30,
    id: "CS315",
    class: "y3",
  });
  g.setNode("204390", {
    label: "CS390",
    width: 50,
    height: 30,
    id: "CS390",
    class: "y4",
  });

// Round the corners of the nodes
  g.nodes().forEach(
      (v) => {
        let node = g.node(v);
        node.rx = node.ry = 10;
      }
  );

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

// Render

// Set up an SVG group so that we can translate the final graph.
  let svg = d3.select("svg");
  let svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
  render(d3.select("svg g"), g);

// Size the container to the graph
  svg.attr("width", g.graph().width + PADDING);
  svg.attr("height", g.graph().height + PADDING);

// Center the graph
  let offset = PADDING / 2;
  svgGroup.attr("transform", "translate(" + offset + ", " + offset + ")");

}
graphGen();


const addAttr = () => {


  const nodeInfo = [];

  const rectTag = document.getElementsByTagName("rect");
  const textTagArray = document.getElementsByTagName("text");

  let texts = [];

  for (const textTag of textTagArray) {
    if (textTag.parentNode.classList[0] !== "label") {
      texts.push(textTag)
    }
  }

  for (const rect of rectTag) {

    nodeInfo.push( { "node":rect.parentNode, "abbr":rect.parentNode.id } )

    // temp var to rest old style
    const oldBG = rect.style.fill;
    const oldBorder = rect.style.stroke;

    //on hover style
    const hoverBg = "#ff9752";
    const hoverBorder = "#333";

    rect.addEventListener("mouseenter", () => {
      rect.style.fill = hoverBg;
      rect.style.stroke = hoverBorder;

      console.log(rect.parentNode)

    })

    rect.addEventListener("mouseleave", () => {
      rect.style.fill = oldBG;
      rect.style.stroke = oldBorder;
    })
  }

  nodeInfo.forEach( (e) => {
    console.log(e);
  })
}
addAttr();

raw_data.forEach(
    (e) => {
      dict[e.abbr] = e
    }
)

console.log(dict)