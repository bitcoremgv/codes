hdkey
=====
npm install
[![NPM Package](https://img.shields.io/npm/v/hdkey.svg?style=flat-square)](https://www.npmjs.org/package/hdkey)
[![build status](https://secure.travis-ci.org/cryptocoinjs/hdkey.svg)](http://travis-ci.org/cryptocoinjs/hdkey)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

A JavaScript component for [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)(hierarchical deterministic keys).
















var HDKey = require('hdkey')
var seed = '0001'
var hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
console.log(mk.privateExtendedKey)
// => ' '
console.log(mk.publicExtendedKey)
// => ' '





- https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/hdnode.js
- http://bip32.org/
- http://blog.richardkiss.com/?p=313
- https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- http://bitcoinmagazine.com/8396/deterministic-wallets-advantages-flaw/
