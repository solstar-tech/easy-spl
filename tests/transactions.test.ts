import * as web3 from '@solana/web3.js'
import * as spl from '../src'

jest.setTimeout(100000)

describe('transactions', () => {

  const keypairA = web3.Keypair.generate()
  const walletA = spl.SimpleWallet.fromKeypair(keypairA)
  const keypairB = web3.Keypair.generate()
  const walletB = spl.SimpleWallet.fromKeypair(keypairB)

  const connection = new web3.Connection('http://localhost:8899', 'confirmed')

  const ONE_SOL = web3.LAMPORTS_PER_SOL
  const MINT_AMOUNT = 15
  const TRANSFER_AMOUNT = 5

  let mint: web3.PublicKey

  it('sets up accounts', async () => {
    const [sigA, sigB] = await Promise.all([
      connection.requestAirdrop(walletA.publicKey, ONE_SOL),
      connection.requestAirdrop(walletB.publicKey, ONE_SOL)
    ])
    await Promise.all([
      connection.confirmTransaction(sigA),
      connection.confirmTransaction(sigB)
    ])
  })

  it('creates mint', async () => {
    mint = await spl.mint.create.send(connection, 6, walletA.publicKey, walletA)
  })

  it('mints to user with no account', async () => {
    await spl.mint.mintTo.send(connection, mint, walletB.publicKey, walletA, MINT_AMOUNT)
  })

  it('accurately retrieves their balance', async () => {
    const balance = await spl.mint.getBalance(connection, mint, walletB.publicKey)
    expect(balance).toEqual(MINT_AMOUNT)
  })

  it('transfers to user with no account', async () => {
    await spl.token.transfer.send(connection, mint, walletA.publicKey, TRANSFER_AMOUNT, walletB)
  })

  it('accurately retrieves both balances', async () => {
    const [balanceA, balanceB] = await Promise.all([
      spl.mint.getBalance(connection, mint, walletA.publicKey),
      spl.mint.getBalance(connection, mint, walletB.publicKey)
    ])
    expect(balanceA).toEqual(TRANSFER_AMOUNT)
    expect(balanceB).toEqual(MINT_AMOUNT - TRANSFER_AMOUNT)
  })


})
