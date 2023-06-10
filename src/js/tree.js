const constant = {
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
	const response = await fetch(url);
	const data = await response.arrayBuffer();
	const workbook = XLSX.read(data, { type: "array" });
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];
	const range = XLSX.utils.decode_range(worksheet["!ref"]);
	range.s.r = 1;
	range.e.r = 21;
	range.s.c = 1;
	range.e.c = 9;
	const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
	const result = jsonData.slice(1).map(row => {
		const obj = {};
		jsonData[0].forEach((headerCell, index) => {
			obj[headerCell] = row[index];
		});
		return obj;
	});
	result.forEach(element => {
		element.code = element.code.toString();
		element.parent = element.parent.toString() === "None" ? [] : element.parent.toString().split(", ");
		element.children = element.children.toString() === "None" ? [] : element.children.toString().split(", ");
	});
	return result;
}

/**
 * Generates a tree view of prerequisite tree from a JSON-like object.
 * @param {Object} rawData - Dictionary of course details.
 * @returns {Promise<void>}
 */
async function generateTree(rawData) {
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
	svg.attr("width", mainTree.graph().width + constant.PADDING);
	svg.attr("height", mainTree.graph().height + constant.PADDING);
	svgGroup.attr("transform", "translate(" + constant.offset + ", " + constant.offset + ")");
}

/**
 * Collects SVG elements from the HTML document.
 * @returns {Promise<{
 *    rectDivs: HTMLCollectionOf<SVGElementTagNameMap[string]>,
 *    textDivs: HTMLCollectionOf<SVGElementTagNameMap[string]>
 * }> } - An object containing collections of rectDivs and textDivs.
 */
async function collectHTMLElement() {
	return {
		rectDivs: document.getElementsByTagName("rect"),
		textDivs: document.getElementsByTagName("text")
	};
}

function idToAbbr(id) {
	const abbrDict = {
		"204": "CS",
		"206": "Math",
		"208": "Stat"
	};
	return `${abbrDict[id.slice(0, 3)]}${id.slice(3)}`
}

function highlightNode(rect, rectDict) {
	const abbr = rect.parentNode?.id;
	if (!abbr) return;
	rect.style.fill = rectDict[abbr]?.oldFill;
	rect.style.stroke = rectDict[abbr]?.oldStroke;
}

function highlightNodes(rects, rectDict) {
	rects.forEach(rect => highlightNode(rect, rectDict));
}

function onhoverHandler(rect, text, childrenRect, parentRect, rectDict, course) {
	const on = ancestor => {
		// Handle "on" logic here
		ancestor.forEach(e => {

		});
	};

	const off = ancestor => {
		// Handle "off" logic here
		ancestor.forEach(e => {

		});
	};

	const highlight = () => {
		// Highlight itself
		rect.style.fill = "#ff0000";
		rect.style.stroke = "#ff0000";
		// Highlight children
		highlightNodes(childrenRect.map(child => child.rectDiv), rectDict);
		// Highlight parents
		parentRect.forEach(mother => {
			const abbr = mother.rectDiv.parentNode.id;
			const ancestor = course[abbr].parent;
			if (ancestor.length !== 0) on(ancestor);
			highlightNode(mother.rectDiv, mother.textDiv, rectDict);
		});
	};

	const unhighlight = () => {
		const abbr = rect.parentNode?.id;
		// Unhighlight nodes
		highlightNode(rect, text, rectDict);
		// Unhighlight children
		highlightNodes(childrenRect.map(child => child.rectDiv), rectDict);
		// Unhighlight parents
		parentRect.forEach(mother => {
			const abbr = mother.rectDiv.parentNode.id;
			const ancestor = course[abbr].parent;
			if (ancestor.length !== 0) off(ancestor);
			highlightNode(mother.rectDiv, mother.textDiv, rectDict);
		});
	};

	rect.addEventListener("mouseenter", highlight);
	rect.addEventListener("mouseleave", unhighlight);
	text.addEventListener("mouseenter", highlight);
	text.addEventListener("mouseleave", unhighlight);
}

async function main() {
	const rawData = await spreadsheetToJson(constant.spreadSheetUrl);
	const course = {};
	const rectDict = {};

	generateTree(rawData)
		.then(() => console.log("Main tree generated!"))
		.catch(error => console.log(error));

	// Create a dictionary with course abbreviations as keys
	for (const subject of rawData) {
		const abbr = subject.abbr;
		course[abbr] = subject;
		rectDict[abbr] = {};
	}

	const { rectDivs, textDivs } = await collectHTMLElement();

	// Filter and store rectDivs and textDivs in the dictionary
	for (const textTag of textDivs) {
		if (textTag.parentNode.classList[0] === "label") continue;
		const abbr = textTag.childNodes[0]?.innerHTML;
		if (!abbr) continue;
		rectDict[abbr].textDiv = textTag;
	}

	for (const rect of rectDivs) {
		const abbr = rect.parentNode.id;
		if (!abbr) continue;
		rectDict[abbr].rectDiv = rect;
		rectDict[abbr].oldFill = rect.style.fill;
		rectDict[abbr].oldStroke = rect.style.stroke;
		
	}

	// Add parent and child rects to the dictionary
	for (const subject of rawData) {
		const parent = subject.parent;
		const child = subject.children;
		const abbr = subject.abbr;
		rectDict[abbr].parentRect = parent.map(e => {
			const abbr = idToAbbr(e);
			return rectDict[abbr];
		});
		rectDict[abbr].childRect = child.map(e => {
			const abbr = idToAbbr(e);
			return rectDict[abbr];
		});

		onhoverHandler(
			rectDict[abbr].rectDiv,
			rectDict[abbr].textDiv,
			rectDict[abbr].childRect,
			rectDict[abbr].parentRect,
			rectDict,
			course
		);
	}
}

main()
	.then(() => console.log("Run main..."))
	.catch(error => console.log(error));
