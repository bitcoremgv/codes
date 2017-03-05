'use strict';

/* jshint unused: false */
var _ = require('lodash');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;
var bitcore = require('..');
var buffer = require('buffer');
var errors = bitcore.errors;
var hdErrors = bitcore.errors.HDPublicKey;
var BufferUtil = bitcore.util.buffer;
var HDPrivateKey = bitcore.HDPrivateKey;
var HDPublicKey = bitcore.HDPublicKey;
var Base58Check = bitcore.encoding.Base58Check;
var Networks = bitcore.Networks;

var MGVL1key = 'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi';
var MGVU1key = 'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8';
var MGVU1keytestnet = 'tpubD6NzVbkrYhZ4WZaiWHz59q5EQ61bd6dUYfU4ggRWAtNAyyYRNWT6ktJ7UHJEXURvTfTfskFQmK7Ff4FRkiRN5wQH8nkGAb6aKB4Yyeqsw5m';
var json = '{"network":"livenetmgv","depth":0,"fingerPrint":876747070,"parentFingerPrint":0,"childIndex":0,"chainCode":"873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508","publicKey":"0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2","checksum":-1421395167,"MGVU1key":"xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8"}';
var derived_0_1_200000 = 'xpub6BqyndF6rkBNTV6LXwiY8Pco8aqctqq7tGEUdA8fmGDTnDJphn2fmxr3eM8Lm3m8TrNUsLbEjHvpa3adBU18YpEx4tp2Zp6nqax3mQkudhX';

describe('HDPublicKey interface', function() {

  var expectFail = function(func, errorType) {
    (function() {
      func();
    }).should.throw(errorType);
  };

  var expectDerivationFail = function(argument, error) {
    (function() {
      var pubkey = new HDPublicKey(MGVU1key);
      pubkey.derive(argument);
    }).should.throw(error);
  };

  var expectFailBuilding = function(argument, error) {
    (function() {
      return new HDPublicKey(argument);
    }).should.throw(error);
  };

  describe('creation formats', function() {

    it('returns same argument if already an instance of HDPublicKey', function() {
      var publicKey = new HDPublicKey(MGVU1key);
      publicKey.should.equal(new HDPublicKey(publicKey));
    });

    it('returns the correct MGVU1key for a MGVL1key', function() {
      var publicKey = new HDPublicKey(MGVL1key);
      publicKey.MGVU1key.should.equal(MGVU1key);
    });

    it('allows to call the argument with no "new" keyword', function() {
      HDPublicKey(MGVU1key).MGVU1key.should.equal(new HDPublicKey(MGVU1key).MGVU1key);
    });

    it('fails when user doesn\'t supply an argument', function() {
      expectFailBuilding(null, hdErrors.MustSupplyArgument);
    });

    it('should not be able to change read-only properties', function() {
      var publicKey = new HDPublicKey(MGVL1key);
      expect(function() {
        publicKey.fingerPrint = 'notafingerprint';
      }).to.throw(TypeError);
    });

    it('doesn\'t recognize an invalid argument', function() {
      expectFailBuilding(1, hdErrors.UnrecognizedArgument);
      expectFailBuilding(true, hdErrors.UnrecognizedArgument);
    });


    describe('MGVU1key string serialization errors', function() {
      it('fails on invalid length', function() {
        expectFailBuilding(
          Base58Check.encode(new buffer.Buffer([1, 2, 3])),
          hdErrors.InvalidLength
        );
      });
      it('fails on invalid base58 encoding', function() {
        expectFailBuilding(
          MGVU1key + '1',
          errors.InvalidB58Checksum
        );
      });
      it('user can ask if a string is valid', function() {
        (HDPublicKey.isValidSerialized(MGVU1key)).should.equal(true);
      });
    });

    it('can be generated from a json', function() {
      expect(new HDPublicKey(JSON.parse(json)).MGVU1key).to.equal(MGVU1key);
    });

    it('can generate a json that has a particular structure', function() {
      assert(_.isEqual(
        new HDPublicKey(JSON.parse(json)).toJSON(),
        new HDPublicKey(MGVU1key).toJSON()
      ));
    });

    it('builds from a buffer object', function() {
      (new HDPublicKey(new HDPublicKey(MGVU1key)._buffers)).MGVU1key.should.equal(MGVU1key);
    });

    it('checks the checksum', function() {
      var buffers = new HDPublicKey(MGVU1key)._buffers;
      buffers.checksum = BufferUtil.integerAsBuffer(1);
      expectFail(function() {
        return new HDPublicKey(buffers);
      }, errors.InvalidB58Checksum);
    });
  });

  describe('error checking on serialization', function() {
    var compareType = function(a, b) {
      expect(a instanceof b).to.equal(true);
    };
    it('throws invalid argument when argument is not a string or buffer', function() {
      compareType(HDPublicKey.getSerializedError(1), hdErrors.UnrecognizedArgument);
    });
    it('if a network is provided, validates that data corresponds to it', function() {
      compareType(HDPublicKey.getSerializedError(MGVU1key, 'testnetmgv'), errors.InvalidNetwork);
    });
    it('recognizes invalid network arguments', function() {
      compareType(HDPublicKey.getSerializedError(MGVU1key, 'invalid'), errors.InvalidNetworkArgument);
    });
    it('recognizes a valid network', function() {
      expect(HDPublicKey.getSerializedError(MGVU1key, 'livenetmgv')).to.equal(null);
    });
  });

  it('toString() returns the same value as .MGVU1key', function() {
    var pubKey = new HDPublicKey(MGVU1key);
    pubKey.toString().should.equal(pubKey.MGVU1key);
  });

  it('publicKey property matches network', function() {
    var livenet = new HDPublicKey(MGVU1key);
    var testnet = new HDPublicKey(MGVU1keytestnet);

    livenet.publicKey.network.should.equal(Networks.livenet);
    testnet.publicKey.network.should.equal(Networks.testnet);
  });

  it('inspect() displays correctly', function() {
    var pubKey = new HDPublicKey(MGVU1key);
    pubKey.inspect().should.equal('<HDPublicKey: ' + pubKey.MGVU1key + '>');
  });

  describe('conversion to/from buffer', function() {

    it('should roundtrip to an equivalent object', function() {
      var pubKey = new HDPublicKey(MGVU1key);
      var toBuffer = pubKey.toBuffer();
      var fromBuffer = HDPublicKey.fromBuffer(toBuffer);
      var roundTrip = new HDPublicKey(fromBuffer.toBuffer());
      roundTrip.MGVU1key.should.equal(MGVU1key);
    });
  });

  describe('conversion to different formats', function() {
    var plainObject = {
      'network':'livenetmgv',
      'depth':0,
      'fingerPrint':876747070,
      'parentFingerPrint':0,
      'childIndex':0,
      'chainCode':'873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
      'publicKey':'0339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2',
      'checksum':-1421395167,
      'MGVU1key':'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8'
    };
    it('roundtrips to JSON and to Object', function() {
      var pubkey = new HDPublicKey(MGVU1key);
      expect(HDPublicKey.fromObject(pubkey.toJSON()).MGVU1key).to.equal(MGVU1key);
    });
    it('recovers state from Object', function() {
      new HDPublicKey(plainObject).MGVU1key.should.equal(MGVU1key);
    });
  });

  describe('derivation', function() {
    it('derivation is the same whether deriving with number or string', function() {
      var pubkey = new HDPublicKey(MGVU1key);
      var derived1 = pubkey.derive(0).derive(1).derive(200000);
      var derived2 = pubkey.derive('m/0/1/200000');
      derived1.MGVU1key.should.equal(derived_0_1_200000);
      derived2.MGVU1key.should.equal(derived_0_1_200000);
    });

    it('allows special parameters m, M', function() {
      var expectDerivationSuccess = function(argument) {
        new HDPublicKey(MGVU1key).derive(argument).MGVU1key.should.equal(MGVU1key);
      };
      expectDerivationSuccess('m');
      expectDerivationSuccess('M');
    });

    it('doesn\'t allow object arguments for derivation', function() {
      expectFail(function() {
        return new HDPublicKey(MGVU1key).derive({});
      }, hdErrors.InvalidDerivationArgument);
    });

    it('needs first argument for derivation', function() {
      expectFail(function() {
        return new HDPublicKey(MGVU1key).derive('s');
      }, hdErrors.InvalidPath);
    });

    it('doesn\'t allow other parameters like m\' or M\' or "s"', function() {
      /* jshint quotmark: double */
      expectDerivationFail("m'", hdErrors.InvalidIndexCantDeriveHardened);
      expectDerivationFail("M'", hdErrors.InvalidIndexCantDeriveHardened);
      expectDerivationFail("1", hdErrors.InvalidPath);
      expectDerivationFail("S", hdErrors.InvalidPath);
    });

    it('can\'t derive hardened keys', function() {
      expectFail(function() {
        return new HDPublicKey(MGVU1key).derive(HDPublicKey.Hardened);
      }, hdErrors.InvalidIndexCantDeriveHardened);
    });

    it('can\'t derive hardened keys via second argument', function() {
      expectFail(function() {
        return new HDPublicKey(MGVU1key).derive(5, true);
      }, hdErrors.InvalidIndexCantDeriveHardened);
    });

    it('validates correct paths', function() {
      var valid;

      valid = HDPublicKey.isValidPath('m/123/12');
      valid.should.equal(true);

      valid = HDPublicKey.isValidPath('m');
      valid.should.equal(true);

      valid = HDPublicKey.isValidPath(123);
      valid.should.equal(true);
    });

    it('rejects illegal paths', function() {
      var valid;

      valid = HDPublicKey.isValidPath('m/-1/12');
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath("m/0'/12");
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath("m/8000000000/12");
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath('bad path');
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath(-1);
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath(8000000000);
      valid.should.equal(false);

      valid = HDPublicKey.isValidPath(HDPublicKey.Hardened);
      valid.should.equal(false);
    });

    it('should use the cache', function() {
      var pubkey = new HDPublicKey(MGVU1key);
      var derived1 = pubkey.derive(0);
      var derived2 = pubkey.derive(0);
      derived1.should.equal(derived2);
    });
  });
});
