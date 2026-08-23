export default function Slide12GetStarted() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex"
      style={{ background: 'var(--slide-bg)' }}
    >
      {/* Left: content */}
      <div
        className="flex flex-col justify-center"
        style={{ width: '60%', padding: '8vh 8vw' }}
      >
        <div
          style={{
            width: '3.5vw',
            height: '0.35vh',
            background: 'var(--slide-primary)',
            marginBottom: '2.5vh',
          }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '5.5vw',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--slide-text)',
            marginBottom: '1.5vh',
          }}
        >
          Get Started
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body-family)',
            fontSize: '2.2vw',
            color: 'var(--slide-muted)',
            marginBottom: '4.5vh',
          }}
        >
          VideoForge is live and ready to use.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.2vh' }}>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4 }}>
              Open the app — create a project — pick a concept in under 2 minutes
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4 }}>
              Add your OpenAI key to unlock AI script generation and voiceover
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4 }}>
              Add your Pexels key to unlock real stock footage search
            </p>
          </div>
        </div>
      </div>

      {/* Right: closing violet panel */}
      <div
        className="flex flex-col items-center justify-center relative overflow-hidden"
        style={{ width: '40%', background: 'var(--slide-primary)' }}
      >
        {/* Large decorative wordmark */}
        <div
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '5.5vw',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.12)',
            letterSpacing: '-0.04em',
            userSelect: 'none',
            position: 'absolute',
            bottom: '6vh',
            right: '2vw',
            lineHeight: 1,
          }}
        >
          VideoForge
        </div>
        {/* Main violet panel text */}
        <p
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '2vw',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.01em',
            textAlign: 'center',
            padding: '0 3vw',
            lineHeight: 1.4,
            textWrap: 'balance',
          }}
        >
          Personal AI Studio
        </p>
        <div
          style={{
            width: '3vw',
            height: '0.3vh',
            background: 'rgba(255,255,255,0.4)',
            marginTop: '2vh',
          }}
        />
      </div>
    </div>
  );
}
