import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix relative imports that don't have .js extension
  content = content.replace(
    /from\s+["'](\.\/.+?)["']/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js') && !importPath.includes('node_modules')) {
        return match.replace(importPath, importPath + '.js');
      }
      return match;
    }
  );
  
  // Fix relative imports with ../ that don't have .js extension
  content = content.replace(
    /from\s+["'](\.\..+?)["']/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js') && !importPath.includes('node_modules')) {
        return match.replace(importPath, importPath + '.js');
      }
      return match;
    }
  );
  
  fs.writeFileSync(filePath, content);
}

function fixImportsInDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImportsInDirectory(filePath);
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  }
}

console.log('Fixing ES module imports...');
fixImportsInDirectory(distDir);
console.log('✅ ES module imports fixed!');
