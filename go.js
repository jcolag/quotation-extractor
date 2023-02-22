const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Need a file prefix.');
  process.exit(1);
}

const prefix = process.argv[2];
const quotes = JSON.parse(fs.readFileSync(`${prefix}Quotes.json`));
const authors = JSON.parse(fs.readFileSync(`${prefix}Authors.json`));

const quote = quotes[Math.floor(Math.random() * quotes.length)];
const author = authors.filter((a) => a.id === quote.author)[0];

let size = quote.text.length + author.name.length + 1;

console.log(quote.text);
if (quote.text.indexOf('[') >= 0) {
  const fn = quote.footnotes ? quote.footnotes.join('\n') : '';
  console.log(fn);
  size += fn.length + 1;
}
console.log(author.name);
console.log(size);

