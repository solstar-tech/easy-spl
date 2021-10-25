import * as web3 from '@solana/web3.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as util from '../util'
import * as account from './account'
import { WalletI } from '../types'

export const createAssociatedTokenAccountRawInstructions = (
  mint: web3.PublicKey,
  address: web3.PublicKey,
  owner: web3.PublicKey,
  sender: web3.PublicKey,
): web3.TransactionInstruction[] => {
  return [Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    address,
    owner,
    sender
  )]
}

export const createAssociatedTokenAccountInstructions = async (
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  sender: web3.PublicKey,
): Promise<web3.TransactionInstruction[]> => {
  const toMake = await getAssociatedTokenAddress(mint, owner)
  return createAssociatedTokenAccountRawInstructions(mint, toMake, owner, sender)
}

export const maybeCreateAssociatedTokenAccountInstructions = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  sender: web3.PublicKey,
): Promise<web3.TransactionInstruction[]> => {
  const doesExist = await exists(conn, mint, owner)
  if (doesExist) return []
  return createAssociatedTokenAccountInstructions(mint, owner, sender)
}

export const createAssociatedTokenAccountTx = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  sender: web3.PublicKey,
): Promise<web3.Transaction> => {
  const instructions = await createAssociatedTokenAccountInstructions(mint, owner, sender)
  return util.wrapInstructions(conn, instructions, sender)
}

export const createAssociatedTokenAccountSigned = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  wallet: WalletI,
): Promise<web3.Transaction> => {
  const tx = await createAssociatedTokenAccountTx(conn, mint, owner, wallet.publicKey)
  return await wallet.signTransaction(tx)
}

export const createAssociatedTokenAccountSend = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  wallet: WalletI,
): Promise<web3.PublicKey> => {
  const address = await getAssociatedTokenAddress(mint, owner)
  if (await account.exists(conn, address)) {
    return address
  }
  const tx = await createAssociatedTokenAccountSigned(conn, mint, owner, wallet)
  await util.sendAndConfirm(conn, tx)
  return address
}

export const getAssociatedTokenAddress = async (
  mint: web3.PublicKey,
  user: web3.PublicKey
): Promise<web3.PublicKey> => {
  return Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, user)
}

export const exists = async(
  conn: web3.Connection,
  mint: web3.PublicKey,
  user: web3.PublicKey
): Promise<boolean> => {
  const address = await getAssociatedTokenAddress(mint, user)
  return account.exists(conn, address)
}


export const get = {
  address: getAssociatedTokenAddress,
}

export const create = {
  rawInstructions: createAssociatedTokenAccountRawInstructions,
  instructions: createAssociatedTokenAccountInstructions,
  maybeInstructions: maybeCreateAssociatedTokenAccountInstructions,
  tx: createAssociatedTokenAccountTx,
  signed: createAssociatedTokenAccountSigned,
  send: createAssociatedTokenAccountSend
}
