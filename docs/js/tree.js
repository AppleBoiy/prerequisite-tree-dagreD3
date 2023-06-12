// Create a dictionary to store the rectangle and course data
const rectangleData = {};
const courseData = {};
const courseList = [];

const main = () => {
	const spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1t8dvUUdvOxdiKQv5nagGaHyiw3P-C2o0Qg6C_1Tlq58/edit?usp=sharing";

	// Convert the spreadsheet to JSON
	spreadsheetToJson(spreadsheetUrl)
		.then(async rawData => {
			// Generate the prerequisite tree view
			await generateTreeView(rawData);

			// Populate the dictionary with rectangle and course data
			for (const subject of rawData) {
				const abbreviation = subject.abbr;
				rectangleData[abbreviation] = {};
				courseData[abbreviation] = subject;
			}

			// Set up the necessary properties for each rectangle element
			const nodeDivs = document.getElementsByClassName("node");
			Array.from(nodeDivs).forEach(div => {
				const [rect, text] = div.childNodes;
				const rectData = rectangleData[div.id];

				Object.assign(rectData, {
					rectangleDiv: rect,
					textDiv: text,
					nodeDiv: div,
					originalFill: rect.style.fill,
					originalStroke: rect.style.stroke,
					highlightFill: "#03fc88",
					highlightStroke: "#03fc88",
					fadedFill: "#fff",
					fadedStroke: "#fff"
				});
			});

			// Attach event handlers to the rectangles
			for (const [abbreviation, rectData] of Object.entries(rectangleData)) {
				const { nodeDiv } = rectData;
				attachEventHandlers(abbreviation, nodeDiv);
			}

		})
		.catch(error => console.log(error));
};

/**
 * Fetches a spreadsheet from the provided URL and converts it to JSON format.
 * Each row in the spreadsheet becomes an object in the resulting array.
 * The headers of the spreadsheet become the keys of the objects.
 *
 * @param {string} url - The URL of the spreadsheet to fetch and convert.
 * @returns {Promise<Array<Object>|null>} - A Promise that resolves to an array of objects representing the spreadsheet data in JSON format.
 *                                          Returns null if an error occurs during the fetch or conversion process.
 */
async function spreadsheetToJson(url)  {
	// Fetch the spreadsheet data
	const response = await fetch(url);
	const data = await response.arrayBuffer();

	// Read the workbook and worksheet from the data
	const workbook = XLSX.read(data, { type: "array" });
	const [workSheet] = workbook.SheetNames;
	const worksheet = workbook.Sheets[workSheet];

	// Define the range of rows and columns
	const range = XLSX.utils.decode_range(worksheet["!ref"]);
	range.s.r = 1;
	range.s.c = 1;

	// Convert the worksheet to JSON
	const rawJsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
	const infoCount = rawJsonData[0].length;

	const jsonData = rawJsonData.filter(data => {
		return data.length === infoCount && !data.includes(undefined);
	});

	// Destructure the jsonData array into headers and rows
	const [headers, ...rows] = jsonData;

	// Map over each row and create an object for each row
	const result = rows.map(row =>
		// Use reduce to build the object by assigning values to the corresponding header keys
		headers.reduce((obj, headerCell, index) => {
			obj[headerCell] = row[index]; // Assign the value from the row to the corresponding header key
			return obj;
		}, {})
	);

	const parseValue = (value) => {
		return value === "-" ? [] : value.toString().split(", ");
	};

	result.forEach(element => {
		element.parent = parseValue(element.parent);
		element.children = parseValue(element.children);
	});

	return result;
}

/**
 * Generates a tree view of prerequisite tree from a JSON-like object.
 * @param {Object} rawData - Dictionary of course details.
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
		// Create node in the main tree
		const nodeData = {
			label: subject.abbr,
			width: 50,
			height: 30,
			id: subject.abbr,
			class: `y${subject.year}`
		};
		mainTree.setNode(subject.code, nodeData);

		// Create edges for subject's children
		subject.children.forEach(child => {
			const edgeData = { class: `${subject.code}-${child}` };
			mainTree.setEdge(subject.code, child, edgeData);
		});

		courseList.push(subject.abbr);
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

	for (const data of mainTree.edges() ) {
		const {v, w} = data;
		// console.log(v, w)
	}
}

/**
 * Traverses a node hierarchy based on an abbreviation.
 * Returns an array of parent nodes and their ancestors.
 *
 * @param {string} abbreviation - The abbreviation of the node to traverse.
 * @returns {Array} - An array containing the parent nodes and their ancestors.
 */
function getNodeAncestors(abbreviation) {
	// Get the parent nodes of the current abbreviation
	const parents = courseData[abbreviation]?.parent.map(e => idToAbbreviation(e));

	if (!parents) return [];

	// Recursively traverse the parent nodes to get their ancestors
	const ancestors = parents.map(e => getNodeAncestors(e));
	const flattenedAncestors = ancestors.flat();

	// Return the parent nodes and their ancestors as a flattened array
	return [...parents, ...flattenedAncestors];
}

/**
 * Highlights or reverts the highlight of a rectangle element.
 *
 * @param {string} abbreviation - The abbreviation associated with the rectangle to be highlighted or reverted.
 * @param mode
 */
function highlightRectangle(abbreviation, mode = "") {
	// Retrieve the rectangle data associated with the abbreviation
	const rectData = rectangleData[abbreviation];

	// Extract the necessary properties from the rectangle data
	const { highlightFill, highlightStroke, originalFill, originalStroke, fadedFill, fadedStroke } = rectData;

	// Access the rectangle element in the DOM
	const rectangle = rectData.rectangleDiv;

	switch (mode) {
		case "enter":
			// Set the new fill and stroke color to highlight the rectangle
			rectangle.style.fill = highlightFill;
			rectangle.style.stroke = highlightStroke;
			break;

		case "leave":
			// Set the original fill and stroke color to revert the highlight
			rectangle.style.fill = originalFill;
			rectangle.style.stroke = originalStroke;
			break;

		default:
			rectangle.style.fill = fadedFill;
			rectangle.style.stroke = fadedStroke;

	}
}

/**
 * Converts an ID to its corresponding abbreviation.
 *
 * @param {string} id - The ID to be converted.
 * @returns {string} The corresponding abbreviation.
 */
function idToAbbreviation(id) {
	// Dictionary mapping IDs to abbreviations
	const abbreviationDict = {
		"204": "CS",
		"206": "Math",
		"208": "Stat"
	};

	// Extract the relevant part of the ID and combine it with the abbreviation
	return `${abbreviationDict[id.slice(0, 3)]}${id.slice(3)}`;
}

/**
 * Attaches event handlers to a given node element based on the provided abbreviation.
 *
 * @param {string} abbreviation - The abbreviation of the node.
 * @param {HTMLElement} nodeElement - The node element to attach the event handlers to.
 * @returns {void} - This function does not return a value.
 */
function attachEventHandlers(abbreviation, nodeElement) {
	const popup = document.getElementById("popup");
	const close = document.getElementById("close");
	close.addEventListener("click", (event) => {
		event.preventDefault();
		if (popup.style.display !== "none") {
			popup.style.display = "none";
		}
	});

	// Retrieve the subject data associated with the abbreviation
	const subjectData = courseData[abbreviation];

	// Get the child and parent codes from the subject data
	const childCodes = subjectData.children.map(idToAbbreviation);
	const parentCodes = getNodeAncestors(abbreviation);

	// Combine the abbreviation, child codes, and parent codes into a single array
	const nodes = [abbreviation, ...childCodes, ...parentCodes];

	const excludes = courseList.filter( e => !nodes.includes(e) );

	// Event handler for mouse enter event
	const handleMouseEnter = () => {
		// Highlight the nodes on mouse enter
		nodes.forEach(e => highlightRectangle(e, "enter"));
		excludes.forEach( e => highlightRectangle(e, "fade"))

	};

	// Event handler for mouse leave event
	const handleMouseLeave = () => {
		// Revert the highlight of the nodes on mouse leave
		nodes.forEach(e => highlightRectangle(e, "leave"));
		excludes.forEach( e => highlightRectangle(e, "leave"))
	};

	const handleMouseClick = (event) => {
		event.preventDefault();
		popup.style.display = "flex";
		const [courseName, courseContent] = popup.children[0].children;

		courseName.innerHTML = courseData[abbreviation]["full name (ENG)"];
		courseContent.innerHTML = `
      Prerequisite: ${courseData[abbreviation]["parent"] || "-"}<br>
      Credit: ${courseData[abbreviation]["credit"]}<br>
      Details: ....`;
	};

	// Attach event listeners to the node element
	nodeElement.addEventListener("mouseenter", handleMouseEnter);
	nodeElement.addEventListener("mouseleave", handleMouseLeave);
	nodeElement.addEventListener("click", handleMouseClick);
}

main();
