// Constants
const constants = {
	spreadSheetUrl: "https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit#gid=0",
	PADDING: 120,
	offset: 60
};

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
	svg.attr("width", mainTree.graph().width + constants.PADDING);
	svg.attr("height", mainTree.graph().height + constants.PADDING);

	svgGroup.attr("transform", `translate(${constants.offset}, ${constants.offset})`);
}


/**
 * Collects SVG elements from the HTML document.
 * @returns {Promise<{
 *    rectDivs: HTMLCollectionOf<SVGElementTagNameMap[string]>,
 *    textDivs: HTMLCollectionOf<SVGElementTagNameMap[string]>
 * }> } - An object containing collections of rectDivs and textDivs.
 */
async function collectHTMLElements() {
	return {
		rectDivs: document.getElementsByTagName("rect"),
		textDivs: document.getElementsByTagName("text"),
		nodeDivs: document.getElementsByClassName("node")
	};
}

/**
 * Adds event handlers for hovering and clicking on the rectangles.
 * @param {Element} rectDiv - Rectangle div element.
 * @param {Element} textDiv - Text div element.
 * @param {string[]} childRectCodes - Array of child rectangle codes.
 * @param {string[]} parentRectCodes - Array of parent rectangle codes.
 * @param {Object} rectDict - Dictionary containing rectangle data.
 * @param {Object} courseDict - Dictionary containing course data.
 */
function attachEventHandlers(rectDiv, textDiv, childRectCodes, parentRectCodes, rectDict, courseDict) {
	const abbr = rectDiv.parentNode.id;

	const handleMouseEnter = () => {
		rectDiv.style.fill = "#FFB31C";
		rectDiv.style.stroke = "#FFB31C";
		childRectCodes.forEach(code => {
			const childRect = rectDict[idToAbbr(code)]?.rectDiv;
			if (childRect) {
				childRect.style.fill = "#FFB31C";
				childRect.style.stroke = "#FFB31C";
			}
		});
	};

	const handleMouseLeave = () => {
		rectDiv.style.fill = rectDict[abbr]?.oldFill;
		rectDiv.style.stroke = rectDict[abbr]?.oldStroke;
		childRectCodes.forEach(code => {
			const childRect = rectDict[idToAbbr(code)]?.rectDiv;
			if (childRect) {
				childRect.style.fill = rectDict[code]?.oldFill;
				childRect.style.stroke = rectDict[code]?.oldStroke ;
			}
		});
	};

	const handleClick = () => {
		const course = courseDict[abbr];
		if (course) {
			console.log(`Course ${abbr} clicked!`);
			console.log("Course details:", course);
		}
	};

	rectDiv.addEventListener("mouseenter", handleMouseEnter);
	rectDiv.addEventListener("mouseleave", handleMouseLeave);
	rectDiv.addEventListener("click", handleClick);
}

function idToAbbr(id) {
	const abbrDict = {
		"204": "CS",
		"206": "Math",
		"208": "Stat"
	};
	return `${abbrDict[id.slice(0, 3)]}${id.slice(3)}`
}

async function main() {
	// Convert the spreadsheet to JSON
	const rawData = await spreadsheetToJson(constants.spreadSheetUrl);

	// Generate the prerequisite tree view
	await generateTreeView(rawData);

	// Create a dictionary to store the rectangle and course data
	const rectDict = {};
	const courseDict = {};

	// Populate the dictionary with rectangle and course data
	for (const subject of rawData) {
		const abbr = subject.abbr;
		rectDict[abbr] = {};
		courseDict[abbr] = subject;
	}

	// Collect rectDivs and textDivs in the dictionary
	const { rectDivs, textDivs, nodeDivs } = await collectHTMLElements();

	Array.from(textDivs).forEach(textTag => {
		if (textTag.parentNode.classList[0] === "label") return;
		const abbr = textTag.childNodes[0]?.innerHTML;
		if (!abbr) return;
		const rectData = rectDict[abbr];
		rectData.textDiv = textTag;
	});

	Array.from(rectDivs).forEach(rect => {
		const abbr = rect.parentNode.id;
		if (!abbr) return;
		const rectData = rectDict[abbr];
		rectData.rectDiv = rect;
		const { fill, stroke } = rect.style;
		rectData.oldFill = fill;
		rectData.oldStroke = stroke;
	});

	// Attach event handlers to the rectangles
	Object.entries(rectDict).forEach(([abbr, rectData]) => {
		const { rectDiv, textDiv } = rectData;
		const childRectCodes = courseDict[abbr]?.children || [];
		const parentRectCodes = courseDict[abbr]?.parent || [];
		attachEventHandlers(rectDiv, textDiv, childRectCodes, parentRectCodes, rectDict, courseDict);
	});


}

main()
	.then(() => console.log("Run main..."))
	.catch(error => console.log(error));
