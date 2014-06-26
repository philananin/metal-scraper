var util = require('util');
var events = require('events');
var querystring = require('querystring');
var EventEmitter = events.EventEmitter;
var cheerio = require('cheerio');

var AlbumProcessor = function() {
  var self = this;
  EventEmitter.call(self);

  self.process = function(rawHtml) {
    var $ = cheerio.load(rawHtml);
    var name = $('div.page_title').text().trim();
    var idHref = $('a:contains(\'Edit album\')').attr('href');
    var id = querystring.parse(idHref.split('?')[1]).album_id;
    var ratingBox = $('span[id^=\'rating_box\']');
    var rating = ratingBox.children().find('a').text();
    var votesRegex = /(\d+)\svotes/;
    var votes = ratingBox.text().trim().match(votesRegex)[1];
    self.emit('parse', {
        id: id,
        name: name,
        rating: {
            value: rating,
            votes: votes
        }
    });
  };
};

util.inherits(AlbumProcessor, EventEmitter);
module.exports = AlbumProcessor;
