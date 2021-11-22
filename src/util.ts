import BN from 'bn.js'
import * as web3 from '@solana/web3.js'

export const wrapInstructions = async (conn: web3.Connection, instructions: web3.TransactionInstruction[], signer: web3.PublicKey): Promise<web3.Transaction> => {
  const tx = new web3.Transaction();
  tx.add(...instructions);
  const { blockhash } = await conn.getRecentBlockhash()
  tx.recentBlockhash = blockhash
  tx.feePayer = signer
  return tx
}

export const partialSignAndSend = async (conn: web3.Connection, tx: web3.Transaction, signers: web3.Keypair[] = []): Promise<string> => {
  if(signers.length > 0) {
    await tx.partialSign(...signers)
  }
  return sendAndConfirm(conn, tx)
}

export const sendAndConfirm = async (conn: web3.Connection, tx: web3.Transaction): Promise<string> => {
  return web3.sendAndConfirmRawTransaction(conn, tx.serialize(), { commitment: 'confirmed' })
}

export const makeDecimal = (bn: BN, decimals: number): number => {
  return bn.toNumber() / Math.pow(10, decimals)
}

export const makeInteger = (num: number, decimals: number): BN => {
  const mul = Math.pow(10, decimals)
  return new BN(num * mul)
}
