# Prerequisite Tree

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AppleBoiy_prerequisite-tree&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AppleBoiy_prerequisite-tree) [![Qodana](https://github.com/AppleBoiy/prerequisite-tree/actions/workflows/code_quality.yml/badge.svg)](https://github.com/AppleBoiy/prerequisite-tree/actions/workflows/code_quality.yml)

<img src="./docs/img/tree_view_screenshot.png" width="1000" alt="">

> The Prerequisite Tree tool allows users to visualize and explore the prerequisite relationships between different courses. It fetches course data from a google spreadsheet, converts it into a JSON format, and generates a tree view using the [dagreD3] library.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Update](#update)
- [Wiki](#wiki)
- [Getting Started](https://github.com/AppleBoiy/prerequisite-tree/wiki/Getting-Started)
- [Customization]https://github.com/AppleBoiy/prerequisite-tree/wiki/Customization)
- [Special Thanks](#special-thanks)
- [License](#license)

## Overview

The Prerequisite Tree tool allows users to visualize and explore the prerequisite relationships between different
courses. It fetches course data from a [Google Sheets], converts it into a JSON format, and generates a tree view
using the [dagreD3] library. Users can hover over nodes to view prerequisite details and navigate the tree to understand
the course dependencies.

## Features

- Converts a [Google Sheets] to JSON format
- Generates an interactive prerequisite tree view
- Highlights and provides details of course prerequisites on mouse hover
- Supports customization of node colors and styles

## Update
### June 2023
In response to user feedback and to improve the readability and maintainability of the upgrade script, several enhancements have been made:

Refactored variable names to be shorter and more meaningful, improving code clarity.
Added fading out of lines that are not related to the node when the mouse is hovering over it or when the node is clicked.
Extracted the logic inside the edgesList.forEach loop into a separate function for better code organization.
Introduced new functions to handle node highlighting, edge opacity manipulation, and event handling.
Updated the documentation in the [README.md](README.md) to reflect the changes made and provide clear instructions on using the upgraded script.
These changes aim to make the upgrade script more flexible, readable, and easier to maintain.

For more details, please see the [pull request](https://github.com/AppleBoiy/prerequisite-tree/pull/84) that implements these improvements.

## Wiki

You can access our wiki by visiting [wiki]. It contains valuable information We encourage you to explore our wiki to learn more about our project and get the most out of it. If you have any
questions or suggestions, feel free to contribute to the wiki or reach out to our team.

## Special Thanks

Special thanks to [dagreD3], [D3.js], and [SheetJS] for providing the libraries and tools that make this educational
tool possible.

A heartfelt thank you to all the contributors who have made this project possible through their valuable contributions. Your time, effort, and expertise are greatly appreciated. Thank you for helping to make this project better with each contribution.

We would like to extend our gratitude to the following contributors:

- [Rachata Thananchai](https://github.com/Meaww2)
- [JaMas](https://github.com/PrakitJm)

Your contributions have played a significant role in improving the project, and we are grateful for your support.


## License

This project is licensed under the [MIT License](LICENSE).


[dagreD3]: https://github.com/dagrejs/dagre-d3
[D3.js]: https://d3js.org
[SheetJS]: https://sheetjs.com

[Node.js]: https://nodejs.org/en
[Python]: https://www.python.org

[wiki]: https://github.com/AppleBoiy/prerequisite-tree/wiki/Home/
[Google Sheets]: https://docs.google.com/spreadsheets

[tree.js]: docs/js/tree.js
[tree.css]: docs/css/tree.css
