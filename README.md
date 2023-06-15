# Prerequisite Tree

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AppleBoiy_prerequisite-tree&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AppleBoiy_prerequisite-tree) [![Qodana](https://github.com/AppleBoiy/prerequisite-tree/actions/workflows/code_quality.yml/badge.svg)](https://github.com/AppleBoiy/prerequisite-tree/actions/workflows/code_quality.yml)

![screen shot]

This is a prerequisite tree generator that converts a spreadsheet containing course data into a graphical representation
of the course prerequisites. It utilizes the [dagreD3] library, [D3.js], and [SheetJS] to generate the tree view.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Wiki](#wiki)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
- [Customization](#customization)
    - [Preparing the Spreadsheet](#preparing-the-spreadsheet)
- [Contributing](#contributing)
- [Special Thanks](#special-thanks)
- [License](#license)

## Overview

The Prerequisite Tree tool allows users to visualize and explore the prerequisite relationships between different
courses. It fetches course data from a Google Spreadsheet, converts it into a JSON format, and generates a tree view
using the [dagreD3] library. Users can hover over nodes to view prerequisite details and navigate the tree to understand
the course dependencies.

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
2. Provide the URL of the spreadsheet in the spreadsheetUrl variable inside the [`main`](./docs/js/tree.js) function in
   the [`tree.js] file.
   ```javascript {.line-numbers}
   // Some code above

   const main = () => {
       const spreadsheetUrl = "https://link/to/your/spreadsheets";
       //Rest of the code goes here
   }
   ```
   Save the changes.

3. Run a local server to serve the files. You can use the following command with Python:
    ```shell
   python -m http.server
    ```
4. Open the web browser and navigate to http://localhost:8000 (or the appropriate address based on your server
   configuration).
5. The prerequisite tree will be displayed based on the data from the spreadsheet.

## Customization

### Preparing the Spreadsheet

To use the Prerequisite Tree tool, you need to prepare a spreadsheet containing the course data. Follow these steps to
prepare the spreadsheet:

1. Create a new spreadsheet using a program like Microsoft Excel or Google Sheets.
2. Create a table to represent the course data. The table should have the following columns:

   | code    | abbr | parent  | children | conditions   | year | term | full name (ENG)                  | credit |
                  |---------|------|---------|----------|--------------|------|------|----------------------------------|--------|
   | CS101   | CS   |         | CS201    |              | 2022 | 1    | Introduction to Computer Science | 3      |
   | CS201   | CS   | CS101   | CS301    |              | 2022 | 2    | Data Structures and Algorithms   | 4      |
   | CS301   | CS   | CS201   |          | CS101        | 2023 | 1    | Software Engineering             | 3      |
   | CS401   | CS   | CS301   |          | CS101, CS201 | 2023 | 2    | Advanced Programming             | 4      |
   | Math101 | MATH |         |          |              | 2022 | 1    | Introduction to Mathematics      | 3      |
   | Math201 | MATH | Math101 |          |              | 2022 | 2    | Calculus                         | 4      |

    - `code`: Represents the course code or identifier.
    - `abbr`: Represents the abbreviation or short form of the course name.
    - `parent`: Represents the parent course code or identifier if there is any.
    - `children`: Represents the child course codes or identifiers if there are any. Use a comma-separated list if there
      are multiple children.
    - `conditions`: Represents any specific conditions or prerequisites for the course.
    - `year`: Represents the academic year in which the course is offered.
    - `term`: Represents the academic term or semester in which the course is offered.
    - `full name (ENG)`: Represents the full name of the course in English.
    - `credit`: Represents the credit value assigned to the course.

3. Fill in the table with the relevant course data, including course codes, names, prerequisites, and descriptions (if
   applicable). Make sure to use the correct course codes for prerequisites to establish the prerequisite relationships
   accurately.
4. Save the spreadsheet and make sure it is accessible online.

Once you have prepared the spreadsheet, you can use it with the Prerequisite Tree tool to generate a graphical
representation of the course prerequisites.

* You can modify the styles in the [tree.css] file to customize the appearance of the prerequisite tree.
* Additional configuration options and functionality can be implemented by modifying the [tree.js] file.

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

[tree.js]: ./docs/js/tree.js

[tree.css]: ./docs/css/tree.css

[screen shot]: ./docs/img/tree_view_screenshot.png