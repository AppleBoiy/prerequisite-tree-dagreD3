/// <reference path="Scripts/jspack-vsdoc.js" />

var Diagram = MindFusion.Diagramming.Diagram;
var CompositeNode = MindFusion.Diagramming.CompositeNode;
var Behavior = MindFusion.Diagramming.Behavior;
var Events = MindFusion.Diagramming.Events;
var Theme = MindFusion.Diagramming.Theme;
var Style = MindFusion.Diagramming.Style;

var Alignment = MindFusion.Drawing.Alignment;
var Rect = MindFusion.Drawing.Rect;
var Point = MindFusion.Drawing.Point;

var TreeLayout = MindFusion.Graphs.TreeLayout;

var diagram = null;
var names;
var coloredNode;

//The DeanNode is a class that inherits from CompositeNode and 
//uses the available layout panels (grid, stack, simple etc.) and components (text, image, table etc.) 
//to construct the desired node type
var DeanNode = CompositeNode.classFromTemplate("DeanNode",
{
	component: "SimplePanel",
	name: "root",
	children:
	[
        {
            component: "Rect",
			name: "Background",
			brush: "white",
			pen: "#cecece",
		},
		{
			component: "GridPanel",
			rowDefinitions: ["*", "2"],
			columnDefinitions: ["*"],
			children:
			[	
				{		
					component: "StackPanel",
					orientation: "Vertical",
					margin: "1",
					verticalAlignment: "Near",
					gridRow: 0,
					children:
						[
							{
								component: "Text",
								name: "Faculty",
								autoProperty: true,
								text: "title",
								font: "serif bold"
								},
								{
								component: "Text",
								name: "Dean",
								autoProperty: true,
								text: "Name of dean",
								pen: "#808080",
								padding: "1,0,1,0"
								},
								{
								component: "Text",
								name: "Details",
								autoProperty: true,
								text: "details",
								font: "serif 3.5 italic"
								}		
						
						]
				},
				
				{
					component: "Rect",
					name: "Underline",
					pen: "red",
					brush: "red",
					gridRow: 1,
					autoProperty: true					
				}
			]
		}			
	]
});


document.addEventListener("DOMContentLoaded", function ()
{
	//some random names for the people
	names = ["Nicole Montgomery", "Loren Alvarado", "Vicki Fisher", "Edith Fernandez", "Lynette Sullivan", "Amy Rhodes", "Teresa Marsh", "Ginger Larson", "Bob Lawrence", "Arthur Ball", "Ramiro Mitchell", "Mitchell Barker", "Jane Silva", "Diana Curry", "Jay Smith", "Caroline Garcia", "Paulette Wells", "Alexander Chapman", "Emanuel Glover", "Shannon Daniel", "Jesus Townsend", "Lowell Gibbs", "Ruben Figueroa", "Estelle Henderson", "Sonja French", "Ken Underwood", "Joe Hines", "Eric Rogers", "Lindsay Manning", "Jorge Shelton", "Bobby Sanders", "Mamie Pratt", "Rudolph Armstrong", "Wayne Mcguire", "Jessica Peters", "Clinton Maxwell", "Lillian Carroll", "Felipe Craig", "Marion Holt", "Willard Reynolds", "Anita Adkins", "Ramona Hanson", "Zachary Rodriguez", "Boyd Todd", "Michelle Ford", "Orlando Jenkins", "Nelson Benson", "Shirley Farmer", "Eddie Curtis", "Phil Taylor", "Yolanda Strickland", "Simon Abbott", "Jesus Neal", "Roman Owens", "Heather Hogan", "Andrew Jennings", "Lucille Kelly", "Glenda Lee", "Kathryn Boone", "Craig Summers", "Michele Fernandez", "Tonya Parsons", "Bennie Freeman", "Stewart Austin", "Johanna Barber", "Julia Dean", "Jeanette Hernandez", "Nicholas Hawkins", "Miriam Lindsey", "Chester Waters", "Marta Jackson", "Jake Brown", "Rufus Turner", "Melvin Nunez", "Luther Collier", "Geraldine Barton", "Wesley Lamb", "Wilbur Frazier", "Wendell Saunders", "Brittany Corte"];
	
	// create a Diagram component that wraps the "diagram" canvas
	diagram = Diagram.create(document.getElementById("diagramCanvas"));
	
		// enable drawing of custom nodes interactively
	diagram.setCustomNodeType(DeanNode);
	diagram.setBehavior(Behavior.Custom);
	
	var theme = new Theme();
	var linkStyle = new Style();
	linkStyle.setStroke("#CECECE");
	theme.styles["std:DiagramLink"] = linkStyle;
	diagram.setTheme(theme);	
	diagram.setShadowsStyle(MindFusion.Diagramming.ShadowsStyle.None);
	
	createNodes();
	
	var links = diagram.getLinks();
	
	//set all links to light gray and with pointers at the bottom, 
	//rather than the head in order to appear inverted
	for(var i = 0; i < links.length; i++)
	{
		var link = links[i];
		
	link.setBaseShape("Triangle");
	link.setHeadShape(null);
	link.setBaseShapeSize(3.0);
	link.setBaseBrush({ type: 'SolidBrush', color: "#CECECE" });
	link.setZIndex(0);
	}
	
	//create an instance of the Tree Layout and apply it
	var layout = new TreeLayout();
	layout.direction = MindFusion.Graphs.LayoutDirection.TopToBottom;
	layout.linkType = MindFusion.Graphs.TreeLayoutLinkType.Cascading;
	//enabling assistants tells the layout to order the nodes with Assistant traits in a special way
	layout.enableAssistants = true;
    diagram.arrange(layout);
	
	diagram.resizeToFitItems(5);
	
		// create an ZoomControl component that wraps the "zoomer" canvas
	var zoomer = MindFusion.Controls.ZoomControl.create(document.getElementById("zoomer"));
	zoomer.setTarget(diagram);
	zoomer.setZoomFactor(55);	
	
	
});

//create all nodes
function createNodes()
{
	var faculties = ["Mathematics and IT", "Economics and BA", "Physics", "Chemistry and Pharmacy", "Medicine", "Biology", "Law", "Philisophy"];
	
	var philosophy = ["Philosophy", "Psychology", "Sociology", "Political science", "Culturology", "Rhetoric", "Library Information Sciences", "Europeanism", "Public Administration", "Public information systems"];
	var math = ["Mathematics", "Information Technology", "Pedagogics for IT and Math"];
	var economics = ["Accounting and Digital Applications", "Finance and Banking", "Economics", "Business Management"];
	var physics = [ "Astronomy", "Atomic Physics", "Quantum electronics", "Meteorology and geophysics", "Methods of teaching physics", "General Physics", "Optics and spectroscopy", "Radiophysics and electronics", "Theoretical Physics", "Condensed Matter Physics and Microelectronics", "Nuclear engineering and nuclear energy"];
	var chemistry = ["Chemistry", "Eco-chemistry", "Computer Chemistry", "Nuclear Chemistry", "Engineering Chemistry and Modern Materials", "Chemistry and Informatics"];
	var medicine = ["Nurse", "Medical rehabilitation"];
	var law = ["Law","International business relations", "International organizations and multilateral diplomacy", "International security", "Private relations with cross-border implications in the EU", "European Master's Program in Human Rights and Democratization (E.MA)", "EU cultural relations and geopolitics"];
	var biology = ["Biochemistry", "Biophysics and radiobiology", "Biotechnology", "Botany", "Genetics", "Ecology and environmental protection", "Zoology and anthropology", "General and industrial microbiology", "Animal and human physiology", "Plant physiology", "Cytology, histology and embryology", "General and applied hydrobiology", "Methodology of Biology Education"];
	
	var departments = [math, economics, physics, chemistry, medicine, biology, law, philosophy];
	
	var deans = [];
	for(var i = 0; i < faculties.length; i++)
		deans.push(createDepartmentNodes(faculties[i], departments[i]));
	
	//create some unique nodes that cannot be generated in a cycle - vice presidents, 
	//the president and the board
	var vpNodeSocial = new DeanNode(diagram);
	vpNodeSocial.setBounds(new Rect(80, 225, 60, 25));
	vpNodeSocial.setFaculty("Vice President");
	vpNodeSocial.setDean(names.pop());
	vpNodeSocial.setDetails(
		"Vice President for Finance, Administration and Social Studies");
	vpNodeSocial.getComponent("Underline").brush = "#76A68F";
	vpNodeSocial.getComponent("Underline").pen = "#76A68F";
	diagram.addItem(vpNodeSocial);
	
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Economics and BA"));
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Philisophy"));
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Law"));
	
	var vpNodeMath = new DeanNode(diagram);
	vpNodeMath.setBounds(new Rect(80, 225, 60, 25));
	vpNodeMath.setFaculty("Vice President");
	vpNodeMath.setDean(names.pop());
	vpNodeMath.setDetails(
		"Vice President for Math, Physics and IT");
	vpNodeMath.getComponent("Underline").brush = "#76A68F";
	vpNodeMath.getComponent("Underline").pen = "#76A68F";
	diagram.addItem(vpNodeMath);
	
	diagram.getFactory().createDiagramLink(vpNodeMath, getDean(deans, "Mathematics and IT"));
	diagram.getFactory().createDiagramLink(vpNodeMath, getDean(deans, "Physics"));
	
	var vpNodeMed = new DeanNode(diagram);
	vpNodeMed.setBounds(new Rect(80, 225, 60, 25));
	vpNodeMed.setFaculty("Vice President");
	vpNodeMed.setDean(names.pop());
	vpNodeMed.setDetails(
		"Vice President for Medicine, Biology and Chemistry");
	vpNodeMed.getComponent("Underline").brush = "#76A68F";
	vpNodeMed.getComponent("Underline").pen = "#76A68F";
	diagram.addItem(vpNodeMed);
	
	var vpNodeStud = new DeanNode(diagram);
	vpNodeStud.setBounds(new Rect(80, 225, 60, 25));
	vpNodeStud.setFaculty("Vice President");
	vpNodeStud.setDean(names.pop());
	vpNodeStud.setDetails(
		"Vice President for Student Affairs");
	vpNodeStud.getComponent("Underline").brush = "#76A68F";
	vpNodeStud.getComponent("Underline").pen = "#76A68F";
	diagram.addItem(vpNodeStud);
	
	diagram.getFactory().createDiagramLink(vpNodeMed, getDean(deans, "Medicine"));
	diagram.getFactory().createDiagramLink(vpNodeMed, getDean(deans, "Biology"));
	diagram.getFactory().createDiagramLink(vpNodeMed, getDean(deans, "Chemistry and Pharmacy"));
	
	var pNode = new DeanNode(diagram);
	pNode.setBounds(new Rect(80, 225, 60, 25));
	pNode.setFaculty("President");
	pNode.setDean(names.pop());
	pNode.setDetails(
		"Vice President for Medicine, Biology and Chemistry");
	pNode.getComponent("Underline").brush = "#649AC4";
	pNode.getComponent("Underline").pen = "#649AC4";
	diagram.addItem(pNode);
	
	diagram.getFactory().createDiagramLink(pNode, vpNodeMed);
	diagram.getFactory().createDiagramLink(pNode, vpNodeMath);
	diagram.getFactory().createDiagramLink(pNode, vpNodeSocial);
	diagram.getFactory().createDiagramLink(pNode, vpNodeStud);
	
	var regNode = new DeanNode(diagram);
	regNode.setBounds(new Rect(80, 225, 60, 25));
	regNode.setFaculty("Board of Trustees");
	regNode.setDean(names.pop());
	regNode.setDetails(
		"President of 12-member board");
	regNode.getComponent("Underline").brush = "#A19AD4";
	regNode.getComponent("Underline").pen = "#A19AD4";
	diagram.addItem(regNode);
	
	diagram.getFactory().createDiagramLink(regNode, pNode);
	
	createCollegeNodes();
	
}


//create the nodes for the given department
function createDepartmentNodes (department, specialities)
{
	var nodes = [];
	
	//create nodes for all specialities in it
	for(var i = 0; i < specialities.length; i++)
	{
		var node = new DeanNode(diagram);
		node.setBounds(new Rect(100, 195, 60, 25));
		node.setFaculty("Faculty of " + department);
		node.setDean(names.pop());
		node.setDetails(
		    getTitle() + " " + specialities[i] + "\r\n" +
			getQualification() + ", " + specialities[i]);
			
	    if(node.getDetails().length > 70)
			node.setDetails(
		    getTitle() + " " + specialities[i]);
		node.getComponent("Underline").brush = "#F2C3A7";
		node.getComponent("Underline").pen = "#F2C3A7";
		node.layoutTraits = { treeLayoutAssistant: MindFusion.Graphs.AssistantType.Left };
		node.setId(specialities[i]);
		diagram.addItem(node);	
		nodes.push(node);
	}
	
	//create the dean of the department
	var major = department;
	
	if(specialities.length > 0)
		major = specialities[0];
	
	var deanNode = new DeanNode(diagram);
	deanNode.setBounds(new Rect(100, 195, 60, 25));
	deanNode.setFaculty("Faculty of " + department);
	deanNode.setDean(names.pop());
	deanNode.setDetails(
		"Dean of the Faculty of " + department+"\r\n" +
		"Professor in " + major);
	if(deanNode.getDetails().length > 60)
		deanNode.setDetails(
		"Dean of the Faculty of " + department);
		
	deanNode.getComponent("Underline").brush = "#F27649";
	deanNode.getComponent("Underline").pen = "#F27649";
	deanNode.setId(department);
	
	diagram.addItem(deanNode);	
	
	//connect the departments with the dean node
	for(var i = 0; i < nodes.length; i++)
	{
		diagram.getFactory().createDiagramLink(deanNode, nodes[i]);
	}
	
	return deanNode;	
	
}

//create the nodes of the colleges
function createCollegeNodes()
{
	var colleges = ["Mathematics", "Information Technology", "Physics", "Mechanics"];
	
	var collegeNodes = [];
	
	for(var i = 0; i < colleges.length; i++)
	{
		var node = new DeanNode(diagram);
		node.setBounds(new Rect(100, 195, 60, 25));
		node.setFaculty("High School of Math and Natural Sciences");
		node.setDean("Accreditied College");
		node.setDetails(
		    "Specialization in " + colleges[i]);	   
		node.getComponent("Underline").brush = "#F2D479";
		node.getComponent("Underline").pen = "#F2D479";
		node.layoutTraits = { treeLayoutAssistant: MindFusion.Graphs.AssistantType.Left };
		node.setId(colleges[i]);
		diagram.addItem(node);			
		collegeNodes.push(node);
	}	
	
	
	//connect the colleges to the last node in the IT department
	for(var i = 0; i < collegeNodes.length; i++)	{
		
		diagram.getFactory().createDiagramLink(getDean(diagram.getNodes(), "Pedagogics for IT and Math"), collegeNodes[i]);
	}
	
	//create colleges in BA and connect the nodes to the last node in the BA and Economics college
	colleges = ["Finance", "Accounting", "Trade", "Banks", "Insurance"];
	
	collegeNodes = [];
	
	for(var i = 0; i < colleges.length; i++)
	{
		var node = new DeanNode(diagram);
		node.setBounds(new Rect(100, 195, 60, 25));
		node.setFaculty("High School of Finance and Accounting");
		node.setDean("Accredited College");
		node.setDetails(
		    "Specialization in " + colleges[i]);	   
		node.getComponent("Underline").brush = "#F2D479";
		node.getComponent("Underline").pen = "#F2D479";
		node.layoutTraits = { treeLayoutAssistant: MindFusion.Graphs.AssistantType.Left };
		node.setId(colleges[i]);
		diagram.addItem(node);			
		collegeNodes.push(node);
	}	
	
	
	for(var i = 0; i < collegeNodes.length; i++)	{
		
		diagram.getFactory().createDiagramLink(getDean(diagram.getNodes(), "Business Management"), collegeNodes[i]);
	}
	
	
}

//search for the dean of the provided departent
function getDean(deanNodes, department)
{
	
	for(var i = 0; i < deanNodes.length; i++)
		if(deanNodes[i].getId() == department)
			return deanNodes[i];
		
		return null;
}

//get random title for the dean
function getTitle()
{
	var titles = ["Program Director for", "Department Chair for", "Associate Dean for", "Assistant Director for"];
	
	var index = Math.floor(Math.random() * titles.length); 
	
	return titles[index];
}

//get a sample education degree for the dean on a ranodm principle
function getQualification()
{
	var titles = ["Clinical Professor", "Associate Professor", "Clinical Associate Professor", "Research Professor", "Professor", "Assistant Professor", "Clinical Assistant Professor"];
	
	var index = Math.floor(Math.random() * titles.length); 
	
	return titles[index];
}

//handles the mouse move event
diagramCanvas.addEventListener('mousemove', function (e) {
	
	//get the position of the mouse
	var cursor = MindFusion.Diagramming.Utils.getCursorPos(e, document.getElementById("diagramCanvas"));
	//convert the mouse position to diagram units
	var point = diagram.clientToDoc(cursor);

//see if there is a diagram node at this location
    var deanNode = diagram.getNodeAt(point);
    if (deanNode) {	
	
	//if there is a node but also another node is colored, we must reset ALL nodes
	 if(coloredNode)
		  resetAllItems();
	  
	 coloredNode = deanNode;	
	  
	  //set the background of the node to the color of its bottom line
      var brush = deanNode.getComponent("Underline").brush;	
	  deanNode.getComponent("Background").brush = brush;	
	
	//set all incoming and outgoing links to be red
	  var links = deanNode.getOutgoingLinks();	  
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("red");	
		  link.setZIndex(1);
	  }
	  
	  links = deanNode.getIncomingLinks();	  
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("red");	
		  link.setZIndex(1);		  
	  }  
	  
	  //invalidate the node to repaint it
	  deanNode.invalidate();
	 }else if (coloredNode)
	 {
		 //if we have a colored node and the mouse is not under another node
		 //we ust reset the colors of the colored node and its links
		 coloredNode.getComponent("Background").brush = "white";	
		 
		var links = coloredNode.getOutgoingLinks();	  
		 
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("#CECECE");
		  link.setZIndex(0);
		  
	  }
	  
	  links = coloredNode.getIncomingLinks();
	  
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("#CECECE");
		  link.setZIndex(0);
	  }	  
	  
		 coloredNode.invalidate();
		 coloredNode = null;
	 }
}); 


/* sets the background of all nodes to white,
the links to gray and the zIndex of all elements to 0 */
function resetAllItems()
{
	 var nodes = diagram.getNodes();
		  
		  for(var i = 0; i < nodes.length; i++)
			  nodes[i].getComponent("Background").brush = "white";
		  
		  var links = diagram.getLinks();
		  
		   for(var i = 0; i < links.length; i++)
		   {
			  links[i].setStroke("#CECECE");
			  links[i].setZIndex(0);
		   }
}





























