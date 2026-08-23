export default function Slide02Problem() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{ background: 'var(--slide-bg)', padding: '7vh 8vw' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '5vh' }}>
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
            fontSize: '4.2vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--slide-text)',
          }}
        >
          The Problem
        </h2>
      </div>

      {/* 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4vh 6vw',
          flex: 1,
        }}
      >
        {/* Cell 1 */}
        <div style={{ borderTop: '2px solid var(--slide-primary)', paddingTop: '2.5vh' }}>
          <p
            style={{
              fontFamily: 'var(--font-display-family)',
              fontSize: '2.2vw',
              fontWeight: 700,
              color: 'var(--slide-text)',
              lineHeight: 1.3,
              textWrap: 'pretty',
            }}
          >
            Creating quality YouTube content means juggling 6+ separate tools
          </p>
        </div>

        {/* Cell 2 */}
        <div style={{ borderTop: '2px solid var(--slide-primary)', paddingTop: '2.5vh' }}>
          <p
            style={{
              fontFamily: 'var(--font-display-family)',
              fontSize: '2.2vw',
              fontWeight: 700,
              color: 'var(--slide-text)',
              lineHeight: 1.3,
              textWrap: 'pretty',
            }}
          >
            Scripting, B-roll, voiceover, captions, and editing all live in different apps
          </p>
        </div>

        {/* Cell 3 */}
        <div style={{ borderTop: '2px solid var(--slide-muted)', paddingTop: '2.5vh' }}>
          <p
            style={{
              fontFamily: 'var(--font-display-family)',
              fontSize: '2.2vw',
              fontWeight: 700,
              color: 'var(--slide-text)',
              lineHeight: 1.3,
              textWrap: 'pretty',
            }}
          >
            The result: hours of setup before a single frame is filmed
          </p>
        </div>

        {/* Cell 4 */}
        <div style={{ borderTop: '2px solid var(--slide-muted)', paddingTop: '2.5vh' }}>
          <p
            style={{
              fontFamily: 'var(--font-display-family)',
              fontSize: '2.2vw',
              fontWeight: 700,
              color: 'var(--slide-text)',
              lineHeight: 1.3,
              textWrap: 'pretty',
            }}
          >
            Most creators abandon ideas before finishing them
          </p>
        </div>
      </div>
    </div>
  );
}
