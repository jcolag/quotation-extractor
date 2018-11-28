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
  { name: 'Dictionary of Quotations Rev James Wood', url: '48105/48105-h/48105-h.htm' },
  { name: 'Familiar Quotations 1e John Bartlett', url: '16732/16732-h/16732-h.htm' },
  { name: 'Book of Wise Sayings Clouston', url: '21130/21130-h/21130-h.htm' },
  { name: 'Memorabilia Mathematica Moritz', url: '44730/44730-h/44730-h.htm' },
  {
    name: 'Handy Dictionary of Poetical Quotations George Powers',
    url: '15119/15119-h/15119-h.htm'
  },
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

  // Busy-waiting is dumb, but for a one-off script that wants to
  // avoid hammering Project Gutenberg's servers, it's sufficient
  // to handle the rate-limiting.
  let until = new Date(new Date().getTime() + 2500);
  while (until > new Date()) {}
});
