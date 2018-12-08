// Don't actually use this file.  This is a generic "shell"
// to build the quote extraction scripts without needing to
// edit out the book-specific parts for each addition.
const fs = require('fs');

// The following should be an HTML document with at least
// partially-semantic markup, which Project Gutenberg does
// for many of its books.
const filename = 'book.html'

// These will contain the final data points.
const quotes = [];
const authors = [];

// This is intermediate scratch space to eventually fill
// in the final objects.
var currentAuthor = '';
var currentTag = '';
var currentText = '';
var currentType = 'Unknown';

// Modal variables aren't great, but they do the job, here.
var collecting = false;

fs.readFileSync(filename).toString().split('\n').forEach(line => {
  // Use the markup (which is invariably specific to the book) to
  // extract author and/or quote data, when possible, and skip
  // everything else.
  const l = line.trim();
  if (l.startsWith('<h3 class="quotation_class">')) {
    currentTag = l.replace(/<[^>]*>/g, '');
    collecting = true;
  } else if (l.startsWith('<p class="author">')) {
    const name = l
      .replace(/<[^>]*>/g, '')
      .replace(/,.*/, '');
    currentAuthor = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.'’*]/g, '')
      .replace(/[ -]/g, '_')
      .toUpperCase();
    if (authors.filter(a => a.id === currentAuthor).length === 0) {
      authors.push({
        ethnicity: '',
        gender: '',
        id: currentAuthor,
        life: '',
        name: name.replace(/\.$/, ''),
        nationality: '',
      });
    }
  } else if (l === '</div>' && currentText.length > 0 && currentAuthor.length > 0) {
    quotes.push({
      author: currentAuthor,
      number: currentTag.replace(/\.$/, ''),
      source: 'id_for_the_book',
      tags: [],
      text: currentText.replace(/<[^>]*>/g, '').trim(),
      type: currentType,
    });
    currentText = '';
    currentAuthor = '';
    collecting = false;
  } else if (collecting) {
    currentText += l + '\n';
  }
});

fs.writeFileSync('xQuotes.json', JSON.stringify(quotes, null, 2));
fs.writeFileSync('xAuthors.json', JSON.stringify(authors, null, 2));

