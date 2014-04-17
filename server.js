var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');

var url = 'http://metalstorm.net/bands/band.php?band_id=13&bandname=Opeth';

request(url, function(err, res, html) {
  if(!err) {
    var $ = cheerio.load(html);
    var bandname = $('.page_title');
    console.log('band: ' + bandname);
  } else {
    console.log('error');
  }
});
