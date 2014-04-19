var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');

function parseBands(rawHtml, pageNumber) {
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
    var name = band.children().eq(1).text().trim();
    var url = band.children().eq(1).find('a').attr('href');
    var bandId = url.split('=')[1];
    console.log('band: ' + name + ', id: ' + bandId);
  });

  var nextPages = content.find('table').filter(function filter(index, element) {
    var table = $(this);
    return table.text().indexOf('Results:') > -1;
  }).find('a').filter(function(idx, elm) {
    var a = $(this);
    var linkPageNumber = parseInt(a.text());
    return linkPageNumber > pageNumber;
  });

  if (nextPages.length > 0) {
    var nextPage = nextPages.first();
    var url = 'http://metalstorm.net/bands/' + nextPage.attr('href');
    var number = parseInt(nextPage.text());
    console.log(number + ', ' + url);
    setTimeout(downloadBandPage(url, number), 100);
  }
}

var firstBandPage = 'http://metalstorm.net/bands';

function downloadBandPage(url, pageNumber) {
  request(url, function(err, res, html) {
    if(!err) {
      parseBands(html, pageNumber);
    } else {
      console.log('error: ' + err);
    }
  });
}

downloadBandPage(firstBandPage, 1);
