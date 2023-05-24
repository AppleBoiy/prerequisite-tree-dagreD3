
const filePath = '/app/data/datatester.json';
// document.write(filePath);

const root = document.getElementById("root");

async function getData() {
  try {
    const response = await fetch(filePath);
    const result = await response.json();
    return result;
  } catch (error) {console.log(error);}
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

createList()