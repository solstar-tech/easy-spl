import * as web3 from '@solana/web3.js'
import InternalWallet from './internal'
import ConnectedWallet from './connected'

// simple wrapper around keypairs so interfaces line up
export class SimpleWallet extends InternalWallet {

  // from web3 keypair
  static fromKeypair(keypair: web3.Keypair): SimpleWallet {
    return new SimpleWallet(keypair)
  }

  // from base58 secretKey
  static fromSecretKey(key: Uint8Array): SimpleWallet {
    const keypair = web3.Keypair.fromSecretKey(key)
    return new SimpleWallet(keypair)
  }

  connect(conn: web3.Connection): ConnectedWallet {
    return ConnectedWallet.fromWallet(conn, this)
  }

}

export default SimpleWallet
