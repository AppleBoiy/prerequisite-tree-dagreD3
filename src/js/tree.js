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
	const jsonData = XLSX.utils.sheet_to_json(worksheet, {
		header: 1,
		range
	});

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

	// Format the raw data to the correct format
	for (const element of result) {
		element.code = element.code.toString();
		element.parent = element.parent.toString() === "None" ? [] : element.parent.toString().split(", ");
		element.children = element.children.toString() === "None" ? [] : element.children.toString().split(", ");
	}

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
	mainTree.setGraph({ "ranksep": 100 });
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
 * @returns { Promise<{
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

const main = async () => {
	const rawData = await spreadsheetToJson(constant.spreadSheetUrl);

	const abbrDict = {
		"204": "CS",
		"206": "Math",
		"208": "Stat"
	};

	const course = {};
	const rectDict = {};

	generateTree(rawData)
		.then(() => console.log("Main tree generated!"))
		.catch(r => console.log(r));

	// Create a dictionary with course abbreviations as keys
	for (const subject of rawData) {
		let abbr = subject["abbr"];
		course[abbr] = subject;
		rectDict[abbr] = {};
	}

	const HTMLElement = await collectHTMLElement();
	const rectTag = HTMLElement.rectDivs;
	const textTagArray = HTMLElement.textDivs;

	// Filter and store rectDivs and textDivs in the dictionary
	for (const textTag of textTagArray) {
		if (textTag.parentNode.classList[0] === "label") continue;
		const abbr = textTag.childNodes[0]?.innerHTML;
		if (!abbr) continue;
		rectDict[abbr]["textDiv"] = textTag;
	}

	for (const rect of rectTag) {
		const abbr = rect.parentNode.id;
		if (!abbr) continue;
		rectDict[abbr]["rectDiv"] = rect;
		rectDict[abbr]["oldFill"] = rect.style.fill;
		rectDict[abbr]["oldStroke"] = rect.style.stroke;
	}

	// Add parent and child rects to the dictionary
	for (const subject of rawData) {
		const parent = subject["parent"];
		const child = subject["children"];

		const abbr = subject["abbr"];

		if (parent?.length !== 0) {
			rectDict[abbr]["parentRect"] = parent.map(e => {
				const abbr = `${abbrDict[e.slice(0, 3)]}${e.slice(3)}`;
				return rectDict[abbr];
			});
		}
		if (child?.length !== 0) {
			rectDict[abbr]["childRect"] = child.map(e => {
				const abbr = `${abbrDict[e.slice(0, 3)]}${e.slice(3)}`;
				return rectDict[abbr];
			});
		}
	}

	function findRectDiv() {
		const temp = document.getElementsByTagName("rect");
		for (const rectDiv of temp) {
			const oldFill = rectDiv.style.fill;
			const oldStroke = rectDiv.style.stroke;

			rectDiv.addEventListener("mouseenter", () => {
				rectDiv.style.fill = "#ffee00";
				rectDiv.style.stroke = "#ffee00";
			});

			rectDiv.addEventListener("mouseleave", () => {
				rectDiv.style.fill = oldFill;
				rectDiv.style.stroke = oldStroke;
			});
		}
	}

	findRectDiv();
};

main()
	.then(() => console.log("Run main..."))
	.catch(r => console.log(r));
