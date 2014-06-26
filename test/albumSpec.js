var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var Album = require('../processors/album.js');

describe('BandList', function() {
  var html = fs.readFileSync('test/album.html', {encoding: 'utf-8'});
  var album;

  beforeEach(function() {
    album = new Album();
  });

  describe('process', function() {
    it('extracts the expected album details', function(done) {
      var expected = {
        id: '54947',
        name: 'Periphery - Periphery II: This Time It\'s Personal',
        rating: {
            value: '8.2',
            votes: '115'
        }
      };

      album.on('parse', function(actual) {
        expect(actual).to.deep.equal(expected);
        done();
      });

      album.process(html);
    });
  });
});
