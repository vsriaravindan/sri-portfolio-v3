import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sri-Kart — Live E-Commerce on Oracle Cloud by Sri Aravindan';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: '#fb923c', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', width: '14px', height: '14px', borderRadius: '9999px', background: '#fb923c' }} />
          <div style={{ display: 'flex' }}>WEB · SRI-KART</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '88px', fontWeight: 700, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <div style={{ display: 'flex' }}>FROM BARE METAL</div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#fb923c' }}>TO LIVE TRAFFIC.</span>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#d0d0d0', maxWidth: '900px', lineHeight: 1.4 }}>
            Express · React · PostgreSQL · Prisma · Nginx · PM2 · Docker on
            Oracle Cloud VPS · Let&rsquo;s Encrypt · custom 4-brand design
            system.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '22px', color: '#a3a3a3', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex' }}>140.245.203.57</div>
          <div style={{ display: 'flex' }}>SRI ARAVINDAN</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
