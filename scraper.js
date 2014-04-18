var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');

var url = 'http://metalstorm.net/bands';

function parseBands(rawHtml) {
  var $ = cheerio.load(rawHtml);
  var content = $('#td_content');
  var bandsTable = content.children().first().find('table.bordercolor2');
  var bands = bandsTable.children();
  if(!bands || bands.length === 0) {
    console.log('no bands found');
  }
  bands.each(function(idx, element) {
    if(idx === 0)
      return;
    var band = $(this);
    console.log(band.children().eq(1).text().trim());
  });
}

request(url, function(err, res, html) {
  if(!err) {
    parseBands(html);
  } else {
    console.log('error: ' + err);
  }
});
