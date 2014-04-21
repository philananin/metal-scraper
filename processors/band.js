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
    self.emit('parse', {
      name: name
    });
  };
};

util.inherits(BandProcessor, EventEmitter);
module.exports = BandProcessor;
