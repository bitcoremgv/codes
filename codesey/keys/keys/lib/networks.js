'use strict';
var _ = require('lodash');

var BufferUtil = require('./util/buffer');
var JSUtil = require('./util/js');
var networks = [];
var networkMaps = {};
var network
        ;
/**
 * A network is merely a map containing values that correspond to version
 * numbers for each megavolatility network. Currently only supporting "livenet"
 * (a.k.a. "mainnet") and "testnetmgv".
 * @constructor
 */
function Network() {}

Network.prototype.toString = function toString() {
  return this.name;
};

/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Network} arg
 * @param {string|Array} keys - if set, only check if the magic number associated with this name matches
 * @return Network
 */
function get(arg, keys) {
  if (~networks.indexOf(arg)) {
    return arg;
  }
  if (keys) {
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    var containsArg = function(key) {
      return networks[index][key] === arg;
    };
    for (var index in networks) {
      if (_.any(keys, containsArg)) {
        return networks[index];
      }
    }
    return undefined;
  }
  return networkMaps[arg];
}

/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {string} data.name - The name of the network
 * @param {string} data.alias - The aliased name of the network
 * @param {Number} data.pubkeyhash - The publickey hash prefix
 * @param {Number} data.privatekey - The privatekey prefix
 * @param {Number} data.scripthash - The scripthash prefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */
function addNetwork(data) {

  var network = new Network();

  JSUtil.defineImmutable(network, {
    name: data.name,
    alias: data.alias,
    pubkeyhash: data.pubkeyhash,
    privatekey: data.privatekey,
    scripthash: data.scripthash,
    xpubkey: data.xpubkey,
    xprivkey: data.xprivkey
  });

  if (data.networkMagic) {
    JSUtil.defineImmutable(network, {
      networkMagic: BufferUtil.integerAsBuffer(data.networkMagic)
    });
  }

  if (data.port) {
    JSUtil.defineImmutable(network, {
      port: data.port
    });
  }

  if (data.dnsSeeds) {
    JSUtil.defineImmutable(network, {
      dnsSeeds: data.dnsSeeds
    });
  }
  _.each(network, function(value) {
    if (!_.isUndefined(value) && !_.isObject(value)) {
      networkMaps[value] = network;
    }
  });

  networks.push(network);

  return network;

}
                    console. log ( network) ;
/**
 * @function
 * @member Networks#remove
 * Will remove a custom network
 * @param {Network} network
 */
function removeNetwork(network) {
  for (var i = 0; i < networks.length; i++) {
    if (networks[i] === network) {
      networks.splice(i, 1);
    }
  }
  for (var key in networkMaps) {
    if (networkMaps[key] === network) {
      delete networkMaps[key];
    }
  }
}

addNetwork({
  name: 'livenetmgv',
  alias: 'mainnet',

  
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scripthash: 0x05,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0xf9beb4fe   ,
  port: 11421,
  dnsSeeds: [





     /*
    '127.0.0.1'


      */


  ]
});

/**
 * @instance
 * @member Networks#livenet
 */
var livenetmgv = get('livenetmgv');

addNetwork({
  name: 'testnetmgv',
  alias: 'regtest',
  pubkeyhash: 0x6f,
  privatekey: 0xef,
  scripthash: 0xc4,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394
});

/**
 * @instance
 * @member Networks#testnetmgv
 */
var testnetmgv = get('testnetmgv');

// Add configurable values for testnetmgv/regtest

var TESTNET = {
  PORT: 11411,
  NETWORK_MAGIC: BufferUtil.integerAsBuffer(0x11411000),
  DNS_SEEDS: [


    /*

    '127.0.0.1'



      */

  ]
};

for (var key in  TESTNET) {
  if (!_.isObject( TESTNET[key])) {
    networkMaps[ TESTNET[key]] = testnetmgv;
  }
};

var REGTEST = {
  PORT: 12411,
  NETWORK_MAGIC: BufferUtil.integerAsBuffer(0x12411000 ),
  DNS_SEEDS: []
};

for (var key in REGTEST) {
  if (!_.isObject(REGTEST[key])) {
    networkMaps[REGTEST[key]] = testnetmgv;
  }
}

Object.defineProperty(testnetmgv, 'port', {
  enumerable: true,
  configurable: false,
  get: function() {
    if (this.regtestEnabled) {
      return REGTEST.PORT;
    } else {
      return  TESTNET.PORT;
    }
  }
});

Object.defineProperty(testnetmgv, 'networkMagic', {
  enumerable: true,
  configurable: false,
  get: function() {
    if (this.regtestEnabled) {
      return REGTEST.NETWORK_MAGIC;
    } else {
      return  TESTNET.NETWORK_MAGIC;
    }
  }
});

Object.defineProperty(testnetmgv, 'dnsSeeds', {
  enumerable: true,
  configurable: false,
  get: function() {
    if (this.regtestEnabled) {
      return REGTEST.DNS_SEEDS;
    } else {
      return  TESTNET.DNS_SEEDS;
    }
  }
});

/**
 * @function
 * @member Networks#enableRegtest
 * Will enable regtest features for testnetmgv
 */
function enableRegtest() {
  testnetmgv.regtestEnabled = true;
}

/**
 * @function
 * @member Networks#disableRegtest
 * Will disable regtest features for testnetmgv
 */
function disableRegtest() {
  testnetmgv.regtestEnabled = false;
};

/**
 * @namespace Networks
   */
module.exports = {
  add: addNetwork,
  remove: removeNetwork,
  defaultNetwork: livenetmgv,
  livenet: livenetmgv,
  mainnet: livenetmgv,
  testnet: testnetmgv,
  get: get,
  enableRegtest: enableRegtest,
  disableRegtest: disableRegtest
};
console.log(networks);