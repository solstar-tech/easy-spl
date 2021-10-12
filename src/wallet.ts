import * as web3 from '@solana/web3.js'
import { WalletI } from './types'

// simple wrapper around keypairs so interfaces line up
export class Wallet implements WalletI {

  private keypair: web3.Keypair
  publicKey: web3.PublicKey

  constructor(keypair: web3.Keypair) {
    this.keypair = keypair
    this.publicKey = keypair.publicKey
  }

  // from web3 keypair
  static fromKeypair(keypair: web3.Keypair): Wallet {
    return new Wallet(keypair)
  }

  // from base58 secretKey
  static fromSecretKey(key: Uint8Array): Wallet {
    const keypair = web3.Keypair.fromSecretKey(key)
    return new Wallet(keypair)
  }

  async signTransaction(tx: web3.Transaction): Promise<web3.Transaction> {
    await tx.sign(this.keypair)
    return tx
  }

  async signAllTransactions(txs: web3.Transaction[]): Promise<web3.Transaction[]> {
    return Promise.all(
      txs.map(tx => this.signTransaction(tx))
    )
  }

}

export default Wallet
