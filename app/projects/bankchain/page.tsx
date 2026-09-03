import Link from 'next/link';
import { ArrowLeft, CodeXml, Check } from 'lucide-react';

export default function BankChainPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
      <Link
        href="/projects"
        className="mono-label inline-flex items-center gap-2 hover:text-[var(--accent)]"
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <div className="mt-8">
        <p className="mono-label">Blockchain Developer</p>
        <h1 className="display-head mt-3 text-[length:var(--type-display-md)] leading-[var(--leading-display-md)]">
          BankChain — Modular DeFi Suite on Polygon
        </h1>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#"
          className="btn btn-ghost opacity-60"
          aria-disabled
        >
          <CodeXml size={16} /> Repository (private)
        </a>
      </div>

      <section className="mt-12">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Four production-grade Solidity contracts form the protocol:{' '}
          <strong>Lending</strong> (over-collateralized lending pool with
          interest accrual), <strong>Token</strong> (ERC20 base),{' '}
          <strong>Treasury</strong> (protocol-owned liquidity + fee routing), and{' '}
          <strong>Vault</strong> (yield aggregator strategy wrapper). An
          AI-agent module wraps the contracts with an autonomous monitor that
          observes on-chain events and proposes rebalancing. Express + Prisma
          backend indexes contract events. Hardhat 9.x with optimizer enabled,
          Polygon Amoy testnet deployment config, Polygonscan verification.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Architecture
        </h2>
        <pre className="mt-3 overflow-x-auto rounded-sm border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 text-xs leading-relaxed text-[var(--text-secondary)]">
{`┌─────────────────┐     ┌─────────────────┐
│   ai-agent/     │────▶│  contracts/     │
│  (monitor +     │     │  Lending        │
│   rebalancer)   │     │  Token          │
└────────┬────────┘     │  Treasury       │
         │              │  Vault          │
         ▼              └────────┬────────┘
┌─────────────────┐              │
│   backend/      │◀─────────────┘
│  Express+Prisma │   (event indexer)
└─────────────────┘`}
        </pre>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          What Stands Out
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            '4 contracts: Lending (over-collateralized), Token (ERC20), Treasury (POLL), Vault (yield aggregator)',
            'Hardhat + Solidity 0.8.20 + OpenZeppelin',
            'Autonomous AI agent for on-chain monitoring',
            'Express + Prisma backend for event indexing',
            'Polygon Amoy testnet deployment + Polygonscan verification',
            'Modular architecture — each contract independently upgradeable',
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
          {['Solidity 0.8.20', 'Hardhat', 'OpenZeppelin', 'TypeScript', 'Express', 'Prisma', 'Polygon', 'Ethers v6'].map((tech) => (
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