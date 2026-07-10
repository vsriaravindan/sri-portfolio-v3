const words = ['automate', 'deploy', 'scale', 'monitor', 'secure', 'build'];

export default function Band() {
  const row1 = [...words, ...words];
  const row2 = [...words, ...words];

  return (
    <div className="band" role="presentation">
      <div className="band-row band-row--outline" style={{ animation: 'marquee-row-1 28s linear infinite' }}>
        {row1.map((word, i) => (
          <span key={i} className="band-cell">
            {word}
            <span className="band-star">✦</span>
          </span>
        ))}
      </div>
      <div className="band-row" style={{ animation: 'marquee-row-2 32s linear infinite' }}>
        {row2.map((word, i) => (
          <span key={i} className="band-cell">
            {word}
            <span className="band-star">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-row-1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-row-2 {
          0% { transform: translateX(-25%); }
          100% { transform: translateX(-75%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .band-row { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
