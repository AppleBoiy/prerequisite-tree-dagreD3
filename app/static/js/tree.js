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

		return result
	}

	const spreadSheetUrl = "https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit#gid=0";
	const resposeSpreadSheet = await readSpreadSheet(spreadSheetUrl);
	const rawData = await convertSpreadsheetToJson(resposeSpreadSheet)

	// build rawdata to correct format
	for (const element of rawData) {
		element.code = (element.code).toString();
		element.parent = (element.parent).toString();
		element.children = (element.children).toString();
		if (element.parent === "None") {
			element.parent = [];
		} else {
			element.parent = element.parent.split(", ");
		}
		if (element.children === "None") {
			element.children = [];
		} else {
			element.children = element.children.split(", ");
		}
	}

	const rectTag = document.getElementsByTagName("rect");
	const textTagArray = document.getElementsByTagName("text");

	const course = {};
	const rectDict = {};

	const graphlib = dagreD3.graphlib;
	const render = dagreD3.render();
	const PADDING = 120;

	const mainTree = new graphlib.Graph();

	// Set up an SVG group so that we can translate the final graph.
	const svg = d3.select("svg");
	const svgGroup = svg.append("g");

	// Center the graph
	const offset = PADDING / 2;

	// create dictionary that abbr is key
	for (const subject of rawData) {
		course[subject.abbr] = subject;
	}

	console.log(course)

	// filter to get only text tag that contains label tag and store to course dictionary
	for (const textTag of textTagArray) {
		if (textTag.parentNode.classList[0] !== "label") {
			const abbr = textTag.childNodes[0]?.innerHTML;
			course[abbr]["innerText"] = textTag;
		}
	}

	for (const rect of rectTag) {
		const abbr = rect.parentNode.id;
		course[abbr]["rectTag"] = rect;
		rectDict[abbr] = rect;
	}

	// Set an object for the graph label
	mainTree.setGraph({"ranksep": 100});

	// Default to assigning a new object as a label for each new edge.
	mainTree.setDefaultEdgeLabel(
		() => {
			return {};
		},
	);


	function spawnNodes() {
		for (const subject of rawData) {
			mainTree.setNode(
				subject.code,
				{
					label: subject.abbr,
					width: 50,
					height: 30,
					id: subject.abbr,
					class: `y${subject.year}`,
				},
			);

		}
	}
	spawnNodes();


	function connectNodes() {

		for (const e of rawData) {
			if (e.children.length === 0) continue;

			e.children.forEach(
				child => {
					mainTree.setEdge(`${e.code}`, `${child}`, {class: `${e.code}` + "-" + `${child}`});
				}
			)
		}
	}
	connectNodes();


	// Round the corners of the nodes
	mainTree.nodes().forEach(
		(v) => {
			const node = mainTree.node(v);
			node.rx = node.ry = 10;
		},
	);

	render(d3.select("svg g"), mainTree);

	// Size the container to the graph
	svg.attr("width", mainTree.graph().width + PADDING);
	svg.attr("height", mainTree.graph().height + PADDING);

	svgGroup.attr("transform", "translate(" + offset + ", " + offset + ")");
}


main().then(
  () => console.log("Tree generated")
).catch(
  e => console.log(e)
)