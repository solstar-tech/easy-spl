import * as web3 from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import * as util from '../util'
import * as associatedTokenAccount from './associated-token-account'
import * as mintTx from './mint'
import { WalletI } from '../types'

export const transferTokenRawInstructions = (
  mint: web3.PublicKey,
  from: web3.PublicKey,
  to: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number,
  decimals: number,
): web3.TransactionInstruction[] => {
  return [
    Token.createTransferCheckedInstruction(TOKEN_PROGRAM_ID, from, mint, to, owner, [], amount, decimals)
  ]
}

export const transferTokenInstructions = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  from: web3.PublicKey,
  to: web3.PublicKey,
  amount: number,
): Promise<web3.TransactionInstruction[]> => {
  const [fromAssociated, toAssociated] = await Promise.all([
    associatedTokenAccount.get.address(mint, from),
    associatedTokenAccount.get.address(mint, to)
  ])

  const mintDecimals = await mintTx.get.decimals(conn, mint)
  const amountRaw = util.makeInteger(amount, mintDecimals).toNumber()
  const instructions = [
    ...await associatedTokenAccount.create.maybeInstructions(conn, mint, to, from),
    ...transferTokenRawInstructions(mint, fromAssociated, toAssociated, from, amountRaw, mintDecimals)
  ]

  return instructions
}

export const transferTokenTx = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  from: web3.PublicKey,
  to: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> => {
  const instructions = await transferTokenInstructions(conn, mint, from, to, amount)
  return util.wrapInstructions(conn, instructions, from)
}

export const transferTokenSigned = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  to: web3.PublicKey,
  amount: number,
  wallet: WalletI
): Promise<web3.Transaction> => {
  const tx = await transferTokenTx(conn, mint, wallet.publicKey, to, amount)
  return await wallet.signTransaction(tx)
}

export const transferTokenSend = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  to: web3.PublicKey,
  amount: number,
  wallet: WalletI
): Promise<string> => {
  const tx = await transferTokenSigned(conn, mint, to, amount, wallet)
  return await util.sendAndConfirm(conn, tx)
}


export const transfer = {
  rawInstructions: transferTokenRawInstructions,
  instructions: transferTokenInstructions,
  tx: transferTokenTx,
  signed: transferTokenSigned,
  send: transferTokenSend
}
