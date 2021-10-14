import * as web3 from '@solana/web3.js'
import { WalletI } from '../types'
import * as util from '../util'

export const transferRawInstructions = (
  from: web3.PublicKey,
  to: web3.PublicKey,
  amount: number
): web3.TransactionInstruction[] => {
  return [web3.SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amount
  })]
}

export const transferInstructions = (
  from: web3.PublicKey,
  to: web3.PublicKey,
  amount: number
): web3.TransactionInstruction[] => {
  return transferRawInstructions(from, to, web3.LAMPORTS_PER_SOL * amount)
}

export const transferTx = async (
  conn: web3.Connection,
  from: web3.PublicKey,
  to: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> => {
  const instructions = transferInstructions(from, to, amount)
  return util.wrapInstructions(conn, instructions, from)
}

export const transferSigned = async (
  conn: web3.Connection,
  to: web3.PublicKey,
  amount: number,
  wallet: WalletI
): Promise<web3.Transaction> => {
  const tx = await transferTx(conn, wallet.publicKey, to, amount)
  return await wallet.signTransaction(tx)
}

export const transferSend = async (
  conn: web3.Connection,
  to: web3.PublicKey,
  amount: number,
  wallet: WalletI
): Promise<string> => {
  const tx = await transferSigned(conn, to, amount, wallet)
  return await util.sendAndConfirm(conn, tx)
}

export const getBalance = async(
  conn: web3.Connection,
  user: web3.PublicKey
): Promise<number> => {
  const balance = await conn.getBalance(user)
  return balance / web3.LAMPORTS_PER_SOL
}

export const transfer = {
  rawInstructions: transferRawInstructions,
  instructions: transferInstructions,
  tx: transferTx,
  signed: transferSigned,
  send: transferSend
}

export const get = {
  balance: getBalance
}
