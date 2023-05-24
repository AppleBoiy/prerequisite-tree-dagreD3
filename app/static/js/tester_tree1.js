
let filePath = '/app/data/datatester.json';
let data = [];
// document.write(filePath);

// Fetch the JSON file
fetch(filePath)
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonData) {
    // Access the data as an object
    // console.log(jsonData);

    // You can now work with the JSON data as an object
    // For example, you can access properties like this:
    // console.log(jsonData.propertyName);
    data = [...jsonData];
  })
  .catch(function(error) {
    console.log('Error:', error);
  });

console.log(data);
