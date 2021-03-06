'use strict';

var expect = require('chai').expect;
var should = require('chai').should();
var bitcore = require('..');
var networks = bitcore.Networks;


describe('Networks', function() {

  var customnet;

  it('should contain all Networks', function() {
    should.exist(networks.livenet);
    should.exist(networks.testnet);
    should.exist(networks.defaultNetwork);
  });

  it('will enable/disable regtest Network', function() {
    networks.enableRegtest();
    networks.testnet.Nid.should.deep.equal(new Buffer('12411000', 'hex'));
    networks.testnet.port.should.equal(12411);
    networks.testnet.dnsSeeds.should.deep.equal([]);
    networks.testnet.regtestEnabled.should.equal(true);

    networks.disableRegtest();
    networks.testnet.Nid.should.deep.equal(new Buffer('11411000', 'hex'));
    networks.testnet.port.should.equal(11411);
    networks.testnet.dnsSeeds.should.deep.equal([


      /*      '127.0.0.1'

           */



    ]);
  });

  it('will get network based on string "regtest" value', function() {
    var network = networks.get('regtest');
    network.should.equal(networks.testnet);
  });

  it('should be able to define a custom Network', function() {
    var custom = {
      name: 'customnet',
      alias: 'mynet',
      pubkeyhash: 0x10,
      privatekey: 0x90,
      scripthash: 0x08,
      MGVU1key: 0x0278b20e,
      MGVL1key: 0x0278ade4,
      Nid: 0xe7beb4d4,
      port: 20001,
      dnsSeeds: [
        'localhost',
        'mynet.localhost'
      ]
    };
    networks.add(custom);
    customnet = networks.get('customnet');
    for (var key in custom) {
      if (key !== 'Nid') {
        customnet[key].should.equal(custom[key]);
      } else {
        var expected = new Buffer('e7beb4d4', 'hex');
        customnet[key].should.deep.equal(expected);
      }
    }
  });

  it('can remove a custom network', function() {
    networks.remove(customnet);
    var net = networks.get('customnet');
    should.equal(net, undefined);
  });

  it('should not set a network map for an undefined value', function() {
    var custom = {
      name: 'somenet',
      pubkeyhash: 0x13,
      privatekey: 0x93,
      scripthash: 0x11,
      MGVU1key: 0x0278b20f,
      MGVL1key: 0x0278ade5,
      Nid: 0xe7beb4d5,
      port: 20008,
      dnsSeeds: [
        'somenet.localhost'
      ]
    };
    networks.add(custom);
    var network = networks.get(undefined);
    should.not.exist(network);
    networks.remove(custom);
  });

  var constants = ['name', 'alias', 'pubkeyhash', 'scripthash', 'MGVU1key', 'MGVL1key'];

  constants.forEach(function(key){
    it('should have constant '+key+' for livenetmgv and testnetmgv', function(){
      networks.testnet.hasOwnProperty(key).should.equal(true);
      networks.livenet.hasOwnProperty(key).should.equal(true);
    });
  });

  it('tests only for the specified key', function() {
    expect(networks.get(0x6f, 'pubkeyhash')).to.equal(networks.testnet);
    expect(networks.get(0x6f, 'privatekey')).to.equal(undefined);
  });

  it('can test for multiple keys', function() {
    expect(networks.get(0x6f, ['pubkeyhash', 'scripthash'])).to.equal(networks.testnet);
    expect(networks.get(0xc4, ['pubkeyhash', 'scripthash'])).to.equal(networks.testnet);
    expect(networks.get(0x6f, ['privatekey', 'port'])).to.equal(undefined);
  });

  it('converts to string using the "name" property', function() {
    networks.livenet.toString().should.equal('livenetmgv');
  });

  it('network object should be immutable', function() {
    expect(networks.testnet.name).to.equal('testnetmgv')
    var fn = function() { networks.testnet.name = 'livenetmgv' }
    expect(fn).to.throw(TypeError)
  });

});
