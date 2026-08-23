export default function Slide05Analyze() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex"
      style={{ background: 'var(--slide-bg)' }}
    >
      {/* Left: content */}
      <div
        className="flex flex-col justify-center"
        style={{ width: '65%', padding: '8vh 8vw' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body-family)',
            fontSize: '1.6vw',
            fontWeight: 500,
            color: 'var(--slide-primary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.5vh',
          }}
        >
          Step 1
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '3.8vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--slide-text)',
            marginBottom: '1.5vh',
            textWrap: 'balance',
          }}
        >
          Analyze &amp; Ideate
        </h2>
        <div
          style={{
            width: '3.5vw',
            height: '0.35vh',
            background: 'var(--slide-primary)',
            marginBottom: '3.5vh',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2vh' }}>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', fontWeight: 400, color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              Paste any YouTube URL or enter a topic
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', fontWeight: 400, color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              VideoForge extracts hook type, pacing, story structure, caption density, and audience angle
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', fontWeight: 400, color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              Instantly generates 3 fully-formed, original video concepts
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', fontWeight: 400, color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              Each concept includes angle, hook line, content structure, and estimated runtime
            </p>
          </div>
        </div>
      </div>

      {/* Right: decorative step number */}
      <div
        className="flex items-center justify-center"
        style={{ width: '35%', position: 'relative', overflow: 'hidden' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '28vw',
            fontWeight: 800,
            color: 'var(--slide-violet-light)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.06em',
          }}
        >
          01
        </span>
      </div>
    </div>
  );
}
