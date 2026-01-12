import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dashboardControllerPath = path.join(__dirname, 'src/controllers/dashboardController.js');
const tempControllerPath = path.join(__dirname, 'temp_controller_fix_v2.js');

try {
  let dashboardContent = fs.readFileSync(dashboardControllerPath, 'utf8');
  const tempContent = fs.readFileSync(tempControllerPath, 'utf8');

  // Find start by comment
  const commentMarker = '// Get Report Tambahan (JT/Jaringan Tambahan) - from SPMK MOM data';
  const commentIndex = dashboardContent.indexOf(commentMarker);

  if (commentIndex === -1) {
    throw new Error('Could not find Get Report Tambahan comment');
  }

  // Find 'export' keyword after comment
  const exportIndex = dashboardContent.indexOf('export', commentIndex);
  if (exportIndex === -1) {
     throw new Error('Could not find export keyword');
  }

  const startIndex = exportIndex;

  // Find end of getReportTambahan
  const endMarker = '// Get Report Datin - from SPMK MOM data';
  const endIndex = dashboardContent.indexOf(endMarker, startIndex);

  if (endIndex === -1) {
    throw new Error('Could not find getReportTambahan function end');
  }

  // Determine the exact cut point.
  let cutIndex = endIndex;
  while (cutIndex > startIndex && dashboardContent[cutIndex] !== '}') {
    cutIndex--;
  }
  cutIndex++;

  // Prepare new function string
  let newFunction = tempContent;
  if (!newFunction.startsWith('export ')) {
    newFunction = 'export ' + newFunction;
  }

  const newContent = dashboardContent.slice(0, startIndex) + newFunction + '\n\n' + dashboardContent.slice(endIndex);

  fs.writeFileSync(dashboardControllerPath, newContent, 'utf8');
  console.log('Successfully updated dashboardController.js with fixed sorting logic');

} catch (error) {
  console.error('Error updating controller:', error);
  process.exit(1);
}
