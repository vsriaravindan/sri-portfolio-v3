import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BankChain — Modular DeFi on Polygon by Sri Aravindan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#000',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: '#c084fc', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', width: '14px', height: '14px', borderRadius: '9999px', background: '#c084fc' }} />
          <div style={{ display: 'flex' }}>BLOCKCHAIN · BANKCHAIN</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '88px', fontWeight: 700, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <div style={{ display: 'flex' }}>4 CONTRACTS.</div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#c084fc' }}>48 TESTS. 0 LLMS.</span>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#d0d0d0', maxWidth: '900px', lineHeight: 1.4 }}>
            Solidity 0.8.20 + OZ 5.x + ERC-4626 + RAY borrow index + on-chain
            liquidation + OZ TimelockController · deterministic rules
            monitor · live on Polygon.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '22px', color: '#a3a3a3', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex' }}>bankchain.vercel.app</div>
          <div style={{ display: 'flex' }}>SRI ARAVINDAN</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
