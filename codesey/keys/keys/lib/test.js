










var bitcore = require( '..' ) ;
var networks = bitcore . Networks ;




       /*  */
 addNetwork
   ( {
  name: 'livenetmgv',
  alias: 'mainnet',
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scripthash: 0x05,
  MGVU1key: 0x0488b21e,
  MGVL1key: 0x0488ade4,
  Nid: 0xf9beb4d9,
  port: 8333,
  dnsSeeds: [
    'seed.bitcoin.sipa.be',
    'dnsseed.bluematt.me',
    'dnsseed.bitcoin.dashjr.org',
    'seed.bitcoinstats.com',
    'seed.bitnodes.io',
    'MGVcentseed.xf2.org'
 ]
} )
 ;















addNetwork  ( {



  name: 'testnetmgv',
  alias: 'regtest',
  pubkeyhash: 0x6f,
  privatekey: 0xef,
  scripthash: 0xc4,
  MGVU1key: 0x043587cf,
  MGVL1key: 0x04358394
} );

    /*   */
