const fs = require('fs');

const filename = 'Familiar Quotations 9e John Bartlett.html';
const quotes = [];
const authors = [];
const footnotes = {};
var currentName = '';
var currentTag = '';
var currentText = '';
var currentType = 'Unknown';
var currentFootnote = '';
var collecting = false;

fs.readFileSync(filename).toString().split('\n').forEach(l => {
  if (l.startsWith('<h3><a name=')) {
    const nd = currentName.split('.  ');
    currentName = l.toLowerCase()
      .replace(/<h3><a name="[^"]*" id="[^"]*"><\/a>/g, '')
      .replace(/<\/h3>/g, '')
      .replace(/&emsp;/g, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\[[^\]]*\]/, '')
      .replace(/&mdash;/g, '--')
      .replace(/&aacute;/g, 'á')
      .replace(/&aelig;/g, 'æ')
      .replace(/&agrave;/g, 'à')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&eacute;/g, 'é')
      .replace(/&egrave;/g, 'è')
      .replace(/&uuml;/g, 'ü')
      .replace(/\b\S*/g, (s) => s.charAt(0).toUpperCase() + s.substr(1))
      .replace(' And', ' and')
      .replace(' Of', ' of')
      .trim();
    if (currentTag.length > 0) {
      authors.push({
        ethnicity: '',
        gender: '',
        id: currentTag,
        life: nd.length > 1
          ? nd[1].replace(/\.$/, '')
          : '',
        name: nd[0],
        nationality: '',
      });
    }
    currentText = '';
    currentTag = l.split('"')[1];
    collecting = false;
  } else if (l.startsWith('<div class="poem"><div class="stanza">')) {
    currentText = '';
    currentType = 'Poetry';
    collecting = true;
  } else if (l.startsWith('<div class="blockquot"><p>')) {
    currentText = l.replace('<div class="blockquot"><p>', '');
    currentType = 'Text';
    collecting = true;
  } else if (l.startsWith('<div class="fn"><p><a name="Fn_')) {
    currentFootnote = l
      .replace(/.*<span class="lb">/, '')
      .replace(/<\/span>.*/, '')
      .replace(/<[^>]*>/g, '')
      .trim();
    currentText = l.replace(/.*<\/span class="lb">[^<]*<\/span><\/a>/, '');
    currentType = 'Footnote';
    collecting = true;
  } else if (l.trim() === '' && currentText.trim() !== '' && currentName.trim() !== '') {
    currentText = currentText
      .replace(/<[^>]*>/g, '')
      .replace(/&#(\d+);/g, (match, code) => String.fromCharCode(code))
      .replace(/&AElig;/g, 'Æ')
      .replace(/&Eacute;/g, 'É')
      .replace(/&OElig;/g, 'Œ')
      .replace(/&aacute;/g, 'á')
      .replace(/&acirc;/g, 'â')
      .replace(/&aelig;/g, 'æ')
      .replace(/&agrave;/g, 'à')
      .replace(/&auml;/g, 'ä')
      .replace(/&ccedil;/g, 'ç')
      .replace(/&eacute;/g, 'é')
      .replace(/&ecirc;/g, 'ê')
      .replace(/&egrave;/g, 'è')
      .replace(/&emsp;/g, ' ')
      .replace(/&euml;/g, 'ë')
      .replace(/&icirc;/g, 'î')
      .replace(/&iuml;/g, 'ï')
      .replace(/&mdash;/g, '—')
      .replace(/&nbsp;/g, ' ')
      .replace(/&oelig;/g, 'œ')
      .replace(/&sect;/g, '§')
      .replace(/&THORN;/g, 'Þ')
      .replace(/&uacute;/g, 'ú')
      .replace(/&ucirc;/g, 'û')
      .replace(/&ugrave;/g, 'ù')
      .replace(/&uuml;/g, 'ü')
      .trim()
    if (currentText.startsWith('[') && currentText.endsWith(']')) {
      return;
    }

    if (currentFootnote.length > 0) {
      const note = footnotes[currentFootnote];
      if (note.quote) {
        if (!Object.prototype.hasOwnProperty.call(note.quote, 'footnotes')) {
          note.quote.footnotes = [];
        }
        note.quote.footnotes.push(currentText);
      } else {
        const author = authors[authors.length - 1];
        if (!Object.prototype.hasOwnProperty.call(author, 'footnotes')) {
          author.footnotes = [];
        }
        author.footnotes.push(currentText);
      }
    } else {
      const quote = {
        author: currentTag,
        source: 'bartlett9e',
        text: currentText,
        type: currentType,
      }
      Object.keys(footnotes).forEach(fn => {
        if (currentText.indexOf(fn) >= 0) {
          footnotes[fn].quote = quote;
        }
      });
      quotes.push(quote);
    }
    collecting = false;
    currentFootnote = '';
    currentText = '';
  } else if (collecting) {
    currentText += l;
  }

  l.split('"#').forEach((candidate) => {
    if (candidate.startsWith('Fn_')) {
      let fn = candidate
        .replace(/".*/, '')
        .replace(/Fn_/, '')
        .replace('-', ':')
        .trim();
      if (fn.length > 0) {
        fn = `[${fn}]`;
        footnotes[fn] = {
          quote: null,
          ref: fn,
        };
      }
    }
  });
});

fs.writeFileSync('bart9eQuotes.json', JSON.stringify(quotes, null, 2));
fs.writeFileSync('bart9eAuthors.json', JSON.stringify(authors, null, 2));

