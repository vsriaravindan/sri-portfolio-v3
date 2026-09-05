import Link from 'next/link';
import { ArrowLeft, CodeXml, Check, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BankChainPage() {
  const repoUrl = 'https://github.com/vsriaravindan/bankchain';
  const liveUrl = 'https://bankchain.vercel.app';

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link
        href="/projects"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <div className="mt-8">
        <p className="mono-label">Blockchain & Full-Stack Developer</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          BankChain — Modular DeFi on Polygon
        </h1>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          <ExternalLink size={16} /> Live Demo
        </a>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          <CodeXml size={16} /> Repository
        </a>
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Production-grade DeFi banking suite on Polygon — 4 Solidity contracts
          (Lending, Token, Treasury, Vault), Express+Prisma indexer, Next.js
          frontend, deterministic on-chain rules monitor. Live at
          bankchain.vercel.app.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Details
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Four production-grade Solidity 0.8.20 contracts form the protocol:{' '}
          <strong>BankToken</strong> (ERC20 with EIP-2612 permit, pausable,
          burnable), <strong>SavingsVault</strong> (OZ ERC4626 yield-bearing
          wrapper with 5% performance fee), <strong>LendingPool</strong>{' '}
          (over-collateralized lending with Compound-style RAY borrow index, 80%
          LTV, on-chain liquidation), and <strong>Treasury</strong> (OZ
          TimelockController owning every protocol parameter with 24h delay). A
          deterministic on-chain rules monitor watches LendingPool state,
          computes utilization, sweeps user health factors, and emits structured
          RebalanceProposal events when thresholds are crossed — pure rules, no
          LLM, no API key. The full monorepo ships: Hardhat 0.8.20 + 48 passing
          tests, Express + Prisma + ethers v6 backend with on-chain event
          indexer and a universal revert-reason decoder, Next.js 14 frontend
          with wagmi + viem + RainbowKit and a deterministic slash-command
          interface, and a CI-style ai-agent monitor. Real bugs caught and fixed
          during development: repay/liquidate totalBorrows underflow on accrued
          interest, borrow liquidity check that counted collateral as liquid,
          and liquidate empty-position bypass — all caught by the test suite, all
          fixed in the protocol.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Architecture
        </h2>
        <pre className="mt-3 overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
{`┌─────────────────┐     ┌─────────────────┐
│  contracts/     │◀────│   backend/      │
│  Lending        │     │  Express+Prisma │
│  Token          │     │  + indexer      │
│  Treasury       │     └────────┬────────┘
│  Vault          │              │
└────────┬────────┘              │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  frontend/      │     │  ai-agent/      │
│  Next.js 14     │     │  rules monitor  │
│  + wagmi        │     │  (no LLM)        │
└─────────────────┘     └─────────────────┘`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What Stands Out
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            '4 contracts: BankToken (ERC20 + permit + pausable), SavingsVault (ERC4626 yield aggregator), LendingPool (over-collateralized, RAY borrow index, 80% LTV, on-chain liquidation), Treasury (OZ TimelockController, 24h delay)',
            'Hardhat + Solidity 0.8.20 + OpenZeppelin 5.x with optimizer enabled',
            '48 Hardhat tests passing — mint, burn, share math, borrow, repay, 100-block interest accrual, liquidation, edge cases',
            'Deterministic on-chain rules monitor — emits RebalanceProposals when health factor / utilization / pause thresholds cross (no LLM, no API key)',
            'Express + Prisma + ethers v6 backend with WebSocket event indexer and universal revert-reason decoder',
            'Next.js 14 frontend with wagmi + viem + RainbowKit, deployed live on Vercel (bankchain.vercel.app)',
            'ChainGuard (auto-detect wrong chain), LiveStats (TVL/supply from chain), and a deterministic slash-command interface (no NLP)',
            'Three real protocol bugs caught and fixed by the test suite before deployment: totalBorrows underflow, borrow liquidity check, liquidate empty-position bypass',
          ].map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Tech Stack
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Solidity 0.8.20',
            'Hardhat',
            'OpenZeppelin 5.x',
            'ERC-4626',
            'TypeScript',
            'Express',
            'Prisma',
            'ethers v6',
            'Next.js 14',
            'wagmi',
            'viem',
            'RainbowKit',
            'Polygon',
            'Vercel',
          ].map((tech) => (
            <span key={tech} className="pill text-[0.6rem]">{tech}</span>
          ))}
        </div>
      </section>

      <div className="relative mt-16 overflow-hidden rounded-sm border border-[var(--border-subtle)]">
        <div className="project-cover__dots absolute inset-0" />
        <div className="project-cover__glow absolute inset-0" />
        <div className="relative flex min-h-[200px] items-center justify-center p-10 sm:min-h-[280px]">
          <div className="text-center">
            <h3 className="display-head text-[length:var(--type-display-sm)]">BankChain</h3>
            <span className="project-cover__cursor" />
          </div>
        </div>
      </div>
    </div>
  );
}
