# Problem 2: Currency Swap UI

Built with Next.js 14, React, TypeScript, and styled-components on the Base network. Extends the basic quote form into a production-style swap — real wallet connection, live on-chain quotes, ERC-20 approval flow, and actual transaction execution.

## Tech Stack

- Node.js 20
- Next.js 14 + React 18 + TypeScript
- styled-components, TanStack Query, Jotai
- wagmi v2 + ConnectKit + viem
- KyberSwap Aggregator API, Axios, bignumber.js

## Challenge Requirements

| Requirement               | Implementation                                                   |
| ------------------------- | ---------------------------------------------------------------- |
| Currency swap form        | Pay/receive inputs with switch button on Base                    |
| Exchange rate calculation | Live quotes from KyberSwap Aggregator with USD values            |
| Token images              | Resolved from token list `logoURI`, DexScreener as fallback      |
| Price information         | KyberSwap / DEX price APIs (real-time on-chain pricing)          |
| Input validation          | See below                                                        |
| Visual attractiveness     | Dark theme, animated transitions, Birdeye chart, responsive grid |
| Frontend skills           | Modular architecture, typed SDK, Jotai, React Query, wagmi       |

### Validation

Each state surfaces a specific button label:

| State                | Button                 |
| -------------------- | ---------------------- |
| Wallet not connected | Connect Wallet         |
| Wrong network        | Switch to Base         |
| No amount            | Enter an amount        |
| Quote error          | Error when fetch quote |
| Exceeds balance      | Insufficient amount    |
| Needs approval       | Approve `<token>`      |
| Approving            | Approving…             |
| Loading quote        | Loading…               |
| Awaiting wallet      | Confirm in wallet      |
| Ready                | Swap                   |

## Features

- Wallet connection via ConnectKit (MetaMask, Coinbase, WalletConnect)
- Real swap execution — approval → confirm → execute on-chain
- Debounced quote refresh with real-time USD output values
- Token search and custom ERC-20 import
- Live wallet balances via multicall
- Slippage settings — Auto / 1% / 3% / 5% / custom
- Birdeye candlestick chart, toggleable from the swap card
- URL-synced token selection for shareable links
- Responsive: chart + card side-by-side on desktop, stacked on mobile

## Project Structure

```
src/
├── components/swap/        # SwapCard, InputPanel, ExecuteButton, TokenChart
│   ├── aggregator/         # KyberSwap quote + execution
│   ├── currency-modal/     # Token search and import
│   ├── settings/           # Slippage modal
│   ├── state/              # Jotai atoms: swap, chart, price, slippage
│   └── hooks/              # Token list, price, balance, URL sync
├── config/                 # Chain, tokens, theme
├── hooks/                  # useApproveCallback, useContract, …
├── providers/              # wagmi + ConnectKit
└── utils/

packages/
└── swap-sdk-core/          # Local SDK: Currency, Token, Native, Fraction
```

## Run Locally

```bash
yarn install
yarn dev
```

Open `http://localhost:3000`

```bash
yarn build && yarn start   # production
yarn lint
```

## Real-World Challenge

**The multi-aggregator approval problem**

One real-world challenge I faced was integrating multiple aggregators into our platform to provide users with the best possible swap rates. While this approach improved pricing, it also created a poor user experience: a user had to approve the same token multiple times because each aggregator used a different router contract.

From a technical perspective, the implementation was correct — the ERC-20 approval model requires per-contract allowances, so each aggregator's router legitimately needed its own. But from a user experience perspective, requiring repeated approvals for the same token eroded trust and caused confusion.

The solution I developed eliminated the need for repeated approvals regardless of which aggregator was selected for a given quote. The underlying approach also became the foundation for several other features that I later built and expanded across the platform — I'm happy to discuss the details further.

## Architecture Decisions

**KyberSwap Aggregator** — optimal routing across Base liquidity without a custom contract. Trade-off: execution depends on API availability.

**Jotai** — swap state shared across components without prop drilling. Trade-off: state resets on page reload (intentional for a swap form).

**URL-synced currencies** — shareable swap links via Next.js shallow routing. Trade-off: couples state handlers to `useRouter`.

**30-minute price cache** — avoids hammering the price API on every keystroke. Trade-off: USD values can be up to 30 minutes stale.

**Birdeye chart iframe** — zero charting code to maintain. Trade-off: layout and theming constrained by iframe boundary.
