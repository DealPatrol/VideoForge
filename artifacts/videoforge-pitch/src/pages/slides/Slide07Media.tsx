export default function Slide07Media() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{ background: 'var(--slide-bg)', padding: '7vh 8vw' }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '5vh',
        }}
      >
        <div>
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
            Step 3
          </p>
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
            Media &amp; Voiceover
          </h2>
        </div>
        {/* Decorative "03" */}
        <span
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '8vw',
            fontWeight: 800,
            color: 'var(--slide-surface)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}
        >
          03
        </span>
      </div>

      <div
        style={{
          width: '3.5vw',
          height: '0.35vh',
          background: 'var(--slide-primary)',
          marginBottom: '4vh',
        }}
      />

      {/* Bullets: 2 columns of 2 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3.5vh 6vw',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
          <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.45, textWrap: 'pretty' }}>
            Search Pexels' library of millions of stock photos and videos inline
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
          <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.45, textWrap: 'pretty' }}>
            Upload your own footage alongside stock clips
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
          <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.45, textWrap: 'pretty' }}>
            Six OpenAI TTS voices (nova, alloy, echo, fable, onyx, shimmer) with speed control
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
          <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
          <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.45, textWrap: 'pretty' }}>
            Real MP3 generation — not a preview, a production-ready audio file
          </p>
        </div>
      </div>
    </div>
  );
}
