import * as web3 from '@solana/web3.js'

export const exists = async (
  conn: web3.Connection,
  account: web3.PublicKey,
): Promise<boolean> => {
  const info = await conn.getParsedAccountInfo(account)
  return info.value !== null
}

 