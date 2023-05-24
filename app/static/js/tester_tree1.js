const filePath = '/app/static/data/datatester.json';

const root = document.getElementById("root");
const y1t1 = document.getElementById("y1t1");
const y1t2 = document.getElementById("y1t2");
const y2t1 = document.getElementById("y2t1");
const y2t2 = document.getElementById("y2t2");
const y3t1 = document.getElementById("y3t1");
const y3t2 = document.getElementById("y3t2");
const y4t1 = document.getElementById("y4t1");
const y4t2 = document.getElementById("y4t2");

// const nodes = new Map();

// get data from json
async function getData() {
  try {
    const response = await fetch(filePath);
    const result = await response.json();
    return result;
  } catch (error) {console.log(error);}
}

async function countNode() {
  const data = await getData();
  
}
// create Node
function createNode(name) {
  const node = document.createElement("div");
  node.classList.add('node');
  // node.style.width = maxWidth + "%";
  const text = document.createTextNode(name);
  node.appendChild(text);
  return node

}
// add Node
async function addNode() {
  const data = await getData();
  let nodeCount = [0,0,0,0,0,0,0,0];
  // let y1t1 = 0;
  // let y1t2 = 0;
  // let y2t1 = 0;
  // let y2t2 = 0;
  // let y3t1 = 0;
  // let y3t2 = 0;
  // let y4t1 = 0;
  // let y4t2 = 0;
  // count Node
  data.forEach(element => {
    switch(element.year){
      case 1:
        (element.term == 1) ? nodeCount[0]++ : nodeCount[1]++;
        break;
      case 2:
        (element.term == 1) ? nodeCount[2]++ : nodeCount[3]++;
        break;
      case 3:
        (element.term == 1) ? nodeCount[4]++ : nodeCount[5]++;
        break;
      case 4:
        (element.term == 1) ? nodeCount[6]++ : nodeCount[7]++;
        break;
    }
  })
  // const nodeWidth = 100 / Math.max(...nodeCount);

  // create Node
  data.forEach(element => {
    const newNode = createNode(element.abbr)
    switch(element.year){
      case 1:
        (element.term == 1) ? y1t1.appendChild(newNode) : y1t2.appendChild(newNode);
        break;
      case 2:
        (element.term == 1) ? y2t1.appendChild(newNode) : y2t2.appendChild(newNode);
        break;
      case 3:
        (element.term == 1) ? y3t1.appendChild(newNode) : y3t2.appendChild(newNode);
        break;
      case 4:
        (element.term == 1) ? y4t1.appendChild(newNode) : y4t2.appendChild(newNode);
        break;
    }
  })
  console.log(nodeCount);
  
}


async function createList() {
  const data = await getData();
  data.forEach(element => {
    const a = document.createElement("p");
    a.className = "test"
    a.innerHTML = `${element.code} ${element["parent list"]} ${element["child list"]} ${element.credit} ${element["full Name"]} ${element.year} ${element.abbr} ${element.term}`
    root.appendChild(a);
  });
}

addNode()
createList()


const test = document.getElementById("testt");
let path = document.createElementNS(test.namespaceURI,"path");
path.setAttributeNS(null, "d",`M${100},10 L150,10`);
path.setAttributeNS(null, "style", "stroke:red; stroke-width: 1.25px; fill: none;marker-end: url(#arrow);");
test.appendChild(path);
console.log(path.getBoundingClientRect());