import * as web3 from '@solana/web3.js'

export interface WalletI {
  publicKey: web3.PublicKey
  signTransaction: (tx: web3.Transaction) => Promise<web3.Transaction>
  signAllTransactions: (txs: web3.Transaction[]) => Promise<web3.Transaction[]>
}
