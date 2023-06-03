var graphlib = dagreD3.graphlib;
var render = dagreD3.render();
var PADDING = 120;

// Create a new directed graph
var g = new graphlib.Graph();

// Set an object for the graph label
g.setGraph({
    ranksep: 100,
});

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(function () {
    return {};
});

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
g.setNode("204306", {
    label: "CS306",
    width: 50,
    height: 30,
    id: "CS306",
    class: "y3",
});
g.setNode("204315", {
    label: "CS315",
    width: 50,
    height: 30,
    id: "CS315",
    class: "y3",
});
g.setNode("204490", {
    label: "CS490",
    width: 50,
    height: 30,
    id: "CS490",
    class: "y4",
});
g.setNode("204390", {
    label: "CS390",
    width: 50,
    height: 30,
    id: "CS390",
    class: "y4",
});
g.setNode("204496", {
    label: "CS496",
    width: 50,
    height: 30,
    id: "CS496",
    class: "y4",
});
g.setNode("204497", {
    label: "CS497",
    width: 50,
    height: 30,
    id: "CS497",
    class: "y4",
});
// Round the corners of the nodes
g.nodes().forEach(function (v) {
    var node = g.node(v);
    node.rx = node.ry = 10;
});

g.setEdge("204111", "204114", { class: "cs111-to-cs114"});
g.setEdge("206183", "204451");
g.setEdge("208269", "204271");
g.setEdge("204252", "204271");
g.setEdge("204252", "204451");
g.setEdge("204252", "204321");
g.setEdge("204114", "204203");
g.setEdge("204114", "204212");
g.setEdge("204114", "204231");
g.setEdge("204114", "204232");
g.setEdge("204114", "204252");
g.setEdge("204212", "204315");
g.setEdge("204212", "204361");
g.setEdge("204231", "204341");
g.setEdge("204232", "204390");
g.setEdge("204321", "204390");
g.setEdge("204341", "204390");
g.setEdge("204361", "204390");
g.setEdge("204496", "204497");

// Set up an SVG group so that we can translate the final graph.
var svg = d3.select("svg"),
    svgGroup = svg.append("g");

// Run the renderer. This is what draws the final graph.
render(d3.select("svg g"), g);

// Size the container to the graph
svg.attr("width", g.graph().width + PADDING);
svg.attr("height", g.graph().height + PADDING);

// Center the graph
var offset = PADDING / 2;
svgGroup.attr(
    "transform",
    "translate(" + offset + ", " + offset + ")",
);

// Inline styles are necessary so dagre can compute dimensions.
function getNumber(n, color) {
    return '<span style="width: 20px; height: 20px; margin-right: 6px; background: ' +
        color +
        '; display: inline-block; text-align: center; border-radius: 10px; color: #fff; line-height: 21px;">' +
        n + "</span>";
}

const lines = document.getElementsByClassName("edgePath")
for (const line of lines) {

    line.classList.add("redline")
    console.log(line)

};

const onEnter = (node) => {
    let classList = node.classList;
    console.log(classList)
};

const nodes = document.getElementsByClassName("node")
for (const node of nodes) {
    node.addEventListener("mouseenter", () => onEnter(node))

}