const filePath = '/app/data/datatester.json';

const root = document.getElementById("root");
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

// add Node
async function addNode() {
  const data = await getData();
  let y1t1 = 0;
  let y1t2 = 0;
  let y2t1 = 0;
  let y2t2 = 0;
  let y3t1 = 0;
  let y3t2 = 0;
  let y4t1 = 0;
  let y4t2 = 0;
  // count node
  data.forEach(element => {
    switch(element.year){
      case 1:
        (element.term == 1) ? y1t1++ : y1t2++;
        break;
      case 2:
        (element.term == 1) ? y2t1++ : y2t2++;
        break;
      case 3:
        (element.term == 1) ? y3t1++ : y3t2++;
        break;
      case 4:
        (element.term == 1) ? y4t1++ : y4t2++;
        break;
    }
  })
  console.log(y2t1);
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