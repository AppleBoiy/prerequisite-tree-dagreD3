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
  const response = await fetch(filePath);
  return await response.json();
}

// create Node
function createNode(data) {
  const name = data.abbr;

  const node = document.createElement("div");
  const detail = document.createElement("div")
  const info = document.createElement("p")

  node.classList.add('node');
  node.setAttribute("id", data.code);
  detail.classList.add('dialog-box')

  // node.style.width = maxWidth + "%";
  const text = document.createTextNode(name);
  info.innerText = JSON.stringify(data);

  detail.appendChild(info)

  node.appendChild(text);
  node.appendChild(detail)


  node.classList.add("textbox")

  return node
}
// add Node
async function addNode() {
  const data = await getData();

  // create Node
  data.forEach(element => {

    const newNode = createNode(element)
    switch (element.year) {
      case 1:
        (element.term === 1) ? y1t1.appendChild(newNode) : y1t2.appendChild(newNode);
        break;
      case 2:
        (element.term === 1) ? y2t1.appendChild(newNode) : y2t2.appendChild(newNode);
        break;
      case 3:
        (element.term === 1) ? y3t1.appendChild(newNode) : y3t2.appendChild(newNode);
        break;
      case 4:
        (element.term === 1) ? y4t1.appendChild(newNode) : y4t2.appendChild(newNode);
        break;
    }
  })
}


addNode()
