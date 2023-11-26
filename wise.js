const fs = require('fs');

const filename = 'Book of Wise Sayings Clouston.html'
const quotes = [];
const authors = [];
var currentName = '';
var currentTag = '';
var currentText = '';
var currentType = 'Unknown';
var collecting = false;

fs.readFileSync(filename).toString().split('\n').forEach(line => {
  const l = line.trim();
  if (l.startsWith('<h3 class="saying_number">')) {
    currentTag = l.replace(/<[^>]*>/g, '');
    collecting = true;
  } else if (l.startsWith('<p class="source">')) {
    const name = l
      .replace(/<[^>]*>/g, '')
      .replace(/,.*/, '');
    currentName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.'’*]/g, '')
      .replace(/[ -]/g, '_')
      .toUpperCase();
    if (authors.filter(a => a.id === currentName).length === 0) {
      authors.push({
        ethnicity: '',
        gender: '',
        id: currentName,
        life: '',
        name: name.replace(/\.$/, ''),
        nationality: '',
      });
    }
  } else if (l === '</div>' && currentText.length > 0 && currentName.length > 0) {
    quotes.push({
      author: currentName,
      number: currentTag.replace(/\.$/, ''),
      source: 'wisesayings',
      tags: [],
      text: currentText.replace(/<[^>]*>/g, '').trim(),
      type: currentType,
    });
    currentText = '';
    currentName = '';
    collecting = false;
  } else if (l.startsWith('<li>') && l.indexOf(':') < 0) {
    const tags = l
      .replace(/<[^>]*>/g, '')
      .replace(/ +/g, ' ')
      .replace(/\.$/, '');
    const tag = tags
      .replace(/[0-9].*/, '')
      .replace(/, $/, '');
    tags
      .replace(tag, '')
      .replace(/^, /, '')
      .split(', ')
      .forEach(t => {
        const quote = quotes.filter(q => q.number === t)[0];
        quote.tags.push(tag);
      });
  } else if (collecting) {
    currentText += l + '\n';
  }
});

fs.writeFileSync('wiseQuotes.json', JSON.stringify(quotes, null, 2));
fs.writeFileSync('wiseAuthors.json', JSON.stringify(authors, null, 2));

