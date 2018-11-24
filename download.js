const fs = require('fs');
const https = require('https');

const urlPrefix = 'https://www.gutenberg.org/files/';
const fileType = '.html';
const books = [
  { name: 'Familiar Quotations 9e John Bartlett', url: '27889/27889-h/27889-h.htm' },
];

books.forEach(book => {
  https.get(`${urlPrefix}${book.url}`, (resp) => {
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
