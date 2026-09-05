import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'sriaravindan.com — Portfolio site by Sri Aravindan';
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', color: '#00ff41', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', width: '14px', height: '14px', borderRadius: '9999px', background: '#00ff41' }} />
          <div style={{ display: 'flex' }}>SELF-REFERENCING PROJECT</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '88px', fontWeight: 700, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            <div style={{ display: 'flex' }}>THIS PORTFOLIO</div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#00ff41' }}>IS ITSELF A PROJECT.</span>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#d0d0d0', maxWidth: '900px', lineHeight: 1.4 }}>
            Next.js 16 + Supabase + Realtime · OTP auth · custom CMS ·
            Reddit-style threaded comments · live /devops CI/CD dashboard ·
            self-hosted Docker on Oracle Cloud VPS.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '22px', color: '#a3a3a3', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <div style={{ display: 'flex' }}>sriaravindan.com</div>
          <div style={{ display: 'flex' }}>SRI ARAVINDAN</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
