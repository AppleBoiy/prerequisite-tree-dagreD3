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
