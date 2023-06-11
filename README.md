# Prerequisite Tree [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=AppleBoiy_prerequisite-tree&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=AppleBoiy_prerequisite-tree)

This is a prerequisite tree generator that converts a spreadsheet containing course data into a graphical representation of the course prerequisites. It utilizes the `dagreD3` library to generate the tree view.

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- Modern web browser with SVG support

### Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/your-username/prerequisite-tree.git
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
2. Provide the URL of the spreadsheet in the spreadsheetUrl variable inside the main function in the script.js file.
Save the changes.
3. Run a local server to serve the files. You can use the following command with Python:
    ```shell
   python -m http.server
    ```
4. Open the web browser and navigate to http://localhost:8000 (or the appropriate address based on your server configuration).
5. The prerequisite tree will be displayed based on the data from the spreadsheet.

### Customization

* You can modify the styles in the `style.css` file to customize the appearance of the prerequisite tree.
* Additional configuration options and functionality can be implemented by modifying the `script.js` file.
Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please open an issue or submit a pull request.

## License

This project is licensed under the [Apache License](LICENSE).
