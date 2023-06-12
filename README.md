


# [Prerequisite Tree](https://appleboiy.github.io/prerequisite-tree/)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AppleBoiy_prerequisite-tree&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AppleBoiy_prerequisite-tree) [![Qodana](https://github.com/AppleBoiy/prerequisite-tree/actions/workflows/code_quality.yml/badge.svg)](https://github.com/AppleBoiy/prerequisite-tree/actions/workflows/code_quality.yml)


This is a prerequisite tree generator that converts a spreadsheet containing course data into a graphical representation
of the course prerequisites. It utilizes the [dagreD3] library, [D3.js], and [SheetJS] to generate the tree view.

## Features

- Converts a Google Spreadsheet to JSON format
- Generates an interactive prerequisite tree view
- Highlights and provides details of course prerequisites on mouse hover
- Supports customization of node colors and styles

## Wiki

You can access our wiki by visiting [wiki](https://cmu.to/cs-prereq-notion). It contains valuable information

> We encourage you to explore our wiki to learn more about our project and get the most out of it. If you have any
> questions or suggestions, feel free to contribute to the wiki or reach out to our team.

## How It Works

The tool fetches a Google Spreadsheet containing course data and converts it into a JSON format. It then uses this data
to generate a tree view representation of the course prerequisites. The tree view is rendered using the [dagreD3]
library, which itself utilizes . The data conversion is facilitated by [SheetJS], allowing users to explore the
prerequisite relationships between different courses.

<a name="guidelines"></a>

## Getting Started

### Prerequisites

- [Node.js] (version 12 or higher)
- Modern web browser with SVG support

### Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/AppleBoiy/prerequisite-tree.git
    ```

2. Navigate to the project directory
    ```shell
    cd prerequisite-tree
    ```

3. install the dependencies
    ```shell
    npm install
    ```

### Usage

1. Open the `index.html` file in a web browser.
2. Provide the URL of the spreadsheet in the spreadsheetUrl variable inside the `main` function in the `tree.js` file.
   Save the changes.
3. Run a local server to serve the files. You can use the following command with Python:
    ```shell
   python -m http.server
    ```
4. Open the web browser and navigate to http://localhost:8000 (or the appropriate address based on your server
   configuration).
5. The prerequisite tree will be displayed based on the data from the spreadsheet.

### Customization

* You can modify the styles in the `tree.css` file to customize the appearance of the prerequisite tree.
* Additional configuration options and functionality can be implemented by modifying the `tree.js` file.

### Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please open an issue or submit a
pull request.

## Special Thanks

Special thanks to [dagreD3], [D3.js], and [SheetJS] for providing the libraries and tools that make this educational
tool possible.

## License

This project is licensed under the [MIT License](LICENSE).


[dagreD3]: https://github.com/dagrejs/dagre-d3

[D3.js]: https://d3js.org

[SheetJS]: https://sheetjs.com

[Node.js]: https://nodejs.org/en
