var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;
var cheerio = require('cheerio');

var BandListProcessor = function() {
  var self = this;
  EventEmitter.call(self);

  self.process = function(rawHtml) {
    var $ = cheerio.load(rawHtml);
    var content = $('#td_content');
    var bandsTable = content.children().first().find('table.bordercolor2');
    var bands = bandsTable.children();

    bands.each(function(index) {
      if(index === 0)
        return;
      var band = $(this).children().eq(1); // second child td
      var name = band.text().trim();
      var url = band.find('a').attr('href');
      var bandId = url.split('=')[1];
      self.emit('parse', {
        name: name,
        url: url,
        id: bandId
      });
    });
    self.emit('done');
  };
};

util.inherits(BandListProcessor, EventEmitter);
module.exports = BandListProcessor;
