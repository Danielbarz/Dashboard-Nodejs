import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roots = [
  path.join(__dirname, 'client/src'),
  path.join(__dirname, 'server/src')
];

const exts = ['.js', '.jsx', '.ts', '.tsx'];

// Entry points yang pasti dipakai
const whitelist = new Set([
  'client/src/index.js',
  'client/src/App.js',
  'client/src/main.jsx',
  'server/src/index.js',
  'server/src/server.js',
  'server/src/app.js',
]);

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    if (file.name.startsWith('.') || file.name === 'node_modules') continue;
    
    const fullPath = path.join(dir, file.name);
    const relativePath = path.relative(__dirname, fullPath).replaceAll('\\', '/');
    
    if (file.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (exts.includes(path.extname(file.name))) {
      fileList.push(relativePath);
    }
  }
  
  return fileList;
}

function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imports = new Set();
  
  // Match ES6 imports: import ... from '...'
  const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
  // Match require: require('...')
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  while ((match = requireRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  return Array.from(imports);
}

function resolveImportPath(fromFile, importPath) {
  // Skip node_modules and external packages
  if (!importPath.startsWith('.')) return null;
  
  const fromDir = path.dirname(fromFile);
  let resolved = path.join(fromDir, importPath);
  
  // Try exact file
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    return path.relative(__dirname, resolved).replaceAll('\\', '/');
  }
  
  // Try with extensions
  for (const ext of exts) {
    const withExt = `${resolved}${ext}`;
    if (fs.existsSync(withExt)) {
      return path.relative(__dirname, withExt).replaceAll('\\', '/');
    }
  }
  
  // Try index file in directory
  for (const ext of exts) {
    const indexFile = path.join(resolved, `index${ext}`);
    if (fs.existsSync(indexFile)) {
      return path.relative(__dirname, indexFile).replaceAll('\\', '/');
    }
  }
  
  return null;
}

function findUnusedFiles() {
  console.log('🔍 Scanning for unused files...\n');
  
  // Get all project files
  const allFiles = [];
  for (const root of roots) {
    if (fs.existsSync(root)) {
      walkDir(root, allFiles);
    }
  }
  
  console.log(`📁 Total files found: ${allFiles.length}\n`);
  
  // Track which files are imported
  const imported = new Set();
  
  // Scan all files for imports
  for (const file of allFiles) {
    const fullPath = path.join(__dirname, file);
    const imports = extractImports(fullPath);
    
    for (const imp of imports) {
      const resolved = resolveImportPath(fullPath, imp);
      if (resolved) {
        imported.add(resolved);
      }
    }
  }
  
  // Find unused files
  const unused = allFiles.filter(file => 
    !imported.has(file) && !whitelist.has(file)
  );
  
  // Categorize by directory
  const byCategory = {
    'client/components': [],
    'client/pages': [],
    'client/services': [],
    'client/other': [],
    'server/controllers': [],
    'server/routes': [],
    'server/middleware': [],
    'server/other': [],
  };
  
  for (const file of unused) {
    if (file.includes('client/src/components')) {
      byCategory['client/components'].push(file);
    } else if (file.includes('client/src/pages')) {
      byCategory['client/pages'].push(file);
    } else if (file.includes('client/src/services')) {
      byCategory['client/services'].push(file);
    } else if (file.startsWith('client/')) {
      byCategory['client/other'].push(file);
    } else if (file.includes('server/src/controllers')) {
      byCategory['server/controllers'].push(file);
    } else if (file.includes('server/src/routes')) {
      byCategory['server/routes'].push(file);
    } else if (file.includes('server/src/middleware')) {
      byCategory['server/middleware'].push(file);
    } else if (file.startsWith('server/')) {
      byCategory['server/other'].push(file);
    }
  }
  
  // Print results
  console.log('='.repeat(60));
  console.log('🗑️  UNUSED FILES REPORT');
  console.log('='.repeat(60));
  console.log();
  
  let totalUnused = 0;
  
  for (const [category, files] of Object.entries(byCategory)) {
    if (files.length === 0) continue;
    
    console.log(`\n📂 ${category.toUpperCase()} (${files.length} files):`);
    console.log('-'.repeat(60));
    
    files.forEach(file => {
      console.log(`  ❌ ${file}`);
      totalUnused++;
    });
  }
  
  console.log();
  console.log('='.repeat(60));
  console.log(`📊 Summary: ${totalUnused} unused files out of ${allFiles.length} total files`);
  console.log('='.repeat(60));
  
  // Generate delete commands
  if (totalUnused > 0) {
    console.log('\n💡 To delete these files, run:');
    console.log('-'.repeat(60));
    
    const allUnused = Object.values(byCategory).flat();
    allUnused.forEach(file => {
      console.log(`git rm "${file}"`);
    });
    
    console.log('\n# Or delete all at once:');
    const fileList = allUnused.map(f => `"${f}"`).join(' ');
    console.log(`git rm ${fileList}`);
  }
}

findUnusedFiles();