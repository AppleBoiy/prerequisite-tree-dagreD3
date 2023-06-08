function convertSpreadsheetToJson() {
    return new Promise(async (resolve, reject) => {
        try {

            // get link input
            const spreadsheetLinkInput = "https://cmu.to/UP5em";

            // build list of array rows from spreadsheet to jsonData
            const response = await fetch(spreadsheetLinkInput);
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
            // Define the range of rows and columns
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            range.s.r = 1; // Start from the first row
            range.e.r = 21; // End at the 20th row
            range.s.c = 1; // Start from the first column
            range.e.c = 9; // End at the 8th column
            // import data in list from to jsonData
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range });
            //console.log(jsonData);

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
            // console.log(result);
            resolve(result);
        } catch (error) {
          reject(error);
        }
    });
}

async function handleHover() {
    // new data from spreadsheet
    const rawData = await convertSpreadsheetToJson();
    // build rawdata to correct format
    rawData.forEach(async element => {
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
    });
    //console.log(rawData)
    return rawData;
}

