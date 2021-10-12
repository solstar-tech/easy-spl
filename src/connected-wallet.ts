import * as web3 from '@solana/web3.js'
import * as mint from './tx/mint'
import * as token from './tx/token'
import * as associatedTokenAccount from './tx/associated-token-account'
import Wallet from "./wallet"

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

  async getBalance(mintKey: web3.PublicKey): Promise<number> {
    return mint.getBalance(this.conn, mintKey, this.publicKey)
  }

  async transferToken(mintKey: web3.PublicKey, to: web3.PublicKey, amount: number): Promise<string> {
    return token.transfer.send(this.conn, mintKey, to, amount, this)
  }

  async getAssociatedTokenAccount(mintKey: web3.PublicKey): Promise<web3.PublicKey> {
    return associatedTokenAccount.get.address(mintKey, this.publicKey)
  }

  async existsAssociatedTokenAccount(mintKey: web3.PublicKey): Promise<boolean> {
    return associatedTokenAccount.exists(this.conn, mintKey, this.publicKey)
  }

  // idempotent, can call as many times as you like
  async createAssociatedTokenAccount(mintKey: web3.PublicKey): Promise<web3.PublicKey> {
    return associatedTokenAccount.create.send(this.conn, mintKey, this.publicKey, this)
  }

}

export default Wallet
