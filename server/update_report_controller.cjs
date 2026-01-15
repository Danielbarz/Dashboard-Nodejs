

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'controllers', 'reportController.js');
let content = fs.readFileSync(filePath, 'utf8');

// Using the actual comment found in the file
const startMarker = '// Get Report HSI - from HSI data table';
const endMarker = '// Get Report Details - Detailed list';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error(`Markers not found! Start: ${startIndex}, End: ${endIndex}`);
    process.exit(1);
}

// Read the clean code fragment (fetchHSIReportData + getReportHSI, NO export)
const newCode = fs.readFileSync(path.join(__dirname, 'report_controller_clean.js'), 'utf8');

const updatedContent = content.substring(0, startIndex) + newCode + '\n\n' + content.substring(endIndex);
fs.writeFileSync(filePath, updatedContent);
console.log('Successfully updated reportController.js');
