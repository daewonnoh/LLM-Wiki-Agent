const fs = require('fs');

try {
  const mdPath = 'F:\\내 드라이브\\!LLM Wiki_AI와 문학 연구\\Papers\\2026-05-24-트러블과함께읽기-대원(학회 양식).md';
  const jsPath = 'C:\\Users\\naisd\\.gemini\\antigravity\\scratch\\literature-research-web\\src\\data\\manuscript.js';
  
  let content = fs.readFileSync(mdPath, 'utf8');
  content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  const jsContent = 'export const manuscriptText = `' + content + '`;\n';
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log('Successfully updated manuscript.js');
} catch (e) {
  console.error('Error:', e);
}
