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

  bands.each(function(index) {
    if(index === 0)
      return;
    var band = $(this).children().eq(1); // second child td
    var name = band.text().trim();
    var url = band.find('a').attr('href');
    var bandId = url.split('=')[1];
    console.log('band: ' + name + ', id: ' + bandId);
  });

  function getNextPage(content, currentPageNumber) {
    function isResultsTable(index, element) {
      var table = $(this);
      return table.text().indexOf('Results:') > -1;
    }

    function pageNumberGreaterThanCurrent(idx, elm) {
      var a = $(this);
      var linkPageNumber = parseInt(a.text());
      return linkPageNumber > currentPageNumber;
    }

    var nextPages = content
    .find('table')
    .filter(isResultsTable)
    .find('a')
    .filter(pageNumberGreaterThanCurrent);

    if (nextPages.length > 0) {
      return nextPages.first();
    }
  }

  var nextPage = getNextPage(content, pageNumber);
  if(nextPage) {
    var url = 'http://metalstorm.net/bands/' + nextPage.attr('href');
    var number = parseInt(nextPage.text());
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
