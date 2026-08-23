export default function Slide06Script() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex"
      style={{ background: 'var(--slide-bg)' }}
    >
      {/* Left violet accent column */}
      <div
        className="flex items-end justify-start"
        style={{
          width: '14vw',
          background: 'var(--slide-primary)',
          padding: '7vh 2.5vw',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '12vw',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.18)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em',
          }}
        >
          02
        </span>
      </div>

      {/* Right: content */}
      <div
        className="flex flex-col justify-center"
        style={{ flex: 1, padding: '8vh 6vw' }}
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
          Step 2
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display-family)',
            fontSize: '3.6vw',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--slide-text)',
            marginBottom: '1.5vh',
            textWrap: 'balance',
          }}
        >
          Script &amp; Originality
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
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              GPT-4o-mini writes a complete, section-by-section script (hook / intro / main / CTA / outro)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              Built-in originality checker scores the script 0–100 and flags risky phrasing
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              Fully editable with debounced autosave — your words, AI-assisted
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '0.4vw', height: '0.4vw', borderRadius: '50%', background: 'var(--slide-primary)', marginTop: '1.1vh', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-body-family)', fontSize: '2.1vw', color: 'var(--slide-text)', lineHeight: 1.4, textWrap: 'pretty' }}>
              Export the script as part of the final project JSON
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
