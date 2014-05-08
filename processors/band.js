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
    var idHref = $('a:contains(\'Band info\')').attr('href');
    var id = querystring.parse(idHref.split('?')[1]).band_id;
    var genreLinks = $('a[href*=\'?b_where=s.style\']');
    var genres = [];
    genreLinks.each(function() {
      var genre = processGenre($(this));
      genres.push(genre);
    });

    var albumLinks = $('#disco1 a[href*=\'album.php\']');
    var albums = [];
    albumLinks.each(function() {
      var album = processAlbum($(this));
      albums.push(album);
    });

    self.emit('parse', {
      name: name,
      id: id,
      genres: genres,
      albums: albums
    });
  };

  function processGenre(genreElement) {
    var genreFullName = genreElement.text().trim();
    var href = genreElement.attr('href');
    var query = querystring.parse(href.split('?')[1]);
    var years = genreElement.parent().prev().text().split('-');
    return {
      fullName: genreFullName,
      main: query.b_what,
      prefix: query.prefix,
      startYear: years[0],
      endYear: years[1]
    };
  }

  function processAlbum(albumElement) {
    var albumName = albumElement.text().trim();
    var query = querystring.parse(albumElement.attr('href').split('?')[1]);
    var flavor = albumElement.parent().prev().text().split('|');
    return {
      name: albumName,
      id: query.album_id,
      year: flavor[0].trim(),
      rating: flavor[1].trim(),
      isEP: albumElement.next().text().trim() === '[EP]'
    };
  }
};

util.inherits(BandProcessor, EventEmitter);
module.exports = BandProcessor;
