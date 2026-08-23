export default function Slide04Workflow() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{ background: 'var(--slide-bg)', padding: '7vh 8vw' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '4.5vh' }}>
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
            fontSize: '4vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--slide-text)',
          }}
        >
          The Workflow
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body-family)',
            fontSize: '2vw',
            color: 'var(--slide-muted)',
            marginTop: '1.2vh',
          }}
        >
          Nine steps, one app.
        </p>
      </div>

      {/* 3-column phases */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0 4vw',
          flex: 1,
        }}
      >
        {/* Phase 1: Discover */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '1.5vw',
              fontWeight: 500,
              color: 'var(--slide-primary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '2.5vh',
              paddingBottom: '1.5vh',
              borderBottom: '1px solid var(--slide-border)',
            }}
          >
            Discover
          </div>

          <div style={{ marginBottom: '2.8vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Analyze</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>Extract proven patterns from any URL or topic</p>
          </div>

          <div style={{ marginBottom: '2.8vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Concepts</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>Generate 3 original video angles</p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Trends</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>Ongoing topic research dashboard</p>
          </div>
        </div>

        {/* Phase 2: Create */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '1.5vw',
              fontWeight: 500,
              color: 'var(--slide-primary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '2.5vh',
              paddingBottom: '1.5vh',
              borderBottom: '1px solid var(--slide-border)',
            }}
          >
            Create
          </div>

          <div style={{ marginBottom: '2.8vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Script</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>AI-written, human-editable, originality-checked</p>
          </div>

          <div style={{ marginBottom: '2.8vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Media</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>Pexels stock footage + your own uploads</p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Voiceover</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>6 AI voices via OpenAI TTS</p>
          </div>
        </div>

        {/* Phase 3: Ship */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '1.5vw',
              fontWeight: 500,
              color: 'var(--slide-primary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '2.5vh',
              paddingBottom: '1.5vh',
              borderBottom: '1px solid var(--slide-border)',
            }}
          >
            Ship
          </div>

          <div style={{ marginBottom: '2.8vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Captions</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>Auto-generated SRT</p>
          </div>

          <div style={{ marginBottom: '2.8vh' }}>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Render</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>16:9 + 9:16 simultaneous export</p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '0.5vh' }}>Publish</p>
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.8vw', color: 'var(--slide-muted)', lineHeight: 1.35 }}>YouTube + direct download</p>
          </div>
        </div>
      </div>
    </div>
  );
}
