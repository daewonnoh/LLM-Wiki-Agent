const fs = require('fs');
const content = fs.readFileSync('src/data/manuscript.js', 'utf8');

const footnotesMap = {};
content.split('\n').forEach(line => {
  const match = line.match(/^\[\^(\d+)\]:\s*(.*)/);
  if (match) {
    footnotesMap[match[1]] = match[2].trim().replace(/"/g, '&quot;');
  }
});

console.log('Keys in map:', Object.keys(footnotesMap).length);
console.log('Sample key 25:', footnotesMap['25']);

const result = '이 텍스트는 [^25] 입니다.'.replace(/\[\^(\d+)\](?!:)/g, (match, p1) => {
  const title = footnotesMap[p1] ? footnotesMap[p1] : '';
  return `<sup class="footnote-ref" title="${title}">[${p1}]</sup>`;
});
console.log('Result:', result);
