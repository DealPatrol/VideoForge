export default function Slide11NextSteps() {
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
            fontSize: '4vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--slide-text)',
          }}
        >
          What's Next
        </h2>
      </div>

      {/* Numbered list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.8vh' }}>
        <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 800, color: 'var(--slide-accent)', lineHeight: 1.4, minWidth: '2.5vw' }}>01</span>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.2vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
            Real FFmpeg video assembly (landscape + portrait from footage + voiceover + captions)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 800, color: 'var(--slide-accent)', lineHeight: 1.4, minWidth: '2.5vw' }}>02</span>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.2vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
            YouTube OAuth upload flow (client ID + secret already wired)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 800, color: 'var(--slide-accent)', lineHeight: 1.4, minWidth: '2.5vw' }}>03</span>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.2vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
            Thumbnail AI generation with DALL-E
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 800, color: 'var(--slide-accent)', lineHeight: 1.4, minWidth: '2.5vw' }}>04</span>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.2vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
            Batch processing — render multiple projects overnight
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2.5vw', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontSize: '2vw', fontWeight: 800, color: 'var(--slide-accent)', lineHeight: 1.4, minWidth: '2.5vw' }}>05</span>
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.2vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
            Export formats: MP4, WebM, ProRes
          </p>
        </div>
      </div>
    </div>
  );
}
