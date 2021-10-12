import * as web3 from '@solana/web3.js'
import Wallet from "./wallet";

export class ConnectedWallet extends Wallet {

  conn: web3.Connection

  constructor(conn: web3.Connection, keypair: web3.Keypair) {
    super(keypair)
    this.conn = conn
  }

  // from web3 keypair
  static fromKeypairConn(conn: web3.Connection, keypair: web3.Keypair): ConnectedWallet {
    return new ConnectedWallet(conn, keypair)
  }

  // from base58 secretKey
  static fromSecretKeyConn(conn: web3.Connection, key: Uint8Array): ConnectedWallet {
    const keypair = web3.Keypair.fromSecretKey(key)
    return new ConnectedWallet(conn, keypair)
  }

}

export default Wallet
