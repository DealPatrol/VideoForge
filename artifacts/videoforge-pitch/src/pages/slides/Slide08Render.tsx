export default function Slide08Render() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{ background: 'var(--slide-bg)', padding: '7vh 8vw' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '5vh' }}>
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
          Step 4
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display-family)',
              fontSize: '3.8vw',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--slide-text)',
            }}
          >
            Render &amp; Publish
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-display-family)',
              fontSize: '7vw',
              fontWeight: 800,
              color: 'var(--slide-surface)',
              lineHeight: 1,
              userSelect: 'none',
              letterSpacing: '-0.04em',
            }}
          >
            04
          </span>
        </div>
        <div
          style={{
            width: '3.5vw',
            height: '0.35vh',
            background: 'var(--slide-primary)',
            marginTop: '2vh',
          }}
        />
      </div>

      {/* 2×2 grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3vh 5vw',
          flex: 1,
        }}
      >
        {/* Cell 1 */}
        <div style={{ background: 'var(--slide-surface)', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '1.2vh', lineHeight: 1.2 }}>
            Dual-format output
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.9vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            One-click render for 16:9 landscape and 9:16 portrait simultaneously
          </p>
        </div>

        {/* Cell 2 */}
        <div style={{ background: 'var(--slide-surface)', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '1.2vh', lineHeight: 1.2 }}>
            Live progress
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.9vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            Live progress bar with server-side polling
          </p>
        </div>

        {/* Cell 3 */}
        <div style={{ background: 'var(--slide-surface)', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '1.2vh', lineHeight: 1.2 }}>
            Full asset package
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.9vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            Download MP4, SRT captions, thumbnail, project JSON, and attribution text
          </p>
        </div>

        {/* Cell 4 */}
        <div style={{ background: 'var(--slide-surface)', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 700, color: 'var(--slide-text)', marginBottom: '1.2vh', lineHeight: 1.2 }}>
            YouTube-ready
          </p>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '1.9vw', color: 'var(--slide-muted)', lineHeight: 1.4 }}>
            Add OAuth credentials and publish without leaving the app
          </p>
        </div>
      </div>
    </div>
  );
}
