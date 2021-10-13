# Easy SPL
[![NPM](https://img.shields.io/npm/v/easy-spl)](https://www.npmjs.com/package/easy-spl)

_Making tokens on Solana easy!_

## Motivation
SPL tokens are difficult to get started with. They function differently from other common blockchain-based tokens. There is no single stateful contract (as in ERC-20 tokens). Tokens aren't even held in a user's root account! Instead a user creates a new account (that their root account has authority over) for each token they want to interact with. Each token contract stores the number of decimals for a mint, but tokens are sent around without reference to the number of decimals. So to send 1 token of a mint with 4 decimals, you need to send 1000 tokens.

All of this is prone to developer error and diffiult to keep straight when getting started!

We wanted to develop a library that papers over all of these difficulties. Using Easy SPL, you don't have to think about associated token accounts or decimals! We also include some stateful classes for repeated interactions with a mint or given user wallet.

## Use
See the [Documentation](https://solstar-tech.github.io/easy-spl/) for full details
```ts
import * as spl from 'easy-spl'
const connection = new web3.Connection('https://api.devnet.solana.com', 'confirmed')

// create accounts and wallets
const keypairAlice = web3.Keypair.generate()
const alice = spl.Wallet.fromKeypair(connection, keypairAlice)
const keypairBob = web3.Keypair.generate()
const bob = spl.Wallet.fromKeypair(connection, keypairBob)

// create a new mint controlled by alice with 6 decimals
const mint = await spl.Mint.create(connection, 6, alice.publicKey, alice)

// mint 10 tokens to bob
await mint.mintTo(bob.publicKey, alice, 10)

// send 5 tokens to alice
await bob.transferToken(mint.key, alice.publicKey, 5)

// check bob's balance
const balance = await mint.getBalance(bob.publicKey)
// OR
const balance = await bob.getBalance(mint.key)

// get mint decimals
const decimals = await mint.getDecimals()

// get mint supply (total tokens in circulation
const supply = await mint.getSupply()
```

## Connected wallets
Connected wallets can also be instantiated from any wallet that uses the common Solana wallet interface. For instance, from the solana labs browser [wallet-adapter](https://github.com/solana-labs/wallet-adapter/) package. Or signers in [anchor](https://project-serum.github.io/anchor/getting-started/introduction.html)
```ts
import * as spl from 'easy-spl'
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export default function OurComponent () {
  const wallet = useWallet()
  const { connection } = useConnection()

  const user = spl.Wallet.fromWallet(connection, wallet)

  ...
}

```

## Txs & Instructions
Sometimes you need to just format the instructions for something, without sending. In that case you can use the txs & instructions api.

_Note: any function that has the word "raw" in it, refers to addresses in terms of **associated token accounts** and amounts in terms of **integer amounts** (multiplied out by the token decimals)._

Each method includes 4-5 variations:
- `instructions`: get just the instruction for the operation
- `rawInstructions`: get just the instruction, but parameters are given as **associated token accounts** and **integer amounts**
- `tx`: get the tx for the operation, with `recentBlockhash` & `feePayer` filled out
- `signed`: get the formatted tx for the operation & sign with the given wallet
- `send`: get the signed tx for the operation, send to the network, and wait for confirmation

See the [Documentation](https://solstar-tech.github.io/easy-spl/) for more details.


## Development
```bash
# install dependencies
yarn

# build
yarn build

# compiler with reloading
yarn dev

# test
yarn test

# test with reloading
yarn test:watch

# docs
yarn docs

# lint
yarn lint
```



