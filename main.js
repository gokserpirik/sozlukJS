const readline = require('readline');


const cheerio = require('cheerio'); /* import this before use */
const request = require('request'); /* import this before use */
const fs = require('fs');


const url = 'https://eksisozluk.com/m/debe'; /* link of website */
let debe = [];
let debelinks = [];

function deleteNewlines(text) {
    return text.replace(/\n/g, '').replace(/\s{2,}/g, ' '); /* solves the first error of getting '\n's inside text */
  }

  function deleteBRlines(text) {
    return text.replace('<br>', '\n');
  }

request(url, (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    // Find all span elements with the 'rdf-meta' class
    const elements = $('ul.topic-list');
    const lis = elements.find('li');



    lis.each((i, li) => {
      // Within each li element, select the a element
      const a = $(li).find('a');
    
      // Get the href attribute of the a element
      const href = a.attr('href');
    
      /* solve of a simple error:
        it was listing many of the links in the page, not only the entries.
      */
    if (href !== undefined && href.includes("entry")) {
        debe.push(deleteNewlines(a.text()));
        debelinks.push('https://eksisozluk.com' + href);
    } else {}

    }

    );

console.log(debe);

/* to get the content of given entry  */
function getContent(url) {
    request(url, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const content = $('.content').text();

        console.log(content);
        console.log('source: ' + url);



      }
    });
  }

  /* allows input from users */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    /* allows completion when user just wrote some of the text */
    completer: function(line) {
      const completions = debe;
      const hits = completions.filter((c) => c.startsWith(line));
      // show all completions if none found
      return [hits.length ? hits : completions, line];
    }

  });


  
  rl.question('choose entry you want \n PS: Tab sometimes does not work but works after that. You can just click tab once, once the app is open. \n ', (name) => {

    getContent(debelinks[debe.indexOf(name)]);
    rl.close();
  });




}});

