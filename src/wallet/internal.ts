import * as web3 from '@solana/web3.js'
import { WalletI } from '../types'

// internal wallet to prevent circular dependencies
export class InternalWallet implements WalletI {

  private keypair: web3.Keypair
  publicKey: web3.PublicKey

  constructor(keypair: web3.Keypair) {
    this.keypair = keypair
    this.publicKey = keypair.publicKey
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

export default InternalWallet
