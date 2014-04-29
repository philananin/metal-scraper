var util = require('util');
var querystring = require('querystring');
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
      var genre = processGenre($(this));
      genres.push(genre);
    });

    self.emit('parse', {
      name: name,
      genres: genres
    });
  };

  function processGenre(genreElement) {
    var genreFullName = genreElement.text().trim();
    var href = genreElement.attr('href');
    var query = querystring.parse(href.split('?')[1]);
    return {
      fullName: genreFullName,
      main: query.b_what,
      prefix: query.prefix
    };
  }
};

util.inherits(BandProcessor, EventEmitter);
module.exports = BandProcessor;
