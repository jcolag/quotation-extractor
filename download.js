const fs = require('fs');
const https = require('https');

const urlPrefix = 'https://www.gutenberg.org/files/';
const fileType = '.html';
const books = [
  // This could easily get away with just storing the book ID, as
  // in "27889" for Bartlett's quotations, but since I'll need to
  // reference the HTML files for each extraction process (the
  // layouts are not remotely consistent, of course), knowing which
  // is which is going to be helpful.
  { name: 'Familiar Quotations 9e John Bartlett', url: '27889/27889-h/27889-h.htm' },
];

books.forEach(book => {
  https.get(`${urlPrefix}${book.url}`, (resp) => {
    // For reference, this is specifically downloading the HTML
    // editions of each book because those generally have enough
    // semantic markup to make parsing easier.
    let page = '';
    resp.on('data', (next) => {
      page += next;
    });
    resp.on('end', () => {
      fs.writeFileSync(`${book.name}${fileType}`, page);
    });
  }).on('error', (ex) => {
    console.log(`Error: ${ex.message}`);
  });
});
