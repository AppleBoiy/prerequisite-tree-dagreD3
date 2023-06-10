const constant = {
	spreadSheetUrl:"https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit#gid=0",
	PADDING:120,
	offset:60
}

/**
 * get dictionary of course detail from url
 *
 * @param url link to spreadSheet
 * @returns {Promise<Object>}
 */
async function spreadsheetToJson(url) {
	// build list of array rows from spreadsheet to jsonData
	const response = await fetch(url);
	const data = await response.arrayBuffer();
	const workbook = XLSX.read(data, {type: "array"});
	const worksheet = workbook.Sheets[workbook.SheetNames[0]];

	// Define the range of rows and columns
	const range = XLSX.utils.decode_range(worksheet["!ref"]);
	range.s.r = 1; // Start from the first row
	range.e.r = 21; // End at the 20th row
	range.s.c = 1; // Start from the first column
	range.e.c = 9; // End at the 8th column

	// import data in list from to jsonData
	const jsonData = XLSX.utils.sheet_to_json(worksheet, {
		header: 1,
		range,
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

	//build rawdata to correct format
	for (const element of result) {
		element.code = (element.code).toString();

		element.parent = (element.parent).toString() === "None"?
			[]: element.parent.toString().split(", ");

		element.children = (element.children).toString() === "None"?
			[]:  element.children.toString().split(", ");
	}

	return result
}

/**
 * generate tree view of prerequisite tree from JSON like object
 * @param rawData dictionary of course detail
 * @returns {Promise<void>}
 */
async function generateTree(rawData) {


	const graphlib = dagreD3.graphlib;
	const render = dagreD3.render();

	// Set up an SVG group so that we can translate the final graph.
	const svg = d3.select("svg");
	const svgGroup = svg.append("g");

	const mainTree = new graphlib.Graph();

	// Set an object for the graph label
	mainTree.setGraph({"ranksep": 100});

	// Default to assigning a new object as a label for each new edge.
	mainTree.setDefaultEdgeLabel(() => {
		return {};
	});

	for (const subject of rawData) {
		// create node
		mainTree.setNode( subject.code, {
			label: subject.abbr,
			width: 50,
			height: 30,
			id: subject.abbr,
			class: `y${subject.year}`,
		})
		// create line
		subject.children.forEach( child => {
			mainTree.setEdge(
				subject.code, child, {class: `${subject.code}-${child}`}
			);
		})
	}


	// Round the corners of the nodes
	mainTree.nodes().forEach( (v) => {
		const node = mainTree.node(v);
		node.rx = node.ry = 10;
	} );

	render(d3.select("svg g"), mainTree);

	// Size the container to the graph
	svg.attr("width", mainTree.graph().width + constant.PADDING);
	svg.attr("height", mainTree.graph().height + constant.PADDING);

	svgGroup.attr("transform", "translate(" + constant.offset + ", " + constant.offset + ")");

}

/**
 * rectDivs: HTMLCollection of SVGElement <Rectangular>
 * textDivs: HMTLCollection of SVGTextElement <text ...></text>
 *
 * @returns { Promise<{
 * 		rectDivs: HTMLCollectionOf<SVGElementTagNameMap[string]>,
 * 		textDivs: HTMLCollectionOf<SVGElementTagNameMap[string]>
 * 		}>}
 */
async function collectHTMLElement() {
	return {
		rectDivs: document.getElementsByTagName("rect"),
		textDivs: document.getElementsByTagName("text")
	}
}


const main = async () => {
	const rawData = await spreadsheetToJson(constant.spreadSheetUrl)
	const abbrDict = {
		"204":"CS",
		"206":"Math",
		"208":"Stat"
	}

	const course = {};
	const rectDict = {};

	generateTree(rawData).then(
		() => console.log("Main tree generated!")
	).catch( r => console.log(r) )

	// create dictionary that abbr is key
	for (const subject of rawData) {
		course[subject.abbr] = subject;
		rectDict[subject.abbr] = {};
	}

	const HTMLElement = await collectHTMLElement();
	const rectTag = HTMLElement.rectDivs;
	const textTagArray = HTMLElement.textDivs;

	// filter to get only text tag that contains label tag and store to course dictionary
	for (const textTag of textTagArray) {
		if (textTag.parentNode.classList[0] === "label")  continue;

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

	// add child and parent rect to dictionary
	for (const subject of rawData) {
		let parent = subject.parent
		if (parent?.length !== 0) {
			// collect parent node
			rectDict[subject.abbr]["parentRect"] = parent.map(
				(e) => {
					const abbr = `${abbrDict[e.slice(0, 3)]}${e.slice(3)}`;
					return rectDict[abbr]
				}
			)
		}

		let child = subject.children
		if (child?.length !== 0) {
			rectDict[subject.abbr]["childRect"] = child.map(
				(e) => {
					const abbr = `${abbrDict[e.slice(0, 3)]}${e.slice(3)}`
					return rectDict[abbr]
				}
			)
		}
	}

	function findRectDiv() {
		const temp = document.getElementsByTagName("rect");
		for (const rectDiv of temp) {
			const oldFill = rectDiv.style.fill;
			const oldStroke = rectDiv.style.stroke;

			// when mouse enter to node
			rectDiv.addEventListener("mouseenter", () => {
				rectDiv.style.fill = "#ffee00";
				rectDiv.style.stroke = "#ffee00";
			});

			// when mouse exit
			rectDiv.addEventListener("mouseleave", () => {
				rectDiv.style.fill = oldFill;
				rectDiv.style.stroke = oldStroke;
			});
		}
	}
	findRectDiv()

}
main().then(
	() => console.log("Run main..")
).catch( r => console.log(r))

