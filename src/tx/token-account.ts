import * as web3 from '@solana/web3.js'
import * as TokenInstructions from './token-instructions'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as util from '../util'
import { WalletI } from '../types'

export const createTokenAccountInstructions = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  address: web3.PublicKey,
  owner: web3.PublicKey,
  sender: web3.PublicKey
): Promise<web3.TransactionInstruction[]> => {
  return [
    web3.SystemProgram.createAccount({
      fromPubkey: sender,
      newAccountPubkey: address,
      space: 165,
      lamports: await conn.getMinimumBalanceForRentExemption(165),
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeAccount({
      account: address,
      mint,
      owner,
    }),
  ]
}

export const createTokenAccountTx = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  address: web3.PublicKey,
  owner: web3.PublicKey,
  sender: web3.PublicKey
): Promise<web3.Transaction> => {
  const instructions = await createTokenAccountInstructions(conn, mint, address, owner, sender)
  return util.wrapInstructions(conn, instructions, sender)
}

export const createTokenAccountSigned = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  address: web3.PublicKey,
  owner: web3.PublicKey,
  wallet: WalletI
): Promise<web3.Transaction> => {
  const tx = await createTokenAccountTx(conn, mint, address, owner, wallet.publicKey)
  return await wallet.signTransaction(tx)
}

export const createTokenAccountSend = async (
  conn: web3.Connection,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  wallet: WalletI
): Promise<web3.PublicKey> => {
  const vault = web3.Keypair.generate()
  const tx = await createTokenAccountSigned(conn, mint, vault.publicKey, owner, wallet)
  await util.partialSignAndSend(conn, tx, [vault])
  return vault.publicKey
}

export const create = {
  instructions: createTokenAccountInstructions,
  tx: createTokenAccountTx,
  signed: createTokenAccountSigned,
  send: createTokenAccountSend
}
