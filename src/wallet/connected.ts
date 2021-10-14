import * as web3 from '@solana/web3.js'
import * as mint from '../tx/mint'
import * as token from '../tx/token'
import * as sol from '../tx/sol'
import * as associatedTokenAccount from '../tx/associated-token-account'
import InternalWallet from './simple'
import { WalletI } from '../types'

export class Wallet implements WalletI {

  conn: web3.Connection
  signer: WalletI
  publicKey: web3.PublicKey

  constructor(conn: web3.Connection, signer: WalletI) {
    this.conn = conn
    this.signer = signer
    this.publicKey = signer.publicKey
  }

  static fromWallet(conn: web3.Connection, signer: WalletI) {
    return new Wallet(conn, signer)
  }

  // from web3 keypair
  static fromKeypair(conn: web3.Connection, keypair: web3.Keypair): Wallet {
    const signer = new InternalWallet(keypair)
    return Wallet.fromWallet(conn, signer)
  }

  // from base58 secretKey
  static fromSecretKey(conn: web3.Connection, key: Uint8Array): Wallet {
    const keypair = web3.Keypair.fromSecretKey(key)
    return Wallet.fromKeypair(conn, keypair)
  }

  async getBalance(mintKey: web3.PublicKey): Promise<number> {
    return mint.getBalance(this.conn, mintKey, this.publicKey)
  }

  async transferToken(mintKey: web3.PublicKey, to: web3.PublicKey, amount: number): Promise<string> {
    return token.transfer.send(this.conn, mintKey, to, amount, this)
  }

  async getSolBalance(): Promise<number> {
    return sol.get.balance(this.conn, this.publicKey)
  }

  async transferSol(to: web3.PublicKey, amount: number): Promise<string> {
    return sol.transfer.send(this.conn, to, amount, this)
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

  async signTransaction(tx: web3.Transaction): Promise<web3.Transaction> {
    return this.signer.signTransaction(tx)
  }

  async signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]> {
    return this.signer.signAllTransactions(txs)
  }

}

export default Wallet
