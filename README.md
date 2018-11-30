# quotation-extractor
Scripts to generate quotation lists that are both exclusively free culture and machine-readable

This repository is...probably _not_ going to save the world.  However, I like to use the occasional quotation in header material for headers in writing, plus I try to throw something onto [Twitter](https://twitter.com/jcolag) every weekday.  Trying to be diligent about copyrights, though, makes it difficult to use conventional sources, so this set of scripts is (the start of) an attempt to build a quotation collection from Free Culture sources, whether public domain or under a public license.

The bulk of this, certainly the easiest to automate, will involve downloading books of quotations from [Project Gutenberg](https://www.gutenberg.org) and scraping through the files for what we want.  I expect the final result to be JSON files with entries that look something like the following.

```JSON
{
  "author": "EDMUND_SPENSER",
  "source": "bartlett9e",
  "text": "I was promised on a time\rTo have reason for my rhyme;\rFrom that time unto this season,\rI received nor rhyme nor reason.[30:3]\rLines on his Promised Pension.[30:4]",
  "type": "Poetry",
  "footnotes": [
    "[30:4] Fuller: Worthies of England, vol. ii. p. 379."
  ]
},
```

I will publish the final collection of quotations when it starts shaping up.

