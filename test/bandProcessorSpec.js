var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var BandProcessor = require('../processors/band.js');

describe('BandProcessor', function() {
  var html = fs.readFileSync('test/periphery.html');
  var bandProcessor;

  beforeEach(function() {
    bandProcessor = new BandProcessor();
  });

  describe('process', function() {
    it('returns the correct band name', function(done) {
      bandProcessor.on('parse', function(bandDetails) {
        expect(bandDetails.name).to.equal('Periphery');
        done();
      });
      bandProcessor.process(html);
    });
  });
});
