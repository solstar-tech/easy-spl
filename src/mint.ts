import { MintInfo } from '@solana/spl-token'

import * as web3 from '@solana/web3.js'
import * as mint from './tx/mint'
import { WalletI } from './types'
export class Mint {

  conn: web3.Connection
  key: web3.PublicKey

  constructor(conn: web3.Connection, key: web3.PublicKey) {
    this.conn = conn
    this.key = key
  }

  static async create(conn: web3.Connection, decimals: number, owner: web3.PublicKey, sender: WalletI): Promise<Mint> {
    const key = await mint.create.send(conn, decimals, owner, sender)
    return new Mint(conn, key)
  }

  static get(conn: web3.Connection, key: web3.PublicKey): Mint {
    return new Mint(conn, key)
  }

  async mintTo(user: web3.PublicKey, sender: WalletI, amount: number): Promise<string> {
    return mint.mintTo.send(this.conn, this.key, user, sender, amount)
  }

  async getInfo(): Promise<MintInfo> {
    return mint.get.info(this.conn, this.key)
  }

  async getDecimals(): Promise<number> {
    return mint.get.decimals(this.conn, this.key)
  }

  async getSupply(): Promise<number> {
    return mint.get.supply(this.conn, this.key)
  }

  async getBalance(user: web3.PublicKey): Promise<number> {
    return mint.get.balance(this.conn, this.key, user)
  }

}
