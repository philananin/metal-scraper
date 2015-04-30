var util = require('util');
var BandListProcessor = require('./processors/bandlist.js');
var BandProcessor = require('./processors/band.js');
var AlbumProcessor = require('./processors/album.js');
var Downloader = require('./utils/downloader.js');

var done = false; // i don't want to spam the site for now, so just download one band
var bandListProcessor = new BandListProcessor();
bandListProcessor.on('parse', function(band) {
  if(!done) {
    downloader.downloadBand(band.id);
    done = true;
  }
});

var bandProcessor = new BandProcessor();
bandProcessor.on('parse', function(bandDetails) {
  console.log('band: ' + bandDetails.name + ', id: ' + bandDetails.id);
  bandDetails.genres.forEach(function(genre) {
    console.log(util.format('genre: %s, prefix: %s, start: %s, end: %s',
                          genre.main, genre.prefix, genre.startYear,
                          genre.endYear));
  });
  bandDetails.albums.forEach(function(album) {
    downloader.downloadAlbum(album.id);
  });
});

var albumProcessor = new AlbumProcessor();
albumProcessor.on('parse', function(album) {
  console.log(util.format('album name: %s, id: %s, rating: %s (%s votes)',
                        album.name, album.id, album.rating.value,
                        album.rating.votes));
});

var downloader = new Downloader();
downloader.on('bandListDownloaded', function(rawHtml) {
  bandListProcessor.process(rawHtml);
});
downloader.on('bandDownloaded', function(rawHtml) {
  bandProcessor.process(rawHtml);
});
downloader.on('albumDownloaded', function(rawHtml) {
  albumProcessor.process(rawHtml);
});

var totalBandPages = 1; // todo
for(var page = 1; page <= totalBandPages; page++) {
  downloader.downloadBandList(page);
}
