const main = async () => {
	async function readSpreadSheet(spreadSheetUrl) {
		return await fetch(spreadSheetUrl)
	}

	async function convertSpreadsheetToJson(response) {

		// build list of array rows from spreadsheet to jsonData
		const data = await response.arrayBuffer();
		const workbook = XLSX.read(data, {type: "array"});
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

	svgGroup.attr("transform", "translate(" + offset + ", " + offset + ")");

	generateTree(rawData)
		.then(() => console.log("Main tree generated!"))
		.catch(r => console.log(r));

	// Create a dictionary with course abbreviations as keys
	for (const subject of rawData) {
		let abbr = subject["abbr"];
		course[abbr] = subject;
		rectDict[abbr] = {};
	}

		// filter to get only text tag that contains label tag and store to course dictionary
		for (const textTag of textTagArray) {
			if (textTag.parentNode.classList[0] === "label")  continue;

			const abbr = textTag.childNodes[0]?.innerHTML;
			rectDict[abbr]["textDiv"] = textTag;
		}

		for (const rect of rectTag) {
			const abbr = rect.parentNode.id;
			rectDict[abbr]["rectDiv"] = rect;
			rectDict[abbr]["oldFill"] = rect.style.fill;
			rectDict[abbr]["oldStroke"] = rect.style.stroke;
		}

		// add child and parent rect to dictionary
		for (const subject of rawData) {
			const parent = subject.parent
			if (typeof parent !== "undefined" || parent.length !== 0) {
				// collect parent node
				rectDict[subject.abbr]["parentRect"] = parent.map(
					(e) => {
						const abbr = `${abbrDict[e.slice(0, 3)]}${e.slice(3)}`;
						return rectDict[abbr]
					}
				)
			}

			const child = subject.children
			if (typeof child !== "undefined" || child.length !== 0) {
				rectDict[subject.abbr]["childRect"] = child.map(
					(e) => {
						const abbr = `${abbrDict[e.slice(0, 3)]}${e.slice(3)}`
						return rectDict[abbr]
					}
				)
			}
		}


	}
	collectHTMLObject();



	function addAttrToNodes() {
		// loop through keys of abbr in couese
		Object.keys(rectDict).forEach(

			e => {
				const rectDiv = rectDict[e]["rectDiv"];

				// when mouse enter to node
				rectDiv.addEventListener("mouseenter", () => {
					console.log(rectDiv)
					rectDiv.style.fill = "ffee00";
					rectDiv.style.stroke = "ffee00";
				});

				// when mouse exit
				rectDiv.addEventListener("mouseleave", () => {
					rectDiv.style.fill = rectDict[e]["oldFill"];
					rectDiv.style.fill = rectDict[e]["oldStroke"];
				});
			}
		)
	}
	addAttrToNodes();
}

