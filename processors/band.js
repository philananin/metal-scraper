var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;
var cheerio = require('cheerio');

var BandProcessor = function() {
  var self = this;
  EventEmitter.call(self);

  self.process = function(rawHtml) {
    var $ = cheerio.load(rawHtml);
    var name = $('.page_title').text().trim();
    var genreLinks = $('a[href*=\'?b_where=s.style\']');
    var genres = [];
    genreLinks.each(function() {
      genres.push($(this).text().trim());
    });

    self.emit('parse', {
      name: name,
      genres: genres
    });
  };
};

util.inherits(BandProcessor, EventEmitter);
module.exports = BandProcessor;
