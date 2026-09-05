import ProjectLayout from '@/components/ProjectLayout';
import type { Project } from '@/lib/projects';

const project: Project = {
  slug: 'bankchain',
  name: 'BankChain — Modular DeFi on Polygon',
  role: 'Blockchain & Full-Stack Developer',
  description:
    'Production-grade DeFi banking suite — 4 Solidity contracts, Express+Prisma indexer, Next.js frontend. Live at bankchain.vercel.app.',
  details: '',
  techStack: [
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
  ],
  repo: 'https://github.com/vsriaravindan/bankchain',
  liveUrl: 'https://bankchain.vercel.app',
  featured: true,
  standout:
    'Live on Vercel. 4 production-grade contracts + on-chain rules monitor (no LLM) + 48 Hardhat tests + full Express/Prisma/Next.js stack. Real DeFi primitives with bugs found and fixed by the test suite.',
  category: 'Blockchain',
  highlights: [
    '4 contracts: BankToken (ERC20 + permit + pausable), SavingsVault (ERC4626 yield aggregator), LendingPool (over-collateralized, RAY borrow index, 80% LTV, on-chain liquidation), Treasury (OZ TimelockController, 24h delay)',
    'Hardhat + Solidity 0.8.20 + OpenZeppelin 5.x with optimizer enabled',
    '48 Hardhat tests passing — mint, burn, share math, borrow, repay, 100-block interest accrual, liquidation, edge cases',
    'Deterministic on-chain rules monitor — emits RebalanceProposals when health factor / utilization / pause thresholds cross (no LLM, no API key)',
    'Express + Prisma + ethers v6 backend with WebSocket event indexer and universal revert-reason decoder',
    'Next.js 14 frontend with wagmi + viem + RainbowKit, deployed live on Vercel (bankchain.vercel.app)',
    'ChainGuard (auto-detect wrong chain), LiveStats (TVL/supply from chain), and a deterministic slash-command interface (no NLP)',
    'Three real protocol bugs caught and fixed by the test suite before deployment: totalBorrows underflow, borrow liquidity check, liquidate empty-position bypass',
  ],
};

export default function BankChainPage() {
  return (
    <ProjectLayout project={project}>
      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Details
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Four production-grade Solidity 0.8.20 contracts form the
          protocol: <strong>BankToken</strong> (ERC20 with EIP-2612 permit,
          pausable, burnable), <strong>SavingsVault</strong> (OZ ERC4626
          yield-bearing wrapper with 5% performance fee),{' '}
          <strong>LendingPool</strong> (over-collateralized lending with
          Compound-style RAY borrow index, 80% LTV, on-chain liquidation),
          and <strong>Treasury</strong> (OZ TimelockController owning
          every protocol parameter with 24h delay). A deterministic
          on-chain rules monitor watches LendingPool state, computes
          utilization, sweeps user health factors, and emits structured
          RebalanceProposal events when thresholds are crossed — pure
          rules, no LLM, no API key. Three real bugs caught and fixed
          during development by the test suite: repay/liquidate
          totalBorrows underflow, borrow liquidity check, and liquidate
          empty-position bypass.
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
│  + wagmi        │     │  (no LLM)       │
└─────────────────┘     └─────────────────┘`}
        </pre>
      </section>
    </ProjectLayout>
  );
}
