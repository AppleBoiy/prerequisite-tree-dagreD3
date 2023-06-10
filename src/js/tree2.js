// Constants
const spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit#gid=0"

// Create a dictionary to store the rectangle and course data
const rectDict = {};
const courseDict = {};

/**
 * Converts a spreadsheet at the given URL to JSON format.
 * @param {string} url - Link to the spreadsheet.
 * @returns {Promise<Object>} - JSON data representing the spreadsheet.
 */
async function spreadsheetToJson(url) {
	// Fetch the spreadsheet data
	const response = await fetch(url);
	const data = await response.arrayBuffer();

	// Read the workbook and worksheet from the data
	const workbook = XLSX.read(data, { type: "array" });
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];

	// Define the range of rows and columns
	const range = XLSX.utils.decode_range(worksheet["!ref"]);
	range.s.r = 1;
	range.e.r = 21;
	range.s.c = 1;
	range.e.c = 9;

	// Convert the worksheet to JSON
	const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
	const result = jsonData.slice(1).map(row => {
		const obj = {};
		jsonData[0].forEach((headerCell, index) => {
			obj[headerCell] = row[index];
		});
		return obj;
	});

	result.forEach(element => {
		element.parent = element.parent.toString() === "None" ?
			[] : element.parent.toString().split(", ");
		element.children = element.children.toString() === "None" ?
			[] : element.children.toString().split(", ");
	});
	return result;
}

/**
 * Generates a tree view of prerequisite tree from a JSON-like object.
 * @param {Object} rawData - Dictionary of course details.
 * @returns {Promise<void>}
 */
async function generateTreeView(rawData) {
	const graphlib = dagreD3.graphlib;
	const render = dagreD3.render();

	const svg = d3.select("svg");
	const svgGroup = svg.append("g");

	const mainTree = new graphlib.Graph();
	mainTree.setGraph({ ranksep: 100 });
	mainTree.setDefaultEdgeLabel(() => ({}));

	// Create nodes and edges in the main tree
	for (const subject of rawData) {
		mainTree.setNode(subject.code, {
			label: subject.abbr,
			width: 50,
			height: 30,
			id: subject.abbr,
			class: `y${subject.year}`
		});

		subject.children.forEach(child => {
			mainTree.setEdge(subject.code, child, { class: `${subject.code}-${child}` });
		});
	}

	// Set rounded corners for the nodes
	mainTree.nodes().forEach(v => {
		const node = mainTree.node(v);
		node.rx = node.ry = 10;
	});

	render(d3.select("svg g"), mainTree);

	// Size the container to the graph
	svg.attr("width", mainTree.graph().width + 120);
	svg.attr("height", mainTree.graph().height + 120);

	svgGroup.attr("transform", `translate(${60}, ${60})`);
}

async function main(url) {
	// Convert the spreadsheet to JSON
	const rawData = await spreadsheetToJson(url);

	// Generate the prerequisite tree view
	await generateTreeView(rawData);

	// Populate the dictionary with rectangle and course data
	for (const subject of rawData) {
		const abbr = subject.abbr;
		rectDict[abbr] = {};
		courseDict[abbr] = subject;
	}

	const nodeDivs = document.getElementsByClassName("node");
	Array.from(nodeDivs).forEach(div => {
		const [ rect , text ] = div.childNodes;
		const { fill, stroke } = rect.style;
		const rectData = rectDict[div.id];

		rectData.rectDiv = rect;
		rectData.textDiv = text;
		rectData.nodeDiv = div;
		rectData.oldFill = fill;
		rectData.oldStroke = stroke;
		rectData.newFill = "#ff0000";
		rectData.newStroke = "#ff0000";
	});

	// Attach event handlers to the rectangles
	Object.entries(rectDict).forEach(([abbr, rectData]) => {
		const { nodeDiv } = rectData;
		attachEventHandlers(abbr, nodeDiv);
	});


}

function attachEventHandlers(abbr, nodeDiv) {
	const subjectData = courseDict[abbr];
	const childCodes = subjectData.children.map( e => idToAbbr(e));
	const parentCodes = subjectData.parent.map( e => idToAbbr(e));

	const handleMouseEnter = () => {
		highlight(abbr);
		childCodes.forEach(code => highlight(code) );
		parentCodes.forEach(code => {
			highlight(code);

		});
	};

	const handleMouseLeave = () => {
		highlight(abbr, false);
		childCodes.forEach(code => highlight(code, false));
		parentCodes.forEach(code => highlight(code, false));
	};

	const handleClick = () => {
		const course = courseDict[abbr];
		if (course) {
			console.log(`Course ${abbr} clicked!`);
			console.log("Course details:", course);
		}
	};

	nodeDiv.addEventListener("mouseenter", handleMouseEnter);
	nodeDiv.addEventListener("mouseleave", handleMouseLeave);
	nodeDiv.addEventListener("click", handleClick);
}

function highlight(abbr, isEnter = true) {
	const rectData = rectDict[abbr]
	const { newFill, newStroke, oldFill, oldStroke } = rectData;
	const rect = rectData.rectDiv;

	if (isEnter) {
		rect.style.fill = newFill;
		rect.style.stroke = newStroke;
	} else {
		rect.style.fill = oldFill;
		rect.style.stroke = oldStroke;
	}
}

function idToAbbr(id) {
	const abbrDict = {
		"204": "CS",
		"206": "Math",
		"208": "Stat"
	};
	return `${abbrDict[id.slice(0, 3)]}${id.slice(3)}`
}

main(spreadSheetUrl)
	.then(() => console.log("Run main..."))
	.catch(error => console.log(error));
