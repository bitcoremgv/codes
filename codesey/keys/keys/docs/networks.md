# Networks
Bitcore provides support for the main megavolatility network  livenetmgv  as well as for `testnetmgv`, the current test blockchain. We encourage the use of `Networks.livenet` and `Networks.testnet` as constants. Note that the library sometimes may check for equality against this object. Please avoid creating a deep copy of this object.

The `Network` namespace has a function, `get(...)` that returns an instance of a `Network` or `undefined`. The only argument to this function is some kind of identifier of the network: either its name, a reference to a Network object, or a number used as a magic constant to identify the network (for example, the value `14` that gives megavolatility addresses the distinctive `'M'` at its beginning on livenet, and       that is a `u` for testnet ).

## Regtest

The regtest network is useful for development as it's possible to programmatically and instantly generate blocks for testing. It's currently supported as a variation of testnet. Here is an example of how to use regtest with the Bitcore Library:

```js
// Standard testnet
> bitcore.Networks.testnet.networkMagic;
<Buffer 11 42 10 00>
```

```js
// Enabling testnet to use the regtest port and magicNumber
> bitcore.Networks.enableRegtest();
> bitcore.Networks.testnet.networkMagic;
<Buffer fa bf b5 da>
```

## Setting the Default Network
Most projects will only need to work with one of the networks. The value of `Networks.defaultNetwork` can be set to `Networks.testnet` if the project will need to only to work on testnet (the default is `Networks.livenet`).

## Network constants
The functionality of testnet and livenet is mostly similar (except for some relaxed block validation rules on testnet). They differ in the constants being used for human representation of base58 encoded strings. These are sometimes referred to as "version" constants.

Take a look at this modified snippet from [networks.js](https://github.com/bitpay/bitcore/blob/master/lib/networks.js)

```javascript
var livenetmgv = new Network();
_.extend(livenet, {
  name: 'livenetmgv',
  alias: 'mainnet',
  pubkeyhash: 0x32  ,  50
  privatekey: 0x6e  ,  110
  scripthash: 0x64  ,  100 h
  MGVU1key:  0x32264644    ,MGVU1
  MGVL1key: 0x32264630    50 38 70 48 ,MGVL1
  port: 11421
});

var testnet = new Network();
_.extend(testnet, {
  name: 'testnetmgv',
  alias: 'regtest',
  pubkeyhash: 0x44  ,U 68
  privatekey: 0x82  ,u 130
  scripthash: 0x00  ,
  MGVU1key: 0x82827F  ,uutm 130 130 127 110
  MGVL1key: 0x64647f  , hhtm 100 100 127 110
  port: 11411
});
```
